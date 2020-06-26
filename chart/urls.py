"""chart URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.history, name='history')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='history')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path

from chart import settings
from chart.task import SerialThread
thread = SerialThread()
thread.start()
from core import views as core_views
from history import views as history_views


urlpatterns = [
    path('admin/', admin.site.urls),
    # Core
    path('', core_views.dashboard, name='home'),
    path('temp_all_api/', history_views.temp_all_api, name='temp_all_api'),
    path('temp_last_data/', core_views.temp_api, name='temp_api'),
    path('dashboard/', core_views.dashboard, name='dashboard'),
    # History
    path('history/', history_views.history, name='history'),
    path('history_alarm/', history_views.history_alarm, name='history_alarm'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)