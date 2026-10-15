;(function () {
  function renderSuggestions() {
    const data = EcoDataStore.getSuggestions()
    const shortEl = document.getElementById('shortTermList')
    const longEl = document.getElementById('longTermList')
    if (!shortEl || !longEl) return

    shortEl.innerHTML = data.shortTerm.map((item) => `<li>${item}</li>`).join('')
    longEl.innerHTML = data.longTerm.map((item) => `<li>${item}</li>`).join('')
  }

  function initTabs() {
    const buttons = document.querySelectorAll('.news-tab-btn')
    const panels = document.querySelectorAll('.news-tab-panel')

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab')
        buttons.forEach((b) => b.classList.remove('active'))
        panels.forEach((p) => p.classList.remove('active'))
        btn.classList.add('active')
        const panel = document.getElementById('tab-' + target)
        if (panel) panel.classList.add('active')
      })
    })

    if (location.hash === '#suggestions') {
      const btn = document.querySelector('[data-tab="suggestions"]')
      if (btn) btn.click()
    }
  }

  function initSuggestionForm() {
    const form = document.getElementById('suggestionForm')
    if (!form) return

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const name = document.getElementById('suggName').value.trim()
      const category = document.getElementById('suggCategory').value
      const text = document.getElementById('suggText').value.trim()
      if (!name || !text) return

      const key = category === 'short' ? 'shortTerm' : 'longTerm'
      const data = EcoDataStore.getSuggestions()
      data[key].push(`<strong>${name}:</strong> ${text}`)
      EcoDataStore.setSuggestions(data)
      renderSuggestions()
      form.reset()
      const success = document.getElementById('suggSuccess')
      if (success) {
        success.style.display = 'block'
        setTimeout(() => { success.style.display = 'none' }, 4000)
      }
    })
  }

  function init() {
    const asOf = document.getElementById('dataAsOf')
    if (asOf) asOf.textContent = EcoDataStore.DATA_AS_OF
    renderSuggestions()
    initTabs()
    initSuggestionForm()

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
