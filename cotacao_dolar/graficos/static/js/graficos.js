import { validarData, checarIntervaloEntreDatas } from "./funcoes_data.js";

function plotar_valores(moeda_alvo, valores, datas) {
  const chart = Highcharts.chart("graficos-container", {
    chart: {
      type: "line",
    },
    title: {
      text: "Cotacao Dólar x" + moeda_alvo,
    },
    xAxis: {
      title: {
        text: "Data",
      },
      categories: datas,
    },
    yAxis: {
      title: {
        text: "Valor em Dólar",
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

function validarCamposDeData() {
  let inputDataInicio = document.getElementById("data-inicio");
  let inputDataFim = document.getElementById("data-fim");
  let dataInicio = inputDataInicio.value;
  let dataFim = inputDataFim.value;
  // Validate the inputs as dates in dd/mm/YYYY format
  let dataInicioValida = validarData(dataInicio);
  let dataFimValida = validarData(dataFim);

  if (dataInicioValida && dataFimValida) {
    // Compare the dates
    if (checarIntervaloEntreDatas(dataInicio, dataFim)) {
      console.log("Data valida");
      return true;
    } else {
      console.log("Datas fora de um intervalo valido");
    }
  } else {
    console.log("O campo não possui um formato de data valido");
  }

  return false;
}

function inicializar_data_pickers() {
  let inputDataInicio = document.getElementById("data-inicio");
  let inputDataFim = document.getElementById("data-fim");

  $(inputDataInicio).datepicker({
    format: "dd/mm/yyyy",
    language: "pt-BR",
    container: "#datepicker-dropbox-inicio",
    autoclose: true,
  });

  $(inputDataFim).datepicker({
    format: "dd/mm/yyyy",
    language: "pt-BR",
    container: "#datepicker-dropbox-fim",
    autoclose: true,
  });

  $(inputDataInicio).on("changeDate", function () {
    validarCamposDeData();
  });

  $(inputDataFim).on("changeDate", function () {
    validarCamposDeData();
  });

  inicializarDataPickersComDataAtual(inputDataInicio, inputDataFim);
  console.log("Data picker inicializados.");
}

function inicializarDataPickersComDataAtual(inputDataInicio, inputDataFim) {
  // Get the current date
  let dataAtual = new Date();

  // Format the date as "dd/mm/YYYY"
  let dia = String(dataAtual.getDate()).padStart(2, "0");
  let mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
  let ano = dataAtual.getFullYear();

  let dataFormatoBrasil = dia + "/" + mes + "/" + ano;

  // Set the current date as the initial value for both inputs
  inputDataInicio.value = dataFormatoBrasil;
  inputDataFim.value = dataFormatoBrasil;
}

document.addEventListener("DOMContentLoaded", function () {
  inicializar_data_pickers();
  plotar_valores("Real", [1, 2, 3], ["01/01", "02/01", "03/01"]);
});
