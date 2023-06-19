import { enviarPostRequest } from "./http_requests.js";

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

  $(inputDataInicio).on("changeDate", async function () {
    await validarCamposDeData();
  });

  $(inputDataFim).on("changeDate", async function () {
    await validarCamposDeData();
  });

  inicializarDataPickersComDataAtual(inputDataInicio, inputDataFim);
  console.log("Data picker inicializados.");
}

export function criarDataObjAPartirFormatoBrasil(strDataFormatoBrasil) {
  let camposDaData = strDataFormatoBrasil.split("/");
  return new Date(
    parseInt(camposDaData[2]),
    parseInt(camposDaData[1]) - 1,
    parseInt(camposDaData[0])
  );
}

export async function validarCamposDeData() {
  let inputDataInicio = document.getElementById("data-inicio");
  let inputDataFim = document.getElementById("data-fim");
  let dataInicio = inputDataInicio.value;
  let dataFim = inputDataFim.value;
  // Valida se formato das datas dd/mm/YYYY
  let dataInicioValida = validarData(dataInicio);
  let dataFimValida = validarData(dataFim);

  if (dataInicioValida && dataFimValida) {
    // Compara datas
    const isDataValida = await checarIntervaloEntreDatas(dataInicio, dataFim);
    console.log("Data e valida: ", isDataValida);
    if (isDataValida) {
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

  // Cria um objeto Date para validar as entradas
  // Um dia 35 seria validado pelo o regex, mas daria erro aqui
  let camposDaData = strData.split("/");
  let dia = parseInt(camposDaData[0], 10);
  let mes = parseInt(camposDaData[1], 10) - 1;
  let ano = parseInt(camposDaData[2], 10);

  let data = new Date(ano, mes, dia);
  return (
    data.getDate() === dia &&
    data.getMonth() === mes &&
    data.getFullYear() === ano
  );
}

async function checarIntervaloEntreDatas(dataInicio, dataFim) {
  let dateObj1 = criarDataObjAPartirFormatoBrasil(dataInicio);
  let dateObj2 = criarDataObjAPartirFormatoBrasil(dataFim);

  let diferencaEntreDatas = dateObj2.getTime() - dateObj1.getTime();
  let diferencaEmDias = Math.ceil(diferencaEntreDatas / (1000 * 3600 * 24));

  const numero_dias_uteis = await contar_dias_uteis_entre_datas(
    dataInicio,
    dataFim
  );
  console.log("Numero de dias uteis entre as datas: ", numero_dias_uteis);

  return diferencaEmDias >= 0 && numero_dias_uteis <= 5;
}

async function contar_dias_uteis_entre_datas(strDataInicio, strDataFim) {
  let request_data = {
    data_inicio: strDataInicio,
    data_fim: strDataFim,
  };

  const respostaServidor = await enviarPostRequest(
    "/graficos/contar_dias_uteis/",
    request_data
  );
  return respostaServidor["data"];
}
