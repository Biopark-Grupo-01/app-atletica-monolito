# app-atletica-monolito - Backend da Atlética Tigre Branco

Este repositório contém o código-fonte do backend monolítico para o aplicativo da Atlética Tigre Branco. Desenvolvido com NestJS, TypeScript e outras tecnologias modernas, ele serve como a espinha dorsal para todas as funcionalidades do aplicativo, incluindo gerenciamento de usuários, eventos, notícias, loja e muito mais.

## Tecnologias Utilizadas

*   **NestJS**: Um framework progressivo Node.js para a construção de aplicações server-side eficientes e escaláveis.
*   **TypeScript**: Um superset tipado de JavaScript que compila para JavaScript puro.
*   **PostgreSQL**: Um poderoso sistema de banco de dados relacional de código aberto.
*   **Docker**: Plataforma para desenvolver, enviar e executar aplicações em contêineres.
*   **Firebase Admin SDK**: Para integração com serviços Firebase, como autenticação e mensagens.
*   **Swagger UI Express**: Para documentação e teste de APIs.

## Estrutura do Projeto

O projeto segue uma arquitetura modular, com serviços separados para diferentes domínios, como `monolith`, `notification-service` e `ticket-service`.

## Como Rodar o Projeto (Desenvolvimento com Docker)

Para rodar o projeto do servidor utilizando Docker e Docker Compose, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina. Você pode verificar a instalação e as versões com os seguintes comandos:

```bash
docker --version
docker-compose --version
```

### Passos para Execução

1.  **Clone o repositório:**

    Abra seu terminal ou prompt de comando e execute:

    ```bash
    git clone https://github.com/Biopark-Grupo-01/app-atletica-monolito.git
    ```

2.  **Navegue até o diretório do projeto:**

    ```bash
    cd app-atletica-monolito
    ```

3.  **Configure as variáveis de ambiente:**

    O projeto espera um arquivo `.env` para configurar variáveis de ambiente sensíveis (como credenciais de banco de dados e chaves Firebase). Um exemplo de arquivo é fornecido como `.env.example` dentro do diretório `monolith`. Copie este arquivo e renomeie-o para `.env`:

    ```bash
    cp monolith/.env.example monolith/.env
    ```

    **Importante**: Edite o arquivo `monolith/.env` e preencha as variáveis de ambiente com os valores corretos para seu ambiente de desenvolvimento. Isso inclui, mas não se limita a, configurações de banco de dados (PostgreSQL) e credenciais do Firebase.

4.  **Construa e inicie os contêineres Docker:**

    Na raiz do projeto (`app-atletica-monolito`), execute o comando para construir as imagens Docker e iniciar todos os serviços definidos no `docker-compose.yml`:

    ```bash
    docker-compose up --build
    ```

    *   O parâmetro `--build` garante que as imagens Docker sejam construídas (ou reconstruídas) antes de iniciar os contêineres, o que é útil na primeira execução ou após alterações no `Dockerfile`.
    *   Este processo pode levar alguns minutos na primeira vez, pois fará o download das imagens base e instalará as dependências.

5.  **Verifique se o servidor está rodando:**

    Após a execução do comando `docker-compose up --build`, você deverá ver os logs dos serviços no terminal. O backend estará acessível na porta configurada (geralmente 3000 ou 3001, conforme definido no seu `.env` e `docker-compose.yml`). Você pode verificar se os contêineres estão em execução com:

    ```bash
    docker-compose ps
    ```

    Você pode acessar a documentação da API (Swagger) em `http://localhost:<PORTA_DO_BACKEND>/api` (substitua `<PORTA_DO_BACKEND>` pela porta configurada).

## Testes

O projeto inclui testes unitários e de ponta a ponta. Para executá-los dentro do ambiente Docker, você pode usar os seguintes comandos após os contêineres estarem em execução:

*   **Executar testes unitários:**

    ```bash
    docker-compose exec monolith npm run test
    ```

*   **Executar testes de ponta a ponta:**

    ```bash
    docker-compose exec monolith npm run test:e2e
    ```

*   **Verificar cobertura de testes:**

    ```bash
    docker-compose exec monolith npm run test:cov
    ```

## Implantação

Para implantar a aplicação NestJS em produção, consulte a [documentação de implantação do NestJS](https://docs.nestjs.com/deployment) para obter mais informações. Além disso, você pode considerar o uso do [Mau](https://nestjs.com/mau), uma plataforma oficial para implantar aplicações NestJS na AWS.

## Contribuição

Contribuições são bem-vindas! Por favor, siga as diretrizes de contribuição do projeto.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Contato

Para dúvidas e suporte, entre em contato com a equipe de desenvolvimento.

