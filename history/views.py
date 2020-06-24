from datetime import datetime, timedelta

from django.http import JsonResponse
from django.shortcuts import render
# Create your views here.
from django.utils import timezone

from core.models import Temperature

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
        if filter =='week':
            week = current_week(today)
            data = Temperature.objects.filter(created_at__range=(week[0], week[1]))
        elif filter == 'month':
            data = Temperature.objects.filter(created_at__year=today.year, created_at__month=today.month)
        elif filter == 'day':
            data = Temperature.objects.filter(created_at__day=today.day)
    else :
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

    data = map(lambda x: {'date':x.created_at, 'value':x.value}, data)

    return JsonResponse(data={
        'data': list(data)
    })


def history(request):
    return render(request, 'history.html')