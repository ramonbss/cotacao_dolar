from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .lib.cotacoes_moedas import Cotacoes
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
