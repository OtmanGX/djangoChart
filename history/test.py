# Temperature.objects.filter(value__range=[18, 21])
# c = Temperature.objects.filter(created_at__day=datetime.now().day)
# d = c.annotate(cat = Case(When(value__range=[18,21], then=Value(1)), When(value__range=[14,18], then=Value(0)), When(value__range=[21,30], then=Value(2)), default=Value(-1),output_field=IntegerField()))
import os
from datetime import datetime
from django.db.models import Case, IntegerField, Value, When, IntegerField
from itertools import groupby
from core.models import Temperature
c = Temperature.objects.filter(created_at__day=datetime.now().day)
d = c.annotate(cat = Case(
    When(value__range=[18,21], then=Value(1)),
    When(value__range=[14,18], then=Value(0)),
    When(value__range=[21,30], then=Value(2)),
    default=Value(-1),output_field=IntegerField())
)

i = 1

def myvalues(queryset):
    for indice, item in enumerate(queryset):
        item['index'] = indice
        yield item
# i.get_next_by_created_at

def rank(itm):
    global i
    vl = itm['cat']
    if vl == 1:
        if d[itm['index']+1].cat != 1:
            i += 1
            print(i)
            return i-1
        return i
    return -1

# dat = {
#     k: list(map(itemgetter('id'), v))
#     for k, v in groupby(
#         d.values('id', 'cat'),
#         rank)
# }

for i, j in groupby(myvalues(d.values('cat', 'value')), rank):
    print(list(j))