from django.urls import path
from . import views

urlpatterns = [
    path('dias_uteis/obter', views.dias_uteis),
    path('cotacao', views.ler_cotacao_banco_de_dados)
]
