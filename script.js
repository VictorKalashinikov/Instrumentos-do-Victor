
"use strict";

// ==========================
// FUNÇÕES AUXILIARES
// ==========================

function mostrarMensagem(elemento, texto, tipo) {
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.className = `message ${tipo}`;
}

function limparMensagem(elemento) {
    if (!elemento) return;

    elemento.textContent = "";
    elemento.className = "message";
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarCampo(campo) {
    if (!campo) return true;

    const valido = campo.checkValidity();

    campo.classList.toggle("invalid", !valido);

    return valido;
}

// Remove o estado de erro enquanto o usuário corrige o campo.
document.querySelectorAll("input").forEach((campo) => {
    campo.addEventListener("input", () => {
        campo.classList.remove("invalid");
    });
});

// ==========================
// MOSTRAR / OCULTAR SENHA
// ==========================

document.querySelectorAll(".toggle-password").forEach((botao) => {
    botao.addEventListener("click", () => {
        const id = botao.dataset.target;
        const campo = document.getElementById(id);

        if (!campo) return;

        const mostrar = campo.type === "password";

        campo.type = mostrar ? "text" : "password";
        botao.textContent = mostrar ? "Ocultar" : "Mostrar";

        botao.setAttribute(
            "aria-label",
            mostrar ? "Ocultar senha" : "Mostrar senha"
        );
    });
});

// ==========================
// CADASTRO
// ==========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const confirmarSenha = document.getElementById("confirmarSenha");
    const aceitarTermos = document.getElementById("aceitarTermos");
    const mensagem = document.getElementById("registerMessage");

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        limparMensagem(mensagem);

        const nomeOk = validarCampo(nome);
        const emailOk = validarCampo(email);
        const senhaOk = validarCampo(senha);
        const confirmacaoOk = validarCampo(confirmarSenha);

        if (!nomeOk || !emailOk || !senhaOk || !confirmacaoOk) {
            mostrarMensagem(
                mensagem,
                "Preencha corretamente todos os campos obrigatórios.",
                "error"
            );
            return;
        }

        if (nome.value.trim().split(/\s+/).join(" ").length < 3) {
            nome.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "Digite um nome válido com pelo menos 3 caracteres.",
                "error"
            );
            return;
        }

        if (!emailValido(email.value.trim())) {
            email.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "Digite um endereço de e-mail válido.",
                "error"
            );
            return;
        }

        if (senha.value.length < 8) {
            senha.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "A senha deve ter pelo menos 8 caracteres.",
                "error"
            );
            return;
        }

        if (senha.value !== confirmarSenha.value) {
            confirmarSenha.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "As senhas não coincidem. Confira os dois campos.",
                "error"
            );
            return;
        }

        if (!aceitarTermos.checked) {
            mostrarMensagem(
                mensagem,
                "Você precisa aceitar os termos para continuar.",
                "error"
            );
            return;
        }

        mostrarMensagem(
            mensagem,
            "Validação concluída! O formulário está pronto para ser conectado ao back-end.",
            "success"
        );

        // Ainda não existe um back-end para criar a conta.
        // Não armazenamos a senha nem simulamos um cadastro real.
    });

    confirmarSenha.addEventListener("input", () => {
        confirmarSenha.classList.remove("invalid");
    });
}

// ==========================
// LOGIN
// ==========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const mensagem = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        limparMensagem(mensagem);

        const emailOk = validarCampo(email);
        const senhaOk = validarCampo(senha);

        if (!emailOk || !senhaOk) {
            mostrarMensagem(
                mensagem,
                "Informe um e-mail válido e sua senha.",
                "error"
            );
            return;
        }

        if (!emailValido(email.value.trim())) {
            email.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "Digite um endereço de e-mail válido.",
                "error"
            );
            return;
        }

        if (!senha.value) {
            senha.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "Digite sua senha para continuar.",
                "error"
            );
            return;
        }

        mostrarMensagem(
            mensagem,
            "Campos validados. A autenticação real depende da integração com o back-end.",
            "success"
        );

        // A autenticação real será implementada no back-end.
    });
}

// ==========================
// RECUPERAÇÃO DE SENHA
// ==========================

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", (event) => {
        event.preventDefault();

        const email = document.getElementById("email");
        const mensagem = document.getElementById("loginMessage");

        limparMensagem(mensagem);

        if (!email.value.trim() || !emailValido(email.value.trim())) {
            email.classList.add("invalid");
            email.focus();

            mostrarMensagem(
                mensagem,
                "Digite seu e-mail para solicitar a recuperação de senha.",
                "error"
            );
            return;
        }

        mostrarMensagem(
            mensagem,
            "O e-mail foi validado. O envio do link de recuperação precisa ser implementado no back-end.",
            "success"
        );
    });
}
