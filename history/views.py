from datetime import datetime, timedelta
import concurrent.futures
from django.http import JsonResponse
from django.shortcuts import render
from datetime import datetime
from itertools import groupby
from django.db.models import ObjectDoesNotExist
from django.db.models import Case, Value, When, IntegerField
from django.utils import timezone
import pandas as pd
from core.models import Temperature, LIMITS

CATS = [str([LIMITS[0], LIMITS[1]]),
        str([LIMITS[1], LIMITS[2]]),
        str([LIMITS[2], LIMITS[3]])]


def string_to_date(date):
    if date:
        date = datetime.strptime(date, '%Y-%m-%d %H:%M')
        return date.replace(tzinfo=timezone.utc)
    return None


# def current_week(date):
#     start_week = date - timedelta(date.weekday())
#     end_week = start_week + timedelta(7)
#     return start_week.replace(tzinfo=timezone.utc), end_week.replace(tzinfo=timezone.utc)

def current_week(date):
    start_week = date - timedelta(7)
    end_week = date
    return start_week.replace(tzinfo=timezone.utc), end_week.replace(tzinfo=timezone.utc)


def temp_all_api(request):
    filter = request.GET.get("filter")
    if filter:
        today = datetime.today().replace(tzinfo=timezone.utc)
        if filter == 'week':
            week = current_week(today)
            data = Temperature.objects.filter(created_at__range=(week[0], week[1]))
        elif filter == 'month':
            # data = Temperature.objects.filter(created_at__year=today.year, created_at__month=today.month)
            data = Temperature.objects.filter(created_at__gte=today - timedelta(30))
        elif filter == 'year':
            # data = Temperature.objects.filter(created_at__year=today.year, created_at__month=today.month)
            data = Temperature.objects.filter(created_at__gte=today - timedelta(365))

        elif filter == 'day':
            data = Temperature.objects.filter(created_at__day=today.day)
    else:
        date1 = request.GET.get("date1")
        date1 = string_to_date(date1)
        date2 = request.GET.get("date2")
        date2 = string_to_date(date2)
        if date1 and date2:
            data = Temperature.objects.filter(created_at__range=(date1, date2))
        elif date1:
            data = Temperature.objects.filter(created_at__gt=date1)
        else:
            data = Temperature.objects.all()

    data = map(lambda x: {'date': x.created_at, 'value': x.value}, data)

    return JsonResponse(data={
        'data': list(data)
    })


def history(request):
    return render(request, 'history.html', {'limits': LIMITS})


def extract_info(group):
    group = list(group[1])
    try:
        last_date = group[-1].get_next_by_created_at().created_at
    except ObjectDoesNotExist:
        last_date = group[-1].created_at
    return {
        'cat': group[0].cat,
        'plage': CATS[group[0].cat],
        'first_date': group[0].created_at,
        'last_date': last_date,
    }


def classify_temperatures(query):
    return query.annotate(cat=Case(
        When(value__range=[LIMITS[0], LIMITS[1]], then=Value(0)),
        When(value__range=[LIMITS[1], LIMITS[2]], then=Value(1)),
        When(value__range=[LIMITS[2], LIMITS[3]], then=Value(2)), default=-1,
        output_field=IntegerField())
    ).exclude(cat=-1)


def generate_dataframe(data):
    data = pd.DataFrame(data)
    data['first_date'] = data['first_date']
    data['last_date'] = data['last_date']
    data['duree'] = (data['last_date'] - data['first_date'])
    return data


def calc_stats(dataframe):
    result = dataframe[['cat', 'duree']].groupby('cat').sum()
    result['duree'] = result['duree'].astype('timedelta64[h]')
    result.fillna(0)

    return result['duree'].tolist()


def history_alarm(request):
    filter = request.GET.get("filter")
    now = datetime.now().replace(tzinfo=timezone.utc)
    day = now - timedelta(1)
    week = now - timedelta(7)
    month = now - timedelta(30)
    year = now - timedelta(365)
    dataYear = Temperature.objects.filter(created_at__gte=year)
    dataYear = classify_temperatures(dataYear)
    dataMonth = dataYear.filter(created_at__gte=month)
    dataWeek = dataMonth.filter(created_at__gte=week)
    dataDay = dataWeek.filter(created_at__gte=day)

    if filter:
        if filter == 'week':
            data = dataWeek
        elif filter == 'month':
            data = dataMonth
        elif filter == 'year':
            data = dataYear
        elif filter == 'day':
            data = dataDay
    elif request.GET.get("date1"):
        date1 = request.GET.get("date1")
        date1 = string_to_date(date1)
        date2 = request.GET.get("date2")
        date2 = string_to_date(date2)
        if date1 and date2:
            data = classify_temperatures(Temperature.objects.filter(created_at__range=(date1, date2)))
        elif date1:
            data = classify_temperatures(Temperature.objects.filter(created_at__gt=date1))
        else:
            data = classify_temperatures(Temperature.objects.all())
    else:
        data = dataMonth

    bar_result = []

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(map, extract_info,
                        groupby(dataYear, lambda x: x.cat))
        future2 = executor.submit(map, extract_info,
                        groupby(dataMonth, lambda x: x.cat))
        future3 = executor.submit(map, extract_info,
                        groupby(dataDay, lambda x: x.cat))
        resYear = future.result()
        resMonth = future2.result()
        resDay = future3.result()

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(generate_dataframe, resYear)
        future2 = executor.submit(generate_dataframe, resMonth)
        future3 = executor.submit(generate_dataframe, resDay)
        resYear = future.result()
        resMonth = future2.result()
        resDay = future3.result()

    bar_result.append(calc_stats(resYear))
    bar_result.append(calc_stats(resMonth))
    bar_result.append(calc_stats(resDay))

    if data == dataYear:
        table_res = resYear
    elif data == dataMonth:
        table_res = resMonth
    elif data == dataDay:
        table_res = resDay
    else:
        resData = map(extract_info,
                      groupby(data, lambda x: x.cat))
        resData = generate_dataframe(resData)
        table_res = generate_dataframe(resData)

    return render(request, 'history_alarm.html', {'data': table_res.values.tolist(), 'barData': bar_result})
