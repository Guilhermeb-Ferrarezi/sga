// ============================
// CONFIG
// ============================
const BASE_URL = "https://sga.santos-tech.com";
const API_URL = "https://api.santos-tech.com";

// ============================
// DOM READY
// ============================
document.addEventListener("DOMContentLoaded", () => {
	verificarLogin();
});

// ============================
// VERIFICAR LOGIN
// ============================
async function verificarLogin() {
	try {
		const res = await fetch(`${API_URL}/me`, { credentials: "include" });
		const data = await res.json();

		const btnLogin = document.getElementById("btn-login");
		const userLogged = document.getElementById("user-logged");
		const userName = document.getElementById("user-name");

		if (data.logged) {
			btnLogin && (btnLogin.style.display = "none");
			userLogged && (userLogged.style.display = "flex");

			if (userName && data.user) {
				const nome = data.user.nome || data.user.name || "";
				const primeiroNome = nome.trim().split(/\s+/)[0];
				userName.textContent = `Olá, ${primeiroNome}`;
			}
		} else {
			btnLogin && (btnLogin.style.display = "inline-flex");
			userLogged && (userLogged.style.display = "none");
		}
	} catch (err) {
		console.error("Erro ao verificar login", err);
	}
}

// ============================
// LOGOUT
// ============================
async function logout() {
	try {
		await fetch(`${API_URL}/logout`, {
			method: "GET",
			credentials: "include"
		});
		window.location.href = BASE_URL;
	} catch {
		console.error("Erro ao fazer logout");
	}
}
