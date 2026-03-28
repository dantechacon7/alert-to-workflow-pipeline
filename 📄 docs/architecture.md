# Arquitetura do Pipeline

## Visão geral

Este projeto implementa um fluxo de transformação de dados analíticos em ações operacionais.

---

## Fluxo

1. **Camada Analítica (SQL / Data Platform)**

   * Detecta eventos relevantes
   * Aplica regras de negócio
   * Estrutura saída em formato tabular

2. **Camada Intermediária (Google Sheets)**

   * Recebe os dados estruturados
   * Permite revisão manual opcional
   * Atua como ponto de controle

3. **Camada de Integração (Apps Script)**

   * Lê os dados da planilha
   * Constrói payloads dinâmicos
   * Envia dados para APIs externas

---

## Componentes principais

### SQL (Geração de dados)

Responsável por:

* Agrupamento por entidade
* Criação de hierarquia (principal + subitens)
* Enriquecimento com classificações
* Identificação de histórico

---

### Google Sheets

Funções:

* Interface operacional
* Validação manual
* Armazenamento intermediário

---

### Apps Script

Responsável por:

* Transformar linhas em payloads de API
* Resolver hierarquia (parent)
* Normalizar dados (datas, textos)
* Evitar erros de integração (payload limpo)

---

## Padrões utilizados

### 1. Hierarquia dinâmica

Itens são relacionados em tempo de execução, sem necessidade de IDs prévios.

---

### 2. Processamento em lote

Permite criação massiva de itens com baixa intervenção humana.

---

### 3. Cache em memória

Reduz chamadas repetidas à API (ex: usuários).

---

### 4. Tolerância a inconsistências

* Tratamento de datas
* Remoção de campos nulos
* Validação de inputs

---

## Benefícios

* Redução drástica de esforço manual
* Escalabilidade operacional
* Padronização de processos
* Rastreabilidade e auditoria
