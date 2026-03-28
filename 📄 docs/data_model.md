# Modelo de Dados

Este pipeline gera uma estrutura tabular padronizada para integração com sistemas de workflow.

A tabela final representa itens operacionais derivados de eventos analíticos.

---

## Estrutura geral

Cada entidade gera:

* 1 **ITEM_PRINCIPAL** (nível agregado)
* N **SUBITEMS** (eventos individuais)

---

## Campos

### tipo_item

Define o tipo do registro:

* ITEM_PRINCIPAL
* SUBITEM

---

### resumo

Título do item.

* ITEM_PRINCIPAL → nome da entidade
* SUBITEM → descrição do evento

---

### entidade_id

Identificador único da entidade (ex: cliente, conta, contrato).

---

### parent

Campo utilizado para reconstrução da hierarquia.

* SUBITEM → contém o resumo do ITEM_PRINCIPAL
* ITEM_PRINCIPAL → vazio

---

### data_limite

Prazo definido automaticamente a partir da data do evento.

---

### classificacao

Classificação derivada de regras ou modelos.

Exemplos:

* HIGH
* MEDIUM
* LOW

---

### flag_especial

Indicador calculado com base em:

* Classificação elevada
* Existência de histórico

---

### flag_grupo

Indica se a entidade pertence a um grupo específico (ex: listas especiais).

---

### descricao

Campo livre para enriquecimento.

---

## Observações

* A estrutura é compatível com sistemas que suportam hierarquia (pai/filho)
* O campo `parent` é resolvido dinamicamente no momento da integração
* Os dados são preparados para evitar inconsistências (nulos, duplicidade, etc.)
