# Projeto de Gerenciamento de Alimentação

![Badge Angular](https://img.shields.io/badge/Frontend-Angular-red)
![Badge Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Badge SQLite](https://img.shields.io/badge/Database-SQLite-blue)

Um sistema completo para gerenciamento de alimentação, permitindo registrar refeições, receitas, e planejar alimentação semanal.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração e Execução](#configuração-e-execução)
- [Deploy](#deploy)
- [Melhorias Futuras](#melhorias-futuras)
- [Licença](#licença)

## 🔍 Visão Geral

O Projeto de Gerenciamento de Alimentação é uma aplicação web que permite aos usuários registrar suas refeições diárias, gerenciar receitas, planejar refeições semanais e gerar listas de compras automaticamente. É ideal para quem deseja acompanhar sua nutrição e organizar sua alimentação de forma eficiente.

## ✅ Funcionalidades

### Cadastro e Login
- Sistema de autenticação com JWT
- Registro de novos usuários
- Login seguro

### Diário Alimentar
- Registro de alimentos consumidos por data
- Categorização por tipo de refeição (café da manhã, almoço, jantar, lanches)
- Opção de adicionar alimentos individuais ou receitas completas
- Cálculo automático de calorias, proteínas, carboidratos e gorduras

### Gerenciamento de Receitas
- Cadastro e edição de receitas próprias
- Categorização por tipo de refeição
- Imagens para receitas
- Lista de ingredientes e modo de preparo
- Cálculo automático de valor nutricional

### Planejamento de Refeições
- Agendamento de refeições para a semana
- Visualização em calendário semanal
- Geração automática de lista de compras baseada no planejamento

### Dashboard
- Resumo das calorias diárias e semanais
- Visualização do progresso alimentar
- Refeições recentes e sugestões de receitas

## 🛠️ Tecnologias Utilizadas

### Frontend
- Angular 16+
- TypeScript
- Bootstrap para estilos e componentes
- Formulários reativos para validação

### Backend
- Node.js
- Express.js
- JWT para autenticação
- SQLite para banco de dados

### Ferramentas de Desenvolvimento
- Visual Studio Code
- Git para controle de versão
- Postman para testes de API


## ⚙️ Configuração e Execução

### Pré-requisitos
- Node.js (v14+)
- NPM ou Yarn
- Angular CLI (`npm install -g @angular/cli`)

### Configuração do Backend
```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install

# Iniciar o servidor em modo desenvolvimento
npm run dev
```

### Configuração do Frontend
```bash
# Navegar para a pasta do cliente
cd client

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
ng serve
```

Acesse a aplicação em [http://localhost:4200](http://localhost:4200)

## 🚀 Deploy

### Deploy do Backend (Render)
1. Crie uma conta no [Render](https://render.com)
2. Conecte seu repositório GitHub
3. Configure um novo Web Service:
   - Diretório: `server`
   - Comando de Build: `npm install`
   - Comando de Start: `node index.js`
   - Adicione as variáveis de ambiente necessárias

### Deploy do Frontend (Vercel)
1. Crie uma conta no [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure o projeto:
   - Diretório raiz: `client`
   - Comando de Build: `ng build --configuration production`
   - Adicione a URL da API como variável de ambiente

## 🔮 Melhorias Futuras

- Sistema de metas nutricionais personalizadas
- Integração com APIs externas de alimentos para maior banco de dados
- Versão mobile com React Native
- Compartilhamento social de receitas
- Sistema de lembretes para refeições
- Dashboard com gráficos de progresso
- Suporte a múltiplos idiomas

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido por Matheus Gouvea - 2025
