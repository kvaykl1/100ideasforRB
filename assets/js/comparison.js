;(function () {
  // Данные для сравнения регионов (актуально на август 2026)
  const regionalData = [
    { 
      name: 'Гомельская область', 
      aqi: 54, 
      waterIndex: 70, 
      emissions: 52.0, 
      wasteProcessing: 39,
      pm25: 16,
      pm10: 25,
      no2: 21,
      so2: 9,
      forestCover: 46.2,
      population: 1380,
      area: 40.4
    },
    { 
      name: 'Могилёвская область', 
      aqi: 51, 
      waterIndex: 72, 
      emissions: 44.1, 
      wasteProcessing: 40,
      pm25: 15,
      pm10: 23,
      no2: 19,
      so2: 8,
      forestCover: 38.4,
      population: 1005,
      area: 29.1
    },
    { 
      name: 'Минская область', 
      aqi: 48, 
      waterIndex: 73, 
      emissions: 41.2, 
      wasteProcessing: 48,
      pm25: 14,
      pm10: 21,
      no2: 18,
      so2: 6,
      forestCover: 38.0,
      population: 1470,
      area: 39.9
    },
    { 
      name: 'Брестская область', 
      aqi: 46, 
      waterIndex: 75, 
      emissions: 33.4, 
      wasteProcessing: 42,
      pm25: 12,
      pm10: 19,
      no2: 16,
      so2: 5,
      forestCover: 36.1,
      population: 1330,
      area: 32.8
    },
    { 
      name: 'Витебская область', 
      aqi: 45, 
      waterIndex: 76, 
      emissions: 32.1, 
      wasteProcessing: 40,
      pm25: 12,
      pm10: 18,
      no2: 15,
      so2: 5,
      forestCover: 42.3,
      population: 1105,
      area: 40.1
    },
    { 
      name: 'Гродненская область', 
      aqi: 47, 
      waterIndex: 74, 
      emissions: 35.6, 
      wasteProcessing: 43,
      pm25: 13,
      pm10: 20,
      no2: 17,
      so2: 6,
      forestCover: 35.5,
      population: 1015,
      area: 25.1
    }
  ]

  // Вычисление общего рейтинга
  function calculateRanking(region) {
    // Нормализуем показатели (чем меньше/больше - тем лучше)
    const aqiScore = 100 - (region.aqi / 80) * 100 // AQI: меньше лучше
    const waterScore = region.waterIndex // Вода: больше лучше
    const emissionsScore = 100 - (region.emissions / 60) * 100 // Выбросы: меньше лучше
    const wasteScore = region.wasteProcessing // Переработка: больше лучше
    const pm25Score = 100 - (region.pm25 / 30) * 100 // PM2.5: меньше лучше
    const forestScore = region.forestCover * 2 // Лес: больше лучше
    
    // Средний балл
    return Math.round((aqiScore + waterScore + emissionsScore + wasteScore + pm25Score + forestScore) / 6)
  }

  // График AQI
  function initAirChart() {
    const ctx = document.getElementById('comparisonAirChart')
    if (!ctx || typeof Chart === 'undefined') return

    const labels = regionalData.map(r => r.name)
    const aqiData = regionalData.map(r => r.aqi)
    const gomelIndex = labels.indexOf('Гомельская область')
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'AQI',
          data: aqiData,
          backgroundColor: aqiData.map((val, idx) => idx === gomelIndex ? '#34c759' : 'rgba(110,231,183,0.6)'),
          borderColor: aqiData.map((val, idx) => idx === gomelIndex ? '#2db351' : '#6ee7b7'),
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'AQI: ' + context.parsed.y + ' (чем ниже, тем лучше)'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 80,
            ticks: { color: '#b6c4bf' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          x: {
            ticks: { color: '#e8f1ee', maxRotation: 45, minRotation: 45 },
            grid: { display: false }
          }
        }
      }
    })
  }

  // График качества воды
  function initWaterChart() {
    const ctx = document.getElementById('comparisonWaterChart')
    if (!ctx || typeof Chart === 'undefined') return

    const labels = regionalData.map(r => r.name)
    const waterData = regionalData.map(r => r.waterIndex)
    const gomelIndex = labels.indexOf('Гомельская область')
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Индекс качества воды',
          data: waterData,
          backgroundColor: waterData.map((val, idx) => idx === gomelIndex ? '#34c759' : 'rgba(110,231,183,0.6)'),
          borderColor: waterData.map((val, idx) => idx === gomelIndex ? '#2db351' : '#6ee7b7'),
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Индекс: ' + context.parsed.y + ' (чем выше, тем лучше)'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#b6c4bf' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          x: {
            ticks: { color: '#e8f1ee', maxRotation: 45, minRotation: 45 },
            grid: { display: false }
          }
        }
      }
    })
  }

  // График выбросов
  function initEmissionsChart() {
    const ctx = document.getElementById('comparisonEmissionsChart')
    if (!ctx || typeof Chart === 'undefined') return

    const labels = regionalData.map(r => r.name)
    const emissionsData = regionalData.map(r => r.emissions)
    const gomelIndex = labels.indexOf('Гомельская область')
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Выбросы (тыс. т/год)',
          data: emissionsData,
          backgroundColor: emissionsData.map((val, idx) => idx === gomelIndex ? '#34c759' : 'rgba(239,68,68,0.6)'),
          borderColor: emissionsData.map((val, idx) => idx === gomelIndex ? '#2db351' : '#ef4444'),
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Выбросы: ' + context.parsed.y + ' тыс. т/год'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#b6c4bf', callback: (v) => v + ' тыс.т' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          x: {
            ticks: { color: '#e8f1ee', maxRotation: 45, minRotation: 45 },
            grid: { display: false }
          }
        }
      }
    })
  }

  // График переработки отходов
  function initWasteChart() {
    const ctx = document.getElementById('comparisonWasteChart')
    if (!ctx || typeof Chart === 'undefined') return

    const labels = regionalData.map(r => r.name)
    const wasteData = regionalData.map(r => r.wasteProcessing)
    const gomelIndex = labels.indexOf('Гомельская область')
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Переработка отходов (%)',
          data: wasteData,
          backgroundColor: wasteData.map((val, idx) => idx === gomelIndex ? '#34c759' : 'rgba(110,231,183,0.6)'),
          borderColor: wasteData.map((val, idx) => idx === gomelIndex ? '#2db351' : '#6ee7b7'),
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Переработка: ' + context.parsed.y + '%'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#b6c4bf', callback: (v) => v + '%' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          x: {
            ticks: { color: '#e8f1ee', maxRotation: 45, minRotation: 45 },
            grid: { display: false }
          }
        }
      }
    })
  }

  // График загрязнителей
  function initPollutantsChart() {
    const ctx = document.getElementById('comparisonPollutantsChart')
    if (!ctx || typeof Chart === 'undefined') return

    const labels = regionalData.map(r => r.name)
    const gomelIndex = labels.indexOf('Гомельская область')
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'PM2.5',
            data: regionalData.map(r => r.pm25),
            backgroundColor: labels.map((_, idx) => idx === gomelIndex ? 'rgba(52,199,89,0.7)' : 'rgba(110,231,183,0.5)'),
            borderColor: labels.map((_, idx) => idx === gomelIndex ? '#34c759' : '#6ee7b7'),
            borderWidth: 1
          },
          {
            label: 'PM10',
            data: regionalData.map(r => r.pm10),
            backgroundColor: labels.map((_, idx) => idx === gomelIndex ? 'rgba(52,199,89,0.5)' : 'rgba(167,243,208,0.4)'),
            borderColor: labels.map((_, idx) => idx === gomelIndex ? '#2db351' : '#a7f3d0'),
            borderWidth: 1
          },
          {
            label: 'NO₂',
            data: regionalData.map(r => r.no2),
            backgroundColor: labels.map((_, idx) => idx === gomelIndex ? 'rgba(52,199,89,0.4)' : 'rgba(134,239,172,0.3)'),
            borderColor: labels.map((_, idx) => idx === gomelIndex ? '#1e9e45' : '#86efac'),
            borderWidth: 1
          },
          {
            label: 'SO₂',
            data: regionalData.map(r => r.so2),
            backgroundColor: labels.map((_, idx) => idx === gomelIndex ? 'rgba(52,199,89,0.3)' : 'rgba(110,231,183,0.2)'),
            borderColor: labels.map((_, idx) => idx === gomelIndex ? '#158a3a' : '#6ee7b7'),
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: { 
            labels: { color: '#e8f1ee' },
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + ' мкг/м³'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#b6c4bf', callback: (v) => v + ' мкг/м³' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          x: {
            ticks: { color: '#e8f1ee', maxRotation: 45, minRotation: 45 },
            grid: { display: false }
          }
        }
      }
    })
  }

  const gomelCities = [
    { name: 'Гомель', aqi: 58 },
    { name: 'Жлобин', aqi: 64 },
    { name: 'Мозырь', aqi: 61 },
    { name: 'Светлогорск', aqi: 60 },
    { name: 'Речица', aqi: 52 },
    { name: 'Калинковичи', aqi: 48 },
    { name: 'Рогачёв', aqi: 46 },
    { name: 'Добруш', aqi: 44 }
  ]

  function initGomelCitiesChart() {
    const ctx = document.getElementById('gomelCitiesAirChart')
    if (!ctx || typeof Chart === 'undefined') return

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: gomelCities.map((c) => c.name),
        datasets: [{
          label: 'AQI',
          data: gomelCities.map((c) => c.aqi),
          backgroundColor: gomelCities.map((c) => c.aqi >= 58 ? '#ef4444' : c.aqi >= 50 ? '#f59e0b' : '#34c759'),
          borderWidth: 0
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#e8f1ee', maxRotation: 45, minRotation: 30 }, grid: { display: false } },
          y: { ticks: { color: '#b6c4bf' }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true }
        }
      }
    })
  }

  // График рейтинга
  function initRankingChart() {
    const ctx = document.getElementById('comparisonRankingChart')
    if (!ctx || typeof Chart === 'undefined') return

    // Сортируем по рейтингу
    const sortedData = [...regionalData].map(r => ({
      ...r,
      ranking: calculateRanking(r)
    })).sort((a, b) => b.ranking - a.ranking)

    const labels = sortedData.map(r => r.name)
    const rankingData = sortedData.map(r => r.ranking)
    const gomelIndex = labels.indexOf('Гомельская область')
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Экологический рейтинг',
          data: rankingData,
          backgroundColor: rankingData.map((val, idx) => idx === gomelIndex ? '#34c759' : 'rgba(110,231,183,0.6)'),
          borderColor: rankingData.map((val, idx) => idx === gomelIndex ? '#2db351' : '#6ee7b7'),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Рейтинг: ' + context.parsed.x + ' баллов'
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#b6c4bf', callback: (v) => v + ' баллов' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y: {
            ticks: { color: '#e8f1ee' },
            grid: { display: false }
          }
        }
      }
    })
  }

  // Рендер таблицы сравнения
  function renderComparisonTable() {
    const tbody = document.getElementById('comparisonTableBody')
    if (!tbody) return
    
    tbody.innerHTML = regionalData.map(region => {
      const isGomel = region.name === 'Гомельская область'
      const rowClass = isGomel ? 'highlight' : ''
      return `
        <tr class="${rowClass}">
          <td><strong>${region.name}</strong></td>
          <td>${region.aqi}</td>
          <td>${region.waterIndex}</td>
          <td>${region.emissions}</td>
          <td>${region.wasteProcessing}%</td>
          <td>${region.pm25}</td>
          <td>${region.pm10}</td>
          <td>${region.no2}</td>
          <td>${region.forestCover}%</td>
        </tr>
      `
    }).join('')
  }

  // Инициализация всех графиков
  function init() {
    initAirChart()
    initWaterChart()
    initEmissionsChart()
    initWasteChart()
    initPollutantsChart()
    initRankingChart()
    initGomelCitiesChart()
    renderComparisonTable()
  }

  // Запуск при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible')
    })
  }, { threshold: 0.15 })
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

})()

