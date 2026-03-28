# Alert to Workflow Pipeline

Pipeline para transformar eventos analíticos em itens operacionais estruturados em ferramentas de gestão (ex: Jira).

O projeto conecta um ambiente analítico (ex: Databricks), uma camada intermediária (Google Sheets) e um sistema de workflow, permitindo que insights gerados por dados sejam convertidos automaticamente em tarefas auditáveis.

---

## 📌 Problema

Em muitos cenários, eventos detectados em bases analíticas (alertas, anomalias, regras de negócio) exigem ação manual:

* Consolidação de dados
* Verificação de histórico
* Criação manual de tickets
* Preenchimento repetitivo de campos

Esse processo é lento, sujeito a erro e pouco escalável.

---

## ⚙️ Solução

Este projeto implementa um fluxo automatizado:

1. **Detecção (SQL / Data Platform)**

   * Identifica eventos relevantes
   * Enriquece com contexto (classificação, histórico, flags)
   * Estrutura os dados em formato de importação

2. **Intermediação (Google Sheets)**

   * Permite revisão humana opcional
   * Atua como camada de controle e auditoria

3. **Execução (Apps Script + API)**

   * Cria itens em sistemas de workflow
   * Mantém hierarquia entre registros (pai/filho)
   * Preenche campos automaticamente

---

## 🔁 Fluxo

Data Platform → Sheet → API → Sistema de Workflow

---

## 🧠 Principais capacidades

* Estruturação hierárquica (item principal + subitens)
* Deduplicação e agrupamento por entidade
* Enriquecimento com histórico e classificação
* Criação automatizada de tarefas via API
* Mapeamento dinâmico de responsáveis
* Redução massiva de esforço operacional

---

## 📊 Modelo de dados (genérico)

| Campo         | Descrição                           |
| ------------- | ----------------------------------- |
| tipo_item     | Tipo do item (principal/subitem)    |
| entidade_id   | Identificador da entidade           |
| resumo        | Título do item                      |
| data_evento   | Data do evento                      |
| prioridade    | Prioridade                          |
| status        | Status inicial                      |
| parent        | Referência ao item pai              |
| classificacao | Classificação de risco ou categoria |
| flag_especial | Indicador derivado de regra         |
| descricao     | Detalhamento                        |

---

## 🚨 Casos de uso

* Alertas de risco / fraude
* Monitoramento de anomalias
* Operações de suporte automatizadas
* Processos de compliance
* Qualquer fluxo data → ação

---

## 📂 Estrutura

```bash
sql/            → Geração dos dados estruturados
apps_script/    → Integração com API de workflow
docs/           → Documentação técnica
data_sample/    → Exemplo de saída
```

---

## ⚠️ Observações

* Adaptável para qualquer sistema com API (Jira, ServiceNow, etc.)
* Campos customizados podem variar por implementação
* Estrutura projetada para alta escalabilidade
