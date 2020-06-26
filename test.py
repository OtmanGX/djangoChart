from datetime import datetime
from itertools import groupby
from django.db.models import ObjectDoesNotExist
from django.db.models import Case, Value, When, IntegerField
from django.utils import timezone
import pandas as pd
from core.models import Temperature

query = Temperature.objects.filter(created_at__day=datetime.now().day-1)
query = query.annotate(cat = Case(
    When(value__range=[18, 21], then=Value(1)),
    When(value__range=[14, 18], then=Value(0)),
    When(value__range=[21, 30], then=Value(2)),
    default=Value(-1), output_field=IntegerField())
)


def extract_info(group):
    group = list(group[1])
    try:
        last_date =  group[-1].get_next_by_created_at().created_at
    except ObjectDoesNotExist:
        last_date = datetime.now(tz=timezone.utc)
    return {
        'first_date': group[0].created_at,
        'last_date': last_date,
        'values': [item.value for item in group]
    }


res = map(extract_info,
          filter(lambda x: x[0] == 1,
                 groupby(query, lambda x: x.cat))
          )
data = pd.DataFrame(res)
data['duree'] = (data['last_date'] - data['first_date']).astype('timedelta64[ms]').astype('int')
data['first_date'] = data['first_date'].astype('str')
data['last_date'] = data['last_date'].astype('str')
print(data.values.tolist()[0])
# print(type(data.iloc[0].first_date))
# print(data.head())
