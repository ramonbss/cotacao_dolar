function plotar_valores(moeda_alvo, valores, datas)
{
    const chart = Highcharts.chart("graficos-container", {
      chart: {
        type: "line",
      },
      title: {
        text: "Cotacao Dólar x" + moeda_alvo,
      },
      xAxis: {
        title:{
            text:'Data'
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

function inicializar_data_pickers()
{
$("#data-inicio").datepicker({
    format: "dd/mm/yyyy",
    language: "pt-BR",
    container: "#datepicker-dropbox-inicio",
    });

    $("#data-fim").datepicker({
    format: "dd/mm/yyyy",
    language: "pt-BR",
    container: "#datepicker-dropbox-fim",
    });
    console.log("Data picker inicializados.")
}

document.addEventListener("DOMContentLoaded", function () {
    inicializar_data_pickers();
    plotar_valores('Real', [1,2,3],['01/01','02/01','03/01'])
    
  });