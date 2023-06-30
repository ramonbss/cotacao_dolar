export async function enviarPostRequest(url, request_data) {
  try {
    console.log("Url: ", url);
    console.log("Request: ", request_data);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      mode: "same-origin", // Do not send CSRF token to another domain.
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

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie("csrftoken");

console.log("Cookie csfr: ", csrftoken);
