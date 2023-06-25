from django.urls import path
from . import views

urlpatterns = [
    path('', views.graficos, name='graficos-cotacoes'),
    path('cotacoes/', views.cotacoes, name='cotacoes'),
    path('cotacoes/database', views.cotacoes_banco_de_dados,
         name='cotacoes-database'),
]
