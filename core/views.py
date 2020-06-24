import json

from django.shortcuts import render
from django.db.models import Sum
from django.http import JsonResponse
from django.utils import timezone
from .models import *
from random import randrange

thread = None

def dashboard(request):
    global LIMITS
    if request.POST:
        data = request.POST
        LIMITS = [data.get('a'), data.get('b'), data.get('c'), data.get('d')]
    paths = ['/', '/dashboard/']
    data = []
    queryset = Temperature.objects.filter(created_at__year=timezone.now().year)
    data = map(lambda x: {'date':x.created_at.isoformat(), 'value':x.value}, queryset)
    return render(request, 'dashboard.html',
                  {'paths': paths, 'queryset': json.dumps(list(data)), 'limits': LIMITS}
                  )


def temp_api(request):
    return JsonResponse(data={
        # 'data': thread.q.get()
        'data': {'value':randrange(30)}
    })

def population_chart(request):
    labels = []
    data = []

    queryset = City.objects.values('country__name').annotate(country_population=Sum('population')).order_by('-country_population')
    for entry in queryset:
        labels.append(entry['country__name'])
        data.append(entry['country_population'])
    
    return JsonResponse(data={
        'labels': labels,
        'data': data,
    })


def line_chart(request):
    return render(request, 'line.html')

def pie_chart(request):
    labels = []
    data = []

    queryset = City.objects.order_by('-population')[:5]
    for city in queryset:
        labels.append(city.name)
        data.append(city.population)

    return render(request, 'pie_chart.html', {
        'labels': labels,
        'data': data,
    })
