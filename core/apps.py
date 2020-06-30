from django.apps import AppConfig
from datetime import datetime, timedelta
from itertools import groupby
import concurrent
from core.models import Temperature
from history.apps import classify_temperatures, extract_info, generate_dataframe, calc_stats2
from django.utils import timezone


class CoreConfig(AppConfig):
    name = 'core'


def get_bar_result():
    bar_result = []
    now = datetime.now().replace(tzinfo=timezone.utc)
    day = now - timedelta(1)
    month = now - timedelta(30)
    year = now - timedelta(365)
    dataYear = Temperature.objects.filter(created_at__gte=year)
    dataYear = classify_temperatures(dataYear)
    dataMonth = dataYear.filter(created_at__gte=month)
    dataDay = dataMonth.filter(created_at__gte=day)
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
    return bar_result
