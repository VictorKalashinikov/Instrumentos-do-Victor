# 🎸 Instrumentos do Victor

**Instrumentos do Victor** é um projeto de e-commerce de instrumentos musicais desenvolvido com HTML, CSS e JavaScript, com foco na criação de uma interface responsiva e na implementação de autenticação de usuários utilizando Supabase.

O projeto tem como objetivo praticar o desenvolvimento web front-end, a integração com serviços de backend e a implementação de funcionalidades de cadastro, login e gerenciamento de contas.

## 🚀 Tecnologias utilizadas

- **HTML5** — estruturação das páginas.
- **CSS3** — estilização, layout e responsividade.
- **JavaScript** — validações, interatividade e lógica da aplicação.
- **Supabase** — autenticação de usuários e integração com banco de dados.
- **Git e GitHub** — versionamento e hospedagem do código.
- **Netlify** — publicação do projeto.

## ✨ Funcionalidades implementadas

- [x] Cadastro de usuários.
- [x] Login com autenticação pelo Supabase.
- [x] Fluxo de confirmação de e-mail.
- [x] Recuperação e redefinição de senha.
- [x] Exibição e ocultação da senha.
- [x] Validação dos campos do formulário.
- [x] Verificação de senha com, no mínimo, 8 caracteres.
- [x] Exibição dos dados do perfil do usuário.
- [x] Logout da conta.
- [x] Interface com tema escuro.
- [x] Layout responsivo.

## 🗂️ Estrutura do projeto

A estrutura pode variar conforme a organização atual dos arquivos do repositório.

```text
Instrumentos-do-Victor/
├── index.html
├── cadastro.html
├── login.html
├── conta.html
├── recuperar-senha.html
├── style.css
├── script.js
└── README.md
```

## ⚙️ Como executar o projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/VictorKalashinikov/Instrumentos-do-Victor.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd Instrumentos-do-Victor
   ```

3. Configure o projeto no Supabase e verifique as credenciais e a configuração da autenticação.

4. Abra o arquivo `index.html` em um navegador ou utilize a extensão Live Server do Visual Studio Code.

**Observação:** algumas funcionalidades dependem da configuração correta do projeto no Supabase. Não coloque chaves privadas ou credenciais administrativas no código público.

## 📋 Próximas tarefas

### 1. Gerenciamento de dados — CRUD

- [ ] **Create:** implementar o cadastro de instrumentos no banco de dados.
- [ ] **Read:** listar e consultar os instrumentos cadastrados.
- [ ] **Update:** permitir editar as informações dos instrumentos.
- [ ] **Delete:** permitir excluir instrumentos cadastrados.
- [ ] Criar formulários para adicionar e editar produtos.
- [ ] Implementar confirmação antes de excluir um produto.
- [ ] Exibir mensagens de sucesso e erro nas operações.
- [ ] Configurar as permissões do banco de dados para impedir alterações não autorizadas.

### 2. Segurança e validação de senhas

- [ ] Verificar a quantidade mínima de caracteres da senha.
- [ ] Definir e validar a quantidade máxima de caracteres permitida.
- [ ] Exigir pelo menos uma letra maiúscula.
- [ ] Exigir pelo menos uma letra minúscula.
- [ ] Exigir pelo menos um número.
- [ ] Exigir pelo menos um caractere especial, como `@`, `#`, `!` ou `$`.
- [ ] Validar a senha enquanto o usuário digita.
- [ ] Criar um indicador visual de força da senha: fraca, média ou forte.
- [ ] Exibir os requisitos de senha atendidos e pendentes.
- [ ] Garantir que a confirmação da senha corresponda à senha informada.
- [ ] Revisar as políticas de senha e autenticação configuradas no Supabase.
- [ ] Testar o cadastro com senhas válidas e inválidas.

### 3. Melhorias futuras

- [ ] Criar uma página de catálogo de instrumentos.
- [ ] Implementar pesquisa de produtos.
- [ ] Adicionar filtros por categoria e preço.
- [ ] Exibir detalhes individuais dos produtos.
- [ ] Melhorar o tratamento de erros e estados de carregamento.
- [ ] Realizar testes de responsividade em diferentes dispositivos.
- [ ] Revisar acessibilidade e validação dos formulários.
- [ ] Testar as permissões de acesso às informações dos usuários.

### 4. Teste de Sistemas Sesi Senai
- [x] Não deixar cadastrar email sem @
- [x] Não deixar repetir email cadastrado
- [x] Não deixar cadastrar conta se as senhas não conferirem
- [x] Não deixar cadastrar dados inválidos
- [x] Entrar e Sair da Conta
- [ ] Se errar 5 vezes a senha do mesmo email, colocar um bloqueio temporário de 3 minutos
      


## 🔐 Considerações de segurança

A validação de senha no front-end melhora a experiência do usuário, mas não deve ser considerada uma medida de segurança suficiente por si só. As políticas de autenticação devem ser aplicadas pelo Supabase, e as operações no banco de dados devem ser protegidas por políticas de Row Level Security (RLS) adequadas.

O CRUD de instrumentos também deve verificar as permissões do usuário antes de permitir a criação, edição ou exclusão de registros.

## 👨‍💻 Autor

**Victor Luan**

- GitHub: [@VictorKalashinikov](https://github.com/VictorKalashinikov)
- Projeto: [Instrumentos do Victor](https://github.com/VictorKalashinikov/Instrumentos-do-Victor)

---

Projeto desenvolvido para fins de aprendizado e prática de desenvolvimento web, autenticação e integração com banco de dados.
