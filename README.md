# Golden Raspberry Awards API

Esta API RESTful permite acessar informações sobre os indicados e vencedores na categoria Pior Filme do Golden Raspberry Awards.

## Funcionalidades
- Importação automática de arquivos CSV.
- Processamento e separação correta de produtores listados em uma mesma linha.
- Obtenção da lista de filmes carregados.
- Cálculo de produtores com maior e menor intervalo entre prêmios consecutivos.

## Tecnologias Utilizadas
- **Node.js** com **Express**
- **SQLite (banco de dados em memória)**
- **Supertest** e **Mocha** para testes de integração

## Estrutura do Projeto
```
/project
│── src/
│   ├── index.js                 # Inicializa o servidor e importa as rotas
│   ├── database.js              # Configuração do banco de dados
│   ├── data/                    # Pasta onde devem ser colocados os arquivos CSV para importação
│   ├── routes/                  # Rotas organizadas por responsabilidade
│   │   ├── movies.js            # Rota de filmes
│   │   ├── producers.js         # Rota dos produtores
│   ├── services/                # Serviços de lógica separados da API
│   │   ├── dataService.js       # Importação do CSV e processamento de dados
│   │   ├── movieService.js      # Consulta da lista de filmes importados
│   │   ├── producerService.js   # Cálculo dos intervalos dos produtores
│── test/                        # Pasta com arquivos de testes
│   ├── integration.test.js      # Testes de integração
│── package.json                 # Dependências do projeto
│── README.md                    # Documentação
```

## Como Executar
1. **Instale as dependências:**
   ```sh
   npm install
   ```
2. **Adicione arquivos CSV para importação:**
   - Coloque os arquivos `.csv` na pasta `src/data/`.
   - Os arquivos devem conter as colunas "years", "title", "studios", "producers" e "winner" para que sejam importados corretamente.
   - Todos os arquivos dentro dessa pasta serão lidos e importados automaticamente.
3. **Inicie a API:**
   ```sh
   npm start
   ```
4. **Acesse os endpoints:**
   - Listar filmes: `GET http://localhost:3000/movies`
   - Obter produtores com maior/menor intervalo: `GET http://localhost:3000/producers/intervals`

## Como Executar os Testes
1. **Inicie a API (garanta que os arquivos com o conteúdo padrão estão na pasta `src/data/`):**
   ```sh
   npm start
   ```
2. **Em um terminal sepadado, instale Mocha globalmente (se necessário):**
   ```sh
   npm install -g mocha
   ```
3. **Execute os comandos abaixo para que os arquivos de comparação sejam criados:**
   ```sh
   curl -X GET http://localhost:3000/movies -H "Content-Type: application/json" -o test/expected_movies.json
   curl -X GET http://localhost:3000/producers/intervals -H "Content-Type: application/json" -o test/expected_producers.json
   ```
   - A partir desses arquivos que o próximo comando irá comparar as integrações.
4. **Execute os testes:**
   ```sh
   npm test
   ```
   - Agora qualquer alteração em arquivos da pasta `src/data/` será validada.

## Observações
- O banco de dados é criado em memória, então os dados são perdidos ao reiniciar a aplicação.