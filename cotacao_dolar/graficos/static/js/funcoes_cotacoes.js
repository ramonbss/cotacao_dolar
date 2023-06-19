import { criarDataObjAPartirFormatoBrasil } from "./funcoes_data.js";
import { plotar_valores } from "./graficos.js";

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

async function obterCotacoes(moedaAlvo) {
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
    }
    dataAtual.setDate(dataAtual.getDate() + 1); // Move to the next day
  }
  plotar_valores(moedaAlvo, cotacoes, datas);
}

async function lerCotacaoNoServidor(moedaAlvo, data) {
  let request_data = {
    moeda: moedaAlvo,
    data: data,
  };

  return await sendPostRequest("/graficos/cotacoes/", request_data);
}

async function sendPostRequest(url, request_data) {
  try {
    console.log("Url: ", url);
    console.log("Request data: ", request_data);
    console.log("Json request data: ", JSON.stringify(request_data));
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_data),
    });
    console.log("Server response:", response);
    if (!response.ok) {
      throw new Error("Error in AJAX POST request");
    }

    const responseData = await response.json();

    // Process the response data or return it
    return responseData;
  } catch (error) {
    console.error(error);
    // Handle the error condition
  }
}

function obterCookie(name) {
  const cookie = document.cookie.match("(^|;)\\s*" + name + "=([^;]*)");
  return cookie ? cookie.pop() : "";
}
