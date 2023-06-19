export async function enviarPostRequest(url, request_data) {
  try {
    console.log("Url: ", url);
    console.log("Request: ", request_data);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_data),
    });
    console.log("Server:", response);
    if (!response.ok) {
      throw new Error("AJAX POST Erro");
    }

    const respostaDoServidor = await response.json();

    // Process the response data or return it
    return respostaDoServidor;
  } catch (error) {
    console.error(error);
    // Handle the error condition
  }
}
