# Studio TrilhaDoDev

## 🚀 Como Usar

O **Studio Trilha do Dev** é uma aplicação web para criação e organização de flashcards com suporte a **drag & drop**, **visualização prévia (preview)** e **exportação em JSON**.

O projeto possui dois pontos principais de uso:

* `index.html` → criação e exportação de flashcards
* `admin.html` → organização e gerenciamento avançado do `data.json`

---

## 📝 1. Usando o `index.html` (Criar Flashcards)

O `index.html` é a interface principal para criação dos flashcards.

### ✅ Criar Flashcards

1. Abra o arquivo `index.html` no navegador.
2. Utilize a interface para:

   * Criar novos flashcards
   * Editar conteúdo
   * Organizar elementos utilizando **drag & drop**
3. Estruture seus cards conforme desejar.

---

### 👀 Visualizar (Preview)

* A aplicação permite visualizar os flashcards antes da exportação.
* Use a opção de **Preview** para conferir:

  * Organização
  * Conteúdo
  * Estrutura final

---

### 📤 Exportar em JSON

Após finalizar seus flashcards:

1. Clique na opção de **Exportar**
2. O sistema gerará um arquivo JSON
3. Esse JSON possui uma **estrutura simplificada**
4. Essa estrutura representa os itens criados no editor

Esse JSON gerado corresponde aos **itens**, que fazem parte de uma estrutura maior utilizada pelo `admin.html`.

---

## 🗂 2. Usando o `admin.html` (Gerenciar data.json)

O `admin.html` é voltado para organização e administração do arquivo `data.json`.

### 📄 O que é o `data.json`?

* É um arquivo mais completo
* Possui uma estrutura hierárica
* É a estrutura **pai** dos itens gerados pelo `index.html`
* Contém agrupamentos, organização e metadados adicionais

---

### ⚙️ Como Usar o Admin

1. Abra o `admin.html` no navegador.
2. Carregue ou edite o `data.json`.
3. Organize os itens:

   * Reestruture categorias
   * Agrupe conteúdos
   * Ajuste a hierarquia

O `admin.html` permite manter uma organização maior e mais estruturada do conteúdo criado inicialmente no `index.html`.

---

## 🔄 Relação entre `index.html` e `admin.html`

| index.html                 | admin.html                    |
| -------------------------- | ----------------------------- |
| Criação de flashcards      | Organização completa          |
| Estrutura simplificada     | Estrutura hierárica (pai)     |
| Exporta JSON de itens      | Gerencia `data.json` completo |
| Interface de edição visual | Interface administrativa      |

---

## 🧩 Fluxo Recomendado

1. Criar os flashcards no `index.html`
2. Exportar o JSON gerado
3. Integrar esses itens ao `data.json`
4. Organizar tudo no `admin.html`

---

## 📌 Resumo

* `index.html` → Criar, visualizar e exportar flashcards
* `admin.html` → Organizar estrutura completa no `data.json`
* Drag & Drop disponível na criação
* Exportação em JSON estruturado
* `data.json` é a estrutura principal (pai)


