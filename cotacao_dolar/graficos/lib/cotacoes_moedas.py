import requests
from ..models import CotacaoDolar
from datetime import datetime


class Cotacoes:
    REAL = 'BRL'
    EURO = 'EUR'
    IENE = 'JPY'
    MOEDAS = [REAL, EURO, IENE]
    SEM_COTACAO = 0

    @classmethod
    def tratar_resposta_do_vatcomply(cls, resposta_vatcomply, par_alvo, data):
        cotacoes = resposta_vatcomply['rates']

        for moeda in cls.MOEDAS:
            if moeda not in cotacoes:
                cotacoes[moeda] = cls.SEM_COTACAO

            cotacoes[moeda] = round(cotacoes[moeda], 2)

        cls._salvar_cotacoes_no_banco_de_dados(
            cotacoes, data
        )

        cotacao_solicitada = cotacoes[par_alvo]

        print(f'cotacao: {cotacao_solicitada}')

        return cotacao_solicitada

    @classmethod
    def obter_cotacao(cls, par_alvo: str, data=''):
        if data == '':
            data = datetime.now().strftime("%Y-%m-%d")
        cotacao_database = CotacaoBancoDeDados.obter_cotacao(par_alvo, data)
        if cotacao_database:
            return cotacao_database.cotacao

        resposta_vatcomply = _Cotacao_VatComply.obter_cotacao(
            data
        )

        cotacao_solicitada = cls.tratar_resposta_do_vatcomply(
            resposta_vatcomply, par_alvo, data
        )

        return cotacao_solicitada

    @classmethod
    def _salvar_cotacoes_no_banco_de_dados(cls, vatcomply_rates: dict, data: str):
        cotacoes = [vatcomply_rates[moeda] for moeda in cls.MOEDAS]
        datas = [data] * len(cls.MOEDAS)

        CotacaoBancoDeDados.salvar_cotacoes(
            cls.MOEDAS, cotacoes, datas
        )


class CotacaoBancoDeDados:

    @classmethod
    def obter_cotacao(cls, moeda, data):
        data_convertida = cls.converter_data(data)
        return CotacaoDolar.objects.filter(moeda=moeda, data=data_convertida).first()

    @classmethod
    def salvar_cotacao(cls, moeda: str, cotacao: float, data: str):
        data_convertida = cls.converter_data(data)
        nova_cotacao = CotacaoDolar(
            moeda=moeda, cotacao=cotacao, data=data_convertida)
        nova_cotacao.save()
        print('-'*20)
        print(f'\n\nSalvo no db:\n{nova_cotacao}\n\n')

    @classmethod
    def salvar_cotacoes(cls, moedas, cotacoes, datas):
        for moeda, cotacao, data in zip(moedas, cotacoes, datas):
            cls.salvar_cotacao(moeda, cotacao, data)

    @staticmethod
    def converter_data(data: str) -> datetime:
        """
            Converte uma data string no formato do VatComply
                em um objeto datetime

        Args:
            data (str): data no formato YYYY-mm-dd

        Returns:
            datetime: Objeto datetime pronto para ser salvo no banco de dados
        """
        return datetime.strptime(data, "%Y-%m-%d")


class _Cotacao_VatComply:
    _URL_BASE = 'https://api.vatcomply.com/rates'

    @classmethod
    def obter_cotacao(cls, data=''):
        requisicao = f'{cls._URL_BASE}?base=USD'
        if data:
            requisicao += f'&date={data}'
        resultado = requests.get(requisicao)
        return resultado.json()
