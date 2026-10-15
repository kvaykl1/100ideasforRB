;(function () {
  function renderNews() {
    const grid = document.getElementById('newsGrid')
    if (!grid || typeof EcoDataStore === 'undefined') return

    const news = EcoDataStore.getNews()
    grid.innerHTML = news.map((item) => `
      <article class="card news-card">
        <div class="news-meta">
          <span class="news-tag">${item.date}</span>
          <span class="news-tag">${item.tag}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        ${item.link ? `<a class="btn-link" href="${item.link}" target="_blank" rel="noopener">${item.linkText || 'Подробнее'}</a>` : ''}
      </article>
    `).join('')
  }

  function initNewsTabs() {
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
  }

  function init() {
    renderNews()
    initNewsTabs()
    const asOf = document.getElementById('dataAsOf')
    if (asOf) asOf.textContent = EcoDataStore.DATA_AS_OF

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
