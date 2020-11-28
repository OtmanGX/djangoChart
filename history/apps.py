from datetime import datetime, timedelta
from django.db.models import Case, Value, When, IntegerField
from django.apps import AppConfig
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from core.models import LIMITS

import pandas as pd


CATS = [str([LIMITS[0], LIMITS[1]]),
        str([LIMITS[1], LIMITS[2]]),
        str([LIMITS[2], LIMITS[3]])]


def string_to_date(date):
    if date:
        date = datetime.strptime(date, '%Y-%m-%d %H:%M')
        return date.replace(tzinfo=timezone.utc)
    return None


def current_week(date):
    start_week = date - timedelta(7)
    end_week = date
    return start_week.replace(tzinfo=timezone.utc), end_week.replace(tzinfo=timezone.utc)


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
    if data.shape[0]==0:
        data['first_date'] = []
        data['last_date'] = []
        data['duree'] = []
    else:
        data['first_date'] = data['first_date']
        data['last_date'] = data['last_date']
        data['duree'] = (data['last_date'] - data['first_date'])
    return data


def calc_stats(dataframe):
    try:
        result = dataframe[['cat', 'duree']]
        result = result.append([{'cat': i, 'duree': timedelta(0)} for i in range(3)], ignore_index=True)
        result = result.groupby('cat').sum()
        result['duree'] = result['duree'].astype('timedelta64[h]')
        result.fillna(0)
    except Exception:
        return [0]*3
    return result['duree'].tolist()


def calc_stats2(dataframe):
    try:
        result = dataframe[['cat', 'duree']]
        result = result.append([{'cat': i, 'duree': timedelta(0)} for i in range(3)], ignore_index=True)
        result = result.groupby('cat').sum()
        result['duree'] = result['duree'].astype('timedelta64[h]')
        result['duree'] = result['duree']/result['duree'].sum()*100
        result.fillna(0)
        result['duree'] = result['duree'].astype('int')
        result.fillna(0)
    except Exception:
        return [0]*3
    return result['duree'].tolist()


class HomeConfig(AppConfig):
    name = 'history'
