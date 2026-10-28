
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

// ============================
// VALIDAÇÃO DE SENHA
// ============================

function validarSenha(senha) {
    const erros = [];

    if (senha.length < 8 || senha.length > 20) {
        erros.push("A senha deve ter entre 8 e 20 caracteres.");
    }

    if (!/[A-Z]/.test(senha)) {
        erros.push("Inclua pelo menos uma letra maiúscula (A-Z).");
    }

    if (!/[a-z]/.test(senha)) {
        erros.push("Inclua pelo menos uma letra minúscula (a-z).");
    }

    if (!/[0-9]/.test(senha)) {
        erros.push("Inclua pelo menos um número (0-9).");
    }

    if (!/[^A-Za-z0-9]/.test(senha)) {
        erros.push("Inclua pelo menos um caractere especial, como @, #, ! ou $.");
    }

    return erros;
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

    if (
        mensagem.includes("password") &&
        (
            mensagem.includes("uppercase") ||
            mensagem.includes("lowercase") ||
            mensagem.includes("number") ||
            mensagem.includes("special character")
        )
    ) {
        return "A senha não atende aos requisitos de segurança.";
    }

    if (mensagem.includes("email not confirmed")) {
        return "Confirme seu e-mail antes de entrar.";
    }

    if (
        mensagem.includes("rate limit") ||
        mensagem.includes("too many requests")
    ) {
        return "Muitas tentativas. Aguarde um pouco e tente novamente.";
    }

    if (
        mensagem.includes("invalid") &&
        (mensagem.includes("token") || mensagem.includes("otp"))
    ) {
        return "Link inválido ou expirado. Solicite um novo e-mail de recuperação.";
    }

    return erro?.message || "Ocorreu um erro. Tente novamente.";
}

// ============================
// MOSTRAR E OCULTAR SENHAS
// ============================

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

// ============================
// VALIDAÇÃO DOS CAMPOS
// ============================

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
                "Digite um nome com pelo menos 3 caracteres."
            );
            return;
        }

        if (!emailValido(email.value.trim())) {
            email.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "Digite um e-mail válido."
            );
            return;
        }

        // Verifica todos os requisitos de segurança da senha.
        const errosSenha = validarSenha(senha.value);

        if (errosSenha.length > 0) {
            senha.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                errosSenha.join(" ")
            );

            senha.focus();
            return;
        }

        if (senha.value !== confirmarSenha.value) {
            confirmarSenha.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "As senhas não coincidem."
            );
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
                    emailRedirectTo:
                        `${window.location.origin}/index.html`
                }
            });

            if (error) throw error;

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
            mostrarMensagem(mensagem, traduzirErro(erro));
        } finally {
            botao.disabled = false;
            botao.innerHTML = 'Criar minha conta <span>→</span>';
        }
    });
}

// ============================
// BLOQUEIO DE TENTATIVAS DE LOGIN
// ============================

const MAX_TENTATIVAS_LOGIN = 5;
const DURACAO_BLOQUEIO_LOGIN = 3 * 60 * 1000;
const CHAVE_TENTATIVAS_LOGIN = "instrumentos_tentativas_login";

function lerTentativasLogin() {
    try {
        const dados = JSON.parse(
            localStorage.getItem(CHAVE_TENTATIVAS_LOGIN) || "{}"
        );

        return dados && typeof dados === "object" ? dados : {};
    } catch (erro) {
        console.error(
            "Não foi possível ler as tentativas de login:",
            erro
        );

        return {};
    }
}

function obterEstadoLogin(email) {
    const dados = lerTentativasLogin();

    return dados[email] || {
        quantidade: 0,
        bloqueadoAte: 0
    };
}

function salvarEstadoLogin(email, estado) {
    const dados = lerTentativasLogin();
    dados[email] = estado;

    try {
        localStorage.setItem(
            CHAVE_TENTATIVAS_LOGIN,
            JSON.stringify(dados)
        );
    } catch (erro) {
        console.error(
            "Não foi possível salvar as tentativas de login:",
            erro
        );
    }
}

function registrarFalhaLogin(email) {
    const estado = obterEstadoLogin(email);
    const agora = Date.now();

    // Reinicia a contagem se o bloqueio anterior expirou.
    if (estado.bloqueadoAte && estado.bloqueadoAte <= agora) {
        estado.quantidade = 0;
        estado.bloqueadoAte = 0;
    }

    estado.quantidade += 1;

    if (estado.quantidade >= MAX_TENTATIVAS_LOGIN) {
        estado.quantidade = 0;
        estado.bloqueadoAte = agora + DURACAO_BLOQUEIO_LOGIN;
    }

    salvarEstadoLogin(email, estado);

    return estado;
}

function limparTentativasLogin(email) {
    const dados = lerTentativasLogin();
    delete dados[email];

    try {
        localStorage.setItem(
            CHAVE_TENTATIVAS_LOGIN,
            JSON.stringify(dados)
        );
    } catch (erro) {
        console.error(
            "Não foi possível limpar as tentativas de login:",
            erro
        );
    }
}

function obterTempoRestanteBloqueio(email) {
    const estado = obterEstadoLogin(email);
    const restante = estado.bloqueadoAte - Date.now();

    if (restante <= 0 && estado.bloqueadoAte) {
        limparTentativasLogin(email);
        return 0;
    }

    return Math.max(0, restante);
}

function formatarTempoRestante(milissegundos) {
    const segundos = Math.ceil(milissegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${minutos} min e ${segundosRestantes} s`;
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

        const emailNormalizado = email.value.trim().toLowerCase();

        if (!emailValido(emailNormalizado)) {
            email.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "Digite um e-mail válido."
            );
            return;
        }

        // Impede nova tentativa enquanto o bloqueio estiver ativo.
        const tempoRestante =
            obterTempoRestanteBloqueio(emailNormalizado);

        if (tempoRestante > 0) {
            mostrarMensagem(
                mensagem,
                `Login temporariamente bloqueado. Tente novamente em ${formatarTempoRestante(tempoRestante)}.`
            );
            return;
        }

        botao.disabled = true;
        botao.textContent = "Entrando...";

        try {
            const { error } =
                await supabaseClient.auth.signInWithPassword({
                    email: emailNormalizado,
                    password: senha.value
                });

            if (error) throw error;

            // Um login bem-sucedido zera as falhas daquele e-mail.
            limparTentativasLogin(emailNormalizado);

            mostrarMensagem(
                mensagem,
                "Login realizado! Abrindo sua conta...",
                "success"
            );

            window.location.assign("conta.html");
        } catch (erro) {
            console.error("Erro no login:", erro);

            const mensagemErro =
                (erro?.message || "").toLowerCase();

            if (mensagemErro.includes("invalid login credentials")) {
                const estado =
                    registrarFalhaLogin(emailNormalizado);

                if (estado.bloqueadoAte > Date.now()) {
                    mostrarMensagem(
                        mensagem,
                        "Você errou a senha 5 vezes. O login ficará bloqueado por 3 minutos."
                    );
                } else {
                    const restantes =
                        MAX_TENTATIVAS_LOGIN - estado.quantidade;

                    mostrarMensagem(
                        mensagem,
                        `E-mail ou senha incorretos. Restam ${restantes} tentativa(s).`
                    );
                }
            } else {
                mostrarMensagem(mensagem, traduzirErro(erro));
            }
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
            console.error(
                "Erro ao solicitar recuperação:",
                erro
            );

            mostrarMensagem(mensagem, traduzirErro(erro));
        }
    });
}

// ============================
// REDEFINIÇÃO DE SENHA
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

        // Aplica os mesmos requisitos utilizados no cadastro.
        const errosSenha = validarSenha(senha.value);

        if (errosSenha.length > 0) {
            senha.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                errosSenha.join(" ")
            );

            senha.focus();
            return;
        }

        if (senha.value !== confirmar.value) {
            confirmar.classList.add("invalid");

            mostrarMensagem(
                mensagem,
                "As senhas não coincidem."
            );
            return;
        }

        botao.disabled = true;
        botao.textContent = "Atualizando...";

        try {
            const {
                data,
                error: sessionError
            } = await supabaseClient.auth.getSession();

            if (sessionError) throw sessionError;

            if (!data.session) {
                throw new Error(
                    "Link inválido ou expirado. Solicite uma nova recuperação de senha."
                );
            }

            const { error } =
                await supabaseClient.auth.updateUser({
                    password: senha.value
                });

            if (error) throw error;

            const { error: logoutError } =
                await supabaseClient.auth.signOut();

            if (logoutError) {
                console.error(
                    "Erro ao encerrar a sessão:",
                    logoutError
                );
            }

            mostrarMensagem(
                mensagem,
                "Senha alterada com sucesso! Você será redirecionado para o login.",
                "success"
            );

            setTimeout(() => {
                window.location.assign("index.html");
            }, 1800);
        } catch (erro) {
            console.error(
                "Erro ao redefinir senha:",
                erro
            );

            mostrarMensagem(mensagem, traduzirErro(erro));
        } finally {
            botao.disabled = false;
            botao.textContent = "Salvar nova senha";
        }
    });
}

// ============================
// ÁREA DO CLIENTE
// ============================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    const nomeElemento = document.getElementById("userName");
    const emailElemento = document.getElementById("userEmail");
    const mensagem = document.getElementById("accountMessage");

    async function carregarConta() {
        try {
            const { data, error } =
                await supabaseClient.auth.getUser();

            if (error || !data.user) {
                window.location.replace("index.html");
                return;
            }

            const usuario = data.user;

            if (emailElemento) {
                emailElemento.textContent =
                    usuario.email || "Não informado";
            }

            if (nomeElemento) {
                nomeElemento.textContent =
                    usuario.user_metadata?.full_name || "Cliente";
            }

            const {
                data: perfil,
                error: erroPerfil
            } = await supabaseClient
                .from("profiles")
                .select("full_name")
                .eq("id", usuario.id)
                .maybeSingle();

            if (erroPerfil) {
                console.error(
                    "Erro ao carregar perfil:",
                    erroPerfil
                );
            } else if (perfil?.full_name && nomeElemento) {
                nomeElemento.textContent = perfil.full_name;
            }
        } catch (erro) {
            console.error(
                "Erro ao carregar a conta:",
                erro
            );

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
            const { error } =
                await supabaseClient.auth.signOut();

            if (error) throw error;

            window.location.replace("index.html");
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


/* ==========================
   PÁGINA DE VENDAS
========================== */

const storeMenuToggle = document.getElementById("storeMenuToggle");
const storeNavigation = document.getElementById("storeNavigation");

if (storeMenuToggle && storeNavigation) {
    storeMenuToggle.addEventListener("click", () => {
        const aberto = storeNavigation.classList.toggle("is-open");

        storeMenuToggle.setAttribute("aria-expanded", String(aberto));
        storeMenuToggle.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

        storeMenuToggle.textContent = aberto ? "×" : "☰";
    });

    storeNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            storeNavigation.classList.remove("is-open");
            storeMenuToggle.setAttribute("aria-expanded", "false");
            storeMenuToggle.setAttribute("aria-label", "Abrir menu");
            storeMenuToggle.textContent = "☰";
        });
    });
}

/* ==========================
   CARROSSEL DE PRODUTOS
========================== */

const productTrack = document.getElementById("productTrack");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");

function moverCarrossel(direcao) {
    if (!productTrack) return;

    const primeiroProduto = productTrack.querySelector(".product-card");

    if (!primeiroProduto) return;

    const estilos = window.getComputedStyle(productTrack);
    const gap = parseFloat(estilos.columnGap) || 0;
    const largura = primeiroProduto.getBoundingClientRect().width + gap;

    productTrack.scrollBy({
        left: largura * direcao,
        behavior: "smooth"
    });
}

if (carouselPrev) {
    carouselPrev.addEventListener("click", () => {
        moverCarrossel(-1);
    });
}

if (carouselNext) {
    carouselNext.addEventListener("click", () => {
        moverCarrossel(1);
    });
}

/* ==========================
   CARRINHO LOCAL
========================== */

const CHAVE_CARRINHO = "instrumentos_victor_carrinho";

function lerCarrinho() {
    try {
        const dados = JSON.parse(
            localStorage.getItem(CHAVE_CARRINHO) || "[]"
        );

        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        console.error("Erro ao ler o carrinho:", erro);
        return [];
    }
}

function salvarCarrinho(carrinho) {
    try {
        localStorage.setItem(
            CHAVE_CARRINHO,
            JSON.stringify(carrinho)
        );

        return true;
    } catch (erro) {
        console.error("Erro ao salvar o carrinho:", erro);
        return false;
    }
}

function atualizarQuantidadeCarrinho() {
    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    const carrinho = lerCarrinho();

    const quantidade = carrinho.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    cartCount.textContent = quantidade;
    cartCount.setAttribute(
        "aria-label",
        `${quantidade} ${quantidade === 1 ? "item" : "itens"} no carrinho`
    );
}

function adicionarAoCarrinho(nome, preco) {
    const carrinho = lerCarrinho();

    const produtoExistente = carrinho.find(
        (produto) => produto.nome === nome
    );

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome,
            preco,
            quantidade: 1
        });
    }

    if (!salvarCarrinho(carrinho)) {
        mostrarMensagem(
            document.getElementById("cartFeedback"),
            "Não foi possível salvar o carrinho. Verifique o armazenamento do navegador."
        );

        return;
    }

    atualizarQuantidadeCarrinho();

    const cartFeedback = document.getElementById("cartFeedback");

    if (cartFeedback) {
        cartFeedback.textContent = `${nome} adicionado ao carrinho.`;
    }
}

document.querySelectorAll(".add-cart-button").forEach((botao) => {
    botao.addEventListener("click", () => {
        const nome = botao.dataset.product;
        const preco = Number(botao.dataset.price);

        if (!nome || !Number.isFinite(preco) || preco < 0) {
            return;
        }

        adicionarAoCarrinho(nome, preco);
    });
});

const cartButton = document.getElementById("cartButton");

if (cartButton) {
    cartButton.addEventListener("click", () => {
        const carrinho = lerCarrinho();

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        const resumo = carrinho.map((produto) => {
            const subtotal = produto.preco * produto.quantidade;

            return `${produto.nome} — ${produto.quantidade} un. — ${
                subtotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })
            }`;
        });

        const total = carrinho.reduce(
            (soma, produto) =>
                soma + produto.preco * produto.quantidade,
            0
        );

        alert(
            "SEU CARRINHO\n\n" +
            resumo.join("\n") +
            "\n\nTotal: " +
            total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            }) +
            "\n\nO checkout ainda precisa ser implementado."
        );
    });
}

/* ==========================
   ANO DO RODAPÉ
========================== */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* ==========================
   MENSAGEM AUXILIAR
========================== */

function mostrarMensagem(elemento, texto, tipo = "error") {
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.className = tipo === "success"
        ? "cart-feedback"
        : "cart-feedback";
}

atualizarQuantidadeCarrinho();
