from django.urls import path
from . import views

urlpatterns = [
    path('', views.graficos, name='graficos-cotacoes')
]
