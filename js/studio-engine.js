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
                <img src="../img/placehold.png" 
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
        <div class="animate-pop" data-id="${id}" data-type="code-inline" style="margin: 10px 0;">
            <code class="code-block" contenteditable="true" style="display:inline-block">console.log("Olá Mundo!");</code>
        </div>`,

        badge: (id) => `
        <div class="tech-badge animate-pop" data-id="${id}" data-type="badge" style="display:inline-flex; gap: 8px; align-items: center;">
            <i class="fa-solid fa-star" data-prop="icon"></i>
            <span contenteditable="true">Bagde</span>
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
            const img = this.selectedElement.querySelector('img');
            const currentSrc = img.src;
            const currentWidth = img.style.width || "100%";
            const currentRadius = img.style.borderRadius || "0px";

            html += `
            <label>URL da Imagem:</label>
            <input type="text" value="${currentSrc}" oninput="Studio.updateProp('img-src', this.value)">
            
           <label>Arredondamento: <span id="radius-val">${currentRadius}</span></label>
            <input type="range" min="0" max="150" value="${parseInt(currentRadius)}" 
                oninput="Studio.updateProp('img-radius', this.value + 'px')">

            <label>Largura da Imagem (${currentWidth}):</label>
            <select onchange="Studio.updateProp('img-width', this.value)">
                <option value="25%" ${currentWidth === '25%' ? 'selected' : ''}>Pequena (25%)</option>
                <option value="50%" ${currentWidth === '50%' ? 'selected' : ''}>Média (50%)</option>
                <option value="75%" ${currentWidth === '75%' ? 'selected' : ''}>Grande (75%)</option>
                <option value="100%" ${currentWidth === '100%' ? 'selected' : ''}>Total (100%)</option>
            </select>
        `;
        }

        if (type === 'paragraph') {
            const currentBg = this.selectedElement.style.backgroundColor || "transparent";

            html += `
            <label>Cor de Fundo do Parágrafo:</label>
            <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px;">
                <button class="color-dot" style="background:transparent; border:1px solid #ccc" onclick="Studio.updateProp('p-bg', 'transparent')"></button>
                <button class="color-dot" style="background:#f0f7ff" onclick="Studio.updateProp('p-bg', '#f0f7ff')"></button>
                <button class="color-dot" style="background:#fff4e5" onclick="Studio.updateProp('p-bg', '#fff4e5')"></button>
                <button class="color-dot" style="background:#e7f9ee" onclick="Studio.updateProp('p-bg', '#e7f9ee')"></button>
                <input type="color" value="${currentBg}" onchange="Studio.updateProp('p-bg', this.value)" style="width:30px; height:30px; border:none; padding:0;margin-top:-2px;">
            </div>
            <small>Ajuste o padding se necessário via CSS (card-text)</small>`;
        }

        if (type === 'badge') {
            const hasFlat = this.selectedElement.classList.contains('badge-flat');
            const currentIcon = this.selectedElement.querySelector('i').className;

            html += `
                <label>Estilo do Badge:</label>
                <select onchange="Studio.updateProp('badge-style', this.value)" style="margin-bottom: 15px;">
                    <option value="3d" ${!hasFlat ? 'selected' : ''}>Padrão 3D (Branco)</option>
                    <option value="flat" ${hasFlat ? 'selected' : ''}>Apenas Ícone (Flat)</option>
                </select>

                <label>Classe do Ícone (FontAwesome):</label>
                <div style="position: relative; display: flex; align-items: center;">
                    <input type="text" 
                        value="${currentIcon}" 
                        oninput="Studio.updateBadgeIcon(this.value)"
                        style="width: 100%; padding-right: 30px;">
                    
                    <a href="https://fontawesome.com/search?m=free" target="_blank" 
                    title="Procurar ícones"
                    style="position: absolute; top: 27%; right: 10px; color: #aaa; text-decoration: none; font-size: 0.9rem;">
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

        // Dentro de renderProperties(type)

        if (type === 'code-inline') {
            const codeEl = this.selectedElement.querySelector('code');
            const currentCol = codeEl.style.color || "inherit";
            const currentBg = codeEl.style.backgroundColor || "transparent";

            html += `
    <label>Cor do Código:</label>
    <div class="color-grid" style="display: flex; gap: 5px; margin-bottom: 10px;">
        <button class="color-dot" style="background:#e06c75" onclick="Studio.updateProp('code-color', '#e06c75')"></button>
        <button class="color-dot" style="background:#98c379" onclick="Studio.updateProp('code-color', '#98c379')"></button>
        <button class="color-dot" style="background:#61afef" onclick="Studio.updateProp('code-color', '#61afef')"></button>
        <input type="color" value="${currentCol}" onchange="Studio.updateProp('code-color', this.value)" class="color-input-min">
    </div>

    <label>Fundo do Código:</label>
    <div class="color-grid" style="display: flex; gap: 5px;">
        <button class="color-dot" style="background:#282c34" onclick="Studio.updateProp('code-bg', '#282c34')"></button>
        <button class="color-dot" style="background:#f0f0f0; border:1px solid #ccc" onclick="Studio.updateProp('code-bg', '#f0f0f0')"></button>
        <button class="color-dot" style="background:transparent; border:1px solid #ccc" onclick="Studio.updateProp('code-bg', 'transparent')"></button>
        <input type="color" value="${currentBg}" onchange="Studio.updateProp('code-bg', this.value)" class="color-input-min">
    </div>`;
        }

        if (type === 'info') {
    // Convertemos as cores atuais para Hex para o input reconhecer
    const currentBg = this.rgbToHex(this.selectedElement.style.backgroundColor) || "#f0f7ff";
    const currentBorder = this.rgbToHex(this.selectedElement.style.borderLeftColor) || "#007bff";

    html += `
    <label>Cor de Fundo (Info):</label>
    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">
        <button type="button" class="color-dot" style="background:#f0f7ff; border:1px solid #ddd" onclick="Studio.updateProp('info-bg', '#f0f7ff')"></button>
        <button type="button" class="color-dot" style="background:#fff4e5; border:1px solid #ddd" onclick="Studio.updateProp('info-bg', '#fff4e5')"></button>
        <input style="margin-top:20px;" type="color" value="${currentBg}" oninput="Studio.updateProp('info-bg', this.value)" class="color-input-min">
    </div>
    
    <label>Cor da Borda e Ícone:</label>
    <div style="display: flex; gap: 8px; align-items: center;">
        <button type="button" class="color-dot" style="background:#007bff" onclick="Studio.updateProp('info-border', '#007bff')"></button>
        <button type="button" class="color-dot" style="background:#ff4b4b" onclick="Studio.updateProp('info-border', '#ff4b4b')"></button>
        <input type="color" value="${currentBorder}" oninput="Studio.updateProp('info-border', this.value)" class="color-input-min" style="margin-top:20px;">
    </div>
    
    <small style="display:block; margin-top:5px; color:#666">O ícone seguirá a cor da borda.</small>`;
}

        this.propPanel.innerHTML = html;
    },

    rgbToHex(rgb) {
        if (!rgb || rgb === "transparent" || rgb === "inherit") return "#ffffff";
        if (rgb.startsWith('#')) return rgb;
        
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues || rgbValues.length < 3) return "#ffffff";
        
        return "#" + rgbValues.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
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

        if (prop === 'img-radius') {
            const img = this.selectedElement.querySelector('img');
            if (img) {
                img.style.borderRadius = value;

                const label = document.getElementById('radius-val');
                if (label) label.innerText = value;
            }
        }

        if (prop === 'p-bg') {
            this.selectedElement.style.backgroundColor = value;

            if (value !== 'transparent') {
                this.selectedElement.style.padding = '15px';
                this.selectedElement.style.borderRadius = '8px';
            } else {
                this.selectedElement.style.padding = '0';
            }
        }

        if (prop === 'code-color') {
            const code = this.selectedElement.querySelector('code');
            if (code) code.style.color = value;
        }
        if (prop === 'code-bg') {
            const code = this.selectedElement.querySelector('code');
            if (code) code.style.backgroundColor = value;
        }

        // Lógica para Bloco Info
        if (prop === 'info-bg') {
            this.selectedElement.style.backgroundColor = value;
        }
        if (prop === 'info-border') {
            this.selectedElement.style.borderLeftColor = value;
            // Sincroniza a cor do ícone com a borda lateral para manter a harmonia
            const icon = this.selectedElement.querySelector('.info-icon i');
            if (icon) icon.style.color = value;
        }
    },

    addComponent(type, targetContainer) {
        if (!this.templates[type]) return;

        const id = 'comp_' + Date.now();
        const wrapper = document.createElement('div');
        wrapper.className = 'edit-wrapper';

        // IMPORTANTE: O conteúdo do template agora é o primeiro filho, 
        // e os controles são o segundo.
        wrapper.innerHTML = `
        ${this.templates[type](id)}
        <div class="edit-controls small">
            <button class="btn-delete-item"><i class="fa-solid fa-trash"></i></button>
        </div>`;

        wrapper.querySelector('.btn-delete-item').onclick = (e) => {
            e.stopPropagation();
            wrapper.remove();
        };

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
                    // Pegamos o elemento de conteúdo real
                    const element = wrap.querySelector('[data-id]');
                    if (!element) return;

                    // Criamos o clone para limpeza
                    const clone = element.cloneNode(true);

                    // REMOÇÃO AGRESSIVA DE CONTROLES
                    // Isso remove caso a lixeira tenha entrado dentro ou esteja colada no elemento
                    const controls = clone.querySelectorAll('.edit-controls, .btn-delete-item, .section-header');
                    controls.forEach(c => c.remove());

                    // Limpeza de atributos de edição
                    clone.classList.remove('animate-pop', 'selected-edit');
                    clone.removeAttribute('contenteditable');

                    // Limpa todos os filhos
                    clone.querySelectorAll('[contenteditable], [spellcheck]').forEach(el => {
                        el.removeAttribute('contenteditable');
                        el.removeAttribute('spellcheck');
                        el.classList.remove('selected-edit');
                    });

                    // Adiciona ao HTML do slide
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
