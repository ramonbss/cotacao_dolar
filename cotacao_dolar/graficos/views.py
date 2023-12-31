from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .lib.cotacoes_moedas import Cotacoes, CotacaoBancoDeDados
from datetime import datetime
from json import loads
from django.views.decorators.csrf import ensure_csrf_cookie
# Create your views here.


@ensure_csrf_cookie
def graficos(request):
    return render(request, 'graficos.html')


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


def cotacoes_banco_de_dados(request):
    if request.method == 'POST':
        print(f'Request: {request.body}')
        request_body = loads(request.body)

        moeda = request_body['moeda']
        data = request_body['data']

        cotacao_database = CotacaoBancoDeDados.obter_cotacao(moeda, data)
        print(f'retornado do db: {cotacao_database}')
        if cotacao_database and cotacao_database.cotacao > 0:
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
