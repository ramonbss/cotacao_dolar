from django.db import models


class CotacaoDolar(models.Model):
    moeda = models.CharField(max_length=3, null=False)
    cotacao = models.FloatField(null=False)
    data = models.DateField(null=False)
