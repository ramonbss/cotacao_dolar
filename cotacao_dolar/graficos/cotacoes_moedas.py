import requests


class Cotacoes:
    @classmethod
    def obter_cotacao(cls, par_alvo: str, data=''):
        cotacoes = _Cotacao_VatComply.obter_cotacao(
            data
        )
        return cotacoes['rates'][par_alvo]


class _Cotacao_VatComply:
    _URL_BASE = 'https://api.vatcomply.com/rates'

    @classmethod
    def obter_cotacao(cls, data=''):
        requisicao = f'{cls._URL_BASE}?base=USD'
        if data:
            requisicao += f'&date={data}'
        resultado = requests.get(requisicao)
        return resultado.json()
