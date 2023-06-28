import { enviarPostRequest } from "./http_requests.js";
const MAXIMO_INTERVALO_DIAS = 5;

function configurarDatePicker(datePicker, strDatePickerContainer) {
  $(datePicker).datepicker({
    format: "dd/mm/yyyy",
    language: "pt-BR",
    container: strDatePickerContainer,
    autoclose: true,
    startDate: new Date(1999, 0, 4),
    endDate: new Date(),
  });
}

function truncarDatas(data, dataLimite) {
  if (data > dataLimite) {
    return dataLimite;
  }
  return data;
}

function converterDateEmTextoFormatoBrasil(data) {
  let dia = String(data.getDate()).padStart(2, "0");
  let mes = String(data.getMonth() + 1).padStart(2, "0");
  let ano = data.getFullYear();

  return dia + "/" + mes + "/" + ano;
}

async function aplicarRestricoesDataFim() {
  let inputDataInicio = document.getElementById("data-inicio");
  let inputDataFim = document.getElementById("data-fim");

  let strDataInicio = inputDataInicio.value;
  let strDataFim = inputDataFim.value;

  if (validarData(strDataFim) == false) {
    strDataFim = strDataInicio;
  }

  let dataInicio = criarDataObjAPartirFormatoBrasil(strDataInicio);
  let dataFim = criarDataObjAPartirFormatoBrasil(strDataFim);
  let dataFimLimite = criarDataObjAPartirFormatoBrasil(strDataInicio);

  dataFimLimite.setDate(dataInicio.getDate() + MAXIMO_INTERVALO_DIAS);
  console.log("Data inicio: ", strDataInicio);
  console.log(
    "Data Fim Limite: ",
    converterDateEmTextoFormatoBrasil(dataFimLimite)
  );

  let quantidadeDiasUteis = await contar_dias_uteis_entre_datas(
    strDataInicio,
    converterDateEmTextoFormatoBrasil(dataFimLimite)
  );
  console.log("QUantidade dias uteis: ", quantidadeDiasUteis);

  let feriados = MAXIMO_INTERVALO_DIAS - quantidadeDiasUteis;

  console.log("QUantidade feriados: ", feriados);

  dataFimLimite.setDate(dataFimLimite.getDate() + feriados);
  console.log(
    "Data Fim (inicio + MAX_Dias + feriados): ",
    converterDateEmTextoFormatoBrasil(dataFimLimite)
  );
  let dataAtual = new Date();

  dataFimLimite = truncarDatas(dataFimLimite, dataAtual);
  console.log(
    "Data Fim truncado com data atual: ",
    converterDateEmTextoFormatoBrasil(dataFimLimite)
  );

  let datePicker = $(inputDataFim).datepicker().data("datepicker");
  datePicker.setStartDate(dataInicio);
  datePicker.setEndDate(dataFimLimite);

  if (dataFim > dataFimLimite || dataFim < dataInicio) {
    inputDataFim.value = inputDataInicio.value;
  }
}

export function inicializar_data_pickers() {
  let inputDataInicio = document.getElementById("data-inicio");
  let inputDataFim = document.getElementById("data-fim");

  configurarDatePicker(inputDataInicio, "#datepicker-dropbox-inicio");

  configurarDatePicker(inputDataFim, "#datepicker-dropbox-fim");

  $(inputDataInicio).on("changeDate", async function () {
    await validarCamposDeData();
    aplicarRestricoesDataFim();
  });

  $(inputDataFim).on("changeDate", async function () {
    await validarCamposDeData();
  });

  inicializarDataPickersComDataAtual(inputDataInicio, inputDataFim);
  aplicarRestricoesDataFim();
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
  let dataAtual = new Date();

  // Formatar data no formato "dd/mm/YYYY"
  let dataFormatoBrasil = converterDateEmTextoFormatoBrasil(dataAtual);

  // Inicializa os data pickers com a data atual
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
    "/api/dias_uteis/obter",
    request_data
  );
  return respostaServidor["data"];
}
