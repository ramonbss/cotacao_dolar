from django.db import models


class CotacaoDolar(models.Model):
    moeda = models.CharField(max_length=3, null=False)
    cotacao = models.FloatField(null=False)
    data = models.DateField(null=False)

    def __str__(self) -> str:
        return f"Moeda: {self.moeda} ** Cotacao: {self.cotacao} ** Data: {self.data}"
