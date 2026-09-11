// Ponte entre o app (Inspetor/Executor/Gestor) e a planilha do Google.
// Roda nos servidores do Netlify, fora da rede da CPFL — por isso não
// sofre o bloqueio que a rede interna aplica em script.google.com.

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwOnsoszPpwuEQKaHRitj3Y6styVrR6Udep4aicXkSBXfHQX5rvTEGJGCyLfHd2BNz9/exec';

exports.handler = async function (event) {
  const headersResposta = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: headersResposta, body: '' };
  }

  try {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const url = GAS_URL + (params.toString() ? '?' + params.toString() : '');

    const resposta = await fetch(url);
    const texto = await resposta.text();

    return {
      statusCode: 200,
      headers: headersResposta,
      body: texto
    };
  } catch (erro) {
    return {
      statusCode: 500,
      headers: headersResposta,
      body: JSON.stringify({ error: 'Falha no proxy: ' + String(erro) })
    };
  }
};
