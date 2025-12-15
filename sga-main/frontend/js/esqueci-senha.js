const btn = document.getElementById("btn-recuperar");
const resposta = document.getElementById("resposta");

btn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        resposta.textContent = "Digite seu email";
        resposta.className = "msg show erro";
        return;
    }

    const res = await fetch("/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (data.success) {
        resposta.textContent = "Email encontrado";
        resposta.className = "msg show sucesso";
    } else {
        resposta.textContent = data.message;
        resposta.className = "msg show erro";
    }
});
