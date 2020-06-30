from datetime import datetime, timedelta
import concurrent.futures
from django.http import JsonResponse
from django.shortcuts import render
from datetime import datetime
from itertools import groupby

from django.utils import timezone
from core.models import Temperature, LIMITS
from history.apps import current_week, string_to_date, classify_temperatures, generate_dataframe, calc_stats, \
    extract_info


def temp_all_api(request):
    request_filter = request.GET.get("filter")
    if request_filter:
        today = datetime.today().replace(tzinfo=timezone.utc)
        if request_filter == 'week':
            week = current_week(today)
            data = Temperature.objects.filter(created_at__range=(week[0], week[1]))
        elif request_filter == 'month':
            # data = Temperature.objects.filter(created_at__year=today.year, created_at__month=today.month)
            data = Temperature.objects.filter(created_at__gte=today - timedelta(30))
        elif request_filter == 'year':
            # data = Temperature.objects.filter(created_at__year=today.year, created_at__month=today.month)
            data = Temperature.objects.filter(created_at__gte=today - timedelta(365))

        elif request_filter == 'day':
            data = Temperature.objects.filter(created_at__day=today.day)
    else:
        date1 = request.GET.get("date1")
        date1 = string_to_date(date1)
        date2 = request.GET.get("date2")
        try:
            date2 = string_to_date(date2)
        except ValueError:
            date2 = None
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
        try:
            date2 = string_to_date(date2)
        except ValueError:
            date2 = None
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
        table_res.sort_values(by='first_date', ascending=True)

    return render(request, 'history_alarm.html',
                  {'data': table_res.sort_values(by='first_date', ascending=False).values.tolist(),
                   'barData': bar_result})
