// ===== Injetar Meta Viewport para Responsividade em Mobile (se já não existir) =====
if (!document.querySelector('meta[name="viewport"]')) {
  const metaViewport = document.createElement('meta');
  metaViewport.name = 'viewport';
  metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(metaViewport);
}

// ===== Injetar Link de Fontes (Montserrat com pesos 400,500,600) =====
if (!document.querySelector('link[href*="Montserrat"]')) {
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
}

// ===== Injetar CSS (estilo dark theme minimalista Apple-like, com glass effects) =====
const existingStyle = document.querySelector('style');
let style;
if (existingStyle) {
  style = existingStyle;
} else {
  style = document.createElement('style');
  document.head.appendChild(style);
}

// Adicionar ou estender os estilos
style.textContent += `
:root {
  --bg-color: #141414;
  --text-color: #fff;
  --accent-color: #AB865B;
  --accent-light: #D3AD83;
  --secondary-bg: #1a1a1a;
  --message-bg-received: #2a2a2a;
  --border-color: rgba(255,255,255,0.1);
  --red-bad: rgb(185, 74, 72);
  --orange-poor: rgb(194, 125, 61);
  --brown-average: rgb(169, 116, 77);
  --dark-brown-good: rgb(139, 106, 69);
  --gold-excellent: rgb(107, 91, 52);
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-blur: blur(10px);
}

body {
  margin: 0;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-color);
  min-height: 100vh;
  overflow: auto;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 16px;
  box-sizing: border-box;
}

header {
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-weight: 600; /* semibold */
  font-size: 24px;
  margin: 0;
}

.rating-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  margin-bottom: 40px;
}

.rating-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.rating-item.selected {
  transform: scale(1.2);
}

.rating-item:hover {
  transform: scale(1.1);
}

.rating-emoji {
  font-size: 40px;
  margin-bottom: 8px;
}

.rating-label {
  font-size: 14px;
  font-weight: 400; /* regular */
}

form {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reasons-section {
  display: none;
  flex-direction: column;
  gap: 10px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
}

.reasons-section label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
}

.reasons-section input[type="checkbox"] {
  accent-color: var(--accent-color);
}

textarea, input[type="email"] {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  color: var(--text-color);
  font-size: 16px;
  font-weight: 400;
  resize: vertical;
  min-height: 100px;
}

textarea:focus, input[type="email"]:focus {
  outline: none;
  border-color: var(--accent-color);
}

button {
  background: var(--accent-color);
  color: var(--text-color);
  border: none;
  border-radius: 24px;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  align-self: center;
}

button:hover {
  background: var(--accent-light);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.popup {
  background: linear-gradient(135deg, rgba(32,32,32,0.98), rgba(171,134,91,0.98));
  color: var(--text-color);
  width: 90%;
  max-width: 450px;
  min-width: 320px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transform: translateY(50px);
  opacity: 0;
  transition: all .6s cubic-bezier(0.25,0.46,0.45,0.94);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.popup.show {
  transform: translateY(0);
  opacity: 1;
}

.popup h2 {
  font-weight: 600;
  font-size: 20px;
  margin: 0;
}

.popup p {
  font-weight: 400;
  font-size: 16px;
  margin: 0;
}

.popup .close-text {
  font-weight: 500; /* medium for emphasis */
  font-size: 14px;
  color: var(--accent-light);
}

@media (max-width: 600px) {
  body {
    padding: 10px;
  }

  .rating-container {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }

  .rating-item {
    flex: 1 1 30%;
  }
}
`;

// ===== Criar e Injetar Elementos HTML Dinamicamente =====

// Header
const header = document.createElement('header');
const h1 = document.createElement('h1');
h1.textContent = 'Frame - Avaliação';
header.appendChild(h1);
document.body.appendChild(header);

// Container de Rating
const ratingContainer = document.createElement('div');
ratingContainer.classList.add('rating-container');

// Itens de Rating
const ratings = [
  { rating: 1, emoji: '😞', label: 'Péssimo' },
  { rating: 2, emoji: '😟', label: 'Ruim' },
  { rating: 3, emoji: '😐', label: 'Médio' },
  { rating: 4, emoji: '🙂', label: 'Bom' },
  { rating: 5, emoji: '😍', label: 'Excelente' }
];

ratings.forEach(r => {
  const item = document.createElement('div');
  item.classList.add('rating-item');
  item.dataset.rating = r.rating;

  const emoji = document.createElement('span');
  emoji.classList.add('rating-emoji');
  emoji.textContent = r.emoji;

  const label = document.createElement('span');
  label.classList.add('rating-label');
  label.textContent = r.label;

  item.appendChild(emoji);
  item.appendChild(label);
  ratingContainer.appendChild(item);
});

document.body.appendChild(ratingContainer);

// Formulário
const form = document.createElement('form');
form.id = 'feedback-form';

// Seções de Motivos
const lowReasons = document.createElement('div');
lowReasons.id = 'low-reasons';
lowReasons.classList.add('reasons-section');

const lowH3 = document.createElement('h3');
lowH3.style = 'font-weight: 600; font-size: 18px; margin: 0 0 10px;';
lowH3.textContent = 'Motivos para a nota baixa:';
lowReasons.appendChild(lowH3);

const lowMotivos = [
  { value: 'demora', text: 'Demora no atendimento' },
  { value: 'incompleta', text: 'Não tive resolução ou foi incompleta' },
  { value: 'confusa', text: 'Comunicação confusa' },
  { value: 'nao-simpatico', text: 'Agente não simpático(a)' },
  { value: 'outro', text: 'Outro' }
];

lowMotivos.forEach(m => {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = 'reason';
  input.value = m.value;
  label.appendChild(input);
  label.appendChild(document.createTextNode(m.text));
  lowReasons.appendChild(label);
});

const highReasons = document.createElement('div');
highReasons.id = 'high-reasons';
highReasons.classList.add('reasons-section');

const highH3 = document.createElement('h3');
highH3.style = 'font-weight: 600; font-size: 18px; margin: 0 0 10px;';
highH3.textContent = 'Motivos para a nota excelente:';
highReasons.appendChild(highH3);

const highMotivos = [
  { value: 'rapido', text: 'Atendimento rápido' },
  { value: 'eficaz', text: 'Solução eficaz' },
  { value: 'clara', text: 'Comunicação clara' },
  { value: 'atencioso', text: 'Atendente atencioso(a)' },
  { value: 'outro', text: 'Outro' }
];

highMotivos.forEach(m => {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = 'reason';
  input.value = m.value;
  label.appendChild(input);
  label.appendChild(document.createTextNode(m.text));
  highReasons.appendChild(label);
});

form.appendChild(lowReasons);
form.appendChild(highReasons);

// Textarea para Comentário
const textarea = document.createElement('textarea');
textarea.id = 'comment';
textarea.placeholder = 'Gostaria de deixar um comentário? (opcional)';
form.appendChild(textarea);

// Input para Email
const emailInput = document.createElement('input');
emailInput.type = 'email';
emailInput.id = 'email';
emailInput.placeholder = 'Seu e-mail para retorno (opcional)';
form.appendChild(emailInput);

// Botão de Enviar
const button = document.createElement('button');
button.type = 'submit';
button.textContent = 'Enviar Avaliação';
form.appendChild(button);

document.body.appendChild(form);

// Overlay e Popup
const overlay = document.createElement('div');
overlay.classList.add('overlay');
overlay.id = 'overlay';

const popup = document.createElement('div');
popup.classList.add('popup');
popup.id = 'popup';

const popupH2 = document.createElement('h2');
popupH2.textContent = 'Obrigado pela sua avaliação! Ela é valiosa';

const popupP1 = document.createElement('p');
popupP1.textContent = 'Ela já foi encaminhada para a Frame Agency.';

const popupP2 = document.createElement('p');
popupP2.classList.add('close-text');
popupP2.textContent = 'Você já pode fechar essa tela.';

popup.appendChild(popupH2);
popup.appendChild(popupP1);
popup.appendChild(popupP2);

overlay.appendChild(popup);
document.body.appendChild(overlay);

// ===== Lógica JavaScript =====
let selectedRating = null;

const ratingItems = document.querySelectorAll('.rating-item');
ratingItems.forEach(item => {
  item.addEventListener('click', () => {
    ratingItems.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    selectedRating = parseInt(item.dataset.rating);

    lowReasons.style.display = 'none';
    highReasons.style.display = 'none';

    if (selectedRating <= 3) {
      lowReasons.style.display = 'flex';
    } else if (selectedRating === 5) {
      highReasons.style.display = 'flex';
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!selectedRating) {
    alert('Por favor, selecione uma nota.');
    return;
  }

  button.disabled = true;
  button.textContent = 'Enviando...';

  // Simular envio (aqui você pode adicionar fetch para API real)
  setTimeout(() => {
    overlay.style.display = 'flex';
    popup.classList.add('show');
    button.disabled = false;
    button.textContent = 'Enviar Avaliação';
  }, 1000); // Efeito de carregamento
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.style.display = 'none';
    popup.classList.remove('show');
    // Opcional: window.close(); se for uma popup window
  }
});