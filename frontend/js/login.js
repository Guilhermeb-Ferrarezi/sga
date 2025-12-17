// ============================
// CONFIG
// ============================
const BASE_URL = "https://sga.santos-tech.com";
const MSG_DELAY = 2000;

// ============================
// FUNÇÃO DE MENSAGEM
// ============================
function mostrarMensagem(texto, tipo = "erro", redirecionar = false, destino = "") {
	const msg = document.getElementById("resposta");
	if (!msg) return;

	msg.textContent = texto;
	msg.className = `msg show ${tipo}`;

	if (redirecionar && destino) {
		setTimeout(() => {
			window.location.href = destino;
		}, MSG_DELAY);
	}
}

// ============================
// FUNÇÃO POST PADRÃO
// ============================
async function postForm(url, dados) {
	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(dados).toString()
	});

	return response.json();
}

// ============================
// LOGIN NORMAL
// ============================
const btnEntrar = document.getElementById("btn-entrar");

btnEntrar?.addEventListener("click", async () => {
	btnEntrar.disabled = true;

	const usuario = document.getElementById("user")?.value.trim();
	const senha = document.getElementById("password")?.value.trim();

	if (!usuario || !senha) {
		mostrarMensagem("Preencha todos os campos");
		return (btnEntrar.disabled = false);
	}

	try {
		const data = await postForm("/login", { usuario, senha });

		if (data.success) {
			window.location.href = BASE_URL;
		} else {
			mostrarMensagem(data.message || "Erro no login");
			btnEntrar.disabled = false;
		}
	} catch {
		mostrarMensagem("Erro ao conectar ao servidor");
		btnEntrar.disabled = false;
	}
});

// ============================
// CRIAR CONTA
// ============================
const btnCriar = document.getElementById("btn-criar");

btnCriar?.addEventListener("click", async () => {
	btnCriar.disabled = true;

	const usuario = document.getElementById("user")?.value.trim();
	const email = document.getElementById("email")?.value.trim();
	const nome = document.getElementById("displayName")?.value.trim();
	const senha = document.getElementById("password")?.value.trim();

	if (!usuario || !email || !nome || !senha) {
		mostrarMensagem("Preencha todos os dados");
		return (btnCriar.disabled = false);
	}

	try {
		const data = await postForm("/register", {
			usuario,
			email,
			nome,
			senha
		});

		if (data.success) {
			mostrarMensagem(
				"Conta criada com sucesso",
				"sucesso",
				true,
				`${BASE_URL}/login`
			);
		} else {
			mostrarMensagem(data.message || "Erro ao criar conta");
			btnCriar.disabled = false;
		}
	} catch {
		mostrarMensagem("Erro ao conectar ao servidor");
		btnCriar.disabled = false;
	}
});

// ============================
// LOGIN COM GOOGLE
// ============================
document.getElementById("btn-google")?.addEventListener("click", () => {
	window.location.href = `${BASE_URL}/auth/google`;
});

// ============================
// MOSTRAR / OCULTAR SENHA
// ============================
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

togglePassword?.addEventListener("click", () => {
	const mostrar = passwordInput.type === "password";

	passwordInput.type = mostrar ? "text" : "password";
	eyeIcon.src = mostrar
		? "./image/Login/olho-fechado.svg"
		: "./image/Login/olho-aberto.svg";

	eyeIcon.alt = mostrar ? "Ocultar senha" : "Mostrar senha";
});
