from datetime import datetime, timedelta

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


def current_week(date):
    start_week = date - timedelta(date.weekday())
    end_week = start_week + timedelta(7)
    return start_week.replace(tzinfo=timezone.utc), end_week.replace(tzinfo=timezone.utc)


def temp_all_api(request):
    filter = request.GET.get("filter")
    if filter:
        today = datetime.today().replace(tzinfo=timezone.utc)
        print(filter)
        if filter == 'week':
            week = current_week(today)
            data = Temperature.objects.filter(created_at__range=(week[0], week[1]))
        elif filter == 'month':
            data = Temperature.objects.filter(created_at__year=today.year, created_at__month=today.month)
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
    return render(request, 'history.html')


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


def history_alarm(request):
    # now = datetime.now()
    # date = datetime(year=now.year, month=now.month, day=now.day-1)
    # query = Temperature.objects.filter(created_at__gte=date).annotate(cat=Case(
    #     When(value__range=[LIMITS[0], LIMITS[1]], then=Value(0)),
    #     When(value__range=[LIMITS[1], LIMITS[2]], then=Value(1)),
    #     When(value__range=[LIMITS[2], LIMITS[3]], then=Value(2)), default=-1,
    #     output_field=IntegerField())
    # ).exclude(cat=-1)
    # res = map(extract_info,
    #           groupby(query, lambda x: x.cat)
    #           )
    # data = pd.DataFrame(res)
    #
    # data['duree'] = (data['last_date'] - data['first_date']).astype('timedelta64[h]')

    # data['duree'] = (data['last_date'] - data['first_date']).astype('timedelta64[ms]').astype('int')
    # data['first_date'] = data['first_date'].astype('str')
    # data['last_date'] = data['last_date'].astype('str')

    return render(request, 'history_alarm.html', {'data': []})
