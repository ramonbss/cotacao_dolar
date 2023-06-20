import {
  criarDataObjAPartirFormatoBrasil,
  validarCamposDeData,
} from "./funcoes_data.js";
import { enviarPostRequest } from "./http_requests.js";
import { plotar_valores, mostrarMensagemDeErro } from "./graficos.js";

export function inicializarBotoesCotacao() {
  console.log("Inicializando eventos dos botoes");
  const botaoReal = document.getElementById("botaoReal");
  const botaoEuro = document.getElementById("botaoEuro");
  const botaoIene = document.getElementById("botaoIene");

  botaoReal.addEventListener("click", function () {
    obterCotacoes("BRL");
  });

  botaoEuro.addEventListener("click", function () {
    obterCotacoes("EUR");
  });

  botaoIene.addEventListener("click", function () {
    obterCotacoes("JPY");
  });
}

export function setBotoesDesabilitado(novoEstado) {
  const buttons = document.getElementsByClassName("botao-cotacao");

  for (const element of buttons) {
    element.disabled = novoEstado;
  }
}

async function obterCotacoes(moedaAlvo) {
  if ((await validarCamposDeData()) == false) {
    console.log("Campos de data inconsistentes");
    mostrarMensagemDeErro(
      "Verifique se o intervalo entre as datas é de 5 dias úteis, no máximo\nou se a Data Inicio escolhida está antes da Data Final"
    );
    return;
  }
  let inputDataInicio = document.getElementById("data-inicio");
  let inputDataFim = document.getElementById("data-fim");

  // Read the text value of the input
  let strDataInicio = inputDataInicio.value;
  let strDataFim = inputDataFim.value;

  let dataInicio = criarDataObjAPartirFormatoBrasil(strDataInicio);
  let dataFim = criarDataObjAPartirFormatoBrasil(strDataFim);

  let dataAtual = new Date(dataInicio);

  // Loop through the dates until reaching the end date
  let cotacoes = [];
  let datas = [];
  while (dataAtual <= dataFim) {
    let dia = String(dataAtual.getDate()).padStart(2, "0");
    let mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
    let ano = dataAtual.getFullYear();
    let strData = ano + "-" + mes + "-" + dia;
    console.log(strData);
    console.log("Obtendo cotacao para a data: ", strData);
    let resposta = await lerCotacaoNoServidor(moedaAlvo, strData);
    console.log("Resposta do servidor: ", resposta);
    if (resposta["status"]) {
      let cotacao = resposta["data"];
      cotacoes.push(cotacao);
      datas.push(dia + "-" + mes + "-" + ano);
    } else {
      mostrarMensagemDeErro(
        "Erro ao obter cotação do servidor, tente novamente"
      );
    }
    dataAtual.setDate(dataAtual.getDate() + 1); // Move to the next day
  }
  plotar_valores(moedaAlvo, cotacoes, datas);
  mostrarMensagemDeErro("");
}

async function lerCotacaoNoServidor(moedaAlvo, data) {
  let request_data = {
    moeda: moedaAlvo,
    data: data,
  };

  return await enviarPostRequest("/graficos/cotacoes/", request_data);
}

function obterCookie(name) {
  const cookie = document.cookie.match("(^|;)\\s*" + name + "=([^;]*)");
  return cookie ? cookie.pop() : "";
}
