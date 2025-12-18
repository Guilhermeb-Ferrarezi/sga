// ============================
// CONFIG
// ============================
const API_URL = "https://sga.santos-tech.com";
const FRONTEND_URL = "https://sga.santos-tech.com";
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
async function postForm(endpoint, dados) {
	const response = await fetch(`${API_URL}${endpoint}`, {
		method: "POST",
		credentials: "include", // 🔥 essencial para cookies/sessão
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams(dados).toString()
	});

	if (!response.ok) {
		throw new Error("Erro na requisição");
	}

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
		btnEntrar.disabled = false;
		return;
	}

	try {
		const data = await postForm("/login", { usuario, senha });

		if (data.success) {
			window.location.href = FRONTEND_URL;
		} else {
			mostrarMensagem(data.message || "Usuário ou senha inválidos");
			btnEntrar.disabled = false;
		}
	} catch (err) {
		console.error(err);
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
		btnCriar.disabled = false;
		return;
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
				`${FRONTEND_URL}/login`
			);
		} else {
			mostrarMensagem(data.message || "Erro ao criar conta");
			btnCriar.disabled = false;
		}
	} catch (err) {
		console.error(err);
		mostrarMensagem("Erro ao conectar ao servidor");
		btnCriar.disabled = false;
	}
});

// ============================
// LOGIN COM GOOGLE
// ============================
const btnGoogle = document.getElementById("btn-google");

btnGoogle?.addEventListener("click", () => {
	window.location.href = `${API_URL}/auth/google`;
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

	if (eyeIcon) {
		eyeIcon.src = mostrar
			? "./image/Login/olho-fechado.svg"
			: "./image/Login/olho-aberto.svg";

		eyeIcon.alt = mostrar ? "Ocultar senha" : "Mostrar senha";
	}
});
