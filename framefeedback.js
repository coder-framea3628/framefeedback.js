// framefeedback.js (atualizado)
(function () {
  if (window.FrameFeedbackV2Loaded) return;
  window.FrameFeedbackV2Loaded = true;

  /* -------------------------
     META + FONTE
     ------------------------- */
  (function injectMetaAndFont() {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
  })();

  /* -------------------------
     CSS
     ------------------------- */
  const css = `
:root {
  --bg: #0f0f10;
  --card-bg: rgba(255,255,255,0.02);
  --card-contrast: #ffffff;
  --accent: #AB865B;
  --accent-2: #D3AD83;
  --muted: rgba(255,255,255,0.6);
  --glass: rgba(255,255,255,0.03);
  --radius: 16px;
  --shadow: 0 12px 40px rgba(0,0,0,0.6);
}
.ff-body, body { font-family: 'Montserrat', -apple-system, system-ui, 'Segoe UI', Roboto; }
.ff-overlay {
  position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65));
  z-index: 2147483646; backdrop-filter: blur(8px);
}
.ff-card {
  width: 92%; max-width: 520px; border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  color: var(--card-contrast); box-shadow: var(--shadow);
  padding: 22px; transform: translateY(30px); opacity: 0;
  transition: all 420ms cubic-bezier(.2,.9,.3,1);
  box-sizing: border-box;
}
.ff-card.ff-show { transform: translateY(0); opacity: 1; }
.ff-top { display:flex; gap:12px; align-items:center; justify-content:space-between; }
.ff-top-left { display:flex; gap:12px; align-items:center; }
.ff-logo img { width:42px; height:42px; border-radius:10px; box-shadow: 0 6px 20px rgba(171,134,91,0.18); }
.ff-title { font-size:18px; font-weight:600; }
.ff-sub { font-size:13px; color:var(--muted); margin-top:2px; }
.ff-rating { display:flex; justify-content:space-between; margin:18px 0 6px; gap:8px; }
.ff-rating .item { flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; background: var(--glass); padding:14px 8px; border-radius:12px; cursor:pointer; }
.ff-rating .item.ff-selected { transform: scale(1.06); box-shadow:0 0 20px rgba(171,134,91,0.4); border:1px solid rgba(255,255,255,0.04); }
.ff-privacy input[type="checkbox"] { accent-color: var(--accent); }
.ff-actions { margin-top:14px; display:flex; justify-content:center; }
.ff-btn { background: linear-gradient(135deg,var(--accent),var(--accent-2)); color:#fff; border:none; padding:12px 20px; border-radius:999px; font-weight:700; cursor:pointer; font-size:16px; width:100%; max-width:240px; text-align:center; }
@media (max-width: 520px) {
  .ff-card { width:380px; max-width:96%; padding:20px; }
}
`;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* -------------------------
     HTML
     ------------------------- */
  const overlay = document.createElement('div');
  overlay.className = 'ff-overlay';
  overlay.innerHTML = `
    <div class="ff-card" id="ffCard">
      <div class="ff-top">
        <div class="ff-top-left">
          <div class="ff-logo"><img src="https://framerusercontent.com/images/nqe8sytY941OUcgvF17Y9qLajUc.png" alt="Frame logo"></div>
          <div>
            <div class="ff-title">Frame | Avaliação</div>
            <div class="ff-sub">Diga o que achou</div>
          </div>
        </div>
        <button class="ff-btn ghost" id="ffClose">Fechar</button>
      </div>
      <div class="ff-welcome" id="ffWelcome">Oi! Queremos ouvir você. Isso leva só 1 minuto.</div>
      <div class="ff-rating" id="ffRating">
        <div class="item" data-val="1"><div class="emoji">😞</div><div class="label">Péssimo</div></div>
        <div class="item" data-val="2"><div class="emoji">😟</div><div class="label">Ruim</div></div>
        <div class="item" data-val="3"><div class="emoji">😐</div><div class="label">Médio</div></div>
        <div class="item" data-val="4"><div class="emoji">🙂</div><div class="label">Bom</div></div>
        <div class="item" data-val="5"><div class="emoji">😍</div><div class="label">Excelente</div></div>
      </div>
      <div class="ff-reasons" id="ffReasonsLow"><strong>O que poderia melhorar?</strong></div>
      <div class="ff-reasons" id="ffReasonsMid"><strong>Teria alguma sugestão?</strong></div>
      <div class="ff-reasons" id="ffReasonsHigh"><strong>O que você amou no nosso atendimento?</strong></div>
      <div id="ffReport" style="display:none; flex-direction:column; gap:8px;">
        <strong>Denunciar atendente</strong>
        <input class="ff-input" id="ffReportName" placeholder="Nome do atendente" required>
        <input class="ff-input" id="ffReportProtocol" placeholder="Protocolo / número" required>
        <textarea class="ff-textarea" id="ffReportDesc" placeholder="Descreva o comportamento" required></textarea>
      </div>
      <textarea id="ffComment" class="ff-textarea" placeholder="Conte mais (opcional)"></textarea>
      <input id="ffEmail" class="ff-input" type="email" placeholder="Seu e-mail (opcional)">
      <div style="margin-top:10px;">
        <div class="ff-report-toggle" id="ffToggleReport">Denunciar atendente</div>
        <div class="ff-privacy"><input type="checkbox" id="ffPrivacyCheck"> Ao enviar você concorda com nossa <a href="https://frameag.com/privacy" target="_blank">Política de Privacidade</a></div>
      </div>
      <div class="ff-actions"><button class="ff-btn" id="ffSubmit">Enviar avaliação</button></div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* -------------------------
     JS - comportamento
     ------------------------- */
  const ffCard = document.getElementById('ffCard');
  const ffClose = document.getElementById('ffClose');
  const ffSubmit = document.getElementById('ffSubmit');
  const ffToggleReport = document.getElementById('ffToggleReport');
  const ffReport = document.getElementById('ffReport');
  const ffPrivacyCheck = document.getElementById('ffPrivacyCheck');

  let selectedRating = null;
  document.querySelectorAll('.ff-rating .item').forEach(it => {
    it.onclick = () => {
      selectedRating = Number(it.dataset.val);
      document.querySelectorAll('.ff-rating .item').forEach(el => el.classList.remove('ff-selected'));
      it.classList.add('ff-selected');
      if (selectedRating === 5) ffCard.classList.add('glow');
    };
  });

  ffClose.onclick = () => {
    alert("Para fechar, basta fechar essa aba/janela do seu navegador.");
  };

  ffToggleReport.onclick = () => {
    ffReport.style.display = ffReport.style.display === 'none' ? 'flex' : 'none';
  };

  ffSubmit.onclick = () => {
    if (!selectedRating && ffReport.style.display === 'none') {
      alert("Selecione uma nota antes de enviar.");
      return;
    }
    if (!ffPrivacyCheck.checked) {
      alert("Você precisa concordar com a Política de Privacidade.");
      return;
    }
    ffCard.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <div style="font-size:20px; font-weight:700;">Obrigado pela avaliação!</div>
        <p style="color:var(--muted)">Sua opinião ajuda a melhorar nosso atendimento.</p>
        <a class="ff-btn ghost" href="https://frameag.com/contato" target="_blank">Central de Ajuda</a>
      </div>
    `;
  };
})();