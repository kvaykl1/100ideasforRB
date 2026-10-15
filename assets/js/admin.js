;(function () {
  const loginSection = document.getElementById('loginSection')
  const dashboardSection = document.getElementById('dashboardSection')
  const btnLogout = document.getElementById('btnLogout')
  const sidebar = document.querySelector('.admin-sidebar')
  const pageTitle = document.getElementById('adminPageTitle')

  const TAB_TITLES = {
    'admin-news': 'Новости',
    'admin-suggestions': 'Предложения',
    'admin-places': 'Точки на карте',
    'admin-stats': 'Статистика'
  }

  function toast(msg) {
    const el = document.getElementById('adminToast')
    if (!el) return
    el.textContent = msg
    el.classList.add('show')
    setTimeout(() => el.classList.remove('show'), 2800)
  }

  function showDashboard() {
    loginSection.style.display = 'none'
    dashboardSection.style.display = 'flex'
    renderAll()
  }

  function showLogin() {
    loginSection.style.display = 'grid'
    dashboardSection.style.display = 'none'
  }

  function switchTab(tabId) {
    document.querySelectorAll('.admin-nav-item').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === tabId)
    })
    document.querySelectorAll('.admin-panel').forEach((p) => {
      p.classList.toggle('active', p.id === 'tab-' + tabId)
    })
    if (pageTitle) pageTitle.textContent = TAB_TITLES[tabId] || 'Панель'
    if (sidebar) sidebar.classList.remove('open')
  }

  function initAuth() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault()
      const password = document.getElementById('loginPassword').value
      const error = document.getElementById('loginError')
      if (EcoDataStore.login(password)) {
        error.style.display = 'none'
        showDashboard()
        toast('✅ Добро пожаловать в панель администратора')
      } else {
        error.style.display = 'flex'
      }
    })

    btnLogout.addEventListener('click', () => {
      EcoDataStore.logout()
      showLogin()
    })

    if (EcoDataStore.isAdmin()) showDashboard()
  }

  function initTabs() {
    document.querySelectorAll('.admin-nav-item').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab))
    })

    const menuToggle = document.getElementById('adminMenuToggle')
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'))
    }
  }

  function renderNews() {
    const list = document.getElementById('newsList')
    if (!list) return
    const news = EcoDataStore.getNews()
    const countLabel = document.getElementById('newsCountLabel')
    if (countLabel) countLabel.textContent = news.length + ' запис' + (news.length === 1 ? 'ь' : news.length < 5 ? 'и' : 'ей')

    if (!news.length) {
      list.innerHTML = '<div class="admin-list-item"><p class="muted" style="margin:0;">Новостей пока нет. Добавьте первую запись.</p></div>'
      return
    }

    list.innerHTML = news.map((item, idx) => `
      <div class="admin-list-item">
        <div class="admin-list-meta">
          <span class="news-tag">${item.date}</span>
          <span class="news-tag">${item.tag}</span>
        </div>
        <h4>${item.title}</h4>
        <p class="muted">${item.text.substring(0, 160)}${item.text.length > 160 ? '…' : ''}</p>
        <button class="admin-delete-btn" data-type="news" data-idx="${idx}">🗑 Удалить</button>
      </div>
    `).join('')
  }

  function renderSuggestions() {
    const data = EcoDataStore.getSuggestions()
    renderEditableList('adminShortList', data.shortTerm, 'shortTerm')
    renderEditableList('adminLongList', data.longTerm, 'longTerm')
  }

  function renderEditableList(elId, items, key) {
    const el = document.getElementById(elId)
    if (!el) return
    if (!items.length) {
      el.innerHTML = '<li class="muted" style="padding:12px 0;">Список пуст</li>'
      return
    }
    el.innerHTML = items.map((item, idx) => `
      <li class="admin-editable-item">
        <span>${item}</span>
        <button class="admin-delete-btn" data-type="suggestion" data-key="${key}" data-idx="${idx}" title="Удалить">×</button>
      </li>
    `).join('')
  }

  function renderPlaces() {
    const clean = EcoDataStore.getCustomCleanPlaces()
    const dirty = EcoDataStore.getCustomDirtyPlaces()
    const cleanEl = document.getElementById('adminCleanList')
    const dirtyEl = document.getElementById('adminDirtyList')
    const cleanLabel = document.getElementById('cleanCountLabel')
    const dirtyLabel = document.getElementById('dirtyCountLabel')

    if (cleanLabel) cleanLabel.textContent = clean.length + ' точек'
    if (dirtyLabel) dirtyLabel.textContent = dirty.length + ' точек'

    if (cleanEl) {
      cleanEl.innerHTML = clean.length
        ? clean.map((p, idx) => `<li class="admin-editable-item"><span>${p.name}</span><button class="admin-delete-btn" data-type="clean" data-idx="${idx}">×</button></li>`).join('')
        : '<li class="muted" style="padding:12px 0;">Нет пользовательских точек</li>'
    }
    if (dirtyEl) {
      dirtyEl.innerHTML = dirty.length
        ? dirty.map((p, idx) => `<li class="admin-editable-item"><span>${p.name} <em style="color:var(--muted)">(${p.severity})</em></span><button class="admin-delete-btn" data-type="dirty" data-idx="${idx}">×</button></li>`).join('')
        : '<li class="muted" style="padding:12px 0;">Нет пользовательских точек</li>'
    }
  }

  function renderStats() {
    const news = EcoDataStore.getNews()
    const sugg = EcoDataStore.getSuggestions()
    const clean = EcoDataStore.getCustomCleanPlaces().length
    const dirty = EcoDataStore.getCustomDirtyPlaces().length
    const suggTotal = sugg.shortTerm.length + sugg.longTerm.length

    document.getElementById('statNews').textContent = news.length
    document.getElementById('statSuggestions').textContent = suggTotal
    document.getElementById('statClean').textContent = clean
    document.getElementById('statDirty').textContent = dirty

    const badgeNews = document.getElementById('badgeNews')
    const badgeSuggestions = document.getElementById('badgeSuggestions')
    const badgePlaces = document.getElementById('badgePlaces')
    if (badgeNews) badgeNews.textContent = news.length
    if (badgeSuggestions) badgeSuggestions.textContent = suggTotal
    if (badgePlaces) badgePlaces.textContent = clean + dirty
  }

  function renderAll() {
    renderNews()
    renderSuggestions()
    renderPlaces()
    renderStats()
    const asOf = EcoDataStore.DATA_AS_OF
    document.querySelectorAll('#adminDataAsOf, #helpDataAsOf').forEach((el) => {
      if (el) el.textContent = asOf
    })
  }

  function initNewsForm() {
    document.getElementById('newsForm').addEventListener('submit', (e) => {
      e.preventDefault()
      const news = EcoDataStore.getNews()
      news.unshift({
        id: 'n' + Date.now(),
        date: document.getElementById('newsDate').value.trim(),
        tag: document.getElementById('newsTag').value.trim(),
        title: document.getElementById('newsTitle').value.trim(),
        text: document.getElementById('newsText').value.trim(),
        link: document.getElementById('newsLink').value.trim(),
        linkText: document.getElementById('newsLinkText').value.trim() || 'Подробнее'
      })
      EcoDataStore.setNews(news)
      e.target.reset()
      renderAll()
      toast('✅ Новость опубликована')
    })
  }

  function initSuggestionForms() {
    document.getElementById('addShortForm').addEventListener('submit', (e) => {
      e.preventDefault()
      const val = document.getElementById('newShort').value.trim()
      if (!val) return
      const data = EcoDataStore.getSuggestions()
      data.shortTerm.push(val)
      EcoDataStore.setSuggestions(data)
      document.getElementById('newShort').value = ''
      renderAll()
      toast('✅ Предложение добавлено')
    })
    document.getElementById('addLongForm').addEventListener('submit', (e) => {
      e.preventDefault()
      const val = document.getElementById('newLong').value.trim()
      if (!val) return
      const data = EcoDataStore.getSuggestions()
      data.longTerm.push(val)
      EcoDataStore.setSuggestions(data)
      document.getElementById('newLong').value = ''
      renderAll()
      toast('✅ Предложение добавлено')
    })
  }

  function initDeleteHandlers() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.admin-delete-btn')
      if (!btn) return
      const type = btn.dataset.type
      const idx = parseInt(btn.dataset.idx, 10)

      if (type === 'news') {
        const news = EcoDataStore.getNews()
        news.splice(idx, 1)
        EcoDataStore.setNews(news)
        toast('🗑 Новость удалена')
      } else if (type === 'suggestion') {
        const data = EcoDataStore.getSuggestions()
        data[btn.dataset.key].splice(idx, 1)
        EcoDataStore.setSuggestions(data)
        toast('🗑 Предложение удалено')
      } else if (type === 'clean') {
        const items = EcoDataStore.getCustomCleanPlaces()
        items.splice(idx, 1)
        EcoDataStore.setCustomCleanPlaces(items)
        toast('🗑 Точка удалена')
      } else if (type === 'dirty') {
        const items = EcoDataStore.getCustomDirtyPlaces()
        items.splice(idx, 1)
        EcoDataStore.setCustomDirtyPlaces(items)
        toast('🗑 Точка удалена')
      }
      renderAll()
    })
  }

  function initReset() {
    document.getElementById('btnResetAll').addEventListener('click', () => {
      if (!confirm('Сбросить все данные к исходным (' + EcoDataStore.DATA_AS_OF + ')?')) return
      EcoDataStore.resetNews()
      EcoDataStore.resetSuggestions()
      EcoDataStore.setCustomCleanPlaces([])
      EcoDataStore.setCustomDirtyPlaces([])
      renderAll()
      toast('↺ Данные восстановлены')
    })
  }

  function init() {
    initAuth()
    initTabs()
    initNewsForm()
    initSuggestionForms()
    initDeleteHandlers()
    initReset()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
