/**
 * Данные визуальной новеллы
 * Редактируйте этот файл для создания своей истории
 *
 * Формат сцены:
 * - type: 'bg' - смена фона (src: путь к изображению)
 * - type: 'show' - показать персонажа (char: имя, pos: left/center/right, emotion: эмоция)
 * - type: 'hide' - скрыть персонажа (pos: left/center/right)
 * - type: 'say' - диалог (name: имя, text: текст)
 * - type: 'choice' - выбор (options: массив вариантов с text и jump)
 * - type: 'jump' - переход к сцене (to: ID сцены)
 * - type: 'play' - музыка (src: путь, loop: true/false)
 * - type: 'stop' - остановка музыки
 * - type: 'set' - установка переменной (name: имя, value: значение)
 * - type: 'if' - условный переход (condition: условие, to: сцена if, else: сцена else)
 * - type: 'wait' - пауза (duration: мс)
 * - type: 'ending' - концовка (title: заголовок, text: текст)
 */

const gameData = {
    // Пути к ассетам (изображения и аудио)
    assets: {
        // Фоны (backgrounds)
        backgrounds: {
            'classroom': 'images/bg_classroom.jpg',
            'corridor': 'images/bg_corridor.jpg',
            'cafe': 'images/bg_cafe.jpg',
            'night': 'images/bg_night.jpg',
            'ending_good': 'images/bg_ending_good.jpg',
            'ending_bad': 'images/bg_ending_bad.jpg'
        },

        // Персонажи (characters) - можно использовать формат: имя_эмоция
        characters: {
            // Главная героиня
            ' heroine_normal': 'images/hero_normal.png',
            'heroine_happy': 'images/hero_happy.png',
            'heroine_sad': 'images/hero_sad.png',
            'heroine_angry': 'images/hero_angry.png',
            'heroine_blush': 'images/hero_blush.png',

            // Второстепенные персонажи
            'friend_normal': 'images/friend_normal.png',
            'friend_happy': 'images/friend_happy.png',
            'mystery': 'images/mystery.png'
        },

        // Аудио
        audio: {
            'main_theme': 'audio/main_theme.mp3',
            'happy': 'audio/happy.mp3',
            'sad': 'audio/sad.mp3',
            'mystery': 'audio/mystery.mp3',
            'typing': 'audio/typing.mp3'
        }
    },

    // Сценарии игры
    scenes: {
        // === СТАРТОВОЕ МЕНЮ ===
        'start': [
            {
                type: 'play',
                src: 'main_theme',
                loop: true
            },
            {
                type: 'say',
                name: '',
                text: 'Добро пожаловать в мою историю!\n\nЭто пример визуальной новеллы, созданной на движке WVNE.\nТы можешь редактировать этот файл и создавать свои собственные истории.'
            },
            {
                type: 'say',
                name: 'Автор',
                text: 'Нажми на текст, чтобы продолжить. В конце каждой сцены ты сможешь выбрать действия персонажа.'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Начать историю', jump: 'prologue' },
                    { text: 'Пропустить вступление', jump: 'chapter1' }
                ]
            }
        ],

        // === ПРОЛОГ ===
        'prologue': [
            {
                type: 'bg',
                src: 'classroom'
            },
            {
                type: 'play',
                src: 'happy',
                loop: true
            },
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Привет! Меня зовут Алина. Я ученица старших классов обычной городской школы.'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Сегодня особенный день — первый день весны. Кажется, что-то должно измениться...'
            },
            {
                type: 'hide',
                pos: 'center'
            },
            {
                type: 'bg',
                src: 'corridor'
            },
            {
                type: 'show',
                char: 'friend_happy',
                pos: 'left'
            },
            {
                type: 'say',
                name: 'Маша',
                text: 'Алина! Ты здесь! Я тебя везде искала!'
            },
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'right'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Маша? Что случилось? Ты выглядишь взволнованной.'
            },
            {
                type: 'say',
                name: 'Маша',
                text: 'В столовой сегодня особенное меню! Говорят, будет десерт от шеф-повара!'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Пойти в столовую с Машей', jump: 'cafeteria_path' },
                    { text: 'Сначала зайти в библиотеку', jump: 'library_path' },
                    { text: 'Остаться в коридоре', jump: 'corridor_stay' }
                ]
            }
        ],

        // === ПУТЬ: СТОЛОВАЯ ===
        'cafeteria_path': [
            {
                type: 'set',
                name: 'cafe_visited',
                value: true
            },
            {
                type: 'bg',
                src: 'cafe'
            },
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'show',
                char: 'friend_happy',
                pos: 'left'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Наконец-то мы добрались до столовой. Здесь так вкусно пахнет!'
            },
            {
                type: 'say',
                name: 'Маша',
                text: 'Видишь того парня у окна? Он здесь уже третий день сидит один.'
            },
            {
                type: 'show',
                char: 'mystery',
                pos: 'right'
            },
            {
                type: 'say',
                name: 'Незнакомец',
                text: '...'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Подойти к незнакомцу', jump: 'talk_mystery' },
                    { text: 'Сесть подальше', jump: 'sit_away' },
                    { text: 'Спросить у Маши о нём', jump: 'ask_about' }
                ]
            }
        ],

        // === ПУТЬ: БИБЛИОТЕКА ===
        'library_path': [
            {
                type: 'set',
                name: 'library_visited',
                value: true
            },
            {
                type: 'bg',
                src: 'classroom' // Используем classroom как замену для библиотеки
            },
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'В библиотеке так тихо... Это именно то, что мне сейчас нужно.'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Хм, а эта книга выглядит интересной. Никогда раньше её не замечала.'
            },
            {
                type: 'wait',
                duration: 1500
            },
            {
                type: 'say',
                name: 'Голос в голове',
                text: 'Не трогай эту книгу...'
            },
            {
                type: 'show',
                char: 'heroine_sad',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Что? Откуда этот голос?'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Взять книгу', jump: 'take_book' },
                    { text: 'Уйти из библиотеки', jump: 'leave_library' }
                ]
            }
        ],

        // === ПУТЬ: КОРИДОР ===
        'corridor_stay': [
            {
                type: 'bg',
                src: 'corridor'
            },
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Пожалуй, я останусь здесь и понаблюдаю за происходящим.'
            },
            {
                type: 'wait',
                duration: 2000
            },
            {
                type: 'show',
                char: 'mystery',
                pos: 'right'
            },
            {
                type: 'say',
                name: '???',
                text: 'Эй, ты... Ты единственная, кто меня видит.'
            },
            {
                type: 'show',
                char: 'heroine_happy',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Подожди, что? Как это — единственная?'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Расспросить его', jump: 'talk_mystery' },
                    { text: 'Испугаться и убежать', jump: 'run_away' }
                ]
            }
        ],

        // === РАЗГОВОР С НЕЗНАКОМЦЕМ ===
        'talk_mystery': [
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'show',
                char: 'mystery',
                pos: 'right'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Привет. Я Алина. А ты... кто?'
            },
            {
                type: 'say',
                name: 'Незнакомец',
                text: 'Меня зовут Кирилл. Я... я здесь новенький.'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Странно, что ты меня видишь. Остальные словно смотрят сквозь меня.'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Возможно, мы можем стать друзьями', jump: 'be_friend' },
                    { text: 'Это действительно странно...', jump: 'strange_feeling' },
                    { text: 'Спросить, почему так происходит', jump: 'ask_why' }
                ]
            }
        ],

        'be_friend': [
            {
                type: 'set',
                name: 'kirill_friendship',
                value: 10
            },
            {
                type: 'show',
                char: 'heroine_happy',
                pos: 'center'
            },
            {
                type: 'show',
                char: 'mystery',
                pos: 'right'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Знаешь, может быть это судьба? Мы должны были встретиться.'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Спасибо, Алина... Я уже и забыл, как это — когда кто-то говорит с тобой.'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Пригласить его домой после школы', jump: 'invite_home' },
                    { text: 'Показать ему школу', jump: 'show_school' }
                ]
            }
        ],

        'invite_home': [
            {
                type: 'set',
                name: 'invited_home',
                value: true
            },
            {
                type: 'bg',
                src: 'night'
            },
            {
                type: 'show',
                char: 'heroine_blush',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Эм... может хочешь зайти ко мне после школы? Я могу показать тебе район...'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Я... я был бы рад. Правда.'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Тогда договорились! Встретимся у входа после последнего урока.'
            },
            {
                type: 'jump',
                to: 'chapter1'
            }
        ],

        'show_school': [
            {
                type: 'set',
                name: 'showed_school',
                value: true
            },
            {
                type: 'bg',
                src: 'corridor'
            },
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'show',
                char: 'mystery',
                pos: 'right'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Пойдём, я покажу тебе нашу школу. Здесь есть отличное место на крыше.'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Ты действительно добрая, Алина.'
            },
            {
                type: 'jump',
                to: 'chapter1'
            }
        ],

        'strange_feeling': [
            {
                type: 'show',
                char: 'heroine_sad',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Прости, но это как-то... странно. Мне нужно время, чтобы привыкнуть.'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Понимаю. Я не должен был к тебе подходить.'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Подожди! Я не это имела в виду', jump: 'be_friend' },
                    { text: 'Извини, мне нужно идти', jump: 'leave_him' }
                ]
            }
        ],

        'ask_why': [
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Почему другие тебя не видят? Это как-то связано с тобой?'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Я... сам не знаю. Я проснулся здесь три дня назад, и никто меня не замечает.'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Это звучит жутко. Но ты не один — я здесь.'
            },
            {
                type: 'jump',
                to: 'be_friend'
            }
        ],

        'sit_away': [
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Лучше я сяду подальше. Не хочу навязываться.'
            },
            {
                type: 'say',
                name: 'Маша',
                text: 'Как хочешь. Но он выглядит таким грустным...'
            },
            {
                type: 'jump',
                to: 'chapter1'
            }
        ],

        'ask_about': [
            {
                type: 'show',
                char: 'friend_happy',
                pos: 'left'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Маша, ты знаешь этого парня?'
            },
            {
                type: 'say',
                name: 'Маша',
                text: 'Какого парня? Там никого нет.'
            },
            {
                type: 'show',
                char: 'heroine_sad',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Подожди... Ты правда его не видишь?'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Рассказать Маше о парне', jump: 'tell_masha' },
                    { text: 'Промолчать и проверить самой', jump: 'check_alone' }
                ]
            }
        ],

        'tell_masha': [
            {
                type: 'set',
                name: 'told_friend',
                value: true
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Там, у окна! Парень в чёрной куртке. Он сидит один.'
            },
            {
                type: 'say',
                name: 'Маша',
                text: 'Алина, там никого нет. Ты в порядке?'
            },
            {
                type: 'show',
                char: 'heroine_angry',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Я не понимаю... Я же его вижу прямо сейчас!'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: '(тихо) Пожалуйста, не говори никому...'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Пообещать молчать', jump: 'promise_silence' },
                    { text: 'Мне нужны ответы', jump: 'need_answers' }
                ]
            }
        ],

        'promise_silence': [
            {
                type: 'set',
                name: 'kept_secret',
                value: true
            },
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Прости, Маша. Наверное, я просто устала. Пойдём лучше поедим.'
            },
            {
                type: 'say',
                name: 'Маша',
                text: 'Точно? Ты выглядишь бледной...'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Всё в порядке. Правда.'
            },
            {
                type: 'jump',
                to: 'chapter1'
            }
        ],

        'check_alone': [
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Маша, извини, я на секунду. Пойду посмотрю на меню.'
            },
            {
                type: 'hide',
                pos: 'center'
            },
            {
                type: 'show',
                char: 'mystery',
                pos: 'right'
            },
            {
                type: 'say',
                name: 'Алина',
                text: '(про себя) Он правда здесь. И только я его вижу...'
            },
            {
                type: 'choice',
                options: [
                    { text: 'Подойти к нему', jump: 'talk_mystery' },
                    { text: 'Вернуться к Маше', jump: 'cafeteria_path' }
                ]
            }
        ],

        'run_away': [
            {
                type: 'show',
                char: 'heroine_angry',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'А-а-а!'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Подожди! Я не причиню вреда!'
            },
            {
                type: 'jump',
                to: 'chapter1'
            }
        ],

        'leave_him': [
            {
                type: 'hide',
                pos: 'right'
            },
            {
                type: 'show',
                char: 'heroine_sad',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Извини... Мне нужно время.'
            },
            {
                type: 'jump',
                to: 'chapter1'
            }
        ],

        // === КОНЦОВКИ ===
        'good_ending': [
            {
                type: 'bg',
                src: 'ending_good'
            },
            {
                type: 'play',
                src: 'happy',
                loop: true
            },
            {
                type: 'show',
                char: 'heroine_happy',
                pos: 'center'
            },
            {
                type: 'show',
                char: 'mystery',
                pos: 'right'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Ну вот и всё. Наша история только начинается.'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Спасибо, Алина. За то, что ты единственная, кто меня увидел.'
            },
            {
                type: 'ending',
                title: 'Хорошая концовка: Начало чего-то нового',
                text: 'Алина и Кирилл стали лучшими друзьями. Вместе они раскрыли тайну его появления в школе. Их ждало много приключений, но одно было ясно — они больше никогда не будут одиноки.\n\nСпасибо за игру!'
            }
        ],

        'bad_ending': [
            {
                type: 'bg',
                src: 'ending_bad'
            },
            {
                type: 'play',
                src: 'sad',
                loop: true
            },
            {
                type: 'show',
                char: 'heroine_sad',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Я так и не узнала, кто он был...'
            },
            {
                type: 'say',
                name: '',
                text: 'Может быть, некоторые тайны лучше не раскрывать.'
            },
            {
                type: 'ending',
                title: 'Концовка с разбитым сердцем',
                text: 'Алина так и не узнала правду о Кирилле. Он исчез так же внезапно, как и появился. Но иногда, в тишине, она всё ещё слышила его голос...\n\nСпасибо за игру!'
            }
        ],

        'neutral_ending': [
            {
                type: 'bg',
                src: 'night'
            },
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Жизнь вернулась в обычное русло.'
            },
            {
                type: 'say',
                name: '',
                text: 'Школа, друзья, учёба... Всё как обычно.'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Но иногда, в тишине, я думаю о нём... О том парне, которого видела только я.'
            },
            {
                type: 'ending',
                title: 'Нейтральная концовка: Воспоминания',
                text: 'Алина продолжает жить обычной жизнью. Тот день в школе стал для неё чем-то особенным — напоминанием о том, что в мире есть вещи, которые невозможно объяснить.\n\nСпасибо за игру!'
            }
        ],

        // === ГЛАВА 1 (ПЕРЕХОДНАЯ) ===
        'chapter1': [
            {
                type: 'bg',
                src: 'corridor'
            },
            {
                type: 'play',
                src: 'mystery',
                loop: true
            },
            {
                type: 'say',
                name: '',
                text: 'Школьный день подошёл к концу...'
            },
            {
                type: 'say',
                name: '',
                text: 'Что же будет дальше?'
            },
            {
                type: 'choice',
                options: [
                    {
                        text: 'Хорошая концовка',
                        jump: 'good_ending',
                        condition: '!cafe_visited && !library_visited'
                    },
                    {
                        text: 'Плохая концовка',
                        jump: 'bad_ending',
                        condition: 'cafe_visited && library_visited'
                    },
                    { text: 'Нейтральная концовка', jump: 'neutral_ending' }
                ]
            }
        ],

        // === ДОПОЛНИТЕЛЬНЫЕ СЦЕНЫ ===
        'take_book': [
            {
                type: 'show',
                char: 'heroine_angry',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Нет! Я не должна слушать какие-то голоса!'
            },
            {
                type: 'say',
                name: 'Алина',
                text: '(Берёт книгу)'
            },
            {
                type: 'wait',
                duration: 1000
            },
            {
                type: 'say',
                name: 'Голос в голове',
                text: 'Ты... смелая. Может быть, ты сможешь помочь.'
            },
            {
                type: 'jump',
                to: 'chapter1'
            }
        ],

        'leave_library': [
            {
                type: 'show',
                char: 'heroine_sad',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Нет уж, увольте. Это место меня пугает.'
            },
            {
                type: 'jump',
                to: 'chapter1'
            }
        ],

        'need_answers': [
            {
                type: 'show',
                char: 'heroine_normal',
                pos: 'center'
            },
            {
                type: 'say',
                name: 'Алина',
                text: 'Мне нужны ответы. Почему это происходит? Кто ты?'
            },
            {
                type: 'say',
                name: 'Кирилл',
                text: 'Я не знаю... Но, может быть, вместе мы сможем узнать.'
            },
            {
                type: 'jump',
                to: 'be_friend'
            }
        ]
    }
};

/**
 * Как добавить свою сцену:
 *
 * 1. Создайте новую запись в gameData.scenes:
 *
 * 'my_scene': [
 *     { type: 'bg', src: 'путь_к_изображению_фона' },
 *     { type: 'show', char: 'heroine_normal', pos: 'center' },
 *     { type: 'say', name: 'Имя', text: 'Текст диалога' },
 *     { type: 'choice', options: [
 *         { text: 'Вариант 1', jump: 'следующая_сцена' },
 *         { text: 'Вариант 2', jump: 'другая_сцена' }
 *     ]}
 * ],
 *
 * 2. Добавьте пути к ассетам в gameData.assets
 *
 * 3. Используйте jump для перехода между сценами
 */
