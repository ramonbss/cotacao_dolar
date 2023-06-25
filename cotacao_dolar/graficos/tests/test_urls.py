from django.test import SimpleTestCase
from django.urls import reverse, resolve
from graficos.views import graficos, cotacoes, cotacoes_banco_de_dados


class TestGraficosUrls(SimpleTestCase):

    def test_graficos_url_resolve(self):
        url = reverse('graficos:graficos-cotacoes')
        self.assertEqual(resolve(url).func, graficos)

    def test_cotacoes_url_resolve(self):
        url = reverse('graficos:cotacoes')
        self.assertEqual(resolve(url).func, cotacoes)

    def test_cotacoes_database_url_resolve(self):
        url = reverse('graficos:cotacoes-database')
        self.assertEqual(resolve(url).func, cotacoes_banco_de_dados)
