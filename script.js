const inputNome = document.querySelector("#nome");
const inputIdade = document.querySelector("#idade");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();
  const nome = inputNome.value;
  const idade = inputIdade.value;

  resultado.classList.remove(
    "d-none",
    "alert-success",
    "alert-danger",
    "alert-warning",
  );

  if (idade >= 18) {
    resultado.textContent = "Olá, " + nome + "! Você é maior de idade.";
    resultado.classList.add("alert-success");
  } else {
    resultado.textContent = "Olá, ${nome}! Você é menor de idade.";
    resultado.classList.add("alert-danger");
  }
});
