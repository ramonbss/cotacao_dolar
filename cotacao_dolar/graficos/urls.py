from django.urls import path
from . import views

urlpatterns = [
    path('', views.graficos, name='graficos-cotacoes'),
    path('cotacoes/', views.cotacoes),
    path('contar_dias_uteis/', views.contar_dias_uteis)
]
