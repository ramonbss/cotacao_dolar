import { inicializar_data_pickers } from "./funcoes_data.js";
import { inicializarBotoesCotacao } from "./funcoes_cotacoes.js";

const parNomes = {
  BRL: "Real",
  EUR: "Euro",
  JPY: "Iene",
};

export function plotar_valores(moedaAlvo, valores, datas) {
  const chart = Highcharts.chart("graficos-container", {
    chart: {
      type: "line",
    },
    title: {
      text: "Cotacao Dólar x " + parNomes[moedaAlvo],
    },
    xAxis: {
      title: {
        text: "Data",
      },
      categories: datas,
    },
    yAxis: {
      title: {
        text: "Valor em Dólares",
      },
    },
    series: [
      {
        name: "Cotação",
        data: valores,
      },
    ],
  });
}

export function mostrarMensagemDeErro(mensagem) {
  let inputErro = document.getElementById("saida-erros");
  inputErro.textContent = mensagem;
}

document.addEventListener("DOMContentLoaded", function () {
  inicializar_data_pickers();
  inicializarBotoesCotacao();
  plotar_valores("BRL", [1, 2, 3], ["01/01", "02/01", "03/01"]);
});
