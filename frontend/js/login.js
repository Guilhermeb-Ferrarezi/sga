// ============================
// FUNÇÃO DE MENSAGEM
// ============================
function mostrarMensagem(texto, tipo = "erro", redirecionar = false, destino = "") {
	const msg = document.getElementById("resposta");
	if (!msg) return;

	msg.textContent = texto;
	msg.className = "msg show " + tipo;

	if (redirecionar) {
		setTimeout(() => {
			window.location.href = destino;
		}, 2000);
	}
}

// ============================
// LOGIN NORMAL
// ============================
const btnEntrar = document.getElementById("btn-entrar");

if (btnEntrar) {
	btnEntrar.addEventListener("click", async () => {
		btnEntrar.disabled = true;

		const usuario = document.getElementById("user").value.trim();
		const senha = document.getElementById("password").value.trim();

		if (!usuario || !senha) {
			mostrarMensagem("Preencha todos os campos");
			btnEntrar.disabled = false;
			return;
		}

		try {
			const resposta = await fetch("/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: `usuario=${encodeURIComponent(usuario)}&senha=${encodeURIComponent(senha)}`
			});

			const data = await resposta.json();

			if (data.success) {
				window.location.href = "http://sga.santos-tech.com/";
			} else {
				mostrarMensagem(data.message || "Erro no login");
				btnEntrar.disabled = false;
			}
		} catch {
			mostrarMensagem("Erro ao conectar ao servidor");
			btnEntrar.disabled = false;
		}
	});
}

// ============================
// CRIAR CONTA
// ============================
const btnCriar = document.getElementById("btn-criar");

if (btnCriar) {
	btnCriar.addEventListener("click", async () => {
		btnCriar.disabled = true;

		const usuario = document.getElementById("user").value.trim();
		const email = document.getElementById("email").value.trim();
		const nome = document.getElementById("displayName").value.trim();
		const senha = document.getElementById("password").value.trim();

		if (!usuario || !email || !nome || !senha) {
			mostrarMensagem("Preencha todos os dados");
			btnCriar.disabled = false;
			return;
		}

		try {
			const resposta = await fetch("/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body:
					`usuario=${encodeURIComponent(usuario)}` +
					`&email=${encodeURIComponent(email)}` +
					`&nome=${encodeURIComponent(nome)}` +
					`&senha=${encodeURIComponent(senha)}`
			});

			const data = await resposta.json();

			if (data.success) {
				mostrarMensagem("Conta criada com sucesso", "sucesso", true, "http://sga.santos-tech.com/login");
			} else {
				mostrarMensagem(data.message || "Erro ao criar conta");
				btnCriar.disabled = false;
			}
		} catch {
			mostrarMensagem("Erro ao conectar ao servidor");
			btnCriar.disabled = false;
		}
	});
}

// ============================
// LOGIN COM GOOGLE
// ============================
const loginGoogle = document.getElementById("btn-google");

if (loginGoogle) {
	loginGoogle.addEventListener("click", () => {
		window.location.href = "http://sga.santos-tech.com/auth/google";
	});
}

// ============================
// BOTÃO MOSTRAR SENHA
// ============================
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

if (passwordInput && togglePassword && eyeIcon) {
	togglePassword.addEventListener("click", () => {
		if (passwordInput.type === "password") {
			passwordInput.type = "text";
			eyeIcon.src = "./image/Login/olho-fechado.svg";
			eyeIcon.alt = "Ocultar senha";
		} else {
			passwordInput.type = "password";
			eyeIcon.src = "./image/Login/olho-aberto.svg";
			eyeIcon.alt = "Mostrar senha";
		}
	});
}
