/**
 * Studio Engine v1.0 - Unificado
 * Focado em modularidade e saída limpa para o data.json
 */

const Studio = {
    slideCount: 0,
    // 1. Templates (Usando suas classes do style.css)
    templates: {
        terminal: (id) => `
            <div class="modern-terminal animate-pop" data-id="${id}" data-type="terminal">
                <div class="terminal-header">
                    <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
                </div>
                <div class="terminal-body" contenteditable="true" spellcheck="false" data-prop="content">// Digite seu código aqui...</div>
            </div>`,

        info: (id) => `
            <div class="info-box-blue animate-pop" data-id="${id}" data-type="info">
                <div class="info-icon"><i class="fa-solid fa-circle-info"></i></div>
                <div class="info-content" contenteditable="true" data-prop="content">Sua explicação teórica aqui...</div>
            </div>`,

        quiz: (id) => `
    <div class="quiz-container animate-pop" data-id="${id}" data-type="quiz">
        <div class="quiz-header">
            <h3 contenteditable="true" class="quiz-question" data-prop="question">Pergunta do Quiz?</h3>
            <p contenteditable="true" class="quiz-description" data-prop="subtitle">Escolha a opção correta para continuar.</p>
        </div>
        <div class="quiz-options-grid">
            <div class="option-item" data-correct="true">
                <span class="option-letter">A</span>
                <div contenteditable="true" class="option-text">Opção Correta</div>
            </div>
            <div class="option-item">
                <span class="option-letter">B</span>
                <div contenteditable="true" class="option-text">Opção Incorreta</div>
            </div>
            <div class="option-item empty-option">
                <span class="option-letter">C</span>
                <div contenteditable="true" class="option-text">Clique para editar</div>
            </div>
            <div class="option-item empty-option">
                <span class="option-letter">D</span>
                <div contenteditable="true" class="option-text">Clique para editar</div>
            </div>
        </div>
    </div>`,

        image: (id) => `
            <div class="card-image animate-pop" data-id="${id}" data-type="image">
                <img src="https://via.placeholder.com/400x200?text=Clique+para+mudar+a+URL" 
                    onclick="const url = prompt('Cole a URL da imagem:'); if(url) this.src=url;">
            </div>`,

        list: (id) => `
            <ul class="feature-list mt-10 animate-pop" data-id="${id}" data-type="list" contenteditable="true">
                <li><strong>Destaque:</strong> Explicação do ponto.</li>
                <li>Segunda instrução...</li>
            </ul>`,

        title: (id) => `
        <h1 class="lesson-main-title animate-pop" data-id="${id}" data-type="title" contenteditable="true">
            Título da Aula
        </h1>`,

        subtitle: (id) => `
        <p class="lesson-subtitle animate-pop" data-id="${id}" data-type="subtitle" contenteditable="true">
            Subtítulo ou descrição breve...
        </p>`,

        paragraph: (id) => `
        <div class="card-text animate-pop" data-id="${id}" data-type="paragraph">
            <p contenteditable="true">Comece a escrever seu parágrafo aqui. Use a toolbox de cores para destacar palavras.</p>
        </div>`,

        'code-inline': (id) => `
        <div class="animate-pop" data-id="${id}" style="margin: 10px 0;">
            <code class="code-block" contenteditable="true" style="display:inline-block">console.log("Olá Mundo!");</code>
        </div>`,

       badge: (id) => `
        <div class="tech-badge animate-pop" data-id="${id}" data-type="badge" style="display:inline-flex; gap: 8px; align-items: center;">
            <i class="fa-solid fa-star" data-prop="icon"></i>
            <span contenteditable="true">Importante</span>
        </div>`,

        grid: (id) => `
            <div class="card-grid animate-pop drop-zone-nested" 
                data-id="${id}" 
                data-type="grid" 
                style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; min-height: 120px;">
                </div>`
    },

    init() {
        this.slidesContainer = document.getElementById('slides-container');
        this.propPanel = document.getElementById('editor-fields');
        this.editorContainer = document.getElementById('editor-container');

        // Garante que o primeiro slide exista
        if (this.slidesContainer.children.length === 0) {
            this.addSlide();
        }

        // BIND DOS BOTÕES - Verifique se os IDs batem com o HTML
        const btnExport = document.getElementById('export-json');
        if (btnExport) btnExport.onclick = () => this.exportToJSON();

        const btnAdd = document.getElementById('add-slide');
        if (btnAdd) btnAdd.onclick = () => this.addSlide();

        const btnPreview = document.getElementById('toggle-preview');
        if (btnPreview) btnPreview.onclick = () => this.togglePreview();

        this.bindEvents();
    },
    addSlide() {
        this.slideCount++;
        const slideId = `slide-${this.slideCount}`;

        const slideMarkup = `
            <div class="edit-section animate-pop" data-slide-order="${this.slideCount}">
                <div class="section-header">
                    <span><i class="fa-solid fa-layer-group"></i> Flashcard ${this.slideCount}</span>
                    <button class="btn-delete-item" onclick="this.closest('.edit-section').remove()">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <div id="${slideId}" class="items-drop-zone drop-zone-nested" data-is-slide="true">
                    <p class="canvas-hint">Arraste elementos aqui para este slide...</p>
                </div>
            </div>`;

        this.slidesContainer.insertAdjacentHTML('beforeend', slideMarkup);
    },

    renderProperties(type) {


        let html = `<h4>Configurações (${type})</h4>`;

        if (type === 'image') {
            const currentSrc = this.selectedElement.querySelector('img').src;
            const currentWidth = this.selectedElement.querySelector('img').style.width || "100%";
            html += `
            <label>URL da Imagem:</label>
            <input type="text" value="${currentSrc}" oninput="Studio.updateProp('img-src', this.value)">
            
            <label>Largura da Imagem (${currentWidth}):</label>
            <select onchange="Studio.updateProp('img-width', this.value)">
                <option value="25%" ${currentWidth === '25%' ? 'selected' : ''}>Pequena (25%)</option>
                <option value="50%" ${currentWidth === '50%' ? 'selected' : ''}>Média (50%)</option>
                <option value="75%" ${currentWidth === '75%' ? 'selected' : ''}>Grande (75%)</option>
                <option value="100%" ${currentWidth === '100%' ? 'selected' : ''}>Total (100%)</option>
            </select>
        `;
        }

       if (type === 'badge') {
            const hasFlat = this.selectedElement.classList.contains('badge-flat');
            // Pegamos a classe atual do ícone para mostrar no input
            const currentIcon = this.selectedElement.querySelector('i').className;
            
            html += `
                <label>Estilo do Badge:</label>
                <select onchange="Studio.updateProp('badge-style', this.value)" style="margin-bottom: 15px;">
                    <option value="3d" ${!hasFlat ? 'selected' : ''}>Padrão 3D (Branco)</option>
                    <option value="flat" ${hasFlat ? 'selected' : ''}>Apenas Ícone (Flat)</option>
                </select>

                <label>Classe do Ícone (FontAwesome):</label>
                <div style="display: flex; gap: 5px;">
                    <input type="text" 
                        value="${currentIcon}" 
                        oninput="Studio.updateBadgeIcon(this.value)"
                        style="flex-grow: 1;">
                    <a href="https://fontawesome.com/search?m=free" target="_blank" 
                    style="padding: 8px; background: #eee; border-radius: 4px; color: #333;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    </a>
                </div>
            `;
        }

        if (type === 'quiz') {
            // 1. Recuperar valores atuais salvos no elemento (se existirem)
            const currentCorrect = Array.from(this.selectedElement.querySelectorAll('.option-item'))
                .findIndex(opt => opt.getAttribute('data-correct') === 'true');

            const feedbackSuccess = this.selectedElement.getAttribute('data-feedback-success') || "";
            const feedbackError = this.selectedElement.getAttribute('data-feedback-error') || "";

            html += `
        <label>Qual é a alternativa correta?</label>
        <select onchange="Studio.updateQuizCorrect(this.value)">
            <option value="0" ${currentCorrect === 0 ? 'selected' : ''}>Opção A</option>
            <option value="1" ${currentCorrect === 1 ? 'selected' : ''}>Opção B</option>
            <option value="2" ${currentCorrect === 2 ? 'selected' : ''}>Opção C</option>
            <option value="3" ${currentCorrect === 3 ? 'selected' : ''}>Opção D</option>
        </select>

        <label style="margin-top:15px; display:block;">Feedback se acertar (Verde):</label>
        <input type="text" 
               value="${feedbackSuccess}" 
               placeholder="Ex: Perfeito! Você acertou." 
               oninput="Studio.updateQuizFeedback('correct', this.value)" 
               style="border-left: 5px solid #58cc02; width: 100%; padding: 8px;">
        
        <label style="margin-top:10px; display:block;">Feedback se errar (Vermelho):</label>
        <input type="text" 
               value="${feedbackError}" 
               placeholder="Ex: Quase lá! O objetivo era..." 
               oninput="Studio.updateQuizFeedback('wrong', this.value)" 
               style="border-left: 5px solid #ff4b4b; width: 100%; padding: 8px;">
    `;
        }


        if (type === 'grid') {
            const currentCols = this.selectedElement.style.gridTemplateColumns;
            html += `
        <label>Configurar Colunas:</label>
        <select onchange="Studio.updateGridCols(this.value)">
            <option value="1fr" ${currentCols === '1fr' ? 'selected' : ''}>1 Coluna (Vertical)</option>
            <option value="1fr 1fr" ${currentCols === '1fr 1fr' ? 'selected' : ''}>2 Colunas</option>
            <option value="1fr 1fr 1fr" ${currentCols === '1fr 1fr 1fr' ? 'selected' : ''}>3 Colunas</option>
            <option value="2fr 1fr" ${currentCols === '2fr 1fr' ? 'selected' : ''}>Largo / Estreito</option>
        </select>
    `;
        }

        this.propPanel.innerHTML = html;
    },

    updateGridCols(val) {
        if (this.selectedElement) {
            this.selectedElement.style.gridTemplateColumns = val;
        }
    },
    selectElement(el) {
        this.selectedElement = el;
        const type = el.dataset.type;
        this.renderProperties(type);
    },

    updateBadgeIcon(iconClass) {
        if (!this.selectedElement) return;
        const iconElement = this.selectedElement.querySelector('i');
        if (iconElement) {
            iconElement.className = iconClass;
        }
    },

    updateQuizCorrect(index) {
        const options = this.selectedElement.querySelectorAll('.option-item');
        options.forEach((opt, i) => {
            opt.removeAttribute('data-correct');
            if (i == index) opt.setAttribute('data-correct', 'true');
        });
    },
    updateQuizFeedback(type, text) {
        if (!this.selectedElement) return;

        if (type === 'correct') {
            this.selectedElement.setAttribute('data-feedback-success', text);
        } else {
            this.selectedElement.setAttribute('data-feedback-error', text);
        }
    },

    bindEvents() {
        // 1. Dragstart nos itens da Toolbox
        document.querySelectorAll('.draggable-item').forEach(tool => {
            tool.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', tool.dataset.type);
            });
        });

        // 2. Dragover Global no Container
        this.editorContainer.addEventListener('dragover', (e) => e.preventDefault());

        // 3. Drop Inteligente
        this.editorContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('type');

            // Encontra o alvo: ou um Grid aninhado ou a zona de Drop do Slide
            const gridTarget = e.target.closest('.drop-zone-nested:not([data-is-slide])');
            const slideTarget = e.target.closest('.items-drop-zone[data-is-slide]');

            if (gridTarget) {
                e.stopPropagation();
                this.addComponent(type, gridTarget);
            } else if (slideTarget) {
                this.addComponent(type, slideTarget);
            }
        });

        // Seleção de elementos por clique (delegação de evento)
        this.slidesContainer.addEventListener('click', (e) => {
            const target = e.target.closest('[data-id]');
            if (target) this.selectElement(target);
        });
    },

    updateProp(prop, value) {
        if (!this.selectedElement) return;


        if (prop === 'img-src') this.selectedElement.querySelector('img').src = value;
        if (prop === 'img-width') this.selectedElement.querySelector('img').style.width = value;
        if (prop === 'icon-class') {
            const icon = this.selectedElement.querySelector('i');
            icon.className = `fa-solid ${value}`;
        }
        if (prop === 'icon-size') this.selectedElement.querySelector('i').style.fontSize = value + 'px';
        if (prop === 'grid-cols') this.selectedElement.style.gridTemplateColumns = value;
        if (prop === 'badge-style') {
            if (value === 'flat') {
                this.selectedElement.classList.add('badge-flat');
            } else {
                this.selectedElement.classList.remove('badge-flat');
            }
        }
    },

    addComponent(type, targetContainer) {
        if (!this.templates[type]) return;

        const id = 'comp_' + Date.now();
        const wrapper = document.createElement('div');
        wrapper.className = 'edit-wrapper';
        wrapper.innerHTML = `
            <div class="edit-controls small">
                <button class="btn-delete-item"><i class="fa-solid fa-trash"></i></button>
            </div>
            ${this.templates[type](id)}`;

        wrapper.querySelector('.btn-delete-item').onclick = (e) => {
            e.stopPropagation();
            wrapper.remove();
        };

        // Limpa o hint
        const hint = targetContainer.querySelector('.canvas-hint');
        if (hint) hint.remove();

        targetContainer.appendChild(wrapper);
    },

    exportToJSON() {
    const slides = this.slidesContainer.querySelectorAll('.edit-section');
    let finalQuiz = null; 
    const flashcardsData = [];

    slides.forEach((slide, index) => {
        const dropZone = slide.querySelector('.items-drop-zone');
        const wrappers = dropZone.querySelectorAll(':scope > .edit-wrapper');
        let slideHtml = "";

        wrappers.forEach(wrap => {
            const element = wrap.querySelector('[data-id]');
            if (!element) return;

            if (element.dataset.type === 'quiz') {
                const options = [];
                element.querySelectorAll('.option-item').forEach((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const text = opt.querySelector('.option-text').innerText;

                    if (text !== "Clique para editar") {
                        options.push({
                            ordem: letter,
                            descricao: text,
                            correta: opt.getAttribute('data-correct') === 'true',
                            feedback: opt.getAttribute('data-correct') === 'true'
                                ? (element.getAttribute('data-feedback-success') || "Correto!")
                                : (element.getAttribute('data-feedback-error') || "Tente novamente.")
                        });
                    }
                });

                finalQuiz = {
                    title: element.querySelector('.quiz-question').innerText,
                    descricao: element.querySelector('.quiz-description').innerText,
                    opcoes: options
                };
            } else {
                // --- ALTERAÇÃO AQUI PARA REMOVER A LIXEIRA ---
                const clone = element.cloneNode(true);
                
                // 1. Remove classes de edição
                clone.classList.remove('animate-pop', 'selected-edit');
                clone.removeAttribute('contenteditable');
                
                // 2. Remove botões de controle (lixeira) se por acaso estiverem dentro do clone
                const controls = clone.querySelector('.edit-controls');
                if (controls) controls.remove();

                // 3. Limpa atributos de edição de todos os filhos
                clone.querySelectorAll('[contenteditable]').forEach(el => {
                    el.removeAttribute('contenteditable');
                    el.removeAttribute('spellcheck');
                });

                slideHtml += clone.outerHTML;
            }
        });

        if (slideHtml.trim() !== "") {
            flashcardsData.push({ html: slideHtml.replace(/\s+/g, ' ').trim() });
        }
    });

    const finalOutput = {
        id: "aula-" + Date.now(),
        title: document.getElementById('lesson-title-input')?.value || "Nova Aula",
        icone: "fa-solid fa-code", 
        banner_class: "logic",     
        flashcards: flashcardsData,
        quiz: finalQuiz,
        item_ordem: 1
    };

    this.downloadJSON(finalOutput);
},

    downloadJSON(obj) {
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Função para aplicar cor à seleção atual
    applyColor(color) {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, color);
    },

    applyWeight(weight) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const span = document.createElement("span");
        span.style.fontWeight = weight;

        const range = selection.getRangeAt(0);
        range.surroundContents(span);
    },
    togglePreview() {
        const isPreview = document.body.classList.toggle('preview-mode');
        const btn = document.getElementById('toggle-preview');
        const editables = document.querySelectorAll('[contenteditable]');

        if (isPreview) {
            btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Voltar a Editar';
            // Desativa edição para não aparecer cursor de texto no preview
            editables.forEach(el => {
                el.dataset.wasEditable = "true";
                el.setAttribute('contenteditable', 'false');
            });
        } else {
            btn.innerHTML = '<i class="fa-solid fa-eye"></i> Ver Preview';
            // Reativa edição
            editables.forEach(el => {
                if (el.dataset.wasEditable === "true") {
                    el.setAttribute('contenteditable', 'true');
                }
            });
        }
    }


};

// Adicione dentro do seu Studio.init()
document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        // Aqui você pode disparar um pequeno menu flutuante.
        // Por agora, vamos usar uma tecla de atalho ou um botão global.
    }
});


document.addEventListener('DOMContentLoaded', () => Studio.init());
