;(function () {
  // Центр области (между Гомелем и Полесьем), чтобы на обзоре были Сож, Днепр и Припять
  const center = [52.35, 29.85]
  const initialZoom = 8
  const oblastBounds = [[51.18, 27.20], [53.42, 32.80]]

  const DISTRICTS = [
    'г. Гомель', 'Брагинский', 'Буда-Кошелёвский', 'Ветковский', 'Гомельский',
    'Добрушский', 'Ельский', 'Житковичский', 'Жлобинский', 'Калинковичский',
    'Кормянский', 'Лельчицкий', 'Лоевский', 'Мозырский', 'Наровлянский',
    'Октябрьский', 'Петриковский', 'Речицкий', 'Рогачёвский', 'Светлогорский',
    'Хойникский', 'Чечерский'
  ]

  // Данные: чистые и проблемные точки (актуально на август 2026)
  const baseCleanPlaces = [
    { name: 'Гомель — парк Румянцевых-Паскевичей', coords: [52.4217, 31.0167], district: 'г. Гомель', note: 'Главный городской парк, зелёный каркас центра' },
    { name: 'Нацпарк «Припятский»', coords: [52.0500, 27.8500], district: 'Житковичский', note: 'Пойменные дубравы и болота Белорусского Полесья' },
    { name: 'Пойма реки Сож', coords: [52.4000, 31.0200], district: 'г. Гомель', note: 'Природная пойма, рекреация и рыболовство' },
    { name: 'Добруш — лесной массив', coords: [52.4089, 31.3239], district: 'Добрушский', note: 'Сосновые леса на востоке области' },
    { name: 'Туров — пойменные луга', coords: [52.0680, 27.7350], district: 'Житковичский', note: 'Ключевые места остановок перелётных птиц' },
    { name: 'Житковичи — озеро Червоное', coords: [52.2170, 27.8560], district: 'Житковичский', note: 'Крупнейший водоём Полесья' },
    { name: 'Чечерск — дворцово-парковый комплекс', coords: [52.9160, 30.9160], district: 'Чечерский', note: 'Исторический парк, зелёный каркас города' },
    { name: 'Лоев — берег Днепра', coords: [51.9410, 30.7960], district: 'Лоевский', note: 'Слияние Сожа и Днепра, низкая плотность застройки' },
    { name: 'Ветка — прибрежная зона Сожа', coords: [52.5590, 31.1810], district: 'Ветковский', note: 'Лесопарки и пойменные участки' },
    { name: 'Петриков — леса Полесья', coords: [52.1280, 28.4950], district: 'Петриковский', note: 'Болотные экосистемы, малая нагрузка' },
    { name: 'Рогачёв — берег Днепра', coords: [53.0930, 30.0500], district: 'Рогачёвский', note: 'Север области, зелёные насаждения' },
    { name: 'Ельск — полесский ландшафт', coords: [51.8160, 29.1520], district: 'Ельский', note: 'Низкая плотность застройки, леса' },
    { name: 'Заказник «Выдрица»', coords: [52.7200, 29.9200], district: 'Жлобинский', note: 'Пойменные леса по Днепру и Березине' },
    { name: 'Лельчицы — лесной фонд', coords: [51.7860, 28.3280], district: 'Лельчицкий', note: 'Один из самых лесистых районов области' },
    { name: 'Буда-Кошелёво — городской парк', coords: [52.7160, 30.5670], district: 'Буда-Кошелёвский', note: 'Зелёная зона районного центра' },
    { name: 'Октябрьский — природный ландшафт', coords: [52.6470, 28.8800], district: 'Октябрьский', note: 'Полесские леса и болота' }
  ]

  const baseDirtyPlaces = [
    { name: 'Промзона Гомеля (Гомсельмаш)', coords: [52.4450, 30.9600], district: 'г. Гомель', severity: 'высокая', pollutant: 'PM10, NO₂' },
    { name: 'Мозырский нефтеперерабатывающий завод', coords: [52.0500, 29.2700], district: 'Мозырский', severity: 'высокая', pollutant: 'VOC, SO₂, углеводороды' },
    { name: 'Светлогорск — «Химволокно»', coords: [52.6330, 29.7490], district: 'Светлогорский', severity: 'высокая', pollutant: 'VOC, PM10' },
    { name: 'Жлобин — Белорусский металлургический завод', coords: [52.8920, 30.0240], district: 'Жлобинский', severity: 'высокая', pollutant: 'PM10, NO₂, пыль' },
    { name: 'Речица — промышленная площадка', coords: [52.3640, 30.3910], district: 'Речицкий', severity: 'средняя', pollutant: 'PM10, NO₂' },
    { name: 'Гомельский химический завод', coords: [52.4000, 30.9100], district: 'г. Гомель', severity: 'высокая', pollutant: 'фосфаты, пыль, SO₂' },
    { name: 'Неорганизованные свалки (окрестности Гомеля)', coords: [52.4800, 31.0500], district: 'Гомельский', severity: 'высокая', pollutant: 'твёрдые отходы' },
    { name: 'Транспортный узел трассы М10', coords: [52.4300, 30.9400], district: 'г. Гомель', severity: 'средняя', pollutant: 'PM2.5, NO₂' },
    { name: 'Калинковичи — железнодорожный узел', coords: [52.1320, 29.3260], district: 'Калинковичский', severity: 'средняя', pollutant: 'пыль, шум' },
    { name: 'Хойники — наследие радиационного загрязнения', coords: [51.9080, 29.9550], district: 'Хойникский', severity: 'средняя', pollutant: 'радионуклиды почв' },
    { name: 'Брагинский район — почвенные загрязнения', coords: [51.7870, 30.2670], district: 'Брагинский', severity: 'средняя', pollutant: 'радионуклиды, тяжёлые металлы' },
    { name: 'Мозырь — участок у нефтепровода', coords: [52.0490, 29.2460], district: 'Мозырский', severity: 'средняя', pollutant: 'углеводороды' },
    { name: 'Наровлянский район — зона отчуждения', coords: [51.7960, 29.5010], district: 'Наровлянский', severity: 'средняя', pollutant: 'радионуклиды почв' },
    { name: 'Гомельская ТЭЦ-2', coords: [52.4020, 30.9230], district: 'г. Гомель', severity: 'средняя', pollutant: 'NO₂, SO₂, пыль' },
    { name: 'Речицанефтегаз', coords: [52.3710, 30.3810], district: 'Речицкий', severity: 'средняя', pollutant: 'углеводороды, VOC' }
  ]

  let cleanPlaces = baseCleanPlaces.concat(
    typeof EcoDataStore !== 'undefined' ? EcoDataStore.getCustomCleanPlaces() : []
  )
  let dirtyPlaces = baseDirtyPlaces.concat(
    typeof EcoDataStore !== 'undefined' ? EcoDataStore.getCustomDirtyPlaces() : []
  )

  function saveCustomPlaces() {
    if (typeof EcoDataStore === 'undefined') return
    EcoDataStore.setCustomCleanPlaces(cleanPlaces.slice(baseCleanPlaces.length))
    EcoDataStore.setCustomDirtyPlaces(dirtyPlaces.slice(baseDirtyPlaces.length))
  }

  // KPI заполнение (данные на август 2026)
  function setKpis() {
    const avgAqi = 54
    const waterIdx = 70
    animateNumber(document.getElementById('kpi-air'), avgAqi)
    animateNumber(document.getElementById('kpi-water'), waterIdx)
    animateNumber(document.getElementById('kpi-clean'), cleanPlaces.length)
    animateNumber(document.getElementById('kpi-dirty'), dirtyPlaces.length)
  }

  function animateNumber(el, target) {
    if (!el) return
    const start = Number(el.textContent.replace(/[^0-9.-]/g, '')) || 0
    const duration = 700
    const startTime = performance.now()
    function frame(now) {
      const p = Math.min(1, (now - startTime) / duration)
      const val = Math.round(start + (target - start) * (1 - Math.cos(p * Math.PI)) / 2)
      el.textContent = val
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  // Список загрязнённых зон
  function renderPollutionList() {
    const list = document.getElementById('pollutionList')
    if (!list) return
    const items = visibleDirtyPlaces().map((p) => {
      const severity = p.severity === 'высокая' ? 'bad' : 'warn'
      const district = p.district ? ` · ${p.district}` : ''
      return `<li>
        <div>
          <strong>${p.name}</strong>
          <div style="color:#b6c4bf;font-size:12px;margin-top:2px;">${p.pollutant}${district}</div>
        </div>
        <span class="badge ${severity}">${p.severity}</span>
      </li>`
    })
    list.innerHTML = items.join('')
  }

  // Предприятия (демоданные) и рендер списка
  const emitters = [
    { name: 'БМЗ (Жлобин)', percent: 22 },
    { name: 'Мозырский НПЗ', percent: 18 },
    { name: 'СветлогорскХимволокно', percent: 14 },
    { name: 'Гомсельмаш', percent: 12 },
    { name: 'Гомельский химический завод', percent: 10 },
    { name: 'Речицкий метизный завод', percent: 8 },
    { name: 'Гомельстекло', percent: 6 },
    { name: 'Гомельтранснефть Дружба', percent: 5 },
    { name: 'Мозырьсоль', percent: 3 },
    { name: 'Гомельский вагоностроительный завод', percent: 2 }
  ]

  function renderEmittersList() {
    const list = document.getElementById('emittersList')
    if (!list) return
    list.innerHTML = emitters
      .map((e) => `<li><div><strong>${e.name}</strong></div><span class="chip">${e.percent}%</span></li>`)
      .join('')
  }

  // Инициализация карты Leaflet
  let map, cleanLayer, dirtyLayer
  let cleanCluster, dirtyCluster, heatLayer
  let addPointMode = false

  function selectedDistrict() {
    const sel = document.getElementById('districtFilter')
    return sel ? sel.value : 'all'
  }

  function matchesDistrict(place) {
    const value = selectedDistrict()
    if (value === 'all') return true
    return place.district === value
  }

  function visibleCleanPlaces() {
    return cleanPlaces.filter(matchesDistrict)
  }

  function visibleDirtyPlaces() {
    return dirtyPlaces.filter(matchesDistrict)
  }

  function fillDistrictFilter() {
    const sel = document.getElementById('districtFilter')
    const markerSel = document.getElementById('markerDistrict')
    const options = DISTRICTS.map((d) => `<option value="${d}">${d}</option>`).join('')
    if (sel && sel.options.length < 3) {
      sel.innerHTML = '<option value="all">Все районы области</option>' + options
    }
    if (markerSel && markerSel.options.length < 2) {
      markerSel.innerHTML = options
    }
  }

  function initMap() {
    const mapContainer = document.getElementById('mapContainer')
    if (!mapContainer) return
    fillDistrictFilter()
    map = L.map(mapContainer, { minZoom: 7, maxZoom: 18 }).setView(center, initialZoom)
    map.setMaxBounds(L.latLngBounds(oblastBounds).pad(0.15))

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors, © CARTO'
    }).addTo(map)

    cleanLayer = L.layerGroup()
    dirtyLayer = L.layerGroup()
    cleanCluster = L.markerClusterGroup({ disableClusteringAtZoom: 14 })
    dirtyCluster = L.markerClusterGroup({ disableClusteringAtZoom: 14 })
    // no draw tools

    function addPlaceLayers() {
      visibleCleanPlaces().forEach((p) => {
        const extra = p.district ? `<br><span style="color:#9ca3af">Район: ${p.district}</span>` : ''
        const marker = L.circleMarker(p.coords, { radius: 8, color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.8 })
          .bindPopup(`<strong>${p.name}</strong><br>${p.note || ''}${extra}`)
        cleanLayer.addLayer(marker)
        cleanCluster.addLayer(L.marker(p.coords, { title: p.name }))
      })
      visibleDirtyPlaces().forEach((p) => {
        const extra = p.district ? `<br><span style="color:#9ca3af">Район: ${p.district}</span>` : ''
        const marker = L.circleMarker(p.coords, { radius: 8, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.85 })
          .bindPopup(`<strong>${p.name}</strong><br>Степень: ${p.severity}<br>${p.pollutant || ''}${extra}`)
        dirtyLayer.addLayer(marker)
        dirtyCluster.addLayer(L.marker(p.coords, { title: p.name }))
      })
    }
    addPlaceLayers()

    cleanLayer.addTo(map)
    dirtyLayer.addTo(map)
    cleanCluster.addTo(map)
    dirtyCluster.addTo(map)

    // Heatmap по проблемным точкам
    const heatData = visibleDirtyPlaces().map((p) => [...p.coords, p.severity === 'высокая' ? 0.9 : 0.5])
    heatLayer = L.heatLayer(heatData, { radius: 22, blur: 18, maxZoom: 12 })

    const overlays = {
      'Чистые локации': cleanLayer,
      'Проблемные локации': dirtyLayer,
    }
    L.control.layers({}, overlays, { collapsed: false, position: 'topright' }).addTo(map)

    // Легенда
    const legend = L.control({ position: 'bottomright' })
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'card')
      div.style.padding = '10px'
      div.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px;">Легенда</div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;">
          <span style="width:10px;height:10px;border-radius:50%;background:#22c55e;display:inline-block"></span>
          <span style="color:#b6c4bf;font-size:13px;">Чистая зона</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span style="width:10px;height:10px;border-radius:50%;background:#ef4444;display:inline-block"></span>
          <span style="color:#b6c4bf;font-size:13px;">Проблемная зона</span>
        </div>
      `
      return div
    }
    legend.addTo(map)

    // Переключатели
    const toggleClean = document.getElementById('toggleClean')
    const toggleDirty = document.getElementById('toggleDirty')
    const toggleClusters = document.getElementById('toggleClusters')
    const toggleHeat = document.getElementById('toggleHeat')
    const districtFilter = document.getElementById('districtFilter')
    const btnAddPoint = document.getElementById('btnAddPoint')
    if (districtFilter) {
      districtFilter.addEventListener('change', () => rerender())
    }
    toggleClean.addEventListener('change', () => {
      if (toggleClean.checked) cleanLayer.addTo(map)
      else map.removeLayer(cleanLayer)
    })
    toggleDirty.addEventListener('change', () => {
      if (toggleDirty.checked) dirtyLayer.addTo(map)
      else map.removeLayer(dirtyLayer)
    })
    toggleClusters.addEventListener('change', () => {
      if (toggleClusters.checked) {
        cleanCluster.addTo(map)
        dirtyCluster.addTo(map)
      } else {
        map.removeLayer(cleanCluster)
        map.removeLayer(dirtyCluster)
      }
    })
    toggleHeat.addEventListener('change', () => {
      if (toggleHeat.checked) heatLayer.addTo(map)
      else map.removeLayer(heatLayer)
    })
    let pendingMarkerCoords = null
    const markerModal = document.getElementById('markerModal')
    const markerType = document.getElementById('markerType')
    const markerName = document.getElementById('markerName')
    const markerNote = document.getElementById('markerNote')
    const markerSeverity = document.getElementById('markerSeverity')
    const markerPollutant = document.getElementById('markerPollutant')
    const markerNoteGroup = document.getElementById('markerNoteGroup')
    const markerSeverityGroup = document.getElementById('markerSeverityGroup')
    const markerDistrict = document.getElementById('markerDistrict')
    const markerPollutantGroup = document.getElementById('markerPollutantGroup')
    const markerSubmit = document.getElementById('markerSubmit')
    const markerCancel = document.getElementById('markerCancel')
    const modalClose = document.getElementById('modalClose')

    // Переключение видимости полей при смене типа точки
    markerType.addEventListener('change', () => {
      if (markerType.value === 'clean') {
        markerNoteGroup.style.display = 'block'
        markerSeverityGroup.style.display = 'none'
        markerPollutantGroup.style.display = 'none'
      } else {
        markerNoteGroup.style.display = 'none'
        markerSeverityGroup.style.display = 'block'
        markerPollutantGroup.style.display = 'block'
      }
    })

    // Открытие модального окна
    btnAddPoint.addEventListener('click', () => {
      addPointMode = !addPointMode
      if (addPointMode) {
        btnAddPoint.textContent = 'Отменить добавление'
        btnAddPoint.style.background = 'var(--danger)'
      } else {
        btnAddPoint.textContent = 'Добавить точку кликом'
        btnAddPoint.style.background = ''
        closeModal()
      }
    })

    // Обработка клика на карте
    map.on('click', (ev) => {
      if (!addPointMode) return
      pendingMarkerCoords = ev.latlng
      markerName.value = ''
      markerNote.value = ''
      markerPollutant.value = ''
      markerType.value = 'clean'
      markerSeverity.value = 'средняя'
      markerNoteGroup.style.display = 'block'
      markerSeverityGroup.style.display = 'none'
      markerPollutantGroup.style.display = 'none'
      markerModal.classList.add('show')
      markerName.focus()
    })

    // Закрытие модального окна
    function closeModal() {
      markerModal.classList.remove('show')
      addPointMode = false
      btnAddPoint.textContent = 'Добавить точку кликом'
      btnAddPoint.style.background = ''
      pendingMarkerCoords = null
    }

    modalClose.addEventListener('click', closeModal)
    markerCancel.addEventListener('click', closeModal)
    markerModal.addEventListener('click', (e) => {
      if (e.target === markerModal) closeModal()
    })

    // Отправка формы
    function submitMarker() {
      if (!pendingMarkerCoords) return
      const name = markerName.value.trim()
      if (!name) {
        markerName.focus()
        markerName.style.borderColor = 'var(--danger)'
        setTimeout(() => {
          markerName.style.borderColor = ''
        }, 2000)
        return
      }
      const { lat, lng } = pendingMarkerCoords
      
      const district = markerDistrict && markerDistrict.value ? markerDistrict.value : ''
      if (markerType.value === 'clean') {
        cleanPlaces.push({
          name,
          coords: [lat, lng],
          district,
          note: markerNote.value.trim() || ''
        })
      } else {
        dirtyPlaces.push({
          name,
          coords: [lat, lng],
          district,
          severity: markerSeverity.value || 'средняя',
          pollutant: markerPollutant.value.trim() || ''
        })
      }
      saveCustomPlaces()
      closeModal()
      rerender()
    }

    markerSubmit.addEventListener('click', submitMarker)
    
    // Отправка по Enter
    markerName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        submitMarker()
      }
    })
    markerNote.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault()
        submitMarker()
      }
    })
    markerPollutant.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault()
        submitMarker()
      }
    })

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && markerModal.classList.contains('show')) {
        closeModal()
      }
    })
  }

  // Диаграммы (демо)
  function initCharts() {
    const airCtx = document.getElementById('airChart')
    const waterCtx = document.getElementById('waterChart')
    const emittersCtx = document.getElementById('emittersChart')

    // Воздух: PM2.5, PM10, NO2, SO2 — январь–август 2026
    if (airCtx && typeof Chart !== 'undefined') {
      new Chart(airCtx, {
        type: 'line',
        data: {
          labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг'],
          datasets: [
            { label: 'PM2.5', data: [16, 19, 17, 14, 12, 11, 10, 10], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.15)', tension: 0.35, fill: true },
            { label: 'PM10', data: [26, 28, 25, 22, 19, 17, 16, 15], borderColor: '#6ee7b7', backgroundColor: 'rgba(110,231,183,0.15)', tension: 0.35, fill: true },
            { label: 'NO₂', data: [22, 24, 20, 18, 16, 15, 14, 13], borderColor: '#a7f3d0', backgroundColor: 'rgba(167,243,208,0.1)', tension: 0.35, fill: true },
            { label: 'SO₂', data: [9, 10, 9, 8, 7, 6, 6, 5], borderColor: '#86efac', backgroundColor: 'rgba(134,239,172,0.1)', tension: 0.35, fill: true },
          ]
        },
        options: {
          plugins: { legend: { labels: { color: '#e8f1ee' } } },
          scales: {
            x: { ticks: { color: '#b6c4bf' }, grid: { color: 'rgba(255,255,255,0.06)' } },
            y: { ticks: { color: '#b6c4bf' }, grid: { color: 'rgba(255,255,255,0.06)' } }
          }
        }
      })
    }

    // Вода: мутность, нитраты, БПК5, pH (относительно)
    if (waterCtx && typeof Chart !== 'undefined') {
      new Chart(waterCtx, {
        type: 'radar',
        data: {
          labels: ['Мутность', 'Нитраты', 'БПК5', 'pH', 'Жесткость'],
          datasets: [
            { label: 'Сож (Гомель)', data: [52, 40, 50, 72, 48], backgroundColor: 'rgba(52,199,89,0.15)', borderColor: '#34c759' },
            { label: 'Припять (Мозырь / Туров)', data: [48, 38, 46, 74, 44], backgroundColor: 'rgba(6,182,212,0.12)', borderColor: '#22d3ee' },
            { label: 'Днепр (Речица / Рогачёв)', data: [58, 46, 55, 71, 52], backgroundColor: 'rgba(110,231,183,0.12)', borderColor: '#6ee7b7' }
          ]
        },
        options: {
          plugins: { legend: { labels: { color: '#e8f1ee' } } },
          scales: {
            r: {
              angleLines: { color: 'rgba(255,255,255,0.06)' },
              grid: { color: 'rgba(255,255,255,0.06)' },
              pointLabels: { color: '#b6c4bf' },
              ticks: { display: false }
            }
          }
        }
      })
    }

    // Предприятия: горизонтальные бары (демоданные)
    if (emittersCtx && typeof Chart !== 'undefined') {
      const labels = emitters.map((e) => e.name)
      const data = emitters.map((e) => e.percent)
      new Chart(emittersCtx, {
        type: 'bar',
        data: { labels, datasets: [{ label: '% вклада', data, backgroundColor: '#ef4444' }] },
        options: {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#b6c4bf', callback: (v) => v + '%' }, grid: { color: 'rgba(255,255,255,0.06)' }, max: 100 },
            y: { ticks: { color: '#e8f1ee' }, grid: { display: false } }
          }
        }
      })
    }
  }


  function rerender() {
    // Перерисовать KPI, список и слои карты
    setKpis()
    renderPollutionList()
    if (map) {
      map.removeLayer(cleanLayer)
      map.removeLayer(dirtyLayer)
      cleanLayer = L.layerGroup()
      dirtyLayer = L.layerGroup()
      cleanCluster.clearLayers()
      dirtyCluster.clearLayers()
      visibleCleanPlaces().forEach((p) => {
        const extra = p.district ? `<br><span style="color:#9ca3af">Район: ${p.district}</span>` : ''
        const marker = L.circleMarker(p.coords, { radius: 8, color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.8 })
          .bindPopup(`<strong>${p.name}</strong><br>${p.note || ''}${extra}`)
        cleanLayer.addLayer(marker)
        cleanCluster.addLayer(L.marker(p.coords, { title: p.name }))
      })
      visibleDirtyPlaces().forEach((p) => {
        const extra = p.district ? `<br><span style="color:#9ca3af">Район: ${p.district}</span>` : ''
        const marker = L.circleMarker(p.coords, { radius: 8, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.85 })
          .bindPopup(`<strong>${p.name}</strong><br>Степень: ${p.severity || ''}<br>${p.pollutant || ''}${extra}`)
        dirtyLayer.addLayer(marker)
        dirtyCluster.addLayer(L.marker(p.coords, { title: p.name }))
      })
      cleanLayer.addTo(map)
      dirtyLayer.addTo(map)
      const heatData = visibleDirtyPlaces().map((p) => [...p.coords, p.severity === 'высокая' ? 0.9 : 0.5])
      if (heatLayer) heatLayer.setLatLngs(heatData)
    }
  }


  // Инициализация
  setKpis()
  renderPollutionList()
  renderEmittersList()
  initMap()
  initCharts()

  // Установка глобальных переменных для features.js
  if (typeof setGlobalVars === 'function') {
    setGlobalVars(cleanPlaces, dirtyPlaces, map, rerender)
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible')
    })
  }, { threshold: 0.15 })
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

})()


