import requests
from .models import CotacaoDolar
from datetime import datetime


class Cotacoes:
    REAL = 'BRL'
    EURO = 'EUR'
    IENE = 'JPY'

    @classmethod
    def obter_cotacao(cls, par_alvo: str, data=''):
        if not data == '':
            data = datetime.now().strftime("%Y-%m-%d")
        cotacao_database = CotacaoBancoDeDados.obter_cotacao(par_alvo, data)
        if cotacao_database:
            print(f'Dados lido do DB Moeda: {cotacao_database.moeda}\n'
                  f'Cotacao: {cotacao_database.cotacao}')
            return cotacao_database.cotacao

        cotacoes = _Cotacao_VatComply.obter_cotacao(
            data
        )
        print(f'Resposta VatComply: {cotacoes}')
        rates = cotacoes['rates']
        cls._salvar_cotacoes_no_banco_de_dados(
            rates, cotacoes['date']
        )

        return round(rates[par_alvo], 2)

    @classmethod
    def _salvar_cotacoes_no_banco_de_dados(cls, vatcomply_rates: dict, data: str):
        moedas = [cls.REAL, cls.EURO, cls.IENE]
        cotacoes = [vatcomply_rates[moeda] for moeda in moedas]
        datas = [data] * len(moedas)

        CotacaoBancoDeDados.salvar_cotacoes(
            moedas, cotacoes, datas
        )


class CotacaoBancoDeDados:

    @classmethod
    def _converter_data(cls, data: str) -> datetime:
        """
            Converte uma data string no formato do VatComply
             em um objeto datetime

        Args:
            data (str): data no formato YYYY-mm-dd

        Returns:
            datetime: Objeto datetime pronto para ser salvo no banco de dados
        """
        return datetime.strptime(data, "%Y-%m-%d")

    @classmethod
    def obter_cotacao(cls, moeda, data):
        data_convertida = cls._converter_data(data)
        return CotacaoDolar.objects.filter(moeda=moeda, data=data_convertida).first()

    @classmethod
    def salvar_cotacao(cls, moeda: str, cotacao: float, data: str):
        data_convertida = cls._converter_data(data)
        cotacao = round(cotacao, 2)
        nova_cotacao = CotacaoDolar(
            moeda=moeda, cotacao=cotacao, data=data_convertida)
        nova_cotacao.save()

    @classmethod
    def salvar_cotacoes(cls, moedas, cotacoes, datas):
        for moeda, cotacao, data in zip(moedas, cotacoes, datas):
            cls.salvar_cotacao(moeda, cotacao, data)


class _Cotacao_VatComply:
    _URL_BASE = 'https://api.vatcomply.com/rates'

    @classmethod
    def obter_cotacao(cls, data=''):
        requisicao = f'{cls._URL_BASE}?base=USD'
        if data:
            requisicao += f'&date={data}'
        resultado = requests.get(requisicao)
        return resultado.json()
