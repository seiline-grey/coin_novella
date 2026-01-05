/**
 * Движок визуальной новеллы - Многопользовательский режим
 * ver. 3.0.0
 * Система поочерёдной игры с передачей хода через коды
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
    currentStep: 0,
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

// Кэш ассетов
var assetCache = {
    backgrounds: {},
    characters: {},
    audio: {}
};

// Элементы DOM
var elements = {};

// Данные игры (из data.js)
var gameData = GAME_DATA;

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
    roleButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var role = parseInt(this.getAttribute('data-role'));
            startNewGame(role);
        });
    });

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
    screens.forEach(function(screen) {
        screen.classList.add('hidden');
    });
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
    gameState.currentStep = 0;
    gameState.variables = {};
    gameState.history = [];
    gameState.storyLog = [];
    gameState.turnCount = 0;
    gameState.choiceCount = 0;

    showScreen('screen-gameplay');
    elements.controlPanel.classList.add('visible');
    elements.turnIndicator.classList.add('visible');

    updateTurnIndicator();
    addToLog('system', 'Начало новой игры. Игрок ' + playerRole + ' начинает.');

    playScene('start');
}

/**
 * Обновление индикатора хода
 */
function updateTurnIndicator() {
    elements.currentPlayerSpan.textContent = 'Игрок ' + gameState.currentPlayer;
}

/**
 * Воспроизведение сцены
 */
function playScene(sceneId) {
    var scene = gameData.scenes[sceneId];
    if (!scene) {
        console.error('Сцена не найдена: ' + sceneId);
        showNotification('Ошибка: сцена не найдена');
        return;
    }

    gameState.currentScene = sceneId;
    gameState.currentStep = 0;

    executeStep(sceneId, 0);
}

/**
 * Выполнение шага сцены
 */
function executeStep(sceneId, stepIndex) {
    var scene = gameData.scenes[sceneId];
    if (!scene || stepIndex >= scene.length) {
        return;
    }

    var step = scene[stepIndex];

    switch (step.type) {
        case 'bg':
            changeBackground(step.src);
            nextStep();
            break;

        case 'show':
            showCharacter(step.char, step.pos, step.emotion);
            nextStep();
            break;

        case 'hide':
            hideCharacter(step.pos);
            nextStep();
            break;

        case 'say':
            showDialog(step.name, step.text);
            break;

        case 'choice':
            showChoices(step.options);
            break;

        case 'jump':
            playScene(step.to);
            break;

        case 'play':
            playAudio(step.src, step.loop !== false);
            nextStep();
            break;

        case 'stop':
            stopAudio();
            nextStep();
            break;

        case 'set':
            setVariable(step.name, step.operator, step.value);
            nextStep();
            break;

        case 'add':
            addToVariable(step.name, step.value);
            nextStep();
            break;

        case 'subtract':
            subtractFromVariable(step.name, step.value);
            nextStep();
            break;

        case 'roll':
            rollDice(step.name, step.min || 1, step.max || 6, step.text);
            break;

        case 'if':
            if (checkCondition(step.condition)) {
                playScene(step.to);
            } else if (step.else) {
                playScene(step.else);
            } else {
                nextStep();
            }
            break;

        case 'wait':
            setTimeout(nextStep, step.duration || 1000);
            break;

        case 'ending':
            showEnding(step.title, step.text);
            break;

        case 'endTurn':
            gameState.turnCount++;
            addToLog('system', 'Ход игрока ' + gameState.currentPlayer + ' завершён.');
            generateTurnCode(step.nextPlayer, step.nextScene);
            break;

        default:
            nextStep();
    }
}

/**
 * Переход к следующему шагу
 */
function nextStep() {
    gameState.currentStep++;
    var scene = gameState.currentScene;
    if (!gameData.scenes[scene]) return;
    if (gameState.currentStep >= gameData.scenes[scene].length) return;
    executeStep(scene, gameState.currentStep);
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

    elements.speakerName.textContent = name || '';
    elements.dialogText.textContent = '';
    elements.dialogText.classList.add('text-typing');
    elements.nextIndicator.style.display = 'none';

    addToLog('dialog', { name: name, text: text });

    var speed = Math.max(10, 101 - gameState.settings.textSpeed);
    var charIndex = 0;

    function typeChar() {
        if (charIndex < text.length) {
            elements.dialogText.textContent += text.charAt(charIndex);
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

    var scene = gameData.scenes[gameState.currentScene];
    var step = scene && scene[gameState.currentStep];

    if (step && step.type === 'say') {
        elements.dialogText.textContent = step.text;
    }

    gameState.isTyping = false;
    gameState.typingComplete = true;
    elements.dialogText.classList.remove('text-typing');
    elements.nextIndicator.style.display = 'block';
}

/**
 * Показать варианты выбора
 */
function showChoices(options) {
    elements.choiceContainer.innerHTML = '';
    elements.choiceMenu.classList.remove('hidden');

    options.forEach(function(option) {
        if (option.condition && !checkCondition(option.condition)) {
            return;
        }

        var btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = option.text;
        btn.addEventListener('click', function() {
            gameState.choiceCount++;
            gameState.history.push({
                player: gameState.currentPlayer,
                text: option.text,
                scene: option.jump
            });
            addToLog('choice', { player: gameState.currentPlayer, text: option.text });

            hideChoices();
            playScene(option.jump);
        });

        elements.choiceContainer.appendChild(btn);
    });
}

/**
 * Скрыть меню выбора
 */
function hideChoices() {
    elements.choiceMenu.classList.add('hidden');
    elements.choiceContainer.innerHTML = '';
}

/**
 * Проверка условия
 */
function checkCondition(condition) {
    try {
        var match = condition.match(/(\w+)\s*(==|!=|>|<|>=|<=)\s*(.+)/);
        if (match) {
            var variable = match[1], operator = match[2], value = match[3];
            var varValue = gameState.variables[variable];
            var numValue = parseFloat(value);

            switch (operator) {
                case '==': return varValue == numValue;
                case '!=': return varValue != numValue;
                case '>': return varValue > numValue;
                case '<': return varValue < numValue;
                case '>=': return varValue >= numValue;
                case '<=': return varValue <= numValue;
            }
        }
        if (condition.charAt(0) === '!') {
            return !gameState.variables[condition.slice(1)];
        }
        return !!gameState.variables[condition];
    } catch (e) {
        return false;
    }
}

/**
 * Установка переменной
 */
function setVariable(name, operator, value) {
    var currentValue = gameState.variables[name] || 0;

    switch (operator) {
        case '=':
            gameState.variables[name] = value;
            break;
        case '+=':
            gameState.variables[name] = currentValue + value;
            break;
        case '-=':
            gameState.variables[name] = currentValue - value;
            break;
        case '*=':
            gameState.variables[name] = currentValue * value;
            break;
        case '/=':
            gameState.variables[name] = currentValue / value;
            break;
        case '++':
            gameState.variables[name] = currentValue + 1;
            break;
        case '--':
            gameState.variables[name] = currentValue - 1;
            break;
        default:
            gameState.variables[name] = value;
    }

    addToLog('system', 'Переменная ' + name + ' = ' + gameState.variables[name]);
}

/**
 * Добавить значение к переменной
 */
function addToVariable(name, value) {
    var currentValue = gameState.variables[name] || 0;
    gameState.variables[name] = currentValue + value;
    addToLog('system', name + ' + ' + value + ' = ' + gameState.variables[name]);
}

/**
 * Вычесть значение из переменной
 */
function subtractFromVariable(name, value) {
    var currentValue = gameState.variables[name] || 0;
    gameState.variables[name] = currentValue - value;
    addToLog('system', name + ' - ' + value + ' = ' + gameState.variables[name]);
}

/**
 * Бросить кубик (случайное число)
 */
function rollDice(variableName, min, max, customText) {
    var result = Math.floor(Math.random() * (max - min + 1)) + min;

    if (variableName) {
        gameState.variables[variableName] = result;
        addToLog('system', 'Кубик брошен: ' + variableName + ' = ' + result + ' (' + min + '-' + max + ')');
    }

    var text = customText || 'Кубик показывает: ' + result;

    if (gameData.scenes && gameData.scenes.start && gameData.scenes.start.nodes) {
        showDialog('Система', text + ' (Результат сохранён в переменную ' + variableName + ')');
    }
}

/**
 * Смена фона
 */
function changeBackground(src) {
    if (gameData.assets && gameData.assets.backgrounds && gameData.assets.backgrounds[src]) {
        elements.backgroundImage.src = gameData.assets.backgrounds[src];
    } else {
        elements.backgroundImage.src = src;
    }
    elements.backgroundImage.onload = function() {
        elements.backgroundImage.classList.add('loaded');
    };
}

/**
 * Показать персонажа
 */
function showCharacter(charId, position, emotion) {
    var key = emotion ? charId + '_' + emotion : charId;
    var src = charId;

    if (gameData.assets && gameData.assets.characters) {
        if (gameData.assets.characters[key]) {
            src = gameData.assets.characters[key];
        } else if (gameData.assets.characters[charId]) {
            src = gameData.assets.characters[charId];
        }
    }

    var slot = getCharacterSlot(position);
    if (!slot) return;

    var img = document.createElement('img');
    img.src = src;
    img.alt = charId;
    img.style.display = 'none';
    img.onload = function() { img.style.display = 'block'; };

    slot.innerHTML = '';
    slot.appendChild(img);
    slot.classList.add('visible');
}

/**
 * Скрыть персонажа
 */
function hideCharacter(position) {
    var slot = getCharacterSlot(position);
    if (!slot) return;
    slot.classList.remove('visible');
    setTimeout(function() { slot.innerHTML = ''; }, 400);
}

/**
 * Получить слот персонажа
 */
function getCharacterSlot(position) {
    switch (position) {
        case 'left': return elements.characterLeft;
        case 'center': return elements.characterCenter;
        case 'right': return elements.characterRight;
        default: return null;
    }
}

/**
 * Воспроизведение аудио
 */
function playAudio(key, loop) {
    var src = key;
    if (gameData.assets && gameData.assets.audio && gameData.assets.audio[key]) {
        src = gameData.assets.audio[key];
    }
    elements.bgmPlayer.src = src;
    elements.bgmPlayer.loop = loop !== false;
    elements.bgmPlayer.volume = gameState.settings.musicVolume / 100;
    elements.bgmPlayer.play().catch(function() {});
}

/**
 * Остановка аудио
 */
function stopAudio() {
    elements.bgmPlayer.pause();
    elements.bgmPlayer.currentTime = 0;
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

    document.getElementById('next-player-num').textContent = nextPlayerNum;
    elements.generatedCodeTextarea.value = readableCode.trim();
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
        gameState.variables = data.variables || {};
        gameState.turnCount = data.turnCount || 0;
        gameState.choiceCount = data.choiceCount || 0;
        gameState.history = data.history || [];
        gameState.storyLog = data.log || [];

        showScreen('screen-gameplay');
        elements.controlPanel.classList.add('visible');
        elements.turnIndicator.classList.add('visible');
        updateTurnIndicator();

        addToLog('system', 'Игрок ' + data.player + ' принял ход.');

        playScene(data.scene);

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
    elements.codeError.textContent = message;
    elements.codeError.classList.remove('hidden');
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

    gameState.storyLog.forEach(function(entry) {
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
    });

    text.push('');
    text.push('=== КОНЕЦ ===');

    elements.logText.value = text.join('\n');
    elements.logTurnCount.textContent = 'Ходов: ' + gameState.turnCount;
    elements.logPlayerCount.textContent = 'Выборов: ' + gameState.choiceCount;
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
        currentStep: gameState.currentStep,
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
        gameState.currentStep = saveData.currentStep || 0;
        gameState.variables = saveData.variables || {};
        gameState.history = saveData.history || [];
        gameState.storyLog = saveData.storyLog || [];
        gameState.turnCount = saveData.turnCount || 0;
        gameState.choiceCount = saveData.choiceCount || 0;

        showScreen('screen-gameplay');
        elements.controlPanel.classList.add('visible');
        elements.turnIndicator.classList.add('visible');
        updateTurnIndicator();

        playScene(gameState.currentScene);

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
    elements.controlPanel.classList.remove('visible');
    elements.turnIndicator.classList.remove('visible');
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

    elements.endingTitle.textContent = title || 'Конец';
    elements.endingText.textContent = text || '';
    elements.statTurns.textContent = gameState.turnCount;
    elements.statChoices.textContent = gameState.choiceCount;

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
        gameState.settings = Object.assign(gameState.settings, settings);
    }

    document.getElementById('music-volume').value = gameState.settings.musicVolume;
    document.getElementById('sfx-volume').value = gameState.settings.sfxVolume;
    document.getElementById('text-speed').value = gameState.settings.textSpeed;
    document.getElementById('music-volume-value').textContent = gameState.settings.musicVolume + '%';
    document.getElementById('sfx-volume-value').textContent = gameState.settings.sfxVolume + '%';
    document.getElementById('text-speed-value').textContent = gameState.settings.textSpeed;

    elements.bgmPlayer.volume = gameState.settings.musicVolume / 100;
    elements.sfxPlayer.volume = gameState.settings.sfxVolume / 100;
}

function updateMusicVolume(e) {
    gameState.settings.musicVolume = parseInt(e.target.value);
    document.getElementById('music-volume-value').textContent = e.target.value + '%';
    elements.bgmPlayer.volume = e.target.value / 100;
    saveSettings();
}

function updateSfxVolume(e) {
    gameState.settings.sfxVolume = parseInt(e.target.value);
    document.getElementById('sfx-volume-value').textContent = e.target.value + '%';
    elements.sfxPlayer.volume = e.target.value / 100;
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

// ============ ПОЛНОЭКРАННЫЙ РЕЖИМ ============

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        elements.gameContainer.requestFullscreen();
    }
}

// ============ ОТЛАДКА ============

window.gameDebug = {
    getState: function() { return gameState; },
    getData: function() { return gameData; },
    jump: function(scene) {
        gameState.currentScene = scene;
        playScene(scene);
    },
    setVar: function(name, value) {
        gameState.variables[name] = value;
    },
    getLog: function() { return elements.logText.value; },
    generateCode: function() { generateTurnCode(); }
};
