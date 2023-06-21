from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .lib.cotacoes_moedas import Cotacoes, CotacaoBancoDeDados
from datetime import datetime
from json import loads
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
def cotacoes_banco_de_dados(request):
    if request.method == 'POST':
        print(f'Request: {request.body}')
        request_body = loads(request.body)

        moeda = request_body['moeda']
        data = request_body['data']

        cotacao_database = CotacaoBancoDeDados.obter_cotacao(moeda, data)
        print(f'retornado do db: {cotacao_database}')
        if cotacao_database:
            return JsonResponse({
                'status': True,
                'data': {
                    'moeda': moeda,
                    'cotacao': cotacao_database.cotacao
                }
            })
        else:
            return JsonResponse({
                'status': False,
                'mensagem': f'Não foi possível encontrar a cotação da moeda {moeda} para a data de {data}'
            })
