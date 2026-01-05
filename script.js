/**
 * Движок визуальной новеллы - Многопользовательский режим
 * ver. 3.2
 * Поддержка объектной структуры сцен
 */

// Константы состояний игры
var GAME_STATE = {
    MENU: 'menu',
    ROLE_SELECT: 'role_select',
    PLAYING: 'playing',
    CODE_GENERATED: 'code_generated',
    WAIT_FOR_CODE: 'wait_for_code',
    ENDING: 'ending'
};

// Глобальное состояние игры
var gameState = {
    state: GAME_STATE.MENU,
    currentPlayer: 1,
    currentScene: 'start',
    currentNodeId: null,
    isTyping: false,
    typingComplete: false,
    variables: {},
    history: [],
    storyLog: [],
    turnCount: 0,
    choiceCount: 0,
    settings: {
        musicVolume: 50,
        sfxVolume: 70,
        textSpeed: 30
    }
};

// Элементы DOM
var elements = {};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initElements();
    initEventListeners();
    loadSettings();
    checkSavedGame();
    showScreen('screen-menu');
    console.log('Движок визуальной новеллы загружен');
});

/**
 * Инициализация ссылок на элементы DOM
 */
function initElements() {
    elements = {
        gameContainer: document.getElementById('game-container'),
        backgroundImage: document.getElementById('background-image'),
        characterLeft: document.getElementById('character-left'),
        characterCenter: document.getElementById('character-center'),
        characterRight: document.getElementById('character-right'),
        dialogBox: document.getElementById('dialog-box'),
        speakerName: document.getElementById('speaker-name'),
        dialogText: document.getElementById('dialog-text'),
        nextIndicator: document.getElementById('next-indicator'),
        choiceMenu: document.getElementById('choice-menu'),
        choiceContainer: document.getElementById('choice-container'),
        turnIndicator: document.getElementById('turn-indicator'),
        controlPanel: document.getElementById('control-panel'),
        currentPlayerSpan: document.getElementById('current-player'),
        generatedCodeTextarea: document.getElementById('generated-code'),
        inputCodeTextarea: document.getElementById('input-code'),
        codeError: document.getElementById('code-error'),
        logText: document.getElementById('log-text'),
        logTurnCount: document.getElementById('log-turn-count'),
        logPlayerCount: document.getElementById('log-player-count'),
        endingTitle: document.getElementById('ending-title'),
        endingText: document.getElementById('ending-text'),
        statTurns: document.getElementById('stat-turns'),
        statChoices: document.getElementById('stat-choices'),
        bgmPlayer: document.getElementById('bgm-player'),
        sfxPlayer: document.getElementById('sfx-player')
    };
}

/**
 * Инициализация обработчиков событий
 */
function initEventListeners() {
    // Главное меню
    document.getElementById('btn-new-game').addEventListener('click', showRoleSelect);
    document.getElementById('btn-load-save').addEventListener('click', loadGame);
    document.getElementById('btn-enter-code').addEventListener('click', showCodeInput);
    document.getElementById('btn-settings').addEventListener('click', showSettings);

    // Выбор роли
    var roleButtons = document.querySelectorAll('.role-select-btn');
    for (var i = 0; i < roleButtons.length; i++) {
        roleButtons[i].addEventListener('click', function() {
            var role = parseInt(this.getAttribute('data-role'));
            startNewGame(role);
        });
    }

    // Игровой экран
    elements.dialogBox.addEventListener('click', handleDialogClick);
    document.getElementById('log-btn').addEventListener('click', showLog);
    document.getElementById('menu-btn').addEventListener('click', showPauseMenu);
    document.getElementById('save-btn').addEventListener('click', saveGame);
    document.getElementById('settings-panel-btn').addEventListener('click', showSettings);
    document.getElementById('end-turn-btn').addEventListener('click', generateTurnCode);

    // Экран вывода кода
    document.getElementById('btn-copy-code').addEventListener('click', copyCode);
    document.getElementById('btn-confirm-transfer').addEventListener('click', confirmCodeTransfer);

    // Экран ввода кода
    document.getElementById('btn-submit-code').addEventListener('click', submitCode);
    document.getElementById('btn-back-to-menu').addEventListener('click', function() {
        showScreen('screen-menu');
    });

    // Настройки
    document.getElementById('music-volume').addEventListener('input', updateMusicVolume);
    document.getElementById('sfx-volume').addEventListener('input', updateSfxVolume);
    document.getElementById('text-speed').addEventListener('input', updateTextSpeed);
    document.getElementById('save-game-btn').addEventListener('click', function() { saveGame(); showNotification('Игра сохранена'); });
    document.getElementById('load-game-btn').addEventListener('click', function() { loadGame(); showNotification('Игра загружена'); });
    document.getElementById('reset-game-btn').addEventListener('click', function() { resetGame(); showNotification('Сохранение удалено'); });
    document.getElementById('close-settings').addEventListener('click', hideSettings);

    // Меню паузы
    document.getElementById('pause-save-btn').addEventListener('click', function() { saveGame(); hidePauseMenu(); showNotification('Игра сохранена'); });
    document.getElementById('pause-load-btn').addEventListener('click', function() { loadGame(); hidePauseMenu(); showNotification('Игра загружена'); });
    document.getElementById('pause-log-btn').addEventListener('click', function() { hidePauseMenu(); showLog(); });
    document.getElementById('pause-endturn-btn').addEventListener('click', function() { hidePauseMenu(); generateTurnCode(); });
    document.getElementById('resume-game-btn').addEventListener('click', hidePauseMenu);
    document.getElementById('quit-game-btn').addEventListener('click', function() { hidePauseMenu(); quitToMenu(); });

    // Логи
    document.getElementById('copy-log-btn').addEventListener('click', copyLog);
    document.getElementById('close-log-btn').addEventListener('click', hideLog);

    // Концовка
    document.getElementById('view-log-btn').addEventListener('click', function() {
        hideScreen('screen-ending');
        showLog();
    });
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('back-to-menu-btn').addEventListener('click', quitToMenu);

    // Клавиатура
    document.addEventListener('keydown', handleKeyDown);

    // Полноэкранный режим
    elements.gameContainer.addEventListener('dblclick', toggleFullscreen);
}

/**
 * Переключение экранов
 */
function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).classList.remove('hidden');
}

function hideAllScreens() {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.add('hidden');
    }
    document.getElementById('settings-menu').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('log-panel').classList.add('hidden');
}

function showRoleSelect() {
    showScreen('screen-role-select');
}

function showSettings() {
    document.getElementById('settings-menu').classList.remove('hidden');
}

function hideSettings() {
    document.getElementById('settings-menu').classList.add('hidden');
}

function showPauseMenu() {
    document.getElementById('pause-menu').classList.remove('hidden');
}

function hidePauseMenu() {
    document.getElementById('pause-menu').classList.add('hidden');
}

function showLog() {
    updateLogDisplay();
    document.getElementById('log-panel').classList.remove('hidden');
}

function hideLog() {
    document.getElementById('log-panel').classList.add('hidden');
}

function showCodeInput() {
    elements.inputCodeTextarea.value = '';
    elements.codeError.classList.add('hidden');
    showScreen('screen-code-input');
}

/**
 * Начало новой игры
 */
function startNewGame(playerRole) {
    gameState.state = GAME_STATE.PLAYING;
    gameState.currentPlayer = playerRole;
    gameState.currentScene = 'start';
    gameState.currentNodeId = 'role_intro';
    gameState.variables = {};
    gameState.history = [];
    gameState.storyLog = [];
    gameState.turnCount = 0;
    gameState.choiceCount = 0;

    showScreen('screen-gameplay');
    if (elements.controlPanel) {
        elements.controlPanel.classList.add('visible');
    }
    if (elements.turnIndicator) {
        elements.turnIndicator.classList.add('visible');
    }

    updateTurnIndicator();
    addToLog('system', 'Начало новой игры. Игрок ' + playerRole + ' начинает.');

    playScene('start', 'role_intro');
}

/**
 * Обновление индикатора хода
 */
function updateTurnIndicator() {
    if (elements.currentPlayerSpan) {
        elements.currentPlayerSpan.textContent = 'Игрок ' + gameState.currentPlayer;
    }
}

/**
 * Воспроизведение сцены
 */
function playScene(sceneId, startNodeId) {
    var scene = GAME_DATA.scenes[sceneId];
    if (!scene) {
        console.error('Сцена не найдена: ' + sceneId);
        showNotification('Ошибка: сцена не найдена');
        return;
    }

    gameState.currentScene = sceneId;
    
    // Если указан начальный узел, используем его
    if (startNodeId) {
        gameState.currentNodeId = startNodeId;
    } else if (!gameState.currentNodeId) {
        // Иначе берём первый узел
        var nodeIds = Object.keys(scene.nodes);
        if (nodeIds.length > 0) {
            gameState.currentNodeId = nodeIds[0];
        } else {
            console.error('В сцене нет узлов: ' + sceneId);
            return;
        }
    }

    executeNode(sceneId, gameState.currentNodeId);
}

/**
 * Выполнение узла сцены
 */
function executeNode(sceneId, nodeId) {
    var scene = GAME_DATA.scenes[sceneId];
    if (!scene || !scene.nodes || !scene.nodes[nodeId]) {
        console.error('Узел не найден: ' + sceneId + '.' + nodeId);
        return;
    }

    var node = scene.nodes[nodeId];
    gameState.currentNodeId = nodeId;

    // Обработка фонового изображения
    if (node.location && elements.backgroundImage) {
        var loc = GAME_DATA.locations[node.location];
        if (loc && loc.image) {
            elements.backgroundImage.src = loc.image;
        }
    }

    // Проверка на особые типы узлов
    
    // Конец хода
    if (node.endTurn) {
        gameState.turnCount++;
        addToLog('system', 'Ход игрока ' + gameState.currentPlayer + ' завершён.');
        var nextPlayer = node.nextPlayer || (gameState.currentPlayer === 1 ? 2 : 1);
        generateTurnCode(nextPlayer, gameState.currentScene);
        return;
    }

    // Ввод кода
    if (node.isCodeInput) {
        showCodeInput();
        return;
    }

    // Вывод кода
    if (node.isCodeOutput) {
        generateTurnCode(node.nextPlayer || 2, gameState.currentScene);
        return;
    }

    // Точка ожидания
    if (node.isWaitingPoint) {
        // Просто показываем текст
        showDialog(node.speaker || '', formatText(node.text, gameState.variables));
        return;
    }

    // Автопереход
    if (node.autoAdvance) {
        showDialog(node.speaker || '', formatText(node.text, gameState.variables));
        setTimeout(function() {
            if (node.autoAdvanceDelay) {
                setTimeout(nextStep, node.autoAdvanceDelay);
            } else {
                nextStep();
            }
        }, 100);
        return;
    }

    // Обычный диалог с выбором
    if (node.choices && node.choices.length > 0) {
        showDialog(node.speaker || '', formatText(node.text, gameState.variables));
        showChoices(node.choices);
        return;
    }

    // Простой диалог без выбора
    if (node.text) {
        showDialog(node.speaker || '', formatText(node.text, gameState.variables));
        return;
    }

    // Конец игры
    if (node.isEnding) {
        showEnding(node.title || 'Конец', formatText(node.text, gameState.variables));
        return;
    }

    // Действия
    if (node.action) {
        executeAction(node.action);
    }

    // Переход к следующему узлу
    nextStep();
}

/**
 * Выполнение действия
 */
function executeAction(action) {
    if (action.setPlayer) {
        gameState.currentPlayer = action.setPlayer;
        updateTurnIndicator();
    }

    if (action.setVar) {
        for (var key in action.setVar) {
            if (action.setVar.hasOwnProperty(key)) {
                var val = action.setVar[key];
                // Проверяем, содержит ли значение оператор
                if (typeof val === 'string' && (val.indexOf('+=') === 0 || val.indexOf('-=') === 0 || 
                    val.indexOf('*=') === 0 || val.indexOf('/=') === 0)) {
                    var op = val.substring(0, 2);
                    var num = parseFloat(val.substring(2));
                    var current = gameState.variables[key] || 0;
                    if (op === '+=') gameState.variables[key] = current + num;
                    else if (op === '-=') gameState.variables[key] = current - num;
                    else if (op === '*=') gameState.variables[key] = current * num;
                    else if (op === '/=') gameState.variables[key] = current / num;
                } else {
                    gameState.variables[key] = val;
                }
            }
        }
    }

    if (action.add) {
        for (var key in action.add) {
            if (action.add.hasOwnProperty(key)) {
                gameState.variables[key] = (gameState.variables[key] || 0) + action.add[key];
            }
        }
    }

    if (action.subtract) {
        for (var key in action.subtract) {
            if (action.subtract.hasOwnProperty(key)) {
                gameState.variables[key] = (gameState.variables[key] || 0) - action.subtract[key];
            }
        }
    }

    if (action.resetGame) {
        resetGame();
        quitToMenu();
    }
}

/**
 * Переход к следующему шагу
 */
function nextStep() {
    var scene = GAME_DATA.scenes[gameState.currentScene];
    if (!scene || !scene.nodes) return;

    var nodeIds = Object.keys(scene.nodes);
    var currentIndex = nodeIds.indexOf(gameState.currentNodeId);

    if (currentIndex === -1 || currentIndex >= nodeIds.length - 1) {
        // Конец сцены
        console.log('Конец сцены: ' + gameState.currentScene);
        return;
    }

    var nextNodeId = nodeIds[currentIndex + 1];
    executeNode(gameState.currentScene, nextNodeId);
}

/**
 * Обработка клика по диалогу
 */
function handleDialogClick() {
    if (gameState.state !== GAME_STATE.PLAYING) return;

    if (gameState.isTyping) {
        completeTyping();
    } else {
        nextStep();
    }
}

/**
 * Обработка нажатия клавиш
 */
function handleKeyDown(e) {
    if (gameState.state !== GAME_STATE.PLAYING) return;

    switch (e.key) {
        case ' ':
        case 'Enter':
            e.preventDefault();
            handleDialogClick();
            break;
        case 'Escape':
            if (!document.getElementById('pause-menu').classList.contains('hidden')) {
                hidePauseMenu();
            } else {
                showPauseMenu();
            }
            break;
    }
}

/**
 * Показать диалог
 */
function showDialog(name, text) {
    gameState.isTyping = true;
    gameState.typingComplete = false;

    if (elements.speakerName) {
        elements.speakerName.textContent = name || '';
    }
    if (elements.dialogText) {
        elements.dialogText.textContent = '';
    }
    if (elements.dialogText) {
        elements.dialogText.classList.add('text-typing');
    }
    if (elements.nextIndicator) {
        elements.nextIndicator.style.display = 'none';
    }

    addToLog('dialog', { name: name, text: text });

    var speed = Math.max(10, 101 - gameState.settings.textSpeed);
    var charIndex = 0;
    var dialogText = text;

    function typeChar() {
        if (charIndex < dialogText.length) {
            if (elements.dialogText) {
                elements.dialogText.textContent += dialogText.charAt(charIndex);
            }
            charIndex++;
            setTimeout(typeChar, speed);
        } else {
            completeTyping();
        }
    }

    typeChar();
}

/**
 * Завершить печатание текста
 */
function completeTyping() {
    if (!gameState.isTyping) return;

    var scene = GAME_DATA.scenes[gameState.currentScene];
    if (scene && scene.nodes && scene.nodes[gameState.currentNodeId]) {
        var node = scene.nodes[gameState.currentNodeId];
        if (elements.dialogText && node.text) {
            elements.dialogText.textContent = formatText(node.text, gameState.variables);
        }
    }

    gameState.isTyping = false;
    gameState.typingComplete = true;
    if (elements.dialogText) {
        elements.dialogText.classList.remove('text-typing');
    }
    if (elements.nextIndicator) {
        elements.nextIndicator.style.display = 'block';
    }
}

/**
 * Показать варианты выбора
 */
function showChoices(options) {
    if (!elements.choiceContainer || !elements.choiceMenu) return;

    elements.choiceContainer.innerHTML = '';
    elements.choiceMenu.classList.remove('hidden');

    for (var i = 0; i < options.length; i++) {
        var option = options[i];

        var btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = option.text;
        btn.addEventListener('click', (function(opt, idx) {
            return function() {
                gameState.choiceCount++;
                gameState.history.push({
                    player: gameState.currentPlayer,
                    text: opt.text,
                    scene: opt.nextNode
                });
                addToLog('choice', { player: gameState.currentPlayer, text: opt.text });

                hideChoices();
                playScene(gameState.currentScene, opt.nextNode);
            };
        })(option, i));

        elements.choiceContainer.appendChild(btn);
    }
}

/**
 * Скрыть меню выбора
 */
function hideChoices() {
    if (elements.choiceMenu) {
        elements.choiceMenu.classList.add('hidden');
    }
    if (elements.choiceContainer) {
        elements.choiceContainer.innerHTML = '';
    }
}

// ============ СИСТЕМА КОДОВ ============

/**
 * Генерация кода для передачи хода
 */
function generateTurnCode(nextPlayer, nextScene) {
    gameState.state = GAME_STATE.CODE_GENERATED;

    var nextPlayerNum = nextPlayer || (gameState.currentPlayer === 1 ? 2 : 1);
    var nextSceneId = nextScene || gameState.currentScene;

    var transferData = {
        version: '1.0',
        timestamp: Date.now(),
        player: nextPlayerNum,
        scene: nextSceneId,
        nodeId: gameState.currentNodeId,
        variables: gameState.variables,
        turnCount: gameState.turnCount,
        choiceCount: gameState.choiceCount,
        history: gameState.history,
        log: gameState.storyLog.slice(-50)
    };

    var jsonString = JSON.stringify(transferData);
    var base64Code = btoa(unescape(encodeURIComponent(jsonString)));

    var readableCode = '';
    for (var i = 0; i < base64Code.length; i += 50) {
        readableCode += base64Code.substring(i, Math.min(i + 50, base64Code.length)) + '\n';
    }

    if (document.getElementById('next-player-num')) {
        document.getElementById('next-player-num').textContent = nextPlayerNum;
    }
    if (elements.generatedCodeTextarea) {
        elements.generatedCodeTextarea.value = readableCode.trim();
    }
    showScreen('screen-code-output');

    console.log('Код сгенерирован для игрока ' + nextPlayerNum);
}

/**
 * Копирование кода в буфер обмена
 */
function copyCode() {
    var code = elements.generatedCodeTextarea.value;
    navigator.clipboard.writeText(code).then(function() {
        showNotification('Код скопирован в буфер обмена!');
    }).catch(function() {
        elements.generatedCodeTextarea.select();
        document.execCommand('copy');
        showNotification('Код скопирован!');
    });
}

/**
 * Подтверждение передачи кода
 */
function confirmCodeTransfer() {
    showNotification('Код передан! Возврат в меню.');
    quitToMenu();
}

/**
 * Ввод и обработка кода
 */
function submitCode() {
    var code = elements.inputCodeTextarea.value.trim().replace(/\n/g, '');

    if (!code) {
        showCodeError('Введите код!');
        return;
    }

    try {
        var jsonString = decodeURIComponent(escape(atob(code)));
        var data = JSON.parse(jsonString);

        if (data.version !== '1.0') {
            showCodeError('Неверный формат кода.');
            return;
        }

        gameState.currentPlayer = data.player;
        gameState.currentScene = data.scene;
        gameState.currentNodeId = data.nodeId;
        gameState.variables = data.variables || {};
        gameState.turnCount = data.turnCount || 0;
        gameState.choiceCount = data.choiceCount || 0;
        gameState.history = data.history || [];
        gameState.storyLog = data.log || [];

        showScreen('screen-gameplay');
        if (elements.controlPanel) {
            elements.controlPanel.classList.add('visible');
        }
        if (elements.turnIndicator) {
            elements.turnIndicator.classList.add('visible');
        }
        updateTurnIndicator();

        addToLog('system', 'Игрок ' + data.player + ' принял ход.');

        playScene(data.scene, data.nodeId);

        showNotification('Ход принят! Продолжаем историю.');

    } catch (e) {
        console.error('Ошибка при разборе кода:', e);
        showCodeError('Неверный код. Проверьте и попробуйте снова.');
    }
}

/**
 * Показать ошибку ввода кода
 */
function showCodeError(message) {
    if (elements.codeError) {
        elements.codeError.textContent = message;
        elements.codeError.classList.remove('hidden');
    }
}

// ============ СИСТЕМА ЛОГОВ ============

/**
 * Добавить запись в лог
 */
function addToLog(type, data) {
    var entry = {
        type: type,
        data: data,
        time: new Date().toLocaleTimeString('ru-RU'),
        player: gameState.currentPlayer
    };
    gameState.storyLog.push(entry);
    console.log('[LOG]', type, data);
}

/**
 * Обновить отображение лога
 */
function updateLogDisplay() {
    var text = [];
    text.push('=== ИСТОРИЯ ПРОХОЖДЕНИЯ ===');
    text.push('Дата: ' + new Date().toLocaleString('ru-RU'));
    text.push('Ходов: ' + gameState.turnCount);
    text.push('Выборов: ' + gameState.choiceCount);
    text.push('');

    for (var i = 0; i < gameState.storyLog.length; i++) {
        var entry = gameState.storyLog[i];
        if (entry.type === 'dialog') {
            if (entry.data.name) {
                text.push('[' + entry.time + '] ' + entry.data.name + ': ' + entry.data.text);
            } else {
                text.push('[' + entry.time + '] ' + entry.data.text);
            }
        } else if (entry.type === 'choice') {
            text.push('[' + entry.time + '] >>> Игрок ' + entry.data.player + ' выбрал: ' + entry.data.text);
        } else if (entry.type === 'system') {
            text.push('[' + entry.time + '] [СИСТЕМА] ' + entry.data);
        }
    }

    text.push('');
    text.push('=== КОНЕЦ ===');

    if (elements.logText) {
        elements.logText.value = text.join('\n');
    }
    if (elements.logTurnCount) {
        elements.logTurnCount.textContent = 'Ходов: ' + gameState.turnCount;
    }
    if (elements.logPlayerCount) {
        elements.logPlayerCount.textContent = 'Выборов: ' + gameState.choiceCount;
    }
}

/**
 * Копировать лог в буфер обмена
 */
function copyLog() {
    navigator.clipboard.writeText(elements.logText.value).then(function() {
        showNotification('История скопирована!');
    }).catch(function() {
        elements.logText.select();
        document.execCommand('copy');
        showNotification('История скопирована!');
    });
}

// ============ СИСТЕМА СОХРАНЕНИЯ/ЗАГРУЗКИ ============

/**
 * Сохранить игру
 */
function saveGame() {
    var saveData = {
        state: gameState.state,
        currentPlayer: gameState.currentPlayer,
        currentScene: gameState.currentScene,
        currentNodeId: gameState.currentNodeId,
        variables: gameState.variables,
        history: gameState.history,
        storyLog: gameState.storyLog,
        turnCount: gameState.turnCount,
        choiceCount: gameState.choiceCount,
        timestamp: Date.now()
    };

    try {
        localStorage.setItem('vn_save_data', JSON.stringify(saveData));
        console.log('Игра сохранена');
    } catch (e) {
        console.error('Ошибка сохранения:', e);
        showNotification('Ошибка сохранения!');
    }
}

/**
 * Загрузить игру
 */
function loadGame() {
    var saved = localStorage.getItem('vn_save_data');
    if (!saved) {
        showNotification('Нет сохранённой игры');
        return false;
    }

    try {
        var saveData = JSON.parse(saved);

        gameState.state = saveData.state || GAME_STATE.PLAYING;
        gameState.currentPlayer = saveData.currentPlayer;
        gameState.currentScene = saveData.currentScene;
        gameState.currentNodeId = saveData.currentNodeId;
        gameState.variables = saveData.variables || {};
        gameState.history = saveData.history || [];
        gameState.storyLog = saveData.storyLog || [];
        gameState.turnCount = saveData.turnCount || 0;
        gameState.choiceCount = saveData.choiceCount || 0;

        showScreen('screen-gameplay');
        if (elements.controlPanel) {
            elements.controlPanel.classList.add('visible');
        }
        if (elements.turnIndicator) {
            elements.turnIndicator.classList.add('visible');
        }
        updateTurnIndicator();

        playScene(gameState.currentScene, gameState.currentNodeId);

        showNotification('Игра загружена!');
        return true;

    } catch (e) {
        console.error('Ошибка загрузки:', e);
        showNotification('Ошибка загрузки!');
        return false;
    }
}

/**
 * Проверить наличие сохранённой игры
 */
function checkSavedGame() {
    var saved = localStorage.getItem('vn_save_data');
    var btn = document.getElementById('btn-load-save');
    if (saved) {
        btn.disabled = false;
        btn.style.opacity = '1';
    } else {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    }
}

/**
 * Сбросить игру
 */
function resetGame() {
    localStorage.removeItem('vn_save_data');
    localStorage.removeItem('vn_settings');
    checkSavedGame();
}

/**
 * Выйти в меню
 */
function quitToMenu() {
    gameState.state = GAME_STATE.MENU;
    stopAudio();
    showScreen('screen-menu');
    if (elements.controlPanel) {
        elements.controlPanel.classList.remove('visible');
    }
    if (elements.turnIndicator) {
        elements.turnIndicator.classList.remove('visible');
    }
    hidePauseMenu();
}

/**
 * Перезапуск игры
 */
function restartGame() {
    hideScreen('screen-ending');
    showRoleSelect();
}

/**
 * Скрыть экран
 */
function hideScreen(screenId) {
    document.getElementById(screenId).classList.add('hidden');
}

// ============ ЭКРАН КОНЦОВКИ ============

/**
 * Показать экран концовки
 */
function showEnding(title, text) {
    gameState.state = GAME_STATE.ENDING;

    if (elements.endingTitle) {
        elements.endingTitle.textContent = title || 'Конец';
    }
    if (elements.endingText) {
        elements.endingText.textContent = text || '';
    }
    if (elements.statTurns) {
        elements.statTurns.textContent = gameState.turnCount;
    }
    if (elements.statChoices) {
        elements.statChoices.textContent = gameState.choiceCount;
    }

    showScreen('screen-ending');
}

// ============ НАСТРОЙКИ ============

/**
 * Загрузить настройки
 */
function loadSettings() {
    var saved = localStorage.getItem('vn_settings');
    if (saved) {
        var settings = JSON.parse(saved);
        for (var key in settings) {
            if (settings.hasOwnProperty(key) && gameState.settings.hasOwnProperty(key)) {
                gameState.settings[key] = settings[key];
            }
        }
    }

    var musicVol = document.getElementById('music-volume');
    var sfxVol = document.getElementById('sfx-volume');
    var textSpd = document.getElementById('text-speed');

    if (musicVol) musicVol.value = gameState.settings.musicVolume;
    if (sfxVol) sfxVol.value = gameState.settings.sfxVolume;
    if (textSpd) textSpd.value = gameState.settings.textSpeed;

    var musicVal = document.getElementById('music-volume-value');
    var sfxVal = document.getElementById('sfx-volume-value');
    var textVal = document.getElementById('text-speed-value');

    if (musicVal) musicVal.textContent = gameState.settings.musicVolume + '%';
    if (sfxVal) sfxVal.textContent = gameState.settings.sfxVolume + '%';
    if (textVal) textVal.textContent = gameState.settings.textSpeed;

    if (elements.bgmPlayer) {
        elements.bgmPlayer.volume = gameState.settings.musicVolume / 100;
    }
    if (elements.sfxPlayer) {
        elements.sfxPlayer.volume = gameState.settings.sfxVolume / 100;
    }
}

function updateMusicVolume(e) {
    gameState.settings.musicVolume = parseInt(e.target.value);
    document.getElementById('music-volume-value').textContent = e.target.value + '%';
    if (elements.bgmPlayer) {
        elements.bgmPlayer.volume = e.target.value / 100;
    }
    saveSettings();
}

function updateSfxVolume(e) {
    gameState.settings.sfxVolume = parseInt(e.target.value);
    document.getElementById('sfx-volume-value').textContent = e.target.value + '%';
    if (elements.sfxPlayer) {
        elements.sfxPlayer.volume = e.target.value / 100;
    }
    saveSettings();
}

function updateTextSpeed(e) {
    gameState.settings.textSpeed = parseInt(e.target.value);
    document.getElementById('text-speed-value').textContent = e.target.value;
    saveSettings();
}

function saveSettings() {
    localStorage.setItem('vn_settings', JSON.stringify(gameState.settings));
}

// ============ УВЕДОМЛЕНИЯ ============

/**
 * Показать уведомление
 */
function showNotification(message) {
    var notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(function() {
        notification.classList.remove('show');
    }, 2000);
}

// ============ АУДИО ============

function playAudio(src, loop) {
    if (elements.bgmPlayer) {
        elements.bgmPlayer.src = src;
        elements.bgmPlayer.loop = loop !== false;
        elements.bgmPlayer.volume = gameState.settings.musicVolume / 100;
        elements.bgmPlayer.play().catch(function() {});
    }
}

function stopAudio() {
    if (elements.bgmPlayer) {
        elements.bgmPlayer.pause();
        elements.bgmPlayer.currentTime = 0;
    }
}

// ============ ПОЛНОЭКРАННЫЙ РЕЖИМ ============

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (elements.gameContainer) {
        elements.gameContainer.requestFullscreen();
    }
}

// ============ ОТЛАДКА ============

window.gameDebug = {
    getState: function() { return gameState; },
    getData: function() { return GAME_DATA; },
    jump: function(scene, node) {
        gameState.currentScene = scene;
        playScene(scene, node);
    },
    setVar: function(name, value) {
        gameState.variables[name] = value;
    },
    getLog: function() { return elements.logText ? elements.logText.value : ''; },
    generateCode: function() { generateTurnCode(); }
};
