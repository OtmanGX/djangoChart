import concurrent
import json
from datetime import datetime, timedelta
from itertools import groupby

from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone

from history.views import classify_temperatures, extract_info, generate_dataframe, calc_stats, calc_stats2
from .models import *
import threading
from random import randrange

thread = None
for t in threading.enumerate():
    print(t.name)
    if t.name == 'serialThread':
        thread = t


def dashboard(request):
    now = datetime.now().replace(tzinfo=timezone.utc)
    day = now - timedelta(1)
    month = now - timedelta(30)
    year = now - timedelta(365)
    dataYear = Temperature.objects.filter(created_at__gte=year)
    dataYear = classify_temperatures(dataYear)
    dataMonth = dataYear.filter(created_at__gte=month)
    dataDay = dataMonth.filter(created_at__gte=day)

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

    bar_result.append(calc_stats2(resYear))
    bar_result.append(calc_stats2(resMonth))
    bar_result.append(calc_stats2(resDay))

    global LIMITS
    global MARGE
    if request.POST:
        data = request.POST
        if data.get('marge'):
            MARGE = data.get('marge')
        else:
            LIMITS = [data.get('a'), data.get('b'), data.get('c'), data.get('d'), data.get('ideal')]
    paths = ['/', '/dashboard/']
    data = []
    queryset = Temperature.objects.filter(created_at__year=timezone.now().year)
    data = map(lambda x: {'date': x.created_at.isoformat(), 'value': x.value}, queryset)
    data = json.dumps(list(data))
    print('ready')
    return render(request, 'dashboard.html',
                  {'paths': paths, 'queryset': data, 'limits': LIMITS, 'marge': MARGE, 'barData': bar_result}
                  )


def month_perc(request):
    queryset = Temperature.objects.filter(value__range=[14, 18])


def temp_api(request):
    try :
        data = thread.q.get_nowait()
    except Exception:
        return
    return JsonResponse(data={
        'data': data
        # 'data': {'value': randrange(30), 'date': datetime.now().isoformat()}
    })
