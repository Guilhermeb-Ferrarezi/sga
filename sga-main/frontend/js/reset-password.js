const senha = document.getElementById("password");
const confirmar = document.getElementById("confirm-password");
const btnReset = document.getElementById("btn-reset");
const resposta = document.getElementById("resposta");

// =========================
// RESET SENHA
// =========================
if (btnReset) {
	btnReset.addEventListener("click", async () => {
		if (senha.value.length < 6) {
			resposta.textContent = "Senha fraca (mínimo 6 caracteres)";
			return;
		}

		if (senha.value !== confirmar.value) {
			resposta.textContent = "As senhas não coincidem";
			return;
		}

		const token = new URLSearchParams(window.location.search).get("token");

		const res = await fetch("/reset-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token, senha: senha.value })
		});

		const data = await res.json();
		resposta.textContent = data.message;

		if (data.success) {
			setTimeout(() => {
				window.location.href = "./frontend/login.html";
			}, 2000);
		}
	});
}

// =========================
// LOGIN
// =========================
const btnEntrar = document.getElementById("btn-entrar");

if (btnEntrar) {
	btnEntrar.addEventListener("click", async () => {
		const usuario = document.getElementById("user").value;
		const senha = document.getElementById("password").value;

		const res = await fetch("/login", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `usuario=${encodeURIComponent(usuario)}&senha=${encodeURIComponent(senha)}`
		});

		const data = await res.json();

		if (data.success) {
			window.location.href = "/index.html";
		} else {
			resposta.textContent = data.message;
		}
	});
}

// =========================
// GOOGLE
// =========================
const btnGoogle = document.getElementById("btn-google");
if (btnGoogle) {
	btnGoogle.onclick = () => {
		window.location.href = "/auth/google";
	};
}
