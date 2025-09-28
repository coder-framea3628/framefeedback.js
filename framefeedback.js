<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Frame - Avaliação</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
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
    </style>
</head>
<body>
    <header>
        <h1>Frame - Avaliação</h1>
    </header>

    <div class="rating-container">
        <div class="rating-item" data-rating="1">
            <span class="rating-emoji">😞</span>
            <span class="rating-label">Péssimo</span>
        </div>
        <div class="rating-item" data-rating="2">
            <span class="rating-emoji">😟</span>
            <span class="rating-label">Ruim</span>
        </div>
        <div class="rating-item" data-rating="3">
            <span class="rating-emoji">😐</span>
            <span class="rating-label">Médio</span>
        </div>
        <div class="rating-item" data-rating="4">
            <span class="rating-emoji">🙂</span>
            <span class="rating-label">Bom</span>
        </div>
        <div class="rating-item" data-rating="5">
            <span class="rating-emoji">😍</span>
            <span class="rating-label">Excelente</span>
        </div>
    </div>

    <form id="feedback-form">
        <div id="low-reasons" class="reasons-section">
            <h3 style="font-weight: 600; font-size: 18px; margin: 0 0 10px;">Motivos para a nota baixa:</h3>
            <label><input type="checkbox" name="reason" value="demora"> Demora no atendimento</label>
            <label><input type="checkbox" name="reason" value="incompleta"> Resolução incompleta</label>
            <label><input type="checkbox" name="reason" value="confusa"> Comunicação confusa</label>
            <label><input type="checkbox" name="reason" value="nao-simpatico"> Atendente não simpático</label>
            <label><input type="checkbox" name="reason" value="outro"> Outro</label>
        </div>

        <div id="high-reasons" class="reasons-section">
            <h3 style="font-weight: 600; font-size: 18px; margin: 0 0 10px;">Motivos para a nota excelente:</h3>
            <label><input type="checkbox" name="reason" value="rapido"> Atendimento rápido</label>
            <label><input type="checkbox" name="reason" value="eficaz"> Solução eficaz</label>
            <label><input type="checkbox" name="reason" value="clara"> Comunicação clara</label>
            <label><input type="checkbox" name="reason" value="atencioso"> Atendente atencioso</label>
            <label><input type="checkbox" name="reason" value="outro"> Outro</label>
        </div>

        <textarea placeholder="Deixe um comentário (opcional)" id="comment"></textarea>

        <input type="email" placeholder="Seu e-mail para retorno (opcional)" id="email">

        <button type="submit">Enviar Avaliação</button>
    </form>

    <div class="overlay" id="overlay">
        <div class="popup" id="popup">
            <h2>Obrigado pela sua avaliação!</h2>
            <p>Ela já foi encaminhada para a Frame Agency.</p>
            <p class="close-text">Você já pode fechar essa tela.</p>
        </div>
    </div>

    <script>
        const ratingItems = document.querySelectorAll('.rating-item');
        const lowReasons = document.getElementById('low-reasons');
        const highReasons = document.getElementById('high-reasons');
        const form = document.getElementById('feedback-form');
        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('popup');
        let selectedRating = null;

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

            const button = form.querySelector('button');
            button.disabled = true;
            button.textContent = 'Enviando...';

            setTimeout(() => {
                overlay.style.display = 'flex';
                popup.classList.add('show');
                button.disabled = false;
                button.textContent = 'Enviar Avaliação';
            }, 1000);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                popup.classList.remove('show');
                // Opcional: window.close(); // Se for uma janela popup
            }
        });