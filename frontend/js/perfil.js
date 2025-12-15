fetch("/me")
    .then(res => {
        if (res.status === 401) {
            window.location.href = "./frontend/login.html";
            return;
        }
        return res.json();
    })
    .then(user => {
        if (!user) return;

        document.getElementById("nome").textContent =
            user.nome || user.usuario;

        document.getElementById("email").textContent = user.email;

        if (user.foto) {
            document.getElementById("foto").src = user.foto;
        } else {
            document.getElementById("foto").style.display = "none";
        }
    });

document.getElementById("btn-logout").addEventListener("click", () => {
    window.location.href = "/logout";
});
