# 🍽️ RU Digital - Agendamento e Gestão de Refeições Universitárias

Este é um projeto de aplicativo web/mobile simulado, desenvolvido com **Expo** e **React Native Web**, focado no agendamento e gestão de refeições em Restaurantes Universitários (RU).

O aplicativo simula as principais funcionalidades de um RU moderno, incluindo login/cadastro, consulta de saldo, agendamento de refeições, visualização do cardápio, um painel administrativo e a implementação de ganhos de pontos ao comprar pelo app.

* **Gestão de Acesso:** Login e cadastro de usuários.
* **Controle Financeiro:** Consulta de saldo e gestão de agendamentos pagos.
* **Operações:** Agendamento de refeições, visualização do cardápio semanal e um painel administrativo.
* **Engajamento:** Implementação da lógica de ganhos de pontos ao comprar pelo app.

## ✨ Funcionalidades em Destaque

* **Autenticação Local:** Login e Cadastro de usuários (simulados via `localStorage`).
* **Gestão de Saldo:** Visualização e Recarga de saldo (simulada via PIX) para pagamento das refeições.
* **Agendamento:** Agendamento de refeições (Almoço/Jantar) com débito automático do saldo (custo fixo de R$ 10,00).
* **Cardápio Semanal:** Visualização do cardápio com informações de prato, kcal e tipo (Tradicional, Vegetariano, Vegano).
* **Painel Administrativo:** Dashboard com estatísticas e funcionalidade para editar o cardápio.
* **Simulação de Persistência:** Utilização do `localStorage` do navegador para simular banco de dados (usuários e cardápio).

## 🚀 Como Iniciar o Projeto

Este projeto foi inicialmente criado no **Expo Snack**. Para executá-lo localmente, siga os passos abaixo:

### 1. Pré-requisitos

* Certifique-se de ter o Node.js instalado.
* Instale o Expo CLI globalmente:
    ```bash
    npm install -g expo-cli
    ```

### 2. Instalação e Execução

1.  **Baixe/Clone** o repositório.
2.  **Instale as dependências** listadas no `package.json`:
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  **Inicie o projeto**:
    ```bash
    npm start
    # ou
    expo start
    ```

Isso abrirá o **Expo Dev Tools** no seu navegador. A partir dele, você pode:
* Escanear o **QR code** com o app **Expo Go** no seu celular para ver o app em tempo real.
* Clicar em **Run in web browser** para ver a versão web (que simula o app mobile no navegador).
* Clicar em **Run on Android/iOS emulator** para usar um emulador.


## 📦 Estrutura e Tecnologia

O projeto segue a estrutura padrão de um aplicativo Expo/React Native.


### Arquivos Chave

* `App.js`: Contém toda a lógica de estado, funções de persistência (`localStorage`), estilos CSS puros e todos os componentes de tela (Home, Login, Admin, etc.).
* `package.json`: Define os scripts de inicialização (`start`, `android`, `ios`, `web`) e as dependências do projeto.
* `index.js`: Ponto de entrada do app, registra o componente raiz (`App`) utilizando `expo`.
* `app.json`: Configurações do Expo, nome do aplicativo (`thankful-blue-pretzels`), e caminhos dos ícones e splash screen.


## 💡 Próximos Passos e Melhorias

Esta é uma lista de funcionalidades planejadas ou possíveis melhorias para o projeto:

* **Validação de Refeição por QR Code:** Acrescentar a opção de escanear o QR code de agendamento na entrada do RU para conseguir validar a compra.
* **Integração com API Real:** Substituir a persistência local (`localStorage`) por uma integração com um backend real (ex: Firebase, Supabase ou API RESTful).
* **Notificações:** Adicionar notificações de lembrete de agendamento e promoções.


## 👤 Credenciais de Teste

O projeto inicia com um conjunto de dados padrão.

* | Nome Completo | Email | RA |
* | **Érik Ordine Garcia** | erik.garcia9@hotmail.com | `22.224.021-0` |
* | **Guilherme Rocha Santos** | guilermerocha.santos@gmail.com | `22.124.061-7` |
* | **Luan Garcia Candido** | luanccandi@gmail.com | `22.225.022-7` |
* | **Yuri Lucas Oishi** | yurilucasoishi@gmail.com | `22.225.025-0` |
* | **Wellington de Menezes Paim** | `22.225.024-3` |
