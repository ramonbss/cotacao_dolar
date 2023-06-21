from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .lib.funcoes_data import contar_dias_uteis
from json import loads
from datetime import datetime
# Create your views here.


@csrf_exempt
def dias_uteis(request):
    if request.method == 'POST':
        request_body = loads(request.body)
        str_data_inicio = request_body['data_inicio']
        str_data_fim = request_body['data_fim']

        data_inicio = datetime.strptime(str_data_inicio, "%d/%m/%Y")
        data_fim = datetime.strptime(str_data_fim, "%d/%m/%Y")

        numero_dias_uteis = contar_dias_uteis(data_inicio, data_fim)
        return JsonResponse({'status': True, 'data': numero_dias_uteis})
