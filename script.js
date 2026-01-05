/**
 * Движок визуальной новеллы
 * ver. 2.1.0 - С системой логов и передачей данных
 */

// Глобальное состояние игры
var gameState = {
    currentScene: 'start',
    currentStep: 0,
    isTyping: false,
    typingComplete: false,
    autoMode: false,
    skipMode: false,
    variables: {},
    history: [],
    // История всех диалогов и выборов
    storyLog: [],
    // Текущий код сессии (для передачи данных)
    sessionCode: '',
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
var elements = {
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
    settingsMenu: document.getElementById('settings-menu'),
    mainMenu: document.getElementById('main-menu'),
    loadingScreen: document.getElementById('loading-screen'),
    controlPanel: document.getElementById('control-panel'),
    endingScreen: document.getElementById('ending-screen'),
    bgmPlayer: document.getElementById('bgm-player'),
    sfxPlayer: document.getElementById('sfx-player'),
    // Новые элементы для логов
    logPanel: null,
    logContent: null
};

// Таймеры
var typingTimer = null;

/**
 * Добавить запись в историю игры
 */
function addToLog(type, data) {
    var timestamp = new Date().toLocaleTimeString('ru-RU');
    var entry = {
        type: type,
        data: data,
        time: timestamp
    };
    gameState.storyLog.push(entry);
    console.log('[LOG]', type, data);
}

/**
 * Получить текст всей истории
 */
function getStoryLogText() {
    var text = [];
    text.push('=== ИСТОРИЯ ПРОХОЖДЕНИЯ ===');
    text.push('Дата: ' + new Date().toLocaleString('ru-RU'));
    text.push('');
    
    gameState.storyLog.forEach(function(entry, index) {
        if (entry.type === 'dialog') {
            if (entry.data.name) {
                text.push('[' + entry.time + '] ' + entry.data.name + ': ' + entry.data.text);
            } else {
                text.push('[' + entry.time + '] ' + entry.data.text);
            }
        } else if (entry.type === 'choice') {
            text.push('[' + entry.time + '] >>> ВЫБОР: ' + entry.data.text);
        } else if (entry.type === 'scene') {
            text.push('');
            text.push('--- ' + entry.data + ' ---');
        }
    });
    
    text.push('');
    text.push('=== КОНЕЦ ===');
    
    return text.join('\n');
}

/**
 * Показать панель истории
 */
function showLogPanel() {
    // Создаём панель, если её нет
    if (!elements.logPanel) {
        elements.logPanel = document.createElement('div');
        elements.logPanel.id = 'log-panel';
        elements.logPanel.className = 'hidden';
        elements.logPanel.innerHTML = 
            '<div class="log-content">' +
                '<h3>История прохождения</h3>' +
                '<textarea id="log-text" readonly></textarea>' +
                '<div class="log-buttons">' +
                    '<button id="copy-log-btn">Копировать</button>' +
                    '<button id="close-log-btn">Закрыть</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(elements.logPanel);
        
        // Обработчики кнопок
        document.getElementById('copy-log-btn').addEventListener('click', copyLogToClipboard);
        document.getElementById('close-log-btn').addEventListener('click', hideLogPanel);
    }
    
    // Заполняем текстом
    var logText = document.getElementById('log-text');
    logText.value = getStoryLogText();
    
    // Показываем панель
    elements.logPanel.classList.remove('hidden');
}

/**
 * Скрыть панель истории
 */
function hideLogPanel() {
    if (elements.logPanel) {
        elements.logPanel.classList.add('hidden');
    }
}

/**
 * Копировать логи в буфер обмена
 */
function copyLogToClipboard() {
    var logText = document.getElementById('log-text');
    logText.select();
    document.execCommand('copy');
    showNotification('История скопирована в буфер обмена!');
}

/**
 * Сгенерировать код передачи данных
 */
function generateTransferCode() {
    var transferData = {
        version: '1.0',
        timestamp: Date.now(),
        variables: gameState.variables,
        history: gameState.history,
        log: gameState.storyLog.slice(-10) // Последние 10 записей лога
    };
    
    var code = btoa(encodeURIComponent(JSON.stringify(transferData)));
    gameState.sessionCode = code;
    
    return code;
}

/**
 * Получить данные из кода
 */
function parseTransferCode(code) {
    try {
        var decoded = JSON.parse(decodeURIComponent(atob(code)));
        return decoded;
    } catch (e) {
        console.error('Ошибка разбора кода:', e);
        return null;
    }
}

/**
 * Показать модальное окно передачи данных
 */
function showTransferModal() {
    var modal = document.getElementById('transfer-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'transfer-modal';
        modal.className = 'hidden';
        modal.innerHTML = 
            '<div class="transfer-content">' +
                '<h3>Передача данных</h3>' +
                '<p>Вставьте код ниже или скопируйте свой код для передачи:</p>' +
                '<textarea id="transfer-input" placeholder="Вставьте код сюда..."></textarea>' +
                '<div class="transfer-buttons">' +
                    '<button id="generate-code-btn">Создать код</button>' +
                    '<button id="import-code-btn">Импортировать</button>' +
                    '<button id="close-transfer-btn">Закрыть</button>' +
                '</div>' +
                '<div id="generated-code" class="hidden"></div>' +
            '</div>';
        document.body.appendChild(modal);
        
        document.getElementById('generate-code-btn').addEventListener('click', function() {
            var code = generateTransferCode();
            var codeDiv = document.getElementById('generated-code');
            codeDiv.innerHTML = '<p>Ваш код:</p><textarea readonly>' + code + '</textarea>';
            codeDiv.classList.remove('hidden');
            showNotification('Код сгенерирован!');
        });
        
        document.getElementById('import-code-btn').addEventListener('click', function() {
            var inputCode = document.getElementById('transfer-input').value.trim();
            if (inputCode) {
                var data = parseTransferCode(inputCode);
                if (data) {
                    // Применяем данные
                    if (data.variables) {
                        gameState.variables = Object.assign(gameState.variables, data.variables);
                    }
                    if (data.history && data.history.length > 0) {
                        gameState.history = data.history;
                    }
                    if (data.log) {
                        data.log.forEach(function(entry) {
                            gameState.storyLog.push(entry);
                        });
                    }
                    showNotification('Данные импортированы!');
                    modal.classList.add('hidden');
                } else {
                    showNotification('Ошибка: неверный код');
                }
            } else {
                showNotification('Вставьте код!');
            }
        });
        
        document.getElementById('close-transfer-btn').addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    }
    
    modal.classList.remove('hidden');
    document.getElementById('transfer-input').value = '';
    document.getElementById('generated-code').classList.add('hidden');
}

/**
 * Инициализация игры
 */
function initGame() {
    console.log('Инициализация движка...');
    
    setupEventListeners();
    loadSettings();
    checkSaveData();
    
    // Скрыть экран загрузки и показать главное меню
    elements.loadingScreen.classList.add('hidden');
    elements.mainMenu.classList.remove('hidden');
    
    console.log('Движок готов. Сцены:', Object.keys(gameData.scenes || {}));
    showNotification('Движок загружен!');
    
    // Добавляем кнопки логов и передачи в панель управления
    addControlButtons();
}

/**
 * Добавить кнопки в панель управления
 */
function addControlButtons() {
    var panel = document.getElementById('control-panel');
    
    // Кнопка истории
    var logBtn = document.createElement('button');
    logBtn.id = 'log-btn';
    logBtn.title = 'История';
    logBtn.innerHTML = '📖';
    logBtn.addEventListener('click', showLogPanel);
    panel.insertBefore(logBtn, panel.firstChild);
    
    // Кнопка передачи данных
    var transferBtn = document.createElement('button');
    transferBtn.id = 'transfer-btn';
    transferBtn.title = 'Передать данные';
    transferBtn.innerHTML = '🔗';
    transferBtn.addEventListener('click', showTransferModal);
    panel.insertBefore(transferBtn, panel.firstChild);
}

/**
 * Настройка обработчиков событий
 */
function setupEventListeners() {
    elements.dialogBox.addEventListener('click', handleDialogClick);
    elements.gameContainer.addEventListener('keydown', handleKeyDown);

    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('continue-game-btn').addEventListener('click', continueGame);
    document.getElementById('settings-btn').addEventListener('click', openSettings);
    document.getElementById('close-settings').addEventListener('click', closeSettings);

    document.getElementById('menu-btn').addEventListener('click', toggleMainMenu);
    document.getElementById('save-btn').addEventListener('click', quickSave);
    document.getElementById('load-btn').addEventListener('click', quickLoad);
    document.getElementById('settings-panel-btn').addEventListener('click', openSettings);
    document.getElementById('skip-btn').addEventListener('click', toggleSkipMode);

    document.getElementById('music-volume').addEventListener('input', updateMusicVolume);
    document.getElementById('sfx-volume').addEventListener('input', updateSfxVolume);
    document.getElementById('text-speed').addEventListener('input', updateTextSpeed);
    document.getElementById('save-game-btn').addEventListener('click', function() {
        saveGame();
        showNotification('Игра сохранена');
    });
    document.getElementById('load-game-btn').addEventListener('click', function() {
        loadGame();
        closeSettings();
        showNotification('Игра загружена');
    });
    document.getElementById('reset-game-btn').addEventListener('click', resetGame);

    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('back-to-menu-btn').addEventListener('click', backToMenu);

    elements.gameContainer.addEventListener('dblclick', toggleFullscreen);
}

/**
 * Обработка клика по диалогу
 */
function handleDialogClick() {
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
    switch (e.key) {
        case ' ':
        case 'Enter':
            e.preventDefault();
            handleDialogClick();
            break;
        case 'Escape':
            if (!elements.settingsMenu.classList.contains('hidden')) {
                closeSettings();
            } else if (!elements.logPanel || elements.logPanel.classList.contains('hidden')) {
                if (elements.mainMenu.classList.contains('hidden')) {
                    openSettings();
                }
            }
            break;
        case 's':
        case 'S':
            if (!e.ctrlKey) {
                quickSave();
            }
            break;
        case 'l':
        case 'L':
            if (!e.ctrlKey) {
                quickLoad();
            }
            break;
    }
}

/**
 * Начало игры
 */
function startGame() {
    console.log('Начало игры...');
    
    elements.mainMenu.classList.add('hidden');
    elements.loadingScreen.classList.remove('hidden');

    // Сброс состояния
    gameState.currentScene = 'start';
    gameState.currentStep = 0;
    gameState.variables = {};
    gameState.history = [];
    gameState.storyLog = [];
    
    addToLog('scene', 'Начало игры');

    setTimeout(function() {
        elements.loadingScreen.classList.add('hidden');
        elements.controlPanel.classList.add('visible');
        playScene('start');
    }, 500);
}

/**
 * Продолжение сохранённой игры
 */
function continueGame() {
    if (localStorage.getItem('visualNovelSave')) {
        loadGame();
    } else {
        showNotification('Нет сохранённой игры');
    }
}

/**
 * Воспроизведение сцены
 */
function playScene(sceneId) {
    console.log('Воспроизведение сцены:', sceneId);
    
    addToLog('scene', 'Сцена: ' + sceneId);
    
    var scene = gameData.scenes[sceneId];
    if (!scene) {
        console.error('Сцена "' + sceneId + '" не найдена!');
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
    console.log('Выполнение шага:', step.type);

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
            // Записываем в лог
            addToLog('dialog', { name: step.name, text: step.text });
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
            setVariable(step.name, step.value);
            nextStep();
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
            addToLog('dialog', { name: '', text: step.title + ': ' + step.text });
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
 * Показать диалог
 */
function showDialog(name, text) {
    gameState.isTyping = true;
    gameState.typingComplete = false;

    elements.speakerName.textContent = name || '';
    elements.dialogText.textContent = '';
    elements.dialogText.classList.add('text-typing');
    elements.nextIndicator.style.display = 'none';

    var speed = Math.max(10, 101 - gameState.settings.textSpeed);
    var charIndex = 0;

    function typeChar() {
        if (charIndex < text.length) {
            elements.dialogText.textContent += text.charAt(charIndex);
            charIndex++;
            typingTimer = setTimeout(typeChar, speed);
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
    clearTimeout(typingTimer);
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
            // Записываем выбор в историю и лог
            gameState.history.push({
                type: 'choice',
                text: option.text,
                jump: option.jump
            });
            addToLog('choice', { text: option.text, jump: option.jump });
            
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
function setVariable(name, value) {
    gameState.variables[name] = value;
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

/**
 * Показать экран концовки
 */
function showEnding(title, text) {
    elements.endingScreen.classList.remove('hidden');
    document.getElementById('ending-title').textContent = title || 'Конец';
    document.getElementById('ending-text').textContent = text || '';
}

/**
 * Управление настройками
 */
function loadSettings() {
    var saved = localStorage.getItem('visualNovelSettings');
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
    localStorage.setItem('visualNovelSettings', JSON.stringify(gameState.settings));
}

/**
 * Сохранение и загрузка игры
 */
function saveGame() {
    var saveData = {
        scene: gameState.currentScene,
        step: gameState.currentStep,
        variables: gameState.variables,
        history: gameState.history,
        storyLog: gameState.storyLog,
        timestamp: Date.now()
    };
    localStorage.setItem('visualNovelSave', JSON.stringify(saveData));
    showNotification('Игра сохранена');
}

function loadGame() {
    var saved = localStorage.getItem('visualNovelSave');
    if (!saved) {
        showNotification('Нет сохранённой игры');
        return false;
    }
    var saveData = JSON.parse(saved);
    gameState.currentScene = saveData.scene;
    gameState.currentStep = saveData.step;
    gameState.variables = saveData.variables || {};
    gameState.history = saveData.history || [];
    gameState.storyLog = saveData.storyLog || [];
    playScene(gameState.currentScene);
    showNotification('Игра загружена');
    return true;
}

function quickSave() { saveGame(); }

function quickLoad() {
    if (!loadGame() && elements.mainMenu.classList.contains('hidden')) {
        toggleMainMenu();
    }
}

function resetGame() {
    localStorage.removeItem('visualNovelSave');
    showNotification('Сохранение удалено');
    closeSettings();
}

function restartGame() {
    elements.endingScreen.classList.add('hidden');
    startGame();
}

function backToMenu() {
    elements.endingScreen.classList.add('hidden');
    stopAudio();
    elements.mainMenu.classList.remove('hidden');
    elements.controlPanel.classList.remove('visible');
}

function toggleMainMenu() {
    if (elements.mainMenu.classList.contains('hidden')) {
        elements.mainMenu.classList.remove('hidden');
        elements.controlPanel.classList.remove('visible');
    } else {
        elements.mainMenu.classList.add('hidden');
        elements.controlPanel.classList.add('visible');
    }
}

function openSettings() { elements.settingsMenu.classList.remove('hidden'); }
function closeSettings() { elements.settingsMenu.classList.add('hidden'); }

function toggleSkipMode() {
    gameState.skipMode = !gameState.skipMode;
    var btn = document.getElementById('skip-btn');
    btn.style.background = gameState.skipMode ? 'rgba(240, 192, 64, 0.5)' : '';
    showNotification(gameState.skipMode ? 'Режим пропуска включён' : 'Режим пропуска выключен');
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        elements.gameContainer.requestFullscreen();
    }
}

function showNotification(message) {
    var notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(function() { notification.classList.remove('show'); }, 2000);
}

function checkSaveData() {
    var saved = localStorage.getItem('visualNovelSave');
    var continueBtn = document.getElementById('continue-game-btn');
    if (saved) {
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
    } else {
        continueBtn.disabled = true;
        continueBtn.style.opacity = '0.5';
    }
}

document.addEventListener('DOMContentLoaded', initGame);

window.gameDebug = {
    getState: function() { return gameState; },
    getData: function() { return gameData; },
    jump: function(scene, step) {
        gameState.currentScene = scene;
        gameState.currentStep = step;
        playScene(scene);
    },
    setVar: function(name, value) {
        gameState.variables[name] = value;
    },
    clearSave: function() {
        localStorage.removeItem('visualNovelSave');
        showNotification('Сохранение очищено');
    },
    getLog: function() { return getStoryLogText(); },
    generateCode: function() { return generateTransferCode(); },
    importCode: function(code) {
        var data = parseTransferCode(code);
        if (data && data.variables) {
            gameState.variables = Object.assign(gameState.variables, data.variables);
            return true;
        }
        return false;
    }
};
