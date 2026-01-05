/**
 * ДАННЫЕ ИГРЫ - СЦЕНАРИЙ И КОНФИГУРАЦИЯ
 * ver. 3.1
 * Редактируйте этот файл для создания своей истории!
 */

var GAME_DATA = {
    settings: {
        gameTitle: "Тайна Забытого Леса",
        authorName: "Автор",
        defaultFont: "16px sans-serif",
        bgTransitionSpeed: 500,
        textSpeed: 30,
        enableAutoSave: true,
        autoSaveInterval: 30000
    },

    variables: {
        coins: 10,
        trust_level: 0,
        secrets_revealed: 0,
        final_choice: 0,
        chapter: 1,
        path_choice: 0
    },

    characters: {
        narrator: { name: "", color: "#888888" },
        hero: { name: "Странник", color: "#4a90d9" },
        guide: { name: "Хранитель", color: "#9b59b6" },
        mystery: { name: "Незнакомец", color: "#e74c3c" }
    },

    locations: {
        forest_entrance: { name: "Вход в лес", image: "" },
        ancient_ruins: { name: "Древние руины", image: "" },
        hidden_glade: { name: "Скрытая поляна", image: "" },
        dark_path: { name: "Тёмная тропа", image: "" }
    },

    scenes: {
        start: {
            title: "Начало игры",
            nodes: {
                role_intro: {
                    text: "Добро пожаловать в 'Тайну Забытого Леса'!\n\nЭто история о двух путниках, которые встретились у входа в древний лес.\n\nВыберите, за кого вы хотите играть:",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        { text: "Я буду играть за СТРАННИКА (Игрок 1)", nextNode: "p1_intro", action: { setPlayer: 1 } },
                        { text: "Я буду играть за ХРАНИТЕЛЯ (Игрок 2)", nextNode: "p2_intro", action: { setPlayer: 2 } }
                    ]
                },

                p1_intro: {
                    text: "Вы - Странник, пришедший издалека. Лес манит вас, но вы чувствуете, что идти одному будет опасно.\n\nВдалеке вы видите фигуру в синих одеяниях.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [ { text: "Подойти к Хранителю", nextNode: "meet_guide" } ]
                },

                p2_intro: {
                    text: "Вы - Хранитель, страж древних тайн. У входа в лес стоит незнакомец в дорожном плаще.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [ { text: "Выйти навстречу незнакомцу", nextNode: "meet_hero" } ]
                },

                meet_guide: {
                    text: "- Здравствуй, путник, - говорит Хранитель. - Я вижу, ты ищешь путь через мой лес.\n\n- Да, - отвечаете вы. - Мне нужно попасть на другую сторону.",
                    speaker: "guide",
                    location: "forest_entrance",
                    choices: [ { text: "Спросить, что нужно делать", nextNode: "first_challenge_intro" } ]
                },

                meet_hero: {
                    text: "- Стой, путник, - произносите вы. - Не многие осмеливаются входить в этот лес.\n\n- У меня нет выбора, - отвечает незнакомец. - Мой путь лежит через него.",
                    speaker: "hero",
                    location: "forest_entrance",
                    choices: [ { text: "Рассказать о своей цели", nextNode: "first_challenge_intro" } ]
                },

                first_challenge_intro: {
                    text: "Хранитель указывает на развилку впереди: 'В лесу три пути. Один ведёт к руинам, другой - в тёмную чащу, третий - к скрытой поляне.\n\nВыбери, куда направимся.'\n\nВремя передать ход. Сгенерируйте код и передайте его другому игроку.",
                    speaker: "guide",
                    location: "forest_entrance",
                    endTurn: true,
                    nextPlayer: 2,
                    choices: [ { text: "Сгенерировать код и передать ход", nextNode: "waiting_for_code" } ]
                },

                waiting_for_code: {
                    text: "Ожидание кода от другого игрока...\n\nПередайте сгенерированный код другому игроку.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isWaitingPoint: true,
                    choices: [ { text: "Ввести код от другого игрока", nextNode: "code_input" } ]
                },

                code_input: {
                    text: "Введите код, полученный от другого игрока, чтобы продолжить историю.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isCodeInput: true,
                    choices: [ { text: "Назад", nextNode: "waiting_for_code" } ]
                },

                path_selection: {
                    text: "Вы получили код и готовы продолжить.\n\nПеред вами развилка. Куда направитесь?\n\nНа камне написаны три слова: 'РУИНЫ', 'ТЬМА', 'СВЕТ'.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        { text: "Направиться к РУИНАМ", nextNode: "go_ruins", action: { setVar: { path_choice: 1 } } },
                        { text: "Направиться в ТЬМУ", nextNode: "go_darkness", action: { setVar: { path_choice: 2 } } },
                        { text: "Пойти к СВЕТУ", nextNode: "go_light", action: { setVar: { path_choice: 3 } } }
                    ]
                },

                go_ruins: {
                    text: "Вы идёте через заросли кустарника и выходите к древним каменным руинам.\n\nВ центре развалин вы замечаете странный камень с вырезанными символами.",
                    speaker: "narrator",
                    location: "ancient_ruins",
                    choices: [
                        { text: "Осмотреть камень", nextNode: "ruins_stone" },
                        { text: "Обойти руины", nextNode: "continue_path" }
                    ]
                },

                ruins_stone: {
                    text: "Камень мерцает тусклым светом. Символы складываются в слова: 'Тот, кто ищет, да найдёт.'\n\nВы чувствуете, как что-то меняется в вашем сознании...",
                    speaker: "mystery",
                    location: "ancient_ruins",
                    action: { setVar: { secrets_revealed: 1 } },
                    choices: [ { text: "Продолжить путь", nextNode: "continue_path" } ]
                },

                go_darkness: {
                    text: "Тропа уходит вглубь леса, где деревья смыкаются кронами, не пропуская свет.\n\nВдруг вы слышите шёпот: 'Зачем ты пришёл в наши владения?'",
                    speaker: "narrator",
                    location: "dark_path",
                    choices: [
                        { text: "Спросить, кто говорит", nextNode: "darkness_whisper" },
                        { text: "Идти вперёд", nextNode: "continue_path" }
                    ]
                },

                darkness_whisper: {
                    text: "Тени вокруг вас сгущаются, формируя очертания существа. 'Я - Хранитель Тьмы. Ты пришёл забрать то, что принадлежит свету?'",
                    speaker: "mystery",
                    location: "dark_path",
                    choices: [
                        { text: "Нет, я просто ищу дорогу", nextNode: "darkness_answer_1" },
                        { text: "Я ищу древнюю тайну", nextNode: "darkness_answer_2" }
                    ]
                },

                darkness_answer_1: {
                    text: "Тень фыркает. 'Все так говорят. Но дорога одна - через терпение.'\n\nВы чувствуете, как тьма вокруг рассеивается...",
                    speaker: "mystery",
                    location: "dark_path",
                    action: { setVar: { trust_level: 1 } },
                    choices: [ { text: "Продолжить", nextNode: "continue_path" } ]
                },

                darkness_answer_2: {
                    text: "Существо усмехается. 'Тайны имеют цену. Готов ли ты заплатить?'\n\nВ руках тени появляется древняя монета.",
                    speaker: "mystery",
                    location: "dark_path",
                    choices: [
                        { text: "Взять монету", nextNode: "take_coin" },
                        { text: "Отказаться", nextNode: "refuse_coin" }
                    ]
                },

                take_coin: {
                    text: "Монета холодная, почти ледяная. На ней выбит странный символ.\n\n'Теперь ты связан, - шепчет тень. - До следующей встречи.'",
                    speaker: "mystery",
                    location: "dark_path",
                    action: { setVar: { secrets_revealed: 1 } },
                    choices: [ { text: "Продолжить", nextNode: "continue_path" } ]
                },

                refuse_coin: {
                    text: "'Мудрый выбор, - кивает тень. - Не всё золото, что блестит. Иди, твой путь очищен.'\n\nТропа впереди становится светлее.",
                    speaker: "mystery",
                    location: "dark_path",
                    action: { setVar: { trust_level: 1 } },
                    choices: [ { text: "Продолжить", nextNode: "continue_path" } ]
                },

                go_light: {
                    text: "Тропа ведёт вверх, к вершине холма, где среди деревьев открывается чудесная поляна, залитая солнечным светом.\n\nПосреди поляны стоит древний дуб.",
                    speaker: "narrator",
                    location: "hidden_glade",
                    choices: [
                        { text: "Осмотреть кувшин", nextNode: "glade_jug" },
                        { text: "Присесть под деревом", nextNode: "glade_rest" }
                    ]
                },

                glade_jug: {
                    text: "Кувшин из глины, простой, но красивый. Внутри - чистая вода, которая никогда не заканчивается.\n\n'Путник, утоли жажду,' - написано на пьедестале.",
                    speaker: "narrator",
                    location: "hidden_glade",
                    action: { setVar: { trust_level: 1 } },
                    choices: [ { text: "Напиться и продолжить", nextNode: "continue_path" } ]
                },

                glade_rest: {
                    text: "Вы садитесь под могучим дубом и закрываете глаза. Тишина и покой наполняют вас.\n\nСпустя мгновение вы чувствуете, что готовы идти дальше.",
                    speaker: "narrator",
                    location: "hidden_glade",
                    choices: [ { text: "Встать и продолжить путь", nextNode: "continue_path" } ]
                },

                continue_path: {
                    text: "Лес постепенно редеет. Впереди показались стены древнего города.\n\n'Мы почти у цели', - говорит ваш спутник.\n\nНо у входа в город стоит страж.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        { text: "Спросить у стража, какой пароль", nextNode: "ask_guard" },
                        { text: "Попробовать пройти незаметно", nextNode: "sneak_past" }
                    ]
                },

                ask_guard: {
                    text: "- Город закрыт для чужаков, - говорит страж. - Но... если вы выполните мою загадку, я вас впущу.\n\n'Что принадлежит вам, но другие используют чаще?'",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        { text: "Имя", nextNode: "answer_name" },
                        { text: "Деньги", nextNode: "answer_wrong" },
                        { text: "Время", nextNode: "answer_wrong" }
                    ]
                },

                answer_name: {
                    text: "Страж улыбается. 'Правильно. Проходите.'\n\nВорота города открываются перед вами.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    action: { setVar: { trust_level: 2 } },
                    choices: [ { text: "Войти в город", nextNode: "enter_city" } ]
                },

                answer_wrong: {
                    text: "- Неправильно, - качает головой страж. - Попробуйте ещё раз.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        { text: "Попробовать снова", nextNode: "ask_guard" },
                        { text: "Попробовать пройти незаметно", nextNode: "sneak_past" }
                    ]
                },

                sneak_past: {
                    text: "Вы пытаетесь обойти стража, но он замечает вас.\n\n- Эй! Стойте!",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        { text: "Бежать", nextNode: "run_away" },
                        { text: "Остановиться", nextNode: "ask_guard" }
                    ]
                },

                run_away: {
                    text: "Вы убегаете обратно в лес.\n\nВремя передать ход и подумать о новом подходе.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    endTurn: true,
                    nextPlayer: 2,
                    choices: [ { text: "Сгенерировать код", nextNode: "waiting_for_code" } ]
                },

                enter_city: {
                    text: "Вы входите в древний город. Улицы вымощены камнем, дома покрыты плющом.\n\nВ центре города - главная площадь и статуя основателя.\n\n'Мы сделали это,' - говорит ваш спутник. - 'Вместе.'",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        { text: "Продолжить исследование", nextNode: "continue_story" },
                        { text: "Завершить историю", nextNode: "ending_1" }
                    ]
                },

                continue_story: {
                    text: "Перед вами открывается целый мир возможностей.\n\nНо это уже совсем другая история...\n\nСпасибо за игру!",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [ { text: "Вернуться в главное меню", nextNode: "return_menu" } ]
                },

                ending_1: {
                    text: "КОНЕЦ ПЕРВОЙ ЧАСТИ\n\nСекретов раскрыто: {secrets_revealed}\nУровень доверия: {trust_level}",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isEnding: true,
                    choices: [ { text: "Вернуться в главное меню", nextNode: "return_menu" } ]
                },

                return_menu: {
                    text: "Возвращение в главное меню...",
                    speaker: "narrator",
                    location: "forest_entrance",
                    action: { resetGame: true },
                    choices: []
                }
            }
        },

        code: {
            title: "Системная сцена",
            nodes: {
                decode_success: {
                    text: "Код успешно принят! История продолжается...",
                    speaker: "narrator",
                    location: "forest_entrance",
                    autoAdvance: true,
                    autoAdvanceDelay: 2000,
                    choices: []
                },
                decode_error: {
                    text: "Ошибка при чтении кода!\n\nКод повреждён или введён неверно.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        { text: "Ввести код снова", nextNode: "code_input" },
                        { text: "Назад", nextNode: "waiting_for_code" }
                    ]
                },
                generate_code: {
                    text: "Ваш ход завершён! Сгенерируйте этот код и передайте другому игроку:",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isCodeOutput: true,
                    choices: [ { text: "Понял", nextNode: "turn_complete" } ]
                },
                turn_complete: {
                    text: "Ход завершён! Ожидайте код от другого игрока.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isWaitingPoint: true,
                    choices: [ { text: "Ввести код", nextNode: "code_input" } ]
                }
            }
        },

        coin_example: {
            title: "Пример с монетами",
            nodes: {
                start: {
                    text: "ПРИМЕР: СИСТЕМА МОНЕТ\n\nВаши текущие монеты: {coins}\n\nПопробуйте арифметические операции:",
                    speaker: "Система",
                    location: "forest_entrance",
                    choices: [
                        { text: "Найти монету (+1)", nextNode: "found_coin" },
                        { text: "Потратить монету (-1)", nextNode: "spent_coin" },
                        { text: "Удвоить монеты (x2)", nextNode: "double_coins" },
                        { text: "Разделить монеты (/2)", nextNode: "halve_coins" },
                        { text: "Назад", nextNode: "back_to_main" }
                    ]
                },
                found_coin: {
                    text: "Вы нашли блестящую монету на земле!",
                    speaker: "narrator",
                    location: "forest_entrance",
                    action: { add: { coins: 1 } },
                    choices: [ { text: "Продолжить", nextNode: "coin_result" } ]
                },
                spent_coin: {
                    text: "Вы купили лечебное зелье у торговца.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    action: { subtract: { coins: 1 } },
                    choices: [ { text: "Продолжить", nextNode: "coin_result" } ]
                },
                double_coins: {
                    text: "Волшебный дуб удваивает ваши монеты!",
                    speaker: "narrator",
                    location: "hidden_glade",
                    action: { setVar: { coins: "*=2" } },
                    choices: [ { text: "Удивительно!", nextNode: "coin_result" } ]
                },
                halve_coins: {
                    text: "Вы уронили монеты... Половина потеряна!",
                    speaker: "narrator",
                    location: "forest_entrance",
                    action: { setVar: { coins: "/=2" } },
                    choices: [ { text: "Как жаль...", nextNode: "coin_result" } ]
                },
                coin_result: {
                    text: "Теперь у вас {coins} монет.",
                    speaker: "Система",
                    location: "forest_entrance",
                    choices: [
                        { text: "Ещё операции", nextNode: "coin_example_start" },
                        { text: "Вернуться", nextNode: "back_to_main" }
                    ]
                }
            }
        },

        dice_example: {
            title: "Пример с кубиком",
            nodes: {
                start: {
                    text: "ПРИМЕР: БРОСОК КУБИКА\n\nКубик определяет вашу удачу. Выберите тип:",
                    speaker: "Система",
                    location: "forest_entrance",
                    choices: [
                        { text: "Обычный кубик (1-6)", nextNode: "roll_d6" },
                        { text: "Большой кубик (1-20)", nextNode: "roll_d20" },
                        { text: "Монета (1-2)", nextNode: "roll_coin" },
                        { text: "Назад", nextNode: "back_to_main" }
                    ]
                },
                roll_d6: {
                    text: "Бросаем кубик d6...",
                    speaker: "narrator",
                    location: "forest_entrance",
                    roll: { name: "luck", min: 1, max: 6, text: "Кубик катится..." },
                    choices: []
                },
                roll_d20: {
                    text: "Бросаем кубик d20...",
                    speaker: "narrator",
                    location: "forest_entrance",
                    roll: { name: "skill_check", min: 1, max: 20, text: "Кубик вращается..." },
                    choices: []
                },
                roll_coin: {
                    text: "Подбрасываем монету...",
                    speaker: "narrator",
                    location: "forest_entrance",
                    roll: { name: "coin_flip", min: 1, max: 2, text: "Монета сверкает..." },
                    choices: []
                },
                dice_result: {
                    text: "Ваш результат: {luck}",
                    speaker: "Система",
                    location: "forest_entrance",
                    choices: [
                        { text: "Бросить снова", nextNode: "dice_example_start" },
                        { text: "Назад", nextNode: "back_to_main" }
                    ]
                }
            }
        },

        luck_test: {
            title: "Проверка удачи",
            nodes: {
                start: {
                    text: "ИСПЫТАНИЕ УДАЧИ\n\nПеред вами три сундука. Только в одном - сокровище.\n\nБросьте кубик: 1-2 - левый, 3-4 - средний, 5-6 - правый.",
                    speaker: "narrator",
                    location: "ancient_ruins",
                    choices: [
                        { text: "Бросить кубик", nextNode: "chest_roll" },
                        { text: "Уйти ни с чем", nextNode: "leave_chests" }
                    ]
                },
                chest_roll: {
                    text: "Кубик катится...",
                    speaker: "narrator",
                    location: "ancient_ruins",
                    roll: { name: "chest_choice", min: 1, max: 6, text: "Кубик останавливается..." },
                    choices: []
                },
                chest_result: {
                    text: "Вы открываете сундук...",
                    speaker: "narrator",
                    location: "ancient_ruins",
                    choices: [ { text: "Посмотреть", nextNode: "chest_outcome" } ]
                },
                chest_outcome: {
                    text: "Результат проверки удачи",
                    speaker: "narrator",
                    location: "ancient_ruins",
                    choices: [ { text: "Продолжить", nextNode: "luck_end" } ]
                },
                leave_chests: {
                    text: "Вы решаете не рисковать и уходите.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [ { text: "Вернуться", nextNode: "back_to_main" } ]
                },
                luck_end: {
                    text: "Хотите попробовать снова?",
                    speaker: "Система",
                    location: "forest_entrance",
                    choices: [
                        { text: "Попробовать снова", nextNode: "luck_test_start" },
                        { text: "Вернуться", nextNode: "back_to_main" }
                    ]
                }
            }
        },

        coin_example_start: {
            text: "ПРИМЕР: СИСТЕМА МОНЕТ\n\nВаши текущие монеты: {coins}",
            speaker: "Система",
            location: "forest_entrance",
            choices: [
                { text: "Найти монету (+1)", nextNode: "found_coin" },
                { text: "Потратить монету (-1)", nextNode: "spent_coin" },
                { text: "Удвоить (x2)", nextNode: "double_coins" },
                { text: "Разделить (/2)", nextNode: "halve_coins" },
                { text: "Назад", nextNode: "back_to_main" }
            ]
        },

        dice_example_start: {
            text: "ПРИМЕР: БРОСОК КУБИКА\n\nВыберите тип кубика:",
            speaker: "Система",
            location: "forest_entrance",
            choices: [
                { text: "d6 (1-6)", nextNode: "roll_d6" },
                { text: "d20 (1-20)", nextNode: "roll_d20" },
                { text: "Монета (1-2)", nextNode: "roll_coin" },
                { text: "Назад", nextNode: "back_to_main" }
            ]
        },

        luck_test_start: {
            text: "ИСПЫТАНИЕ УДАЧИ\n\nПеред вами три сундука.",
            speaker: "narrator",
            location: "ancient_ruins",
            choices: [
                { text: "Бросить кубик", nextNode: "chest_roll" },
                { text: "Уйти", nextNode: "leave_chests" }
            ]
        },

        back_to_main: {
            text: "ВЕРНУТЬСЯ\n\nВыберите раздел:",
            speaker: "Система",
            location: "forest_entrance",
            choices: [
                { text: "Монеты и арифметика", nextNode: "coin_example" },
                { text: "Кубики и случайность", nextNode: "dice_example" },
                { text: "Испытание удачи", nextNode: "luck_test" },
                { text: "Основная игра", nextNode: "role_intro" }
            ]
        }
    }
};

// Системные функции
function getNode(sceneId, nodeId) {
    if (GAME_DATA.scenes[sceneId] && GAME_DATA.scenes[sceneId].nodes[nodeId]) {
        return GAME_DATA.scenes[sceneId].nodes[nodeId];
    }
    return null;
}

function getLocation(locationId) {
    return GAME_DATA.locations[locationId] || { name: "Неизвестно", image: "" };
}

function getCharacter(charId) {
    return GAME_DATA.characters[charId] || { name: "Неизвестно", color: "#888888" };
}

function formatText(text, variables) {
    var formatted = text;
    for (var key in variables) {
        if (variables.hasOwnProperty(key)) {
            var value = variables[key];
            formatted = formatted.replace(new RegExp("\\{" + key + "\\}", "g"), value);
        }
    }
    return formatted;
}
