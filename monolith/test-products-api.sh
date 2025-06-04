#!/bin/bash

# Definindo cores para melhor visualização
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # Sem cor

BASE_URL="http://localhost:3000"

echo -e "${BLUE}======================${NC}"
echo -e "${BLUE}Testando API de Produtos${NC}"
echo -e "${BLUE}======================${NC}"

echo -e "\n${GREEN}1. Criando um novo produto${NC}"
CREATE_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Camisa Atlética",
    "description": "Camisa oficial da atlética",
    "price": 49.90,
    "stock": 100
  }' \
  $BASE_URL/products)
  
echo $CREATE_RESPONSE | json_pp
PRODUCT_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

echo -e "\n${GREEN}2. Listando todos os produtos${NC}"
curl -s -X GET $BASE_URL/products | json_pp

echo -e "\n${GREEN}3. Buscando produto por ID${NC}"
curl -s -X GET $BASE_URL/products/$PRODUCT_ID | json_pp

echo -e "\n${GREEN}4. Atualizando produto${NC}"
curl -s -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "price": 59.90,
    "stock": 80
  }' \
  $BASE_URL/products/$PRODUCT_ID | json_pp

echo -e "\n${GREEN}5. Verificando produto atualizado${NC}"
curl -s -X GET $BASE_URL/products/$PRODUCT_ID | json_pp

echo -e "\n${GREEN}6. Listando todos os produtos novamente${NC}"
curl -s -X GET $BASE_URL/products | json_pp

echo -e "\n${BLUE}======================${NC}"
echo -e "${BLUE}Teste concluído${NC}"
echo -e "${BLUE}======================${NC}"