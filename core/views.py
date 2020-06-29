import json
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from .models import *
import threading
from random import randrange

thread = None
for t in threading.enumerate():
    print(t.name)
    if t.name == 'serialThread':
        thread = t


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
    data = []
    queryset = Temperature.objects.filter(created_at__year=timezone.now().year)
    data = map(lambda x: {'date': x.created_at.isoformat(), 'value': x.value}, queryset)
    data = json.dumps(list(data))
    print('ready')
    return render(request, 'dashboard.html',
                  {'paths': paths, 'queryset': data, 'limits': LIMITS, 'marge': MARGE}
                  )


def month_perc(request):
    queryset = Temperature.objects.filter(value__range=[14, 18])


def temp_api(request):
    return JsonResponse(data={
        # 'data': thread.q.get()
        'data': {'value': randrange(30), 'date': datetime.now().isoformat()}
    })
