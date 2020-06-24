from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=30)


class City(models.Model):
    name = models.CharField(max_length=30)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    population = models.PositiveIntegerField()


class Temperature(models.Model):
    created_at = models.DateTimeField()
    value = models.IntegerField(blank=False)


# Limits
LIMITS = [14, 18, 21, 23]