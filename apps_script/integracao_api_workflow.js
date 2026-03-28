// 1. Menu na planilha
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Automação de Workflows')
    .addItem('Executar Integração', 'executarIntegracao')
    .addToUi();
}

// 2. Função principal
function executarIntegracao() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Base_Oficial");

  if (!sheet) {
    SpreadsheetApp.getUi().alert("Erro: Aba 'Base_Oficial' não encontrada!");
    return;
  }

  const data = sheet.getDataRange().getValues();
  const props = PropertiesService.getScriptProperties();

  const apiUser = props.getProperty('apiUser');
  const apiToken = props.getProperty('apiToken');
  const apiDomain = props.getProperty('apiDomain');
  const projectKey = props.getProperty('projectKey');

  const encodedAuth = Utilities.base64Encode(apiUser + ":" + apiToken);
  const endpoint = `https://${apiDomain}/rest/api/3/issue`; // pode ser adaptado

  const parentMap = {};
  const userCache = {};

  for (let i = 1; i < data.length; i++) {
    try {
      let row = data[i];

      let itemType = row[0] ? String(row[0]).toLowerCase().trim() : "";
      let summary = row[2] ? String(row[2]).trim() : "";
      let parentReference = row[15] ? String(row[15]).trim() : "";

      if (!summary) continue;

      console.log(`Processando linha ${i + 1}: ${summary}`);

      // Tipo de item (genérico)
      let itemTypeId = itemType.includes("sub") ? "SUBTASK_TYPE_ID" : "TASK_TYPE_ID";

      // Normalização de data
      let dueDate = formatarData(row[10]);

      // Mapeamento de usuários
      let assigneeId = buscarUsuario(row[3], apiDomain, encodedAuth, userCache);
      let reporterId = buscarUsuario(row[4], apiDomain, encodedAuth, userCache);

      // Lógica de parent dinâmico
      let parentKey = null;
      if (parentReference !== "") {
        parentKey =
          parentMap[parentReference.toLowerCase()] ||
          (parentReference.includes("-") ? parentReference : null);
      }

      // Payload genérico
      let payload = {
        fields: {
          project: { key: projectKey },
          issuetype: { id: itemTypeId },
          summary: summary,
          assignee: assigneeId ? { id: assigneeId } : null,
          reporter: reporterId ? { id: reporterId } : null,
          priority: row[5] ? { name: String(row[5]).trim() } : null,
          duedate: dueDate,
          description: montarDescricao(row[13]),

          // Campos customizáveis (genéricos)
          customfield_1: montarCampo(row[11]),
          customfield_2: montarCampo(row[14]),
          customfield_3: montarCampo(row[16]),
          customfield_4: row[17] ? String(row[17]).trim() : null,
          customfield_5: montarCampo(row[18]),
          customfield_6: montarCampo(row[19]),
          customfield_7: montarCampo(row[20]),

          parent: parentKey ? { key: parentKey } : null
        }
      };

      // Remove campos nulos
      payload.fields = limparCamposNulos(payload.fields);

      let options = {
        method: "post",
        contentType: "application/json",
        headers: { Authorization: "Basic " + encodedAuth },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      let response = UrlFetchApp.fetch(endpoint, options);
      let status = response.getResponseCode();
      let body = response.getContentText();

      if (status === 201) {
        let responseJson = JSON.parse(body);
        parentMap[summary.toLowerCase()] = responseJson.key;

        sheet.getRange(i + 1, 2).setValue(responseJson.key);

        console.log(`Sucesso: ${responseJson.key}`);
      } else {
        console.error(`Erro (${status}): ${body}`);
      }

    } catch (e) {
      console.error(`Erro na linha ${i + 1}: ${e.message}`);
    }
  }

  SpreadsheetApp.getUi().alert("Processo finalizado!");
}

---

## 🔧 Funções auxiliares

function formatarData(valor) {
  if (!valor) return null;

  if (valor instanceof Date && !isNaN(valor)) {
    return Utilities.formatDate(valor, "GMT", "yyyy-MM-dd");
  }

  let texto = String(valor).trim();

  let match = texto.match(/(\\d{4}-\\d{2}-\\d{2})/);
  if (match) return match[1];

  if (texto.includes("/")) {
    let partes = texto.split("/");
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
  }

  return null;
}

function buscarUsuario(nome, domain, auth, cache) {
  if (!nome) return null;

  let key = nome.trim();
  if (cache[key]) return cache[key];

  const url = `https://${domain}/rest/api/3/user/search?query=${encodeURIComponent(key)}`;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: "get",
      headers: { Authorization: "Basic " + auth },
      muteHttpExceptions: true
    });

    const users = JSON.parse(response.getContentText());

    if (users && users.length > 0) {
      cache[key] = users[0].accountId;
      return users[0].accountId;
    }

  } catch (e) {}

  return null;
}

function montarDescricao(texto) {
  return {
    type: "doc",
    version: 1,
    content: [{
      type: "paragraph",
      content: [{
        type: "text",
        text: texto ? String(texto) : ""
      }]
    }]
  };
}

function montarCampo(valor) {
  return valor ? { value: String(valor).trim() } : null;
}

function limparCamposNulos(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  );
}
