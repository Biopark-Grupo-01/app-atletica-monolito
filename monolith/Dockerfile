FROM node:23.11

WORKDIR /usr/src/app

# Copiar apenas os arquivos de configuração de pacotes
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código fonte
COPY . .

# Compilar a aplicação
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]