;(function (global) {
  const KEYS = {
    news: 'gomel_eco_news',
    suggestions: 'gomel_eco_suggestions',
    knowledge: 'gomel_eco_knowledge_custom',
    userMessages: 'gomel_eco_user_messages',
    kpi: 'gomel_eco_kpi',
    cleanPlaces: 'gomel_eco_clean_places',
    dirtyPlaces: 'gomel_eco_dirty_places',
    auth: 'gomel_eco_admin_session'
  }

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const defaultNews = [
    {
      id: 'n1', date: '12 августа 2026', tag: 'Отчёт',
      title: 'Опубликован полугодовой экологический отчёт Гомельской области',
      text: 'Комитет природных ресурсов и охраны окружающей среды облисполкома представил сводный отчёт за январь — июль 2026 года. Индекс качества воздуха — 54 балла (AQI), доля переработанных отходов выросла до 39%. Зафиксировано 21 экологическое правонарушение — на 11% меньше, чем за аналогичный период 2025 года.',
      link: 'https://gomel-region.gov.by/', linkText: 'Портал Гомельского облисполкома'
    },
    {
      id: 'n2', date: '28 июля 2026', tag: 'Лес',
      title: 'Лесопожарная служба Гомельщины успешно прошла проверку готовности',
      text: 'По итогам летней проверки лесхозы региона признаны готовыми к тушению пожаров. За первые 7 месяцев 2026 года зафиксировано 27 возгораний на площади 22 га — на 25% меньше, чем в 2025 году. Особое внимание — лесам Полесья и зоне Полесского радиационно-экологического заповедника.',
      link: 'https://www.gp.by/', linkText: 'Гомельская правда'
    },
    {
      id: 'n3', date: '15 июля 2026', tag: 'Инфраструктура',
      title: 'В Гомеле расширена система раздельного сбора отходов',
      text: 'К августу 2026 года в городе Гомеле раздельный сбор отходов внедрён в 52 жилых дворах. Установлено 140 контейнеров. За первый месяц собрано более 90 тонн вторсырья.',
      link: 'https://www.belta.by/', linkText: 'БЕЛТА'
    },
    {
      id: 'n4', date: '5 июня 2026', tag: 'Экоакция',
      title: 'Более 3 500 жителей приняли участие в акции «Чистое Полесье»',
      text: 'В 21 районе области прошли субботники. Волонтёры собрали свыше 50 тонн мусора, высадили 1 400 саженцев и очистили береговые зоны рек Сож, Припять и Днепр.',
      link: 'https://www.gp.by/', linkText: 'Гомельская правда'
    },
    {
      id: 'n5', date: '20 мая 2026', tag: 'ООПТ',
      title: 'Нацпарк «Припятский» открыл сезон экологических маршрутов',
      text: 'В Житковичском районе стартовал сезон познавательных троп по пойменным дубравам Припяти. Особое внимание — гнездовьям чёрного аиста и орлана-белохвоста. Посещение Полесского заповедника по-прежнему только по пропускам.',
      link: 'https://www.gp.by/', linkText: 'Гомельская правда'
    },
    {
      id: 'n6', date: '8 апреля 2026', tag: 'Мониторинг',
      title: 'В Брагинском и Хойникском районах обновлены посты радиационного контроля',
      text: 'Комитет природных ресурсов облисполкома сообщил о модернизации сети контроля в южных районах. Данные о содержании радионуклидов в почвах и продуктах питания будут публиковаться ежеквартально.',
      link: 'https://gomel-region.gov.by/', linkText: 'Портал Гомельского облисполкома'
    }
  ]

  const defaultSuggestions = {
    shortTerm: [
      'Развернуть сетку датчиков PM2.5/PM10 в Гомеле, Жлобине, Мозыре и Светлогорске',
      'Внедрить общественный мониторинг сбросов с фотофиксацией и обратной связью',
      'Усилить контроль открытого горения (сухая трава, свалки)',
      'Организовать раздельный сбор отходов в школах и госучреждениях',
      'Озеленение улиц: высадка деревьев, приоритет — трасса М10 и промзоны',
      'Установить информационные табло с AQI на главных магистралях Гомеля'
    ],
    longTerm: [
      'Модернизация очистных сооружений и водозаборов',
      'Переход промпредприятий на наилучшие доступные технологии',
      'Развитие общественного транспорта и инфраструктуры для велосипедов',
      'Создание зелёных коридоров и защитных лесополос',
      'Экопросвещение и поддержка локальных экопроектов',
      'Создание единого регионального экологического портала с API'
    ]
  }

  const defaultKpi = { aqi: 54, water: 70 }

  const store = {
    KEYS,
    DATA_AS_OF: 'август 2026',

    getNews() { return read(KEYS.news, defaultNews) },
    setNews(items) { write(KEYS.news, items) },
    resetNews() { write(KEYS.news, defaultNews) },

    getSuggestions() { return read(KEYS.suggestions, defaultSuggestions) },
    setSuggestions(data) { write(KEYS.suggestions, data) },
    resetSuggestions() { write(KEYS.suggestions, defaultSuggestions) },

    getKnowledgeArticles() {
      const defaults = global.EcoKnowledgeDefaults || []
      const custom = read(KEYS.knowledge, [])
      const map = new Map(defaults.map((a) => [a.id, a]))
      custom.forEach((a) => map.set(a.id, a))
      return Array.from(map.values())
    },
    getCustomKnowledge() { return read(KEYS.knowledge, []) },
    setCustomKnowledge(items) { write(KEYS.knowledge, items) },
    addKnowledgeArticle(article) {
      const items = read(KEYS.knowledge, [])
      items.push(article)
      write(KEYS.knowledge, items)
    },
    removeKnowledgeArticle(id) {
      const defaults = (global.EcoKnowledgeDefaults || []).map((a) => a.id)
      if (defaults.includes(id)) {
        const hidden = read('gomel_eco_knowledge_hidden', [])
        if (!hidden.includes(id)) { hidden.push(id); write('gomel_eco_knowledge_hidden', hidden) }
        return
      }
      write(KEYS.knowledge, read(KEYS.knowledge, []).filter((a) => a.id !== id))
    },
    getHiddenKnowledge() { return read('gomel_eco_knowledge_hidden', []) },
    resetKnowledge() {
      write(KEYS.knowledge, [])
      write('gomel_eco_knowledge_hidden', [])
    },
    getVisibleKnowledge() {
      const hidden = new Set(read('gomel_eco_knowledge_hidden', []))
      return store.getKnowledgeArticles().filter((a) => !hidden.has(a.id))
    },

    getUserMessages() { return read(KEYS.userMessages, []) },
    addUserMessage(msg) {
      const items = read(KEYS.userMessages, [])
      items.unshift({ id: 'm' + Date.now(), date: new Date().toLocaleDateString('ru-RU'), ...msg, read: false })
      write(KEYS.userMessages, items)
    },
    markMessageRead(id) {
      const items = read(KEYS.userMessages, [])
      const m = items.find((x) => x.id === id)
      if (m) m.read = true
      write(KEYS.userMessages, items)
    },
    deleteUserMessage(id) {
      write(KEYS.userMessages, read(KEYS.userMessages, []).filter((m) => m.id !== id))
    },
    resetMessages() { write(KEYS.userMessages, []) },

    getKpi() { return read(KEYS.kpi, defaultKpi) },
    setKpi(data) { write(KEYS.kpi, data) },
    resetKpi() { write(KEYS.kpi, defaultKpi) },

    getCustomCleanPlaces() { return read(KEYS.cleanPlaces, []) },
    setCustomCleanPlaces(items) { write(KEYS.cleanPlaces, items) },
    getCustomDirtyPlaces() { return read(KEYS.dirtyPlaces, []) },
    setCustomDirtyPlaces(items) { write(KEYS.dirtyPlaces, items) },

    isAdmin() { return sessionStorage.getItem(KEYS.auth) === '1' },
    login(password) {
      const ok = password === 'eco2026'
      if (ok) sessionStorage.setItem(KEYS.auth, '1')
      return ok
    },
    logout() { sessionStorage.removeItem(KEYS.auth) },

    exportAll() {
      return JSON.stringify({
        news: store.getNews(),
        suggestions: store.getSuggestions(),
        knowledge: store.getCustomKnowledge(),
        hiddenKnowledge: store.getHiddenKnowledge(),
        messages: store.getUserMessages(),
        kpi: store.getKpi(),
        cleanPlaces: store.getCustomCleanPlaces(),
        dirtyPlaces: store.getCustomDirtyPlaces(),
        exportedAt: new Date().toISOString()
      }, null, 2)
    },

    importAll(json) {
      const data = JSON.parse(json)
      if (data.news) store.setNews(data.news)
      if (data.suggestions) store.setSuggestions(data.suggestions)
      if (data.knowledge) store.setCustomKnowledge(data.knowledge)
      if (data.hiddenKnowledge) write('gomel_eco_knowledge_hidden', data.hiddenKnowledge)
      if (data.messages) write(KEYS.userMessages, data.messages)
      if (data.kpi) store.setKpi(data.kpi)
      if (data.cleanPlaces) store.setCustomCleanPlaces(data.cleanPlaces)
      if (data.dirtyPlaces) store.setCustomDirtyPlaces(data.dirtyPlaces)
    },

    resetAll() {
      store.resetNews()
      store.resetSuggestions()
      store.resetKnowledge()
      store.resetMessages()
      store.resetKpi()
      store.setCustomCleanPlaces([])
      store.setCustomDirtyPlaces([])
    }
  }

  global.EcoDataStore = store
})(window)
