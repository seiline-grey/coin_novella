/**
 * ДАННЫЕ ИГРЫ - СЦЕНАРИЙ И КОНФИГУРАЦИЯ
 * ============================================================
 * Этот файл содержит всю логику и контент вашей новеллы.
 * Редактируйте только этот файл, чтобы изменить историю!
 * ============================================================
 */

const GAME_DATA = {
    // Настройки игры
    settings: {
        gameTitle: "Тайна Забытого Леса",           // Название игры
        authorName: "Автор",                        // Имя автора
        defaultFont: "16px sans-serif",             // Размер шрифта по умолчанию
        bgTransitionSpeed: 500,                     // Скорость перехода фона (мс)
        textSpeed: 30,                              // Скорость печати текста (мс/символ)
        enableAutoSave: true,                       // Включить автосохранение
        autoSaveInterval: 30000                     // Интервал автосохранения (мс)
    },

    // Переменные игры (будут изменяться во время игры)
    // Здесь задаются начальные значения переменных
    variables: {
        player1_name: "Неизвестный",
        player2_name: "Неизвестный",
        trust_level: 0,          // Уровень доверия между игроками
        secrets_revealed: 0,     // Количество раскрытых секретов
        final_choice: 0,         // Итоговый выбор
        chapter: 1,              // Текущая глава
        path_choice: 0           // Выбранный путь
    },

    // Персонажи игры (спрайты и имена)
    characters: {
        narrator: {
            name: "",
            color: "#888888"
        },
        hero: {
            name: "Странник",
            color: "#4a90d9"
        },
        guide: {
            name: "Хранитель",
            color: "#9b59b6"
        },
        mystery: {
            name: "Незнакомец",
            color: "#e74c3c"
        }
    },

    // Локации (фоновые изображения)
    locations: {
        forest_entrance: {
            name: "Вход в лес",
            image: "forest_entrance.jpg"
        },
        ancient_ruins: {
            name: "Древние руины",
            image: "ruins.jpg"
        },
        hidden_glade: {
            name: "Скрытая поляна",
            image: "glade.jpg"
        },
        dark_path: {
            name: "Тёмная тропа",
            image: "dark_path.jpg"
        }
    },

    // СЦЕНАРИЙ ИГРЫ
    // Каждая сцена содержит набор шагов (nodes)
    // Структура узла: id, текст, выборы, действия, условия
    scenes: {

        // === СЦЕНА 1: НАЧАЛО ИГРЫ ===
        start: {
            title: "Начало игры",
            nodes: {
                // Узел 1: Приветствие и выбор роли
                role_intro: {
                    text: "Добро пожаловать в 'Тайну Забытого Леса'!\n\nЭто история о двух путниках, которые встретились у входа в древний лес. Вместе им предстоит раскрыть его тайны, но каждый ход один игрок передаёт код другому.\n\nВыберите, за кого вы хотите играть:",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Я буду играть за СТРАННИКА (Игрок 1)",
                            nextNode: "p1_intro",
                            action: { setPlayer: 1 }
                        },
                        {
                            text: "Я буду играть за ХРАНИТЕЛЯ (Игрок 2)",
                            nextNode: "p2_intro",
                            action: { setPlayer: 2 }
                        }
                    ]
                },

                // Узел для Игрока 1
                p1_intro: {
                    text: "Вы - Странник, пришедший издалека. Лес манит вас, но вы чувствуете, что идти одному будет опасно.\n\nВдалеке вы видите фигуру в синих одеяниях. Похоже, это Хранитель леса.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Подойти к Хранителю",
                            nextNode: "meet_guide"
                        }
                    ]
                },

                // Узел для Игрока 2
                p2_intro: {
                    text: "Вы - Хранитель, страж древних тайн. Сегодня утром вы почувствовали странную дрожь в лесу - кто-то приближается.\n\nУ входа в лес стоит незнакомец в дорожном плаще.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Выйти навстречу незнакомцу",
                            nextNode: "meet_hero"
                        }
                    ]
                },

                // Узел встречи (общий)
                meet_guide: {
                    text: "- Здравствуй, путник, - говорит Хранитель. - Я вижу, ты ищешь путь через мой лес.\n\n- Да, - отвечаете вы. - Мне нужно попасть на другую сторону.\n\n- Путь непрост, - кивает Хранитель. - Но я помогу... если ты докажешь, что достоин.",
                    speaker: "guide",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Спросить, что нужно делать",
                            nextNode: "first_challenge_intro"
                        }
                    ]
                },

                meet_hero: {
                    text: "- Стой, путник, - произносите вы. - Не многие осмеливаются входить в этот лес.\n\n- У меня нет выбора, - отвечает незнакомец. - Мой путь лежит через него.\n\n- Тогда тебе понадобится моя помощь, - говорите вы. - Но сначала ответь: зачем тебе этот лес?",
                    speaker: "hero",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Рассказать о своей цели",
                            nextNode: "first_challenge_intro"
                        }
                    ]
                },

                first_challenge_intro: {
                    text: "Хранитель указывает на развилку впереди: 'В лесу три пути. Один ведёт к руинам, другой - в тёмную чащу, третий - к скрытой поляне. Каждый путь хранит свою тайну.\n\nВыбери, куда направимся. Но помни - от этого выбора зависит многое.'\n\nВ этот момент вы понимаете, что пора передать ход. Сгенерируйте код и передайте его другому игроку.",
                    speaker: "guide",
                    location: "forest_entrance",
                    endTurn: true,
                    nextPlayer: 2,
                    choices: [
                        {
                            text: "Сгенерировать код и передать ход",
                            nextNode: "waiting_for_code"
                        }
                    ]
                },

                // === СЦЕНА 2: ОЖИДАНИЕ КОДА ===
                waiting_for_code: {
                    text: "Ожидание кода от другого игрока...\n\nНа этом шаге ваш ход завершён. Передайте сгенерированный код другому игроку. Когда он закончит свой ход, он даст вам новый код для продолжения.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isWaitingPoint: true,
                    choices: [
                        {
                            text: "Ввести код от другого игрока",
                            nextNode: "code_input"
                        }
                    ]
                },

                code_input: {
                    text: "Введите код, полученный от другого игрока, чтобы продолжить историю.\n\nКод должен быть введён точно, без ошибок.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isCodeInput: true,
                    choices: [
                        {
                            text: "Назад",
                            nextNode: "waiting_for_code"
                        }
                    ]
                },

                // === СЦЕНА 3: ПЕРВЫЙ ВЫБОР ПУТИ ===
                path_selection: {
                    text: "Вы получили код и готовы продолжить.\n\nПеред вами развилка. Куда направитесь?\n\nНа камне написаны три слова: 'РУИНЫ', 'ТЬМА', 'СВЕТ'.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Направиться к РУИНАМ",
                            nextNode: "go_ruins",
                            action: { setVar: { path_choice: 1 } }
                        },
                        {
                            text: "Направиться в ТЬМУ",
                            nextNode: "go_darkness",
                            action: { setVar: { path_choice: 2 } }
                        },
                        {
                            text: "Пойти к СВЕТУ",
                            nextNode: "go_light",
                            action: { setVar: { path_choice: 3 } }
                        }
                    ]
                },

                // Ветка Руин
                go_ruins: {
                    text: "Вы идёте через заросли кустарника и выходите к древним каменным руинам. Сохранились лишь стены да колонны, поросшие мхом.\n\nВ центре развалин вы замечаете странный камень с вырезанными символами.",
                    speaker: "narrator",
                    location: "ancient_ruins",
                    choices: [
                        {
                            text: "Осмотреть камень",
                            nextNode: "ruins_stone"
                        },
                        {
                            text: "Обойти руины",
                            nextNode: "continue_path"
                        }
                    ]
                },

                ruins_stone: {
                    text: "Камень мерцает тусклым светом. Символы складываются в слова: 'Тот, кто ищет, да найдёт. Но цена знания - память.'\n\nВы чувствуете, как что-то меняется в вашем сознании...",
                    speaker: "mystery",
                    location: "ancient_ruins",
                    action: { setVar: { secrets_revealed: 1 } },
                    choices: [
                        {
                            text: "Продолжить путь",
                            nextNode: "continue_path"
                        }
                    ]
                },

                // Ветка Тьмы
                go_darkness: {
                    text: "Тропа уходит вглубь леса, где деревья смыкаются кронами, не пропуская свет. Воздух становится холоднее.\n\nВдруг вы слышите шёпот: 'Зачем ты пришёл в наши владения?'",
                    speaker: "narrator",
                    location: "dark_path",
                    choices: [
                        {
                            text: "Спросить, кто говорит",
                            nextNode: "darkness_whisper"
                        },
                        {
                            text: "Идти вперёд, не останавливаясь",
                            nextNode: "continue_path"
                        }
                    ]
                },

                darkness_whisper: {
                    text: "Тени вокруг вас сгущаются, формируя очертания существа. 'Я - Хранитель Тьмы. Ты пришёл забрать то, что принадлежит свету?'\n\nСущество ждёт вашего ответа.",
                    speaker: "mystery",
                    location: "dark_path",
                    choices: [
                        {
                            text: "Нет, я просто ищу дорогу",
                            nextNode: "darkness_answer_1"
                        },
                        {
                            text: "Я ищу древнюю тайну",
                            nextNode: "darkness_answer_2"
                        }
                    ]
                },

                darkness_answer_1: {
                    text: "Тень фыркает. 'Все так говорят. Но дорога одна - через терпение. Жди, и путь откроется.'\n\nВы чувствуете, как тьма вокруг рассеивается...",
                    speaker: "mystery",
                    location: "dark_path",
                    action: { setVar: { trust_level: 1 } },
                    choices: [
                        {
                            text: "Поблагодарить и продолжить",
                            nextNode: "continue_path"
                        }
                    ]
                },

                darkness_answer_2: {
                    text: "Существо усмехается. 'Тайны имеют цену. Готов ли ты заплатить?'\n\nВ руках тени появляется древняя монета.",
                    speaker: "mystery",
                    location: "dark_path",
                    choices: [
                        {
                            text: "Взять монету",
                            nextNode: "take_coin"
                        },
                        {
                            text: "Отказаться",
                            nextNode: "refuse_coin"
                        }
                    ]
                },

                take_coin: {
                    text: "Монета холодная, почти ледяная. На ней выбит странный символ.\n\n'Теперь ты связан, - шепчет тень. - До следующей встречи.'",
                    speaker: "mystery",
                    location: "dark_path",
                    action: { setVar: { secrets_revealed: 1 } },
                    choices: [
                        {
                            text: "Продолжить",
                            nextNode: "continue_path"
                        }
                    ]
                },

                refuse_coin: {
                    text: "'Мудрый выбор, - кивает тень. - Не всё золото, что блестит. Иди, твой путь очищен.'\n\nТропа впереди становится светлее.",
                    speaker: "mystery",
                    location: "dark_path",
                    action: { setVar: { trust_level: 1 } },
                    choices: [
                        {
                            text: "Продолжить",
                            nextNode: "continue_path"
                        }
                    ]
                },

                // Ветка Света
                go_light: {
                    text: "Тропа ведёт вверх, к вершине холма, где среди деревьев открывается чудесная поляна, залитая солнечным светом.\n\nПосреди поляны стоит древний дуб, а у его корней - пьедестал с кувшином.",
                    speaker: "narrator",
                    location: "hidden_glade",
                    choices: [
                        {
                            text: "Осмотреть кувшин",
                            nextNode: "glade_jug"
                        },
                        {
                            text: "Присесть под деревом",
                            nextNode: "glade_rest"
                        }
                    ]
                },

                glade_jug: {
                    text: "Кувшин из глины, простой, но красивый. Внутри - чистая вода, которая никогда не заканчивается.\n\nНа пьедестале надпись: 'Путник, утоли жажду, и пусть вода очистит твой путь.'",
                    speaker: "narrator",
                    location: "hidden_glade",
                    action: { setVar: { trust_level: 1 } },
                    choices: [
                        {
                            text: "Напиться и продолжить",
                            nextNode: "continue_path"
                        }
                    ]
                },

                glade_rest: {
                    text: "Вы садитесь под могучим дубом и закрываете глаза. Тишина и покой наполняют вас.\n\nСпустя мгновение (или час?) вы чувствуете, что готовы идти дальше.",
                    speaker: "narrator",
                    location: "hidden_glade",
                    choices: [
                        {
                            text: "Встать и продолжить путь",
                            nextNode: "continue_path"
                        }
                    ]
                },

                // === СЦЕНА 4: ПРОДОЛЖЕНИЕ ===
                continue_path: {
                    text: "Лес постепенно редеет. Впереди показались стены древнего города.\n\n'Мы почти у цели', - говорит ваш спутник.\n\nНо у входа в город стоит страж. Он требует пароль.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Спросить у стража, какой пароль",
                            nextNode: "ask_guard"
                        },
                        {
                            text: "Попробовать пройти незаметно",
                            nextNode: "sneak_past"
                        }
                    ]
                },

                ask_guard: {
                    text: "- Город закрыт для чужаков, - говорит страж. - Но... если вы выполните мою загадку, я вас впущу.\n\n'Что принадлежит вам, но другие используют чаще?'",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Имя",
                            nextNode: "answer_name"
                        },
                        {
                            text: "Деньги",
                            nextNode: "answer_wrong"
                        },
                        {
                            text: "Время",
                            nextNode: "answer_wrong"
                        }
                    ]
                },

                answer_name: {
                    text: "Страж улыбается. 'Правильно. Проходите.'\n\nВорота города открываются перед вами.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    action: { setVar: { trust_level: 2 } },
                    choices: [
                        {
                            text: "Войти в город",
                            nextNode: "enter_city"
                        }
                    ]
                },

                answer_wrong: {
                    text: "- Неправильно, - качает головой страж. - Попробуйте ещё раз, иначе придётся уйти.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Попробовать снова",
                            nextNode: "ask_guard"
                        },
                        {
                            text: "Попробовать пройти незаметно",
                            nextNode: "sneak_past"
                        }
                    ]
                },

                sneak_past: {
                    text: "Вы пытаетесь обойти стража, но он замечает вас.\n\n- Эй! Стойте!",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Бежать",
                            nextNode: "run_away"
                        },
                        {
                            text: "Остановиться",
                            nextNode: "ask_guard"
                        }
                    ]
                },

                run_away: {
                    text: "Вы убегаете обратно в лес. Страж не следует за вами, но и в город вы не попали.\n\nВремя передать ход и подумать о новом подходе.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    endTurn: true,
                    nextPlayer: 2,
                    choices: [
                        {
                            text: "Сгенерировать код",
                            nextNode: "waiting_for_code"
                        }
                    ]
                },

                // === СЦЕНА 5: ФИНАЛ ===
                enter_city: {
                    text: "Вы входите в древний город. Улицы вымощены камнем, дома покрыты плющом.\n\nВ центре города - главная площадь и статуя основателя.\n\n'Мы сделали это', - говорит ваш спутник. - 'Вместе.'\n\nНо приключение только начинается...",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Продолжить исследование",
                            nextNode: "continue_story"
                        },
                        {
                            text: "Завершить эту часть истории",
                            nextNode: "ending_1"
                        }
                    ]
                },

                continue_story: {
                    text: "Перед вами открывается целый мир возможностей.\n\nНо это уже совсем другая история...\n\nСпасибо за игру!",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Вернуться в главное меню",
                            nextNode: "return_menu"
                        }
                    ]
                },

                ending_1: {
                    text: "КОНЕЦ ПЕРВОЙ ЧАСТИ\n\nВы успешно завершили первый этап приключения.\n\nСекретов раскрыто: {secrets_revealed}\nУровень доверия: {trust_level}",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isEnding: true,
                    choices: [
                        {
                            text: "Вернуться в главное меню",
                            nextNode: "return_menu"
                        }
                    ]
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

        // === СЦЕНА КОДА (СИСТЕМНАЯ) ===
        code: {
            title: "Системная сцена для обработки кода",
            nodes: {
                decode_success: {
                    text: "Код успешно принят! История продолжается...\n\nПродолжайте приключение вместе!",
                    speaker: "narrator",
                    location: "forest_entrance",
                    autoAdvance: true,
                    autoAdvanceDelay: 2000,
                    choices: []
                },

                decode_error: {
                    text: "Ошибка при чтении кода!\n\nКод повреждён или введён неверно. Проверьте правильность ввода и попробуйте снова.",
                    speaker: "narrator",
                    location: "forest_entrance",
                    choices: [
                        {
                            text: "Ввести код снова",
                            nextNode: "code_input"
                        },
                        {
                            text: "Назад",
                            nextNode: "waiting_for_code"
                        }
                    ]
                },

                generate_code: {
                    text: "Ваш ход завершён! Сгенерируйте этот код и передайте другому игроку:\n\n[КОД БУДЕТ ПОКАЗАН НИЖЕ]",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isCodeOutput: true,
                    choices: [
                        {
                            text: "Понял, завершить ход",
                            nextNode: "turn_complete"
                        }
                    ]
                },

                turn_complete: {
                    text: "Ход завершён! Ожидайте, пока другой игрок не передаст вам свой код.\n\nНе забудьте записать свой прогресс!",
                    speaker: "narrator",
                    location: "forest_entrance",
                    isWaitingPoint: true,
                    choices: [
                        {
                            text: "Ввести код",
                            nextNode: "code_input"
                        }
                    ]
                }
            }
        }
    }
};

// ============================================================
// ПРИМЕРЫ С АРИФМЕТИКОЙ И КУБИКАМИ (ver. 3.1)
// ============================================================

coin_example: {
    title: "Пример с монетами",
    nodes: {
        start: {
            text: "ПРИМЕР: СИСТЕМА МОНЕТ\n\nВ этом примере показано, как работает арифметика с переменными.\n\nВаши текущие монеты: {coins}",
            speaker: "Система",
            location: "forest_entrance",
            choices: [
                {
                    text: "Найти монету (+1)",
                    nextNode: "found_coin"
                },
                {
                    text: "Потратить монету (-1)",
                    nextNode: "spent_coin"
                },
                {
                    text: "Удвоить монеты (x2)",
                    nextNode: "double_coins"
                },
                {
                    text: "Разделить монеты (/2)",
                    nextNode: "halve_coins"
                },
                {
                    text: "Назад",
                    nextNode: "back_to_main"
                }
            ]
        },

        found_coin: {
            text: "Вы нашли блестящую монету на земле!\n\nСтарая сумма: {coins}",
            speaker: "narrator",
            location: "forest_entrance",
            action: { add: { coins: 1 } },
            choices: [
                {
                    text: "Продолжить",
                    nextNode: "coin_result"
                }
            ]
        },

        spent_coin: {
            text: "Вы купили лечебное зелье у торговца.\n\nМонеты потрачены.",
            speaker: "narrator",
            location: "forest_entrance",
            action: { subtract: { coins: 1 } },
            choices: [
                {
                    text: "Продолжить",
                    nextNode: "coin_result"
                }
            ]
        },

        double_coins: {
            text: "Волшебный дуб удваивает ваши монеты!\n\nМагия древних деревьев...",
            speaker: "narrator",
            location: "hidden_glade",
            action: { setVar: { coins: "*=2" } },
            choices: [
                {
                    text: "Удивительно!",
                    nextNode: "coin_result"
                }
            ]
        },

        halve_coins: {
            text: "Вы случайно уронили монеты в колодец... Половина упала!\n\nПотеряно половину суммы.",
            speaker: "narrator",
            location: "forest_entrance",
            action: { setVar: { coins: "/=2" } },
            choices: [
                {
                    text: "Как жаль...",
                    nextNode: "coin_result"
                }
            ]
        },

        coin_result: {
            text: "Теперь у вас {coins} монет.\n\nХотите продолжить эксперименты?",
            speaker: "Система",
            location: "forest_entrance",
            choices: [
                {
                    text: "Ещё операции",
                    nextNode: "coin_example_start"
                },
                {
                    text: "Вернуться",
                    nextNode: "back_to_main"
                }
            ]
        }
    }
},

dice_example: {
    title: "Пример с кубиком",
    nodes: {
        start: {
            text: "ПРИМЕР: БРОСОК КУБИКА\n\nЗдесь показано, как использовать случайные числа в игре.\n\nКубик определяет вашу удачу в предстоящих испытаниях.",
            speaker: "Система",
            location: "forest_entrance",
            choices: [
                {
                    text: "Бросить обычный кубик (1-6)",
                    nextNode: "roll_d6"
                },
                {
                    text: "Бросить большой кубик (1-20)",
                    nextNode: "roll_d20"
                },
                {
                    text: "Бросить монету (1-2)",
                    nextNode: "roll_coin"
                },
                {
                    text: "Назад",
                    nextNode: "back_to_main"
                }
            ]
        },

        roll_d6: {
            text: "Бросаем стандартный кубик d6...",
            speaker: "narrator",
            location: "forest_entrance",
            roll: { name: "luck", min: 1, max: 6, text: "Кубик катится по столу..." },
            choices: []
        },

        roll_d20: {
            text: "Бросаем кубик для проверки навыка (d20)...",
            speaker: "narrator",
            location: "forest_entrance",
            roll: { name: "skill_check", min: 1, max: 20, text: "Кубик вращается в воздухе..." },
            choices: []
        },

        roll_coin: {
            text: "Подбрасываем монету...",
            speaker: "narrator",
            location: "forest_entrance",
            roll: { name: "coin_flip", min: 1, max: 2, text: "Монета сверкает на солнце..." },
            choices: []
        },

        dice_result: {
            text: "Ваш результат: {luck}\n\nХотите бросить снова?",
            speaker: "Система",
            location: "forest_entrance",
            choices: [
                {
                    text: "Бросить снова",
                    nextNode: "dice_example_start"
                },
                {
                    text: "Назад",
                    nextNode: "back_to_main"
                }
            ]
        }
    }
},

luck_test: {
    title: "Проверка удачи",
    nodes: {
        start: {
            text: "ИСПЫТАНИЕ УДАЧИ\n\nПеред вами три сундука. Только в одном из них - сокровище.\n\nВы можете попытаться открыть сундук наудачу или использовать подсказку.",
            speaker: "narrator",
            location: "ancient_ruins",
            choices: [
                {
                    text: "Бросить кубик для выбора сундука",
                    nextNode: "chest_roll"
                },
                {
                    text: "Использовать подсказку (автоматический выбор)",
                    nextNode: "auto_choice"
                },
                {
                    text: "Уйти ни с чем",
                    nextNode: "leave_chests"
                }
            ]
        },

        chest_roll: {
            text: "Бросьте кубик: 1 или 2 - левый сундук, 3 или 4 - средний, 5 или 6 - правый.",
            speaker: "narrator",
            location: "ancient_ruins",
            roll: { name: "chest_choice", min: 1, max: 6, text: "Кубик катится по каменному полу..." },
            choices: []
        },

        chest_open: {
            text: "Вы открываете выбранный сундук...",
            speaker: "narrator",
            location: "ancient_ruins",
            choices: [
                {
                    text: "Посмотреть, что внутри",
                    nextNode: "chest_reveal"
                }
            ]
        },

        chest_reveal: {
            text: "Вы открываете сундук...",
            speaker: "narrator",
            location: "ancient_ruins",
            choices: [
                {
                    text: "Узнать результат",
                    nextNode: "chest_outcome"
                }
            ]
        },

        chest_outcome: {
            text: "Результат проверки",
            speaker: "narrator",
            location: "ancient_ruins",
            choices: [
                {
                    text: "Продолжить",
                    nextNode: "luck_end"
                }
            ]
        },

        auto_choice: {
            text: "Хранитель шепчет: 'Средний сундук...'\n\nВы открываете средний сундук и находите сокровище!\n\nИногда мудрость лучше слепой удачи.",
            speaker: "guide",
            location: "ancient_ruins",
            action: { setVar: { success: true } },
            choices: [
                {
                    text: "Забрать сокровище",
                    nextNode: "luck_end"
                }
            ]
        },

        leave_chests: {
            text: "Вы решаете не рисковать и уходите.\n\nВозможно, это мудрое решение... или упущенная возможность.",
            speaker: "narrator",
            location: "forest_entrance",
            action: { setVar: { success: null } },
            choices: [
                {
                    text: "Вернуться к примерам",
                    nextNode: "back_to_main"
                }
            ]
        },

        luck_end: {
            text: "Результат испытания\n\nХотите попробовать снова?",
            speaker: "Система",
            location: "forest_entrance",
            choices: [
                {
                    text: "Попробовать снова",
                    nextNode: "luck_test_start"
                },
                {
                    text: "Вернуться в меню примеров",
                    nextNode: "back_to_main"
                }
            ]
        }
    }
},

coin_example_start: {
    text: "ПРИМЕР: СИСТЕМА МОНЕТ\n\nВаши текущие монеты: {coins}",
    speaker: "Система",
    location: "forest_entrance",
    choices: [
        {
            text: "Найти монету (+1)",
            nextNode: "found_coin"
        },
        {
            text: "Потратить монету (-1)",
            nextNode: "spent_coin"
        },
        {
            text: "Удвоить монеты (x2)",
            nextNode: "double_coins"
        },
        {
            text: "Разделить монеты (/2)",
            nextNode: "halve_coins"
        },
        {
            text: "Назад",
            nextNode: "back_to_main"
        }
    ]
},

dice_example_start: {
    text: "ПРИМЕР: БРОСОК КУБИКА\n\nВыберите тип кубика:",
    speaker: "Система",
    location: "forest_entrance",
    choices: [
        {
            text: "Обычный кубик (1-6)",
            nextNode: "roll_d6"
        },
        {
            text: "Большой кубик (1-20)",
            nextNode: "roll_d20"
        },
        {
            text: "Монета (1-2)",
            nextNode: "roll_coin"
        },
        {
            text: "Назад",
            nextNode: "back_to_main"
        }
    ]
},

luck_test_start: {
    text: "ИСПЫТАНИЕ УДАЧИ\n\nПеред вами три сундука. В одном - сокровище.",
    speaker: "narrator",
    location: "ancient_ruins",
    choices: [
        {
            text: "Бросить кубик для выбора",
            nextNode: "chest_roll"
        },
        {
            text: "Использовать подсказку",
            nextNode: "auto_choice"
        },
        {
            text: "Уйти",
            nextNode: "leave_chests"
        }
    ]
},

back_to_main: {
    text: "ВЕРНУТЬСЯ В ПРИМЕРЫ\n\nВыберите, какой пример хотите изучить:",
    speaker: "Система",
    location: "forest_entrance",
    choices: [
        {
            text: "Монеты и арифметика",
            nextNode: "coin_example"
        },
        {
            text: "Кубики и случайность",
            nextNode: "dice_example"
        },
        {
            text: "Испытание удачи",
            nextNode: "luck_test"
        },
        {
            text: "Вернуться к основной игре",
            nextNode: "role_intro"
        }
    ]
}
};

// ============================================================
// СИСТЕМНЫЕ ФУНКЦИИ (НЕ ИЗМЕНЯТЬ)
// ============================================================

// Функция для получения узла по ID
function getNode(sceneId, nodeId) {
    if (GAME_DATA.scenes[sceneId] &&
        GAME_DATA.scenes[sceneId].nodes[nodeId]) {
        return GAME_DATA.scenes[sceneId].nodes[nodeId];
    }
    return null;
}

// Функция для получения локации
function getLocation(locationId) {
    return GAME_DATA.locations[locationId] || { name: "Неизвестно", image: "" };
}

// Функция для получения персонажа
function getCharacter(charId) {
    return GAME_DATA.characters[charId] || { name: "Неизвестно", color: "#888888" };
}

// Функция для форматирования текста с переменными
function formatText(text, variables) {
    let formatted = text;
    for (let key in variables) {
        let value = variables[key];
        formatted = formatted.replace(new RegExp('\\{' + key + '\\}', 'g'), value);
    }
    return formatted;
}

// Функция для экспорта данных (для отладки)
function exportGameData() {
    return JSON.stringify(GAME_DATA, null, 2);
}
