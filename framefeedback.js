// framefeedback.js
(function () {
  if (window.FrameFeedbackV2Loaded) return;
  window.FrameFeedbackV2Loaded = true;

  /* -------------------------
     META + FONTE (responsividade)
     ------------------------- */
  (function injectMetaAndFont() {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      // evita zoom em iOS/Android (ajuda com o zoom ao focar inputs)
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
     CSS (melhor responsividade + estilo)
     ------------------------- */
  const css = `
:root{
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

/* base reset */
.ff-body, body { font-family: 'Montserrat', -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
.ff-overlay {
  position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65));
  z-index: 2147483646; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}

/* container */
.ff-card {
  width: 92%;
  max-width: 520px;
  border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  color: var(--card-contrast);
  box-shadow: var(--shadow);
  padding: 22px;
  transform: translateY(30px);
  opacity: 0;
  transition: all 420ms cubic-bezier(.2,.9,.3,1);
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

/* show */
.ff-card.ff-show { transform: translateY(0); opacity: 1; }

/* header */
.ff-top {
  display:flex; gap:12px; align-items:center; justify-content:space-between;
}
.ff-top-left { display:flex; gap:12px; align-items:center; }
.ff-logo {
  width:42px; height:42px; min-width:42px; border-radius:10px;
  background: linear-gradient(135deg,var(--accent),var(--accent-2));
  display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff;
  box-shadow: 0 6px 20px rgba(171,134,91,0.18);
}
.ff-title {
  font-size:18px; font-weight:600; letter-spacing:0.2px;
}
.ff-sub { font-size:13px; color:var(--muted); margin-top:2px; }

/* chatbot welcome */
.ff-welcome {
  margin-top: 12px;
  font-size:15px;
  color:var(--muted);
}

/* rating row */
.ff-rating {
  display:flex; justify-content:space-between; margin:18px 0 6px;
  gap:8px;
}
.ff-rating .item {
  flex:1 1 0; display:flex; flex-direction:column; align-items:center; gap:8px;
  background: var(--glass); padding:14px 8px; border-radius:12px; cursor:pointer;
  transition: transform 180ms ease, background 180ms ease;
  user-select:none;
}
.ff-rating .item:active{ transform: scale(.98); }
.ff-rating .item .emoji { font-size:28px; }
.ff-rating .item .label { font-size:13px; color:var(--muted); text-align:center; }

/* selected */
.ff-rating .item.ff-selected { transform: scale(1.06); box-shadow:0 10px 30px rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.04); }

/* reasons area */
.ff-reasons { display:none; gap:8px; margin-top:12px; }
.ff-reasons.active { display:flex; flex-direction:column; }
.ff-reasons label { display:flex; gap:10px; align-items:center; font-size:15px; color:var(--muted); }
.ff-reasons input[type="checkbox"] { width:18px; height:18px; accent-color: var(--accent); }

/* inputs */
.ff-input, .ff-textarea {
  width:100%; box-sizing:border-box; border-radius:12px; border:1px solid rgba(255,255,255,0.06);
  background: transparent; padding:12px 14px; color:var(--card-contrast); font-size:16px; min-height:44px;
}
.ff-textarea { min-height:110px; resize:vertical; font-size:16px; line-height:1.4; }

/* small helper */
.ff-privacy {
  font-size:13px; color:var(--muted); margin-top:8px; display:flex; gap:6px; align-items:center;
}
.ff-privacy a { color:var(--accent-2); text-decoration:underline; font-weight:600; font-size:13px; }

/* actions */
.ff-actions { display:flex; gap:10px; margin-top:14px; align-items:center; }
.ff-btn {
  background: linear-gradient(135deg,var(--accent),var(--accent-2));
  color:#fff; border:none; padding:12px 16px; border-radius:999px; font-weight:700; cursor:pointer;
  font-size:15px; min-width:120px;
  box-shadow: 0 10px 30px rgba(171,134,91,0.18);
}
.ff-btn.ghost {
  background: transparent; border:1px solid rgba(255,255,255,0.06); color:var(--muted);
}

/* report small */
.ff-report-toggle { font-size:13px; color:var(--muted); cursor:pointer; text-decoration:underline; }

/* loading overlay (within popup) */
.ff-inner-loading {
  display:none; gap:10px; align-items:center; justify-content:center; margin-top:12px; flex-direction:column;
}
.ff-inner-loading.active { display:flex; }
.ff-spinner {
  width:36px; height:36px; border-radius:50%; border:3px solid rgba(255,255,255,0.12); border-top-color:var(--accent);
  animation: ff-spin 1s linear infinite;
}
@keyframes ff-spin { to { transform: rotate(360deg); } }

/* small toast */
.ff-toast {
  position: fixed; right:18px; bottom:18px; background:linear-gradient(135deg,var(--accent),var(--accent-2));
  color:#fff; padding:10px 14px; border-radius:14px; box-shadow:0 8px 24px rgba(171,134,91,0.25); font-weight:600;
  z-index:2147483647; transform: translateY(24px); opacity:0; transition: all 300ms ease;
}
.ff-toast.show { transform:translateY(0); opacity:1; }

/* responsive tweaks */
@media (max-width: 520px) {
  .ff-card { padding:20px; width:96%; max-width:420px; }
  .ff-title { font-size:17px; }
  .ff-rating .item { padding:12px 6px; }
  .ff-logo { width:40px; height:40px; min-width:40px; }
  .ff-btn { min-width:110px; padding:12px 14px; font-size:15px; }
  .ff-textarea, .ff-input { font-size:16px; }
}

/* make inputs never trigger browser zoom: font >= 16px, meta viewport set above */
input, textarea, button { -webkit-tap-highlight-color: transparent; font-size:16px; }
`;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* -------------------------
     HTML do componente (injection)
     ------------------------- */
  const overlay = document.createElement('div');
  overlay.className = 'ff-overlay';
  overlay.innerHTML = `
    <div class="ff-card" role="dialog" aria-modal="true" aria-label="Avaliação da Frame" id="ffCard">
      <div class="ff-top">
        <div class="ff-top-left">
          <div class="ff-logo" aria-hidden="true">F</div>
          <div>
            <div class="ff-title">Frame | Avaliação</div>
            <div class="ff-sub">Diga o que achou</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="ff-btn ghost" id="ffClose" title="Fechar">Fechar</button>
        </div>
      </div>

      <!-- chatbot-like welcome + small typing -->
      <div class="ff-welcome" id="ffWelcome">Oi! Queremos ouvir você. Isso leva só 1 minuto.</div>

      <!-- rating -->
      <div class="ff-rating" id="ffRating" aria-hidden="false">
        <div class="item" data-val="1" role="button" tabindex="0"><div class="emoji">😞</div><div class="label">Péssimo</div></div>
        <div class="item" data-val="2" role="button" tabindex="0"><div class="emoji">😟</div><div class="label">Ruim</div></div>
        <div class="item" data-val="3" role="button" tabindex="0"><div class="emoji">😐</div><div class="label">Médio</div></div>
        <div class="item" data-val="4" role="button" tabindex="0"><div class="emoji">🙂</div><div class="label">Bom</div></div>
        <div class="item" data-val="5" role="button" tabindex="0"><div class="emoji">😍</div><div class="label">Excelente</div></div>
      </div>

      <!-- reasons & extra fields -->
      <div class="ff-reasons" id="ffReasonsLow" aria-hidden="true">
        <strong style="font-size:15px">O que poderia melhorar?</strong>
        <label><input type="checkbox" value="demora"> Demora no atendimento</label>
        <label><input type="checkbox" value="incompleta"> Não tive resolução ou ela foi incompleta</label>
        <label><input type="checkbox" value="confusa"> Comunicação confusa</label>
        <label><input type="checkbox" value="nao-simpatico"> Agente não foi simpático(a)</label>
        <label><input type="checkbox" value="outro"> Outro</label>
      </div>

      <div class="ff-reasons" id="ffReasonsHigh" aria-hidden="true">
        <strong style="font-size:15px">O que você amou no nosso atendimento?</strong>
        <label><input type="checkbox" value="rapido"> O atendimento foi rápido</label>
        <label><input type="checkbox" value="eficaz"> Solução eficaz</label>
        <label><input type="checkbox" value="claro"> Comunicação clara</label>
        <label><input type="checkbox" value="atencioso"> Agente atencioso(a)</label>
        <label><input type="checkbox" value="outro"> Outro</label>
      </div>

      <!-- optional report (hidden by default) -->
      <div id="ffReport" style="display:none; margin-top:10px; gap:8px; flex-direction:column;">
        <strong style="font-size:15px">Denunciar atendente</strong>
        <input class="ff-input" id="ffReportName" placeholder="Nome do atendente reportado" aria-label="Nome do atendente">
        <input class="ff-input" id="ffReportProtocol" placeholder="Protocolo / número (opcional)" aria-label="Protocolo de atendimento">
        <textarea class="ff-textarea" id="ffReportDesc" placeholder="Descreva o comportamento inadequado do agente"></textarea>
      </div>

      <textarea id="ffComment" class="ff-textarea" placeholder="Conte mais (opcional)"></textarea>
      <input id="ffEmail" class="ff-input" type="email" placeholder="Seu e-mail (opcional)">

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
        <div>
          <div class="ff-report-toggle" id="ffToggleReport">Denunciar atendente</div>
          <div class="ff-privacy" style="margin-top:8px;">
            <input type="checkbox" id="ffPrivacyCheck" aria-label="Concordo com a política" />
            <div style="display:flex;flex-direction:column">
              <span style="font-size:13px;color:var(--muted)">Ao enviar você concorda com nossa</span>
              <a href="https://frameag.com/privacy" target="_blank" rel="noopener">Política de Privacidade</a>
            </div>
          </div>
        </div>
        <div class="ff-actions">
          <button class="ff-btn ghost" id="ffLater">Talvez depois</button>
          <button class="ff-btn" id="ffSubmit">Enviar avaliação</button>
        </div>
      </div>

      <!-- inner loading state (agent search etc) -->
      <div class="ff-inner-loading" id="ffInnerLoading">
        <div class="ff-spinner" aria-hidden="true"></div>
        <div id="ffInnerLoadingText" style="font-size:14px;color:var(--muted)">Encontrando o agente responsável pelo seu protocolo...</div>
      </div>
    </div>

    <div class="ff-toast" id="ffToast" role="status" aria-live="polite" style="display:none"></div>
  `;
  document.body.appendChild(overlay);

  /* -------------------------
     Element references
     ------------------------- */
  const ffCard = document.getElementById('ffCard');
  const ffClose = document.getElementById('ffClose');
  const ratingItems = Array.from(document.querySelectorAll('.ff-rating .item'));
  const reasonsLow = document.getElementById('ffReasonsLow');
  const reasonsHigh = document.getElementById('ffReasonsHigh');
  const ffWelcome = document.getElementById('ffWelcome');
  const ffComment = document.getElementById('ffComment');
  const ffEmail = document.getElementById('ffEmail');
  const ffSubmit = document.getElementById('ffSubmit');
  const ffLater = document.getElementById('ffLater');
  const ffToast = document.getElementById('ffToast');
  const ffInnerLoading = document.getElementById('ffInnerLoading');
  const ffInnerLoadingText = document.getElementById('ffInnerLoadingText');
  const ffToggleReport = document.getElementById('ffToggleReport');
  const ffReport = document.getElementById('ffReport');
  const ffReportName = document.getElementById('ffReportName');
  const ffReportProtocol = document.getElementById('ffReportProtocol');
  const ffReportDesc = document.getElementById('ffReportDesc');
  const ffPrivacyCheck = document.getElementById('ffPrivacyCheck');

  /* small helper */
  function showToast(text, time = 2600) {
    ffToast.textContent = text;
    ffToast.style.display = 'block';
    setTimeout(() => ffToast.classList.add('show'), 20);
    setTimeout(() => {
      ffToast.classList.remove('show');
      setTimeout(() => ffToast.style.display = 'none', 300);
    }, time);
  }

  /* accessibility focus trap-ish (basic) */
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  function openPanel() {
    ffCard.classList.add('ff-show');
    // small "typing" / chatbot feeling
    ffWelcome.textContent = 'Oi! Queremos ouvir você. Isso leva só 1 minuto.';
    setTimeout(() => {
      const original = ffWelcome.textContent;
      let i = 0;
      const typing = setInterval(() => {
        ffWelcome.textContent = original.slice(0, i) + (i % 2 ? '|' : '');
        i++;
        if (i > original.length + 4) {
          clearInterval(typing);
          ffWelcome.textContent = original;
        }
      }, 45);
    }, 150);
    // prevent body scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    ffCard.classList.remove('ff-show');
    setTimeout(() => {
      overlay.remove();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }, 420);
  }

  ffClose.addEventListener('click', closePanel);
  ffLater.addEventListener('click', () => {
    showToast('Tudo bem! A gente volta depois :)');
    closePanel();
  });

  /* rating logic */
  let selectedRating = null;
  ratingItems.forEach(item => {
    const val = Number(item.dataset.val || 0);
    function select() {
      ratingItems.forEach(it => it.classList.remove('ff-selected'));
      item.classList.add('ff-selected');
      selectedRating = val;
      // show reasons
      reasonsLow.classList.remove('active');
      reasonsHigh.classList.remove('active');
      if (val <= 3) reasonsLow.classList.add('active');
      if (val === 5) reasonsHigh.classList.add('active');
      // scroll into view if needed on mobile
      setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 180);
    }
    item.addEventListener('click', select);
    item.addEventListener('keypress', (e) => { if (e.key === 'Enter') select(); });
  });

  // toggle report area
  ffToggleReport.addEventListener('click', () => {
    if (ffReport.style.display === 'none' || !ffReport.style.display) {
      ffReport.style.display = 'flex';
      ffToggleReport.textContent = 'Cancelar minha denúncia';
    } else {
      ffReport.style.display = 'none';
      ffToggleReport.textContent = 'Reportar agente';
    }
  });

  /* submit simulation (no backend) */
  ffSubmit.addEventListener('click', () => {
    if (!selectedRating) {
      showToast('Por favor, selecione uma nota antes de enviar.');
      return;
    }
    if (!ffPrivacyCheck.checked) {
      showToast('Você precisa concordar com a Política de Privacidade para enviar.');
      return;
    }
    // disable UI
    ffSubmit.disabled = true;
    ffSubmit.style.opacity = '0.6';
    // show inner loading
    ffInnerLoading.classList.add('active');
    ffInnerLoadingText.textContent = 'Encontrando o agente responsável pelo seu protocolo...';

    // simulate staged flow
    setTimeout(() => {
      ffInnerLoadingText.textContent = 'Analisando sua avaliação...';
    }, 1200);
    setTimeout(() => {
      ffInnerLoadingText.textContent = 'Preparando nossa resposta personalizada...';
    }, 2600);

    // final confirmation step
    setTimeout(() => {
      ffInnerLoading.classList.remove('active');
      // replace card content with confirmation - keep nice design
      ffCard.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:18px">
          <div style="width:66px;height:66px;border-radius:22px;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:28px">✓</div>
          <div style="font-size:18px;font-weight:700">Obrigado pela avaliação!</div>
          <div style="font-size:14px;color:var(--muted);text-align:center">Sua opinião ajuda a melhorar nosso atendimento. Em breve vamos analisar e tomar medidas quando necessário.</div>
          <div style="margin-top:12px;width:100%;display:flex;gap:10px;justify-content:center">
            <button class="ff-btn" id="ffCloseFinal">Fechar</button>
            <button class="ff-btn ghost" id="ffNew">Enviar outra</button>
          </div>
        </div>
      `;
      // small toast
      showToast('Avaliação enviada com sucesso!');
      // hook buttons
      document.getElementById('ffCloseFinal').addEventListener('click', closePanel);
      document.getElementById('ffNew').addEventListener('click', () => {
        // reload original overlay (re-initialize by re-creating the script is heavy) - quick reset:
        try { overlay.remove(); window.FrameFeedbackV2Loaded = false; location.reload(); } catch (err) { closePanel(); }
      });
    }, 4200);
  });

  /* small pinch: prevent multiple taps zoom on iOS by ensuring font-size >= 16 and meta set */
  // already addressed in CSS + meta tag

  /* show initial panel with small delay so page finishes paint */
  setTimeout(openPanel, 280);

  /* Expose a small API in case you want to control it externally */
  window.FrameFeedback = {
    open: openPanel,
    close: closePanel,
    toast: showToast
  };

  /* Accessibility / cleanup on unload */
  window.addEventListener('beforeunload', () => {
    try { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; } catch (e) {}
  });

})();
