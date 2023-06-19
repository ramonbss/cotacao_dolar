from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .lib.cotacoes_moedas import Cotacoes
from .lib.funcoes_data import contar_dias_uteis as dias_uteis
from json import loads
from datetime import datetime
# Create your views here.


def graficos(request):
    return render(request, 'graficos.html')


@csrf_exempt
def cotacoes(request):
    if request.method == 'POST':
        request_body = loads(request.body)
        print(f'Request: {request_body}')
        moedaAlvo = request_body['moeda']
        data = request_body['data']
        resposta_servidor = Cotacoes.obter_cotacao(
            moedaAlvo, data
        )
        print(f'Resposta da cotacao do servidor: {resposta_servidor}')
        return JsonResponse({'status': True, 'data': resposta_servidor})
    return HttpResponse('Okay')


@csrf_exempt
def contar_dias_uteis(request):
    if request.method == 'POST':
        request_body = loads(request.body)
        str_data_inicio = request_body['data_inicio']
        str_data_fim = request_body['data_fim']

        data_inicio = datetime.strptime(str_data_inicio, "%d/%m/%Y")
        data_fim = datetime.strptime(str_data_fim, "%d/%m/%Y")

        numero_dias_uteis = dias_uteis(data_inicio, data_fim)
        return JsonResponse({'status': True, 'data': numero_dias_uteis})
