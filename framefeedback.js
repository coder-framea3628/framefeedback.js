// framefeedback.js
(function () {
  // Evita rodar duas vezes
  if (window.FrameFeedbackLoaded) return;
  window.FrameFeedbackLoaded = true;

  // ----- Estilos (minimalista Apple-like) -----
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --bg-color: #fff;
      --text-color: #000;
      --accent-color: #007aff; /* azul estilo Apple */
      --border-color: rgba(0,0,0,0.1);
    }
    .ff-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .ff-card {
      background: var(--bg-color);
      color: var(--text-color);
      width: 90%; max-width: 420px;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      text-align: center;
      transform: translateY(30px);
      opacity: 0;
      transition: all .4s ease;
    }
    .ff-card.show { transform: translateY(0); opacity: 1; }
    .ff-title { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
    .ff-rating { display: flex; justify-content: space-around; margin: 20px 0; }
    .ff-rating-item { cursor: pointer; font-size: 32px; transition: transform .2s; }
    .ff-rating-item:hover { transform: scale(1.2); }
    .ff-rating-item.selected { transform: scale(1.3); }
    .ff-reasons { text-align: left; margin: 15px 0; display: none; }
    .ff-reasons label { display: flex; align-items: center; gap: 8px; margin: 6px 0; font-size: 15px; }
    .ff-input, .ff-textarea {
      width: 100%; border: 1px solid var(--border-color);
      border-radius: 12px; padding: 12px;
      font-size: 15px; margin-top: 10px;
    }
    .ff-button {
      margin-top: 18px; background: var(--accent-color);
      color: #fff; border: none; border-radius: 24px;
      padding: 12px 24px; font-weight: 600; font-size: 15px;
      cursor: pointer; transition: opacity .2s;
    }
    .ff-button:disabled { opacity: .5; cursor: not-allowed; }
    .ff-loading {
      font-size: 15px; color: #555; margin-top: 16px;
      display: none;
    }
  `;
  document.head.appendChild(style);

  // ----- Estrutura -----
  const overlay = document.createElement("div");
  overlay.className = "ff-overlay";
  overlay.innerHTML = `
    <div class="ff-card" id="ff-card">
      <div class="ff-title">Queremos ouvir você</div>
      <div class="ff-rating" id="ff-rating">
        <div class="ff-rating-item" data-val="1">😞</div>
        <div class="ff-rating-item" data-val="2">😟</div>
        <div class="ff-rating-item" data-val="3">😐</div>
        <div class="ff-rating-item" data-val="4">🙂</div>
        <div class="ff-rating-item" data-val="5">😍</div>
      </div>
      <div class="ff-reasons" id="ff-reasons-low">
        <strong>O que poderia melhorar?</strong><br>
        <label><input type="checkbox" value="demora"> Demora no atendimento</label>
        <label><input type="checkbox" value="incompleto"> Não tive resolução ou foi incompleta</label>
        <label><input type="checkbox" value="confuso"> Comunicação confusa</label>
        <label><input type="checkbox" value="nao-simpatico"> Atendente não simpático(a)</label>
      </div>
      <div class="ff-reasons" id="ff-reasons-high">
        <strong>O que foi excelente?</strong><br>
        <label><input type="checkbox" value="rapido"> Atendimento rápido</label>
        <label><input type="checkbox" value="eficaz"> Solução eficaz</label>
        <label><input type="checkbox" value="claro"> Comunicação clara</label>
        <label><input type="checkbox" value="atencioso"> Atendente atencioso</label>
      </div>
      <textarea class="ff-textarea" id="ff-comment" placeholder="Comentário (opcional)"></textarea>
      <input type="email" class="ff-input" id="ff-email" placeholder="Seu e-mail (opcional)" />
      <button class="ff-button" id="ff-submit">Enviar Avaliação</button>
      <div class="ff-loading" id="ff-loading">Encontrando o agente responsável pelo seu caso...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Delay para animação
  setTimeout(() => overlay.querySelector(".ff-card").classList.add("show"), 50);

  // ----- Lógica -----
  const ratingEls = overlay.querySelectorAll(".ff-rating-item");
  const lowReasons = overlay.querySelector("#ff-reasons-low");
  const highReasons = overlay.querySelector("#ff-reasons-high");
  const submitBtn = overlay.querySelector("#ff-submit");
  const loadingText = overlay.querySelector("#ff-loading");

  let selectedRating = null;

  ratingEls.forEach(el => {
    el.addEventListener("click", () => {
      ratingEls.forEach(i => i.classList.remove("selected"));
      el.classList.add("selected");
      selectedRating = parseInt(el.dataset.val);
      lowReasons.style.display = "none";
      highReasons.style.display = "none";
      if (selectedRating <= 3) lowReasons.style.display = "block";
      if (selectedRating === 5) highReasons.style.display = "block";
    });
  });

  submitBtn.addEventListener("click", () => {
    if (!selectedRating) {
      alert("Selecione uma nota antes de enviar.");
      return;
    }
    submitBtn.disabled = true;
    loadingText.style.display = "block";

    setTimeout(() => {
      overlay.querySelector(".ff-card").innerHTML = `
        <div class="ff-title"> Obrigado pelo tempo dedicado e por sua avaliação! Ela é valiosa.</div>
        <p>e já foi encaminhada para nossa equipe.</p>
        <p style="font-size:14px; color:#777;">Agora você pode fechar esta tela.</p>
      `;
    }, 2000);
  });

  // Fecha se clicar fora
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.remove();
  });
})();
