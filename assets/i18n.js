// Simple i18n loader: loads a JSON file and replaces elements with data-i18n keys.
(function(){
  let currentLang = 'en';
  
  // Inline fallback data for when fetch fails (file:// protocol)
  const fallbackData = {
  "en": {
    "name": "Vadim Gamolia",
    "experience": "Experience",
    "education": "Education",
    "tagline": "Game Developer • Unity",
    "nav": {
      "summary": "Summary",
      "skills": "Skills",
      "experience": "Experience",
      "projects": "Projects",
      "education": "Education",
      "languages": "Languages",
      "contact": "Contacts"
    },
    "cards": {
      "skills": {
        "programming": {
          "title": "Programming",
          "text": "C#, Python, JavaScript, TypeScript, ShaderGraph / HLSL"
        },
        "engines": {
          "title": "Engines",
          "text": "Unity (4+ years), Godot, Cocos"
        },
        "systems": {
          "title": "Systems and Focus",
          "text": "Gameplay architecture, optimization of all aspects of the game, deterministic logic, physics integration, save systems, build pipelines."
        },
        "tools": {
          "title": "Tools",
          "text": "UniRx(R3), UniTask, Odin, FacePunch, Mirror Networking, DotTween, PrimeTween, Zenject, VContainer, Addressables, ECS frameworks, Master Audio, EasySave, GamePush, Git, GitLab Actions, GitHub Actions"
        },
        "graphics": {
          "title": "Graphics / Technologies",
          "text": "Render pipelines (URP/HDRP), GPU profiling, batching, shader writing, VFX Graph, rendering profiling and optimization."
        },
        "soft": {
          "title": "Soft Skills",
          "text": "Ability to find common ground and build trust. Responsibility for results and readiness to take initiative. Active listening and understanding. Calmness and composure in stressful situations. Team collaboration and colleague support. Flexible thinking and adaptability."
        }
      },
      "projects": {
        "p1": {
          "title": "Grimdark",
          "text": "A large project targeting WebGL and PC. Numerous custom tools and solutions to maintain performance on an unusual set of platforms and game requirements. Full development cycle from concept to release, including multiple mechanic prototypes. Player communication, feedback collection, and issue resolution. Balance calculations. New content creation. Full support of the project from the very beginning."
        },
        "p2": {
          "title": "Hyper casual",
          "text": "A set of hyper-casual games with simple mechanics and fast playability. Multiple rapid iterations to improve and change gameplay. Creation of reusable content and tools to speed up development."
        },
        "p3": {
          "title": "Among Us for Influencers",
          "text": "Developing a multiplayer project similar to Among Us, with unique gameplay mechanics, for a streamers offline event."
          ,"unreleased": "Unreleased"
        }
      }
    },
    "sections": {
      "summary": {
        "title": "Summary",
        "subtitle": "Overview"
      },
      "skills": {
        "title": "Core Skills",
        "subtitle": "Stack"
      },
      "experience": {
        "title": "Work Experience",
        "subtitle": "Roles"
      },
      "projects": {
        "title": "Projects",
        "subtitle": "Released and Prototypes"
      },
      "education": {
        "title": "Education",
        "subtitle": "Academic"
      },
      "languages": {
        "title": "Languages",
        "subtitle": "Proficiency"
      },
      "contact": {
        "title": "Contacts",
        "subtitle": "Get in Touch"
      }
    },
    "content": {
      "summary_text": "Independent / freelance game developer with 4+ years of commercial experience. Worked on small game projects, prototyping, and hyper-casual games, as well as on a large-scale project. Participated in the full development cycle — from idea to release and support of all aspects of the game, including multi-platform support. Focused on performance and workflow optimization. Optimized CPU, GPU, memory, and build size for multiple platforms. Advocate of using tools and time purposefully, without reinventing the wheel for minor features. Prioritize adaptability and learning to solve specific tasks in the fastest and most efficient way. Passionate about learning new things and sharing knowledge with the team. Actively leverage AI to accelerate workflows. Empathetic, good listener, and easily engage in both technical and design discussions.",
      "contact_intro": "Open to contract / full-time opportunities (remote). Prefer roles focused on gameplay systems, tools creation, and performance optimization.",
      "back_to_top": "Back to Top ↑",
      "key_strengths": {
        "gameplay_systems": "Gameplay Systems",
        "tools_pipelines": "Tooling",
        "optimization": "Optimization",
        "technical_design": "Architectural Design",
        "learning_ability": "Ability to Learn"
      },
      "experience": {
        "role1": "Lead Developer – HiTyara / Freelance",
        "date1": "2022 – Present",
        "desc1": "Built a project from scratch, target platforms – WebGL, PC. Developed a lightweight custom system (based on a small number of object types used to reconstruct all game elements) supporting a large number of on-screen objects for PC and mobile devices. Built custom tools for complex ability design. Developed a custom component system to accelerate gameplay. Implemented cloud saves. Created and iteratively improved gameplay mechanics from scratch. Collected and resolved user feedback and issues. Built a strictly structured system for data flow from mechanics to UI. Designed a custom nested attribute system. Implemented a procedural system for balance and enemy spawning. Added localization support. Handled balance calculations, mechanic descriptions, new content design and implementation.",
        
        "role3": "Junior Game Developer – HiTyara / Freelance / Project Collaboration",
        "date3": "2021 – 2022",
        "desc3": "Rapid prototyping. Project support. Collaboration with a hyper-casual games publisher.",
        
        "role4": "Team Enthusiast Projects",
        "date4": "2021",
        "desc4": "Created a multiplayer game from scratch, including architecture design, network code implementation, and tools for designers.",
        
        "role5": "Non-IT or Semi-IT Jobs",
        "date5": "2014 – 2018",
        "desc5": "Worked in various non-IT fields. Project management. Business client relations. Workflow optimization."
      },
      "education": {
        "degree1": "Bachelor of Science / Computer-Aided Design Systems / Software Engineering – MAMI",
        "date1": "2011 – 2015",
        "desc1": "Focus: design and modeling using CAD tools.",
        "degree2": "Specialist / Automated Control Systems – MPT",
        "date2": "2007 – 2011",
        "desc2": "Focus: automation, process control, real-time systems."
      },
      "languages": {
        "russian": "Russian",
        "russian_level": "Native speaker",
        "english": "English", 
        "english_level": "B1-B2"
      }
    },
    "footer": {
      "copyright": "© {year} DrySprout. This page is a single-file resume (HTML + CSS + JSON-LD). Print-friendly and accessible."
    },
    "meta": {
      "age": "(33)"
    }
  }
,
  "ru": {
    "name": "Вадим Гамоля",
    "experience": "Опыт работы",
    "education": "Образование",
    "tagline": "Разработчик игр • Unity",
    "nav": {
      "summary": "Резюме",
      "skills": "Навыки",
      "experience": "Опыт",
      "projects": "Проекты",
      "education": "Образование",
      "languages": "Языки",
      "contact": "Контакты"
    },
    "cards": {
      "skills": {
        "programming": {
          "title": "Программирование",
          "text": "C#, Python, JavaScript, TypeScript, ShaderGraph / HLSL"
        },
        "engines": {
          "title": "Движки",
          "text": "Unity (4+ лет), Godot, Cocos"
        },
        "systems": {
          "title": "Системы и фокус",
          "text": "Архитектура игрового процесса, оптимизация всех аспектов игры, детерминированная логика, интеграция физики, системы сохранения, пайплайны сборки билдов."
        },
        "tools": {
          "title": "Инструменты",
          "text": "UniRx(R3), UniTask, Odin, FacePunch, Mirror Networking, DotTween, PrimeTween, Zenject, VContainer, Addressables, ECS frameworks, Master Audio, EasySave, GamePush, Git, GitLab Actions, GitHub Actions"
        },
        "graphics": {
          "title": "Графика / Технологии",
          "text": "Рендер-пайплайны (URP/HDRP), профилирование GPU, батчинг, написание шейдеров, VFX Graph, профилирование и оптимизация рендеринга."
        },
        "soft": {
          "title": "Soft Skills",
          "text": "Умение находить общий язык и выстраивать доверительные отношения. Ответственность за результат и готовность брать инициативу. Навык активного слушания и понимания собеседника. Спокойствие и выдержка в стрессовых ситуациях. Командное взаимодействие и поддержка коллег. Гибкость мышления и умение адаптироваться к изменениям."
        }
      },
      "projects": {
        "p1": {
          "title": "Grimdark",
          "text": "Крупный проект с целевыми платформами WebGL и PC. Множество кастомных инструментов и решений для поддержания производительности на необычном наборе платформ и с учетом требований игры. Полный цикл разработки от концепции до релиза, включая многочисленные прототипы механик. Общение с игроками, сбор отзывов и решение проблем. Расчет баланса. Создание нового контента. Полная поддержка проекта с самого начала."
        },
        "p2": {
          "title": "Hyper casual",
          "text": "Набор гиперказуальных игр с простыми механиками и быстрой играбельностью. Множественные быстрые итерации по улучшению и изменению игрового процесса. Создание переиспользуемого контента и инструментов для ускорения разработки."
        },
        "p3": {
          "title": "Among Us для инфлюенсеров",
          "text": "Разработка многопользовательского проекта, аналогичного Among Us, с уникальными игровыми механиками для офлайн-мероприятия стримеров."
          ,"unreleased": "Не выпущено"
        }
      }
    },
    "sections": {
      "summary": {
        "title": "Резюме",
        "subtitle": "Обзор"
      },
      "skills": {
        "title": "Основные навыки",
        "subtitle": "Стек"
      },
      "experience": {
        "title": "Опыт работы",
        "subtitle": "Роли"
      },
      "projects": {
        "title": "Проекты",
        "subtitle": "Выпущенные и прототипы"
      },
      "education": {
        "title": "Образование",
        "subtitle": "Академическое"
      },
      "languages": {
        "title": "Языки",
        "subtitle": "Уровень владения"
      },
      "contact": {
        "title": "Контакты",
        "subtitle": "Связаться"
      }
    },
    "content": {
      "summary_text": "Независимый / фриланс разработчик игр с 4+ годами коммерческого опыта. Работал как над небольшими игровыми проектами, прототипированием и гиперказуальными играми, так и над крупным проектом. Участвовал в полном цикле разработки — от идеи до релиза и сопровождения всех аспектов игры, включая поддержку нескольких платформ. Занимался оптимизацией производительности и рабочих процессов. Оптимизировал CPU, GPU, память и размер игры для разных платформ. Сторонник использования инструментов и времени по назначению, без изобретения «велосипеда» ради мелких фич. Ставлю приоритет на умение адаптироваться и обучаться для решения конкретных задач максимально быстрым и продуктивным способом. Люблю учиться новому и делиться знаниями с командой. По максимуму использую ИИ для ускорения рабочих процессов. Эмпатичен, умею слушать, легко подключаюсь к обсуждению как технических, так и дизайнерских вопросов.",
      "contact_intro": "Открыт для контрактных / full-time возможностей (удаленно). Предпочитаю роли, сосредоточенные на игровых системах, создании инструментов и оптимизации производительности.",
      "back_to_top": "Наверх ↑",
      "key_strengths": {
        "gameplay_systems": "Игровые механики",
        "tools_pipelines": "Инструментарий",
        "optimization": "Оптимизация",
        "technical_design": "Архитектурное проектирование",
        "learning_ability": "Обучаемость"
      },
      "experience": {
        "role1": "Ведущий разработчик – HiTyara / Фриланс",
        "date1": "2022 – Настоящее время",
        "desc1": "Создание проекта с нуля, целевые платформы – WebGL, PC. Собственная легковесная система (основанная на небольшом количестве типов игровых объектов, из которых воссоздаются все элементы игры), поддерживающая большое количество объектов на экране для PC и мобильных устройств. Самописная система инструментов для проектирования сложных способностей. Кастомная система компонентов для ускорения игровых процессов. Поддержка облачных сохранений. Создание и итерационное улучшение игровых механик с нуля. Работа с отзывами и проблемами пользователей. Строго структурированная система передачи данных от механик в UI. Самописная система вложенных характеристик. Процедурная система баланса и спавна противников. Поддержка локализации. Расчет баланса, описание игровых механик, создание и проработка нового контента.",
        
        "role3": "Младший разработчик игр – HiTyara / Фриланс / Проектное сотрудничество",
        "date3": "2021 – 2022",
        "desc3": "Быстрое прототипирование. Сопровождение проектов. Работа с издателем гиперказуальных игр.",
        
        "role4": "Разработка проектов в команде энтузиастов",
        "date4": "2021",
        "desc4": "Создание мультиплеерной игры с нуля, включая проектирование архитектуры, реализацию сетевого кода и создание инструментов для дизайнеров.",
        
        "role5": "Работы, не связанные или слабо связанные с IT",
        "date5": "2014 – 2018",
        "desc5": "Работа в различных сферах, не связанных с информационными технологиями. Менеджмент проектов. Работа с бизнес-клиентами. Оптимизация рабочих процессов."
      },
      "education": {
        "degree1": "Бакалавр наук / Системы автоматизированного проектирования / Программная инженерия – МАМИ",
        "date1": "2011 – 2015",
        "desc1": "Фокус: проектирование и моделирование с помощью инструментов автоматизированного проектирования.",
        "degree2": "Специалист / Автоматизированные системы управления – МПТ",
        "date2": "2007 – 2011",
        "desc2": "Фокус: автоматизация, управление процессами, системы реального времени."
      },
      "languages": {
        "russian": "Русский",
        "russian_level": "Носитель языка",
        "english": "Английский", 
        "english_level": "B1-B2"
      }
    },
    "footer": {
      "copyright": "© {year} DrySprout. Эта страница представляет собой резюме в одном файле (HTML + CSS + JSON-LD). Подходит для печати и доступна."
    },
    "meta": {
      "age": "(33)"
    }
  }
};
  
  async function loadLocale(locale){
    console.log('Loading locale:', locale);
    
    try {
      // First, try to find an inline JSON script with the requested locale
      const inline = document.querySelector(`script[type="application/json"][data-i18n-lang="${locale}"]`) || document.getElementById('i18n-inline');
      if(inline && inline.textContent.trim()){
        try{
          const data = JSON.parse(inline.textContent);
          applyLocale(data);
          currentLang = locale;
          updateLanguageButtons();
          document.documentElement.setAttribute('lang', locale);
          console.log('Loaded from inline script');
          return;
        }catch(e){
          console.warn('Failed to parse inline i18n JSON', e);
        }
      }
      
      // Try to fetch the locale JSON over HTTP
      try {
        const res = await fetch(`assets/i18n/${locale}.json`, {cache: 'no-store'});
        if(res.ok) {
          const data = await res.json();
          applyLocale(data);
          currentLang = locale;
          updateLanguageButtons();
          document.documentElement.setAttribute('lang', locale);
          console.log('Loaded from external file');
          return;
        }
      } catch(fetchError) {
        console.warn('Fetch failed, using fallback data:', fetchError);
      }
      
      // Fallback to inline data
      if(fallbackData[locale]) {
        applyLocale(fallbackData[locale]);
        currentLang = locale;
        updateLanguageButtons();
        document.documentElement.setAttribute('lang', locale);
        console.log('Loaded from fallback data');
        return;
      }
      
      throw new Error('No data available for locale: ' + locale);
      
    }catch(err){
      console.warn('i18n load failed completely, falling back to English:', err);
      if(locale !== 'en') {
        loadLocale('en');
      }
    }
  }

  function applyLocale(obj, prefix=''){
    console.log('Applying locale with prefix:', prefix);
    for(const key in obj){
      const val = obj[key];
      const path = prefix ? `${prefix}.${key}` : key;
      if(typeof val === 'object'){
  applyLocale(val, path);
        continue;
      }
      // Replace text for elements with matching data-i18n
      const els = document.querySelectorAll(`[data-i18n="${path}"]`);
      console.log(`Found ${els.length} elements for path: ${path}`);
      els.forEach(el=>{
        const rendered = val.replace('{year}', new Date().getFullYear());
        if(el.tagName === 'IMG'){
          el.alt = rendered;
        } else if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
          el.placeholder = rendered;
        } else {
          el.innerHTML = rendered;
        }
      });
    }
  }

  function updateLanguageButtons(){
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  // Global function for language switching
  window.switchLanguage = function(lang) {
    console.log('Switching to language:', lang);
    loadLocale(lang);
    // Update URL without reloading page
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  };

  // Auto-detect language (basic): url param `lang` or browser lang fallback
  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang') || navigator.language.split('-')[0] || 'en';
  console.log('Initial language detected:', lang);
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadLocale(lang).catch(()=>loadLocale('en'));
    });
  } else {
    loadLocale(lang).catch(()=>loadLocale('en'));
  }
})();
