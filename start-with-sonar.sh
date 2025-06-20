#!/bin/bash

# Inicia o ambiente Docker
echo "Iniciando Docker Compose..."
docker compose up -d

# Aguarda o SonarQube ficar pronto
echo "Aguardando SonarQube iniciar (pode levar até 2 minutos)..."
attempt=0
max_attempts=60
until $(curl --output /dev/null --silent --fail http://localhost:9000/api/system/status); do
  if [ ${attempt} -eq ${max_attempts} ]; then
    echo "Tempo limite excedido ao aguardar SonarQube"
    exit 1
  fi
  attempt=$(($attempt+1))
  echo "Tentativa: $attempt - SonarQube ainda não está pronto, aguardando..."
  sleep 5
done

echo "SonarQube está pronto!"

# Verifica se o token do SonarQube já foi configurado
if ! grep -q "token: '[a-zA-Z0-9]'" ./monolith/sonar-project.js; then
  echo "⚠️ Token do SonarQube não configurado!"
  echo "Por favor:"
  echo "1. Acesse http://localhost:9000"
  echo "2. Faça login com admin/admin (ou a senha que você definiu)"
  echo "3. Crie um projeto manualmente com a chave 'atletica-monolith'"
  echo "4. Gere um token e adicione-o ao arquivo monolith/sonar-project.js"
  echo "5. Execute: cd monolith && npm run sonar"
  exit 0
fi

# Se o token estiver configurado, executa a análise
echo "Executando análise do SonarQube para o monolith..."
cd monolith
npm run sonar

echo "✅ Pronto! Acesse http://localhost:9000 para visualizar o resultado da análise."