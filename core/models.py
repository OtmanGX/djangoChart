from django.db import models


class Temperature(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    value = models.FloatField(blank=False)


# Limits
LIMITS = [14, 18, 21, 23, 15]
MARGE = 0.1
