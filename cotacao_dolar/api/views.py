from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .lib.funcoes_data import contar_dias_uteis
from json import loads
from datetime import datetime
import requests
from django.urls import reverse
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


def retornar_erro(mensagem_de_erro: str) -> JsonResponse:
    return JsonResponse({
        'status': False,
        'mensagem': mensagem_de_erro
    })


@csrf_exempt
def ler_cotacao_banco_de_dados(request):
    if request.method == 'GET':
        moeda = request.GET.get('moeda', '')
        data = request.GET.get('data', '')
        if not moeda:
            return retornar_erro(
                'É necessário passar o parâmetro "moeda" com o código (BRL, EUR, JPY) da moeda que você deseja consultar a cotação'
            )
        if not data:
            data = datetime.now().strftime("%Y-%m-%d")
        else:
            try:
                data = datetime.strptime(data, "%d-%m-%Y").strftime("%Y-%m-%d")
            except Exception as e:
                print(e)
                return retornar_erro('A data precisa está no formato dd-mm-YYYY')

        host = request.get_host()
        endpoint_cotacoes = reverse('graficos:cotacoes-database')

        parametros_post = {'moeda': moeda,
                           'data': data}
        resposta = requests.post(
            f'http://{host}{endpoint_cotacoes}', json=parametros_post).json()
        print(f'dir resposta: {dir(resposta)}')
        print(f'Resposta do servidor:  {resposta}')
        if resposta['status']:
            return JsonResponse(
                resposta
            )
        else:
            return retornar_erro(
                resposta['mensagem']
            )
