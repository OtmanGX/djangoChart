import json

from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone

from .apps import get_bar_result
from .models import *
import threading
from random import randrange

thread = None
for t in threading.enumerate():
    print(t.name)
    if t.name == 'serialThread':
        thread = t


def bar_result_view(request):
    bar_result = get_bar_result()
    return JsonResponse(data={'bar_result': bar_result})


def dashboard(request):
    global LIMITS
    global MARGE
    if request.POST:
        data = request.POST
        if data.get('marge'):
            MARGE = data.get('marge')
        else:
            LIMITS = [data.get('a'), data.get('b'), data.get('c'), data.get('d'), data.get('ideal')]
    paths = ['/', '/dashboard/']
    queryset = Temperature.objects.filter(created_at__year=timezone.now().year)
    data = map(lambda x: {'date': x.created_at.isoformat(), 'value': x.value}, queryset)
    data = json.dumps(list(data))

    bar_result = get_bar_result()
    return render(request, 'dashboard.html',
                  {'paths': paths, 'queryset': data, 'limits': LIMITS, 'marge': MARGE, 'barData': bar_result}
                  )


# def year_history():
#     queryset = Temperature.objects.filter(created_at__year=timezone.now().year)
#     data = map(lambda x: {'date': x.created_at.isoformat(), 'value': x.value}, queryset)
#     return JsonResponse(data={'data': data})


def temp_api(request):
    # try:
    #     data = thread.q.get_nowait()
    # except Exception:
    #     data = None
    return JsonResponse(data={
        # 'data': data
        'data': {'value': randrange(12, 26), 'date': timezone.now().isoformat()}
    })
