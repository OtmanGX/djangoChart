from django import template

register = template.Library()


@register.filter(name='localefr')
def localefr(value):
    return str(value).replace('days', 'jours')
