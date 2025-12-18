document.addEventListener("DOMContentLoaded", async () => {
	const res = await fetch("/me");
	const data = await res.json();

	if (data.logged) {
		document.getElementById("ola-usuario").textContent =
			`Olá, ${data.nome}`;
	}
});
