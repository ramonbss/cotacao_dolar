from django.test import SimpleTestCase
from django.urls import reverse, resolve
from api.views import dias_uteis, ler_cotacao_banco_de_dados


class TestApiUrls(SimpleTestCase):
    def test_dias_uteis_url_resolve(self):
        url = reverse('obter_dias_uteis')
        self.assertEqual(resolve(url).func, dias_uteis)

    def test_cotacao_url_resolve(self):
        url = reverse('cotacao_database')
        self.assertEqual(resolve(url).func, ler_cotacao_banco_de_dados)
