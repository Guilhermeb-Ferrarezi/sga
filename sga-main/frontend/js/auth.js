document.addEventListener("DOMContentLoaded", async () => {
	try {
		const res = await fetch("/me");
		const data = await res.json();

		const btnLogin = document.getElementById("btn-login");
		const userLogged = document.getElementById("user-logged");
		const userName = document.getElementById("user-name");

		if (data.logged) {
			if (btnLogin) btnLogin.style.display = "none";
			if (userLogged) userLogged.style.display = "flex";

			if (userName) {
				// Garante pegar só o primeiro nome
				const nomeCompleto = data.user.nome || data.user.name || "";
				const primeiroNome = nomeCompleto.trim().split(/\s+/)[0];

				userName.textContent = `Olá, ${primeiroNome}`;
			}
		} else {
			if (btnLogin) btnLogin.style.display = "inline-flex";
			if (userLogged) userLogged.style.display = "none";
		}
	} catch (err) {
		console.error("Erro ao verificar login", err);
	}
});

// ============================
// LOGOUT
// ============================
function logout() {
	fetch("/logout", { method: "GET" })
		.then(() => {
			window.location.href = "./index.html";
		});
}
