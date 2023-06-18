export function validarData(strData) {
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

export function checarIntervaloEntreDatas(dataInicio, dataFim) {
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
