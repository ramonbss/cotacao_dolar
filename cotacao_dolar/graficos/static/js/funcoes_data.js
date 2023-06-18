export function inicializar_data_pickers() {
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

function validarData(strData) {
  let regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(strData)) return false;

  let camposDaData = strData.split("/");
  let dia = parseInt(camposDaData[0], 10);
  let mes = parseInt(camposDaData[1], 10) - 1;
  let ano = parseInt(camposDaData[2], 10);

  // Cria um objeto Date para validar as entradas
  // Um dia 35 seria validado pelo o regex, mas daria erro aqui
  let data = new Date(ano, mes, dia);
  return (
    data.getDate() === dia &&
    data.getMonth() === mes &&
    data.getFullYear() === ano
  );
}

function checarIntervaloEntreDatas(dataInicio, dataFim) {
  let camposData1 = dataInicio.split("/");
  let camposData2 = dataFim.split("/");

  let dia1 = parseInt(camposData1[0], 10);
  let mes1 = parseInt(camposData1[1], 10) - 1;
  let ano1 = parseInt(camposData1[2], 10);

  let dia2 = parseInt(camposData2[0], 10);
  let mes2 = parseInt(camposData2[1], 10) - 1;
  let ano2 = parseInt(camposData2[2], 10);

  let dateObj1 = new Date(ano1, mes1, dia1);
  let dateObj2 = new Date(ano2, mes2, dia2);

  let diferencaEntreDatas = dateObj2.getTime() - dateObj1.getTime();
  let diferencaEmDias = Math.ceil(diferencaEntreDatas / (1000 * 3600 * 24));

  return diferencaEmDias >= 0 && diferencaEmDias <= 5;
}
