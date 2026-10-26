
"use strict";

// ============================
// FUNÇÕES AUXILIARES
// ============================

function mostrarMensagem(elemento, texto, tipo = "error") {
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

function traduzirErro(erro) {
    const mensagem = (erro?.message || "").toLowerCase();

    if (mensagem.includes("invalid login credentials")) {
        return "E-mail ou senha incorretos.";
    }

    if (mensagem.includes("user already registered")) {
        return "Este e-mail já possui uma conta.";
    }

    if (mensagem.includes("password should be at least")) {
        return "A senha precisa ter pelo menos 8 caracteres.";
    }

    if (mensagem.includes("email not confirmed")) {
        return "Confirme seu e-mail antes de entrar.";
    }

    if (mensagem.includes("rate limit")) {
        return "Muitas tentativas. Aguarde um pouco e tente novamente.";
    }

    return erro?.message || "Ocorreu um erro. Tente novamente.";
}

// Mostra e oculta as senhas.
document.querySelectorAll(".toggle-password").forEach((botao) => {
    botao.addEventListener("click", () => {
        const campo = document.getElementById(botao.dataset.target);

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

// Limpa o destaque de erro enquanto o usuário digita.
document.querySelectorAll("input").forEach((campo) => {
    campo.addEventListener("input", () => {
        campo.classList.remove("invalid");
    });
});

// ============================
// CADASTRO
// ============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const confirmarSenha = document.getElementById("confirmarSenha");
    const aceitarTermos = document.getElementById("aceitarTermos");
    const mensagem = document.getElementById("registerMessage");
    const botao = registerForm.querySelector('button[type="submit"]');

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagem(mensagem);

        const nomeOk = validarCampo(nome);
        const emailOk = validarCampo(email);
        const senhaOk = validarCampo(senha);
        const confirmacaoOk = validarCampo(confirmarSenha);

        if (!nomeOk || !emailOk || !senhaOk || !confirmacaoOk) {
            mostrarMensagem(
                mensagem,
                "Preencha corretamente todos os campos obrigatórios."
            );
            return;
        }

        if (nome.value.trim().length < 3) {
            nome.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "Digite seu nome completo ou um nome com pelo menos 3 caracteres."
            );
            return;
        }

        if (!emailValido(email.value.trim())) {
            email.classList.add("invalid");

            mostrarMensagem(mensagem, "Digite um e-mail válido.");
            return;
        }

        if (senha.value.length < 8) {
            senha.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "A senha precisa ter pelo menos 8 caracteres."
            );
            return;
        }

        if (senha.value !== confirmarSenha.value) {
            confirmarSenha.classList.add("invalid");

            mostrarMensagem(mensagem, "As senhas não coincidem.");
            return;
        }

        if (!aceitarTermos.checked) {
            mostrarMensagem(
                mensagem,
                "Você precisa aceitar os termos para continuar."
            );
            return;
        }

        botao.disabled = true;
        botao.textContent = "Criando conta...";

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email.value.trim(),
                password: senha.value,
                options: {
                    data: {
                        full_name: nome.value.trim()
                    },
                    emailRedirectTo: `${window.location.origin}/login.html`
                }
            });

            if (error) throw error;

            // Quando a confirmação de e-mail está habilitada,
            // a sessão normalmente ainda não está autenticada.
            if (data.session) {
                mostrarMensagem(
                    mensagem,
                    "Conta criada! Redirecionando para sua área de cliente...",
                    "success"
                );

                window.location.assign("conta.html");
                return;
            }

            mostrarMensagem(
                mensagem,
                "Cadastro enviado! Confira seu e-mail para confirmar a conta antes de entrar.",
                "success"
            );

            registerForm.reset();
        } catch (erro) {
            console.error("Erro no cadastro:", erro);

            mostrarMensagem(
                mensagem,
                traduzirErro(erro)
            );
        } finally {
            botao.disabled = false;
            botao.innerHTML = 'Criar minha conta <span>→</span>';
        }
    });
}

// ============================
// LOGIN
// ============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const mensagem = document.getElementById("loginMessage");
    const botao = loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagem(mensagem);

        if (!validarCampo(email) || !validarCampo(senha)) {
            mostrarMensagem(
                mensagem,
                "Informe um e-mail válido e sua senha."
            );
            return;
        }

        if (!emailValido(email.value.trim())) {
            email.classList.add("invalid");

            mostrarMensagem(mensagem, "Digite um e-mail válido.");
            return;
        }

        botao.disabled = true;
        botao.textContent = "Entrando...";

        try {
            const { error } = await supabaseClient.auth.signInWithPassword({
                email: email.value.trim(),
                password: senha.value
            });

            if (error) throw error;

            mostrarMensagem(
                mensagem,
                "Login realizado! Abrindo sua conta...",
                "success"
            );

            window.location.assign("conta.html");
        } catch (erro) {
            console.error("Erro no login:", erro);

            mostrarMensagem(
                mensagem,
                traduzirErro(erro)
            );
        } finally {
            botao.disabled = false;
            botao.innerHTML = 'Entrar na conta <span>→</span>';
        }
    });
}

// ============================
// RECUPERAÇÃO DE SENHA
// ============================

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email");
        const mensagem = document.getElementById("loginMessage");

        limparMensagem(mensagem);

        if (!email.value.trim() || !emailValido(email.value.trim())) {
            email.classList.add("invalid");
            email.focus();

            mostrarMensagem(
                mensagem,
                "Digite seu e-mail para solicitar a recuperação de senha."
            );
            return;
        }

        try {
            const { error } =
                await supabaseClient.auth.resetPasswordForEmail(
                    email.value.trim(),
                    {
                        redirectTo:
                            `${window.location.origin}/redefinir-senha.html`
                    }
                );

            if (error) throw error;

            mostrarMensagem(
                mensagem,
                "Se o endereço estiver cadastrado, você receberá as instruções de recuperação por e-mail.",
                "success"
            );
        } catch (erro) {
            console.error("Erro ao solicitar recuperação:", erro);

            mostrarMensagem(
                mensagem,
                traduzirErro(erro)
            );
        }
    });
}

// ============================
// PÁGINA DE RECUPERAÇÃO
// ============================

const resetForm = document.getElementById("resetForm");

if (resetForm) {
    const senha = document.getElementById("novaSenha");
    const confirmar = document.getElementById("confirmarNovaSenha");
    const mensagem = document.getElementById("resetMessage");
    const botao = resetForm.querySelector('button[type="submit"]');

    resetForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagem(mensagem);

        if (!validarCampo(senha) || !validarCampo(confirmar)) {
            mostrarMensagem(
                mensagem,
                "Preencha corretamente os dois campos."
            );
            return;
        }

        if (senha.value.length < 8) {
            mostrarMensagem(
                mensagem,
                "A nova senha deve ter pelo menos 8 caracteres."
            );
            return;
        }

        if (senha.value !== confirmar.value) {
            confirmar.classList.add("invalid");

            mostrarMensagem(mensagem, "As senhas não coincidem.");
            return;
        }

        botao.disabled = true;
        botao.textContent = "Atualizando...";

        try {
            const { data, error: sessionError } =
                await supabaseClient.auth.getSession();

            if (sessionError) throw sessionError;

            if (!data.session) {
                throw new Error(
                    "Link inválido ou expirado. Solicite uma nova recuperação de senha."
                );
            }

            const { error } = await supabaseClient.auth.updateUser({
                password: senha.value
            });

            if (error) throw error;

            await supabaseClient.auth.signOut();

            mostrarMensagem(
                mensagem,
                "Senha alterada com sucesso! Você será redirecionado para o login.",
                "success"
            );

            setTimeout(() => {
                window.location.assign("login.html");
            }, 1800);
        } catch (erro) {
            console.error("Erro ao redefinir senha:", erro);

            mostrarMensagem(
                mensagem,
                traduzirErro(erro)
            );
        } finally {
            botao.disabled = false;
            botao.textContent = "Salvar nova senha";
        }
    });
}


/* ============================
   ÁREA DO CLIENTE
============================ */

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    const nomeElemento = document.getElementById("userName");
    const emailElemento = document.getElementById("userEmail");
    const mensagem = document.getElementById("accountMessage");

    async function carregarConta() {
        try {
            const { data, error } = await supabaseClient.auth.getUser();

            if (error || !data.user) {
                window.location.replace("login.html");
                return;
            }

            const usuario = data.user;

            emailElemento.textContent = usuario.email || "Não informado";
            nomeElemento.textContent =
                usuario.user_metadata?.full_name || "Cliente";

            const { data: perfil, error: erroPerfil } =
                await supabaseClient
                    .from("profiles")
                    .select("full_name")
                    .eq("id", usuario.id)
                    .maybeSingle();

            if (erroPerfil) {
                console.error("Erro ao carregar perfil:", erroPerfil);
            } else if (perfil?.full_name) {
                nomeElemento.textContent = perfil.full_name;
            }
        } catch (erro) {
            console.error("Erro ao carregar a conta:", erro);

            mostrarMensagem(
                mensagem,
                "Não foi possível carregar seus dados. Verifique sua conexão."
            );
        }
    }

    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = "Saindo...";

        try {
            const { error } = await supabaseClient.auth.signOut();

            if (error) throw error;

            window.location.replace("login.html");
        } catch (erro) {
            console.error("Erro ao sair:", erro);

            mostrarMensagem(
                mensagem,
                "Não foi possível encerrar a sessão. Tente novamente."
            );

            logoutButton.disabled = false;
            logoutButton.textContent = "Sair da conta";
        }
    });

    carregarConta();
}
