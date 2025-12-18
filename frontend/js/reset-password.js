// ============================
// CONFIG
// ============================
const BASE_URL = "https://sga.santos-tech.com";
const MSG_DELAY = 2000;

// ============================
// ELEMENTOS
// ============================
const senhaInput = document.getElementById("password");
const confirmarInput = document.getElementById("confirm-password");
const btnReset = document.getElementById("btn-reset");
const btnEntrar = document.getElementById("btn-entrar");
const btnGoogle = document.getElementById("btn-google");
const resposta = document.getElementById("resposta");

// ============================
// FUNÇÃO DE MENSAGEM
// ============================
function mostrarMensagem(texto) {
	if (!resposta) return;
	resposta.textContent = texto;
}

// ============================
// FUNÇÃO POST JSON
// ============================
async function postJSON(url, data) {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	return res.json();
}

// ============================
// RESET DE SENHA
// ============================
btnReset?.addEventListener("click", async () => {
	if (!senhaInput || !confirmarInput) return;

	if (senhaInput.value.length < 6) {
		return mostrarMensagem("Senha fraca (mínimo 6 caracteres)");
	}

	if (senhaInput.value !== confirmarInput.value) {
		return mostrarMensagem("As senhas não coincidem");
	}

	const token = new URLSearchParams(window.location.search).get("token");
	if (!token) return mostrarMensagem("Token inválido");

	try {
		const data = await postJSON("/reset-password", {
			token,
			senha: senhaInput.value
		});

		mostrarMensagem(data.message || "Senha atualizada");

		if (data.success) {
			setTimeout(() => {
				window.location.href = `${BASE_URL}/login`;
			}, MSG_DELAY);
		}
	} catch {
		mostrarMensagem("Erro ao conectar ao servidor");
	}
});

// ============================
// LOGIN NORMAL
// ============================
btnEntrar?.addEventListener("click", async () => {
	const usuario = document.getElementById("user")?.value.trim();
	const senha = senhaInput?.value.trim();

	if (!usuario || !senha) {
		return mostrarMensagem("Preencha todos os campos");
	}

	try {
		const res = await fetch("/login", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ usuario, senha }).toString()
		});

		const data = await res.json();

		if (data.success) {
			window.location.href = BASE_URL;
		} else {
			mostrarMensagem(data.message || "Erro no login");
		}
	} catch {
		mostrarMensagem("Erro ao conectar ao servidor");
	}
});

// ============================
// LOGIN COM GOOGLE
// ============================
btnGoogle?.addEventListener("click", () => {
	window.location.href = `${BASE_URL}/auth/google`;
});
