/**
 * Движок визуальной новеллы
 * ver. 2.0.1 - Исправленная версия
 */

// Глобальное состояние игры
const gameState = {
    currentScene: 'start',
    currentStep: 0,
    isTyping: false,
    typingComplete: false,
    autoMode: false,
    skipMode: false,
    variables: {},
    history: [],
    settings: {
        musicVolume: 50,
        sfxVolume: 70,
        textSpeed: 30
    }
};

// Кэш ассетов
const assetCache = {
    backgrounds: {},
    characters: {},
    audio: {}
};

// Элементы DOM
const elements = {
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
    sfxPlayer: document.getElementById('sfx-player')
};

// Таймеры
let typingTimer = null;

/**
 * Инициализация игры
 */
function initGame() {
    console.log('Инициализация движка...');
    
    setupEventListeners();
    loadSettings();
    checkSaveData();
    
    console.log('Движок готов. Сцены:', Object.keys(gameData.scenes || {}));
    showNotification('Движок загружен!');
}

/**
 * Настройка обработчиков событий
 */
function setupEventListeners() {
    // Клик по диалоговому окну
    elements.dialogBox.addEventListener('click', handleDialogClick);
    elements.gameContainer.addEventListener('keydown', handleKeyDown);

    // Кнопки меню
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('continue-game-btn').addEventListener('click', continueGame);
    document.getElementById('settings-btn').addEventListener('click', openSettings);
    document.getElementById('close-settings').addEventListener('click', closeSettings);

    // Панель управления
    document.getElementById('menu-btn').addEventListener('click', toggleMainMenu);
    document.getElementById('save-btn').addEventListener('click', quickSave);
    document.getElementById('load-btn').addEventListener('click', quickLoad);
    document.getElementById('settings-panel-btn').addEventListener('click', openSettings);
    document.getElementById('skip-btn').addEventListener('click', toggleSkipMode);

    // Настройки
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

    // Кнопки концовки
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('back-to-menu-btn').addEventListener('click', backToMenu);

    // Полноэкранный режим
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
            } else if (elements.mainMenu.classList.contains('hidden')) {
                openSettings();
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

    // Небольшая задержка для визуального эффекта
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
    
    var scene = gameData.scenes[sceneId];
    if (!scene) {
        console.error('Сцена "' + sceneId + '" не найдена!');
        console.log('Доступные сцены:', Object.keys(gameData.scenes));
        showNotification('Ошибка: сцена не найдена');
        return;
    }

    gameState.currentScene = sceneId;
    gameState.currentStep = 0;
    gameState.history = [];

    executeStep(sceneId, 0);
}

/**
 * Выполнение шага сцены
 */
function executeStep(sceneId, stepIndex) {
    var scene = gameData.scenes[sceneId];
    if (!scene || stepIndex >= scene.length) {
        console.log('Сцена "' + sceneId + '" завершена');
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
            break;

        default:
            console.warn('Неизвестный тип шага: ' + step.type);
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

    if (gameState.currentStep >= gameData.scenes[scene].length) {
        console.log('Сцена "' + scene + '" завершена');
        return;
    }

    executeStep(scene, gameState.currentStep);
}

/**
 * Смена фона
 */
function changeBackground(src) {
    console.log('Смена фона на:', src);
    
    // Если src это ключ ассета, пробуем загрузить
    if (gameData.assets && gameData.assets.backgrounds && gameData.assets.backgrounds[src]) {
        elements.backgroundImage.src = gameData.assets.backgrounds[src];
    } else {
        // Используем напрямую (заглушка или путь)
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
    console.log('Показать персонажа:', charId, position, emotion);
    
    var key = emotion ? charId + '_' + emotion : charId;
    var src = charId; // По умолчанию используем как путь

    // Пробуем найти в ассетах
    if (gameData.assets && gameData.assets.characters) {
        if (gameData.assets.characters[key]) {
            src = gameData.assets.characters[key];
        } else if (gameData.assets.characters[charId]) {
            src = gameData.assets.characters[charId];
        }
    }

    var slot = getCharacterSlot(position);
    if (!slot) return;

    // Создаём изображение персонажа
    var img = document.createElement('img');
    img.src = src;
    img.alt = charId;
    img.style.display = 'none';
    img.onload = function() {
        img.style.display = 'block';
    };
    
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
    setTimeout(function() {
        slot.innerHTML = '';
    }, 400);
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
            if (option.text) {
                gameState.history.push({
                    type: 'choice',
                    text: option.text,
                    jump: option.jump
                });
            }

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
            var variable = match[1];
            var operator = match[2];
            var value = match[3];
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
        console.warn('Ошибка проверки условия:', condition, e);
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
    
    elements.bgmPlayer.play().catch(function(err) {
        console.log('Не удалось воспроизвести аудио:', src);
    });
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

    playScene(gameState.currentScene);

    showNotification('Игра загружена');
    return true;
}

/**
 * Быстрое сохранение
 */
function quickSave() {
    saveGame();
}

/**
 * Быстрая загрузка
 */
function quickLoad() {
    if (!loadGame()) {
        if (elements.mainMenu.classList.contains('hidden')) {
            toggleMainMenu();
        }
    }
}

/**
 * Сброс игры
 */
function resetGame() {
    localStorage.removeItem('visualNovelSave');
    showNotification('Сохранение удалено');
    closeSettings();
}

/**
 * Перезапуск игры
 */
function restartGame() {
    elements.endingScreen.classList.add('hidden');
    startGame();
}

/**
 * Возврат в меню
 */
function backToMenu() {
    elements.endingScreen.classList.add('hidden');
    stopAudio();
    elements.mainMenu.classList.remove('hidden');
    elements.controlPanel.classList.remove('visible');
}

/**
 * Переключение главного меню
 */
function toggleMainMenu() {
    if (elements.mainMenu.classList.contains('hidden')) {
        elements.mainMenu.classList.remove('hidden');
        elements.controlPanel.classList.remove('visible');
    } else {
        elements.mainMenu.classList.add('hidden');
        elements.controlPanel.classList.add('visible');
    }
}

/**
 * Открыть настройки
 */
function openSettings() {
    elements.settingsMenu.classList.remove('hidden');
}

/**
 * Закрыть настройки
 */
function closeSettings() {
    elements.settingsMenu.classList.add('hidden');
}

/**
 * Переключить режим пропуска
 */
function toggleSkipMode() {
    gameState.skipMode = !gameState.skipMode;
    var btn = document.getElementById('skip-btn');
    btn.style.background = gameState.skipMode ? 'rgba(240, 192, 64, 0.5)' : '';
    showNotification(gameState.skipMode ? 'Режим пропуска включён' : 'Режим пропуска выключен');
}

/**
 * Переключение полноэкранного режима
 */
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        elements.gameContainer.requestFullscreen();
    }
}

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

/**
 * Проверка наличия сохранённой игры
 */
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

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Глобальные функции для отладки
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
    }
};
