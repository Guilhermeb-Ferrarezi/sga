// ============================
// CONFIG
// ============================
const API_URL = "https://api.santos-tech.com";
const FRONTEND_URL = "https://sga.santos-tech.com";

// ============================
// DOM READY
// ============================
document.addEventListener("DOMContentLoaded", async () => {
	await carregarPerfil();
	configurarLogout();
});

// ============================
// CARREGAR PERFIL
// ============================
async function carregarPerfil() {
	try {
		const res = await fetch(`${API_URL}/me`, {
			credentials: "include"
		});

		const data = await res.json();

		if (!data.logged || !data.user) {
			window.location.href = `${FRONTEND_URL}/login.html`;
			return;
		}

		const user = data.user;

		// Preencher dados do usuário
		const fotoEl = document.getElementById("foto");
		const nomeEl = document.getElementById("nome");
		const emailEl = document.getElementById("email");

		if (fotoEl) {
			if (user.foto) {
				fotoEl.src = user.foto;
				fotoEl.alt = `Foto de ${user.nome || user.usuario || "usuário"}`;
			} else {
				// Foto padrão ou placeholder
				fotoEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Ccircle cx='45' cy='45' r='45' fill='%23ddd'/%3E%3Ctext x='45' y='50' font-family='Arial' font-size='30' fill='%23999' text-anchor='middle'%3E%3F%3C/text%3E%3C/svg%3E";
				fotoEl.alt = "Sem foto";
			}
		}

		if (nomeEl) {
			nomeEl.textContent = user.nome || user.usuario || "Usuário";
		}

		if (emailEl) {
			emailEl.textContent = user.email || "";
		}
	} catch (err) {
		console.error("Erro ao carregar perfil:", err);
		alert("Erro ao carregar dados do perfil. Redirecionando...");
		window.location.href = `${FRONTEND_URL}/login.html`;
	}
}

// ============================
// CONFIGURAR LOGOUT
// ============================
function configurarLogout() {
	const btnLogout = document.getElementById("btn-logout");

	btnLogout?.addEventListener("click", async () => {
		btnLogout.disabled = true;
		btnLogout.textContent = "Saindo...";

		try {
			await fetch(`${API_URL}/logout`, {
				method: "GET",
				credentials: "include"
			});

			window.location.href = `${FRONTEND_URL}/login.html`;
		} catch (err) {
			console.error("Erro ao fazer logout:", err);
			alert("Erro ao fazer logout. Tente novamente.");
			btnLogout.disabled = false;
			btnLogout.textContent = "Sair";
		}
	});
}
