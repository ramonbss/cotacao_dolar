from django.test import TestCase
from ..models import CotacaoDolar
from datetime import date


class TestModelCotacaoDolar(TestCase):

    def setUp(self):
        self._data_de_teste = date(2023, 6, 17)
        CotacaoDolar.objects.create(
            moeda='BRL', cotacao=5.0,
            data=self._data_de_teste.strftime('%Y-%m-%d'))

    def test_campo_moeda(self):
        cotacao = CotacaoDolar.objects.get(id=1)
        campo_moeda = cotacao._meta.get_field('moeda')
        self.assertEqual(campo_moeda.verbose_name, 'moeda')
        self.assertEqual(campo_moeda.max_length, 3)
        self.assertFalse(campo_moeda.null)

    def test_campo_cotacao(self):
        cotacao = CotacaoDolar.objects.get(id=1)
        campo_cotacao = cotacao._meta.get_field('cotacao')
        self.assertEqual(campo_cotacao.verbose_name, 'cotacao')
        self.assertFalse(campo_cotacao.null)

    def test_campo_data(self):
        cotacao = CotacaoDolar.objects.get(id=1)
        campo_data = cotacao._meta.get_field('data')
        self.assertEqual(campo_data.verbose_name, 'data')
        self.assertFalse(campo_data.null)

    def test_leitura_de_cotacao(self):
        cotacao = CotacaoDolar.objects.get(id=1)
        self.assertEqual(cotacao.moeda, 'BRL')
        self.assertEqual(cotacao.cotacao, 5.0)
        self.assertEqual(cotacao.data, self._data_de_teste)
