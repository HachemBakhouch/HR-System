/**
 * charts.js - Charts and statistics functionality for the Mazzaro Milano HR System
 */

document.addEventListener('DOMContentLoaded', () => {
  initChartsPage();
  initChartFilters();
  initChartExport();
  initDateRangePicker();
  initComparisonSelector();
});

/**
 * Initialize charts page
 */
function initChartsPage() {
  // Check if we're on the statistics page
  if (!document.querySelector('.statistics-content')) return;

  // Load charts
  initAttendanceChart();
  initPerformanceChart();
  initLeaveDistributionChart();
  initTicketsChart();
  initEmployeesStatsChart();
  initStorePerformanceRadarChart();
}

/**
 * Initialize chart filters
 */
function initChartFilters() {
  const periodFilter = document.querySelector('select[name="period-filter"]');
  const storeFilter = document.querySelector('select[name="store-filter"]');

  if (periodFilter) {
    periodFilter.addEventListener('change', function () {
      updateCharts();
    });
  }

  if (storeFilter) {
    storeFilter.addEventListener('change', function () {
      updateCharts();
    });
  }
}

/**
 * Initialize chart export functionality
 */
function initChartExport() {
  const exportButtons = document.querySelectorAll('.btn-export');

  exportButtons.forEach(button => {
    button.addEventListener('click', function () {
      const chartId = this.getAttribute('data-chart');
      exportChart(chartId);
    });
  });
}

/**
 * Export chart to image or CSV
 */
function exportChart(chartId) {
  const chart = Chart.getChart(chartId);

  if (!chart) return;

  // For this prototype, we'll just show a notification
  // In a real app, this would download the chart as an image or data as CSV

  showNotification('Export', 'Le graphique a été exporté avec succès');
}

/**
 * Initialize date range picker
 */
function initDateRangePicker() {
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const applyDateBtn = document.getElementById('apply-date-range');

  if (startDateInput && endDateInput && applyDateBtn) {
    applyDateBtn.addEventListener('click', function () {
      if (startDateInput.value && endDateInput.value) {
        // In a real app, this would update the charts with the new date range
        // For this prototype, we'll just show a notification

        showNotification('Période mise à jour', 'Les graphiques ont été mis à jour pour la période sélectionnée');

        // Update charts
        updateCharts();
      } else {
        alert('Veuillez sélectionner une date de début et de fin');
      }
    });
  }
}

/**
 * Initialize comparison selector
 */
function initComparisonSelector() {
  const comparisonCheckboxes = document.querySelectorAll('input[name="comparison"]');

  comparisonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      // In a real app, this would add/remove data from the charts
      // For this prototype, we'll just show a notification

      const isChecked = this.checked;
      const comparisonName = this.nextElementSibling.textContent.trim();

      if (isChecked) {
        showNotification('Comparaison ajoutée', `Comparaison avec ${comparisonName} ajoutée aux graphiques`);
      } else {
        showNotification('Comparaison retirée', `Comparaison avec ${comparisonName} retirée des graphiques`);
      }

      // Update charts
      updateCharts();
    });
  });
}

/**
 * Update all charts with new filters
 */
function updateCharts() {
  // In a real app, this would fetch new data based on the filters
  // and update all the charts
  // For this prototype, we'll just simulate updating the charts

  // Show loading state
  document.querySelectorAll('.chart-loading').forEach(loading => {
    loading.style.display = 'flex';
  });

  // Simulate API call delay
  setTimeout(() => {
    // Update each chart with new random data
    updateAttendanceChart();
    updatePerformanceChart();
    updateLeaveDistributionChart();
    updateTicketsChart();
    updateEmployeesStatsChart();
    updateStorePerformanceRadarChart();

    // Hide loading state
    document.querySelectorAll('.chart-loading').forEach(loading => {
      loading.style.display = 'none';
    });

    showNotification('Graphiques mis à jour', 'Tous les graphiques ont été mis à jour avec succès');
  }, 1500);
}

/**
 * Initialize attendance chart
 */
function initAttendanceChart() {
  const chartElement = document.getElementById('attendanceChart');
  if (!chartElement) return;

  const ctx = chartElement.getContext('2d');

  // Sample data for attendance chart
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const onTimeData = [92, 94, 91, 93, 95, 90, 89, 92, 93, 95, 94, 92];
  const lateData = [5, 4, 6, 5, 3, 7, 8, 6, 5, 3, 4, 6];
  const absentData = [3, 2, 3, 2, 2, 3, 3, 2, 2, 2, 2, 2];

  window.attendanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'À l\'heure',
          data: onTimeData,
          borderColor: 'rgba(59, 89, 152, 1)',
          backgroundColor: 'rgba(59, 89, 152, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'En retard',
          data: lateData,
          borderColor: 'rgba(255, 193, 7, 1)',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Absent',
          data: absentData,
          borderColor: 'rgba(220, 53, 69, 1)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (context) {
              return context.dataset.label + ': ' + context.parsed.y + '%';
            }
          }
        },
        title: {
          display: true,
          text: 'Taux de présence mensuel'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + '%';
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

/**
 * Update attendance chart with new data
 */
function updateAttendanceChart() {
  const chart = Chart.getChart('attendanceChart');
  if (!chart) return;

  // Generate random data with similar patterns
  const onTimeData = [];
  const lateData = [];
  const absentData = [];

  for (let i = 0; i < 12; i++) {
    const onTime = Math.floor(Math.random() * 10) + 85; // 85-95%
    const late = Math.floor(Math.random() * 8) + 2;    // 2-10%
    const absent = 100 - onTime - late;

    onTimeData.push(onTime);
    lateData.push(late);
    absentData.push(absent);
  }

  // Update chart data
  chart.data.datasets[0].data = onTimeData;
  chart.data.datasets[1].data = lateData;
  chart.data.datasets[2].data = absentData;

  // Update chart
  chart.update();
}

/**
 * Initialize performance chart
 */
function initPerformanceChart() {
  const chartElement = document.getElementById('performanceChart');
  if (!chartElement) return;

  const ctx = chartElement.getContext('2d');

  // Performance data
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const datasets = [
    {
      label: 'Boutique Nord',
      data: [75, 78, 80, 79, 85, 87, 84, 82, 88, 89, 90, 92],
      borderColor: 'rgba(59, 89, 152, 1)',
      backgroundColor: 'rgba(59, 89, 152, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Boutique Sud',
      data: [70, 72, 73, 78, 77, 75, 80, 82, 85, 86, 88, 90],
      borderColor: 'rgba(237, 69, 15, 1)',
      backgroundColor: 'rgba(237, 69, 15, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Boutique Est',
      data: [68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90],
      borderColor: 'rgba(40, 167, 69, 1)',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Boutique Ouest',
      data: [72, 74, 76, 75, 77, 79, 81, 83, 85, 87, 89, 91],
      borderColor: 'rgba(23, 162, 184, 1)',
      backgroundColor: 'rgba(23, 162, 184, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Boutique Centre',
      data: [73, 75, 77, 76, 79, 81, 83, 85, 87, 89, 91, 93],
      borderColor: 'rgba(255, 193, 7, 1)',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      tension: 0.4,
      fill: true
    }
  ];

  window.performanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (context) {
              return context.dataset.label + ': ' + context.parsed.y + '%';
            }
          }
        },
        title: {
          display: true,
          text: 'Performance des boutiques'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + '%';
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

/**
 * Update performance chart with new data
 */
function updatePerformanceChart() {
  const chart = Chart.getChart('performanceChart');
  if (!chart) return;

  // Generate random data with similar patterns for each dataset
  chart.data.datasets.forEach((dataset, index) => {
    const baseValue = 70 + index * 2; // Different base for each dataset
    const newData = [];

    for (let i = 0; i < 12; i++) {
      // Generate a value between baseValue and baseValue + 25
      const value = baseValue + Math.floor(Math.random() * 25);
      newData.push(value);
    }

    dataset.data = newData;
  });

  // Update chart
  chart.update();
}

/**
 * Initialize leave distribution chart
 */
function initLeaveDistributionChart() {
  const chartElement = document.getElementById('leaveDistributionChart');
  if (!chartElement) return;

  const ctx = chartElement.getContext('2d');

  // Leave distribution data
  const labels = ['Congé annuel', 'Congé maladie', 'Congé personnel', 'Congé maternité', 'Congé paternité', 'Autre'];
  const data = [55, 20, 15, 5, 3, 2];

  window.leaveDistributionChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(59, 89, 152, 0.7)',
          'rgba(237, 69, 15, 0.7)',
          'rgba(40, 167, 69, 0.7)',
          'rgba(23, 162, 184, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(108, 117, 125, 0.7)'
        ],
        borderColor: [
          'rgba(59, 89, 152, 1)',
          'rgba(237, 69, 15, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(23, 162, 184, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(108, 117, 125, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${context.label}: ${percentage}% (${value} jours)`;
            }
          }
        },
        title: {
          display: true,
          text: 'Répartition des types de congés'
        }
      }
    }
  });
}

/**
 * Update leave distribution chart with new data
 */
function updateLeaveDistributionChart() {
  const chart = Chart.getChart('leaveDistributionChart');
  if (!chart) return;

  // Generate random data that adds up to 100
  const total = 100;
  const newData = [];
  let remaining = total;

  // Generate random values for first 5 categories
  for (let i = 0; i < 5; i++) {
    const max = Math.floor(remaining * 0.8); // Don't use more than 80% of what's left
    const value = i === 0 ?
      Math.floor(Math.random() * 20) + 40 : // First category (annual) between 40-60
      Math.floor(Math.random() * max * 0.5); // Others proportionally smaller

    newData.push(value);
    remaining -= value;
  }

  // Last category gets whatever is remaining
  newData.push(remaining);

  // Update chart data
  chart.data.datasets[0].data = newData;

  // Update chart
  chart.update();
}

/**
 * Initialize tickets chart
 */
function initTicketsChart() {
  const chartElement = document.getElementById('ticketsChart');
  if (!chartElement) return;

  const ctx = chartElement.getContext('2d');

  // Tickets data
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const newData = [12, 15, 18, 14, 16, 19, 22, 20, 17, 15, 18, 16];
  const completedData = [10, 13, 15, 12, 14, 17, 19, 18, 15, 14, 16, 14];

  window.ticketsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Nouveaux tickets',
          data: newData,
          backgroundColor: 'rgba(59, 89, 152, 0.7)',
          borderColor: 'rgba(59, 89, 152, 1)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Tickets complétés',
          data: completedData,
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        },
        title: {
          display: true,
          text: 'Tickets mensuels'
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          },
          ticks: {
            precision: 0
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

/**
 * Update tickets chart with new data
 */
function updateTicketsChart() {
  const chart = Chart.getChart('ticketsChart');
  if (!chart) return;

  // Generate random data
  const newData = [];
  const completedData = [];

  for (let i = 0; i < 12; i++) {
    const newTickets = Math.floor(Math.random() * 15) + 10; // 10-25
    // Completed is usually a bit less than new
    const completedTickets = Math.floor(newTickets * (0.8 + Math.random() * 0.2)); // 80-100% of new

    newData.push(newTickets);
    completedData.push(completedTickets);
  }

  // Update chart data
  chart.data.datasets[0].data = newData;
  chart.data.datasets[1].data = completedData;

  // Update chart
  chart.update();
}

/**
 * Initialize employees stats chart
 */
function initEmployeesStatsChart() {
  const chartElement = document.getElementById('employeesStatsChart');
  if (!chartElement) return;

  const ctx = chartElement.getContext('2d');

  // Employees data
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const activeData = [60, 62, 65, 64, 67, 68, 70, 71, 72, 72, 74, 73];
  const hiresData = [3, 2, 4, 1, 3, 2, 3, 2, 1, 2, 3, 1];
  const departuresData = [1, 0, 1, 2, 0, 1, 1, 1, 0, 2, 1, 2];

  window.employeesStatsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          type: 'line',
          label: 'Employés actifs',
          data: activeData,
          borderColor: 'rgba(59, 89, 152, 1)',
          backgroundColor: 'rgba(59, 89, 152, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          type: 'bar',
          label: 'Embauches',
          data: hiresData,
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Départs',
          data: departuresData,
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        },
        title: {
          display: true,
          text: 'Évolution des effectifs'
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Nombre total d\'employés'
          },
          min: 0
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Embauches et départs'
          },
          min: 0,
          max: 10,
          grid: {
            drawOnChartArea: false
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

/**
 * Update employees stats chart with new data
 */
function updateEmployeesStatsChart() {
  const chart = Chart.getChart('employeesStatsChart');
  if (!chart) return;

  // Generate random data with some logic
  const activeData = [];
  const hiresData = [];
  const departuresData = [];

  let currentActive = 60; // Starting value

  for (let i = 0; i < 12; i++) {
    // Random hires and departures
    const hires = Math.floor(Math.random() * 5); // 0-4
    const departures = Math.floor(Math.random() * 3); // 0-2

    // Update active employees
    currentActive = currentActive + hires - departures;

    activeData.push(currentActive);
    hiresData.push(hires);
    departuresData.push(departures);
  }

  // Update chart data
  chart.data.datasets[0].data = activeData;
  chart.data.datasets[1].data = hiresData;
  chart.data.datasets[2].data = departuresData;

  // Update chart
  chart.update();
}

/**
 * Initialize store performance radar chart
 */
function initStorePerformanceRadarChart() {
  const chartElement = document.getElementById('storePerformanceRadarChart');
  if (!chartElement) return;

  const ctx = chartElement.getContext('2d');

  // Performance metrics
  const metrics = [
    'Ventes',
    'Satisfaction client',
    'Productivité',
    'Présence',
    'Formation',
    'Innovation'
  ];

  const datasets = [
    {
      label: 'Boutique Nord',
      data: [90, 85, 88, 92, 78, 82],
      backgroundColor: 'rgba(59, 89, 152, 0.2)',
      borderColor: 'rgba(59, 89, 152, 1)',
      pointBackgroundColor: 'rgba(59, 89, 152, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(59, 89, 152, 1)'
    },
    {
      label: 'Boutique Sud',
      data: [85, 90, 80, 88, 84, 75],
      backgroundColor: 'rgba(237, 69, 15, 0.2)',
      borderColor: 'rgba(237, 69, 15, 1)',
      pointBackgroundColor: 'rgba(237, 69, 15, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(237, 69, 15, 1)'
    }
  ];

  window.storePerformanceRadarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: metrics,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 2
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: 'Performance comparative des boutiques'
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          suggestedMin: 50,
          suggestedMax: 100,
          ticks: {
            stepSize: 10,
            callback: function (value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

/**
 * Update store performance radar chart with new data
 */
function updateStorePerformanceRadarChart() {
  const chart = Chart.getChart('storePerformanceRadarChart');
  if (!chart) return;

  // Generate random data for each dataset
  chart.data.datasets.forEach(dataset => {
    const newData = [];

    for (let i = 0; i < 6; i++) {
      // Generate a value between 70 and 95
      const value = Math.floor(Math.random() * 25) + 70;
      newData.push(value);
    }

    dataset.data = newData;
  });

  // Update chart
  chart.update();
}

/**
 * Load chart data from API
 */
function loadChartData(chartType, params) {
  // In a real app, this would be an API call to fetch data
  // For this prototype, we'll use sample data

  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      switch (chartType) {
        case 'attendance':
          resolve({
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: {
              onTime: [92, 94, 91, 93, 95, 90, 89, 92, 93, 95, 94, 92],
              late: [5, 4, 6, 5, 3, 7, 8, 6, 5, 3, 4, 6],
              absent: [3, 2, 3, 2, 2, 3, 3, 2, 2, 2, 2, 2]
            }
          });
          break;

        case 'performance':
          resolve({
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: {
              north: [75, 78, 80, 79, 85, 87, 84, 82, 88, 89, 90, 92],
              south: [70, 72, 73, 78, 77, 75, 80, 82, 85, 86, 88, 90],
              east: [68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90],
              west: [72, 74, 76, 75, 77, 79, 81, 83, 85, 87, 89, 91],
              center: [73, 75, 77, 76, 79, 81, 83, 85, 87, 89, 91, 93]
            }
          });
          break;

        case 'leave':
          resolve({
            labels: ['Congé annuel', 'Congé maladie', 'Congé personnel', 'Congé maternité', 'Congé paternité', 'Autre'],
            data: [55, 20, 15, 5, 3, 2]
          });
          break;

        case 'tickets':
          resolve({
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: {
              new: [12, 15, 18, 14, 16, 19, 22, 20, 17, 15, 18, 16],
              completed: [10, 13, 15, 12, 14, 17, 19, 18, 15, 14, 16, 14]
            }
          });
          break;

        case 'employees':
          resolve({
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: {
              active: [60, 62, 65, 64, 67, 68, 70, 71, 72, 72, 74, 73],
              hires: [3, 2, 4, 1, 3, 2, 3, 2, 1, 2, 3, 1],
              departures: [1, 0, 1, 2, 0, 1, 1, 1, 0, 2, 1, 2]
            }
          });
          break;

        case 'performance-radar':
          resolve({
            metrics: [
              'Ventes',
              'Satisfaction client',
              'Productivité',
              'Présence',
              'Formation',
              'Innovation'
            ],
            datasets: {
              north: [90, 85, 88, 92, 78, 82],
              south: [85, 90, 80, 88, 84, 75],
              east: [83, 87, 85, 90, 76, 78],
              west: [88, 82, 84, 86, 80, 88],
              center: [92, 88, 86, 89, 82, 80]
            }
          });
          break;

        default:
          resolve({});
      }
    }, 1000);
  });
}

/**
 * Format numbers for display
 */
function formatNumber(number) {
  return new Intl.NumberFormat('fr-FR').format(number);
}

/**
 * Format percentages for display
 */
function formatPercentage(number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(number / 100);
}

/**
 * Get colors for charts
 */
function getChartColors() {
  return {
    primary: {
      main: 'rgba(59, 89, 152, 1)',
      light: 'rgba(59, 89, 152, 0.7)',
      veryLight: 'rgba(59, 89, 152, 0.1)'
    },
    secondary: {
      main: 'rgba(237, 69, 15, 1)',
      light: 'rgba(237, 69, 15, 0.7)',
      veryLight: 'rgba(237, 69, 15, 0.1)'
    },
    success: {
      main: 'rgba(40, 167, 69, 1)',
      light: 'rgba(40, 167, 69, 0.7)',
      veryLight: 'rgba(40, 167, 69, 0.1)'
    },
    warning: {
      main: 'rgba(255, 193, 7, 1)',
      light: 'rgba(255, 193, 7, 0.7)',
      veryLight: 'rgba(255, 193, 7, 0.1)'
    },
    danger: {
      main: 'rgba(220, 53, 69, 1)',
      light: 'rgba(220, 53, 69, 0.7)',
      veryLight: 'rgba(220, 53, 69, 0.1)'
    },
    info: {
      main: 'rgba(23, 162, 184, 1)',
      light: 'rgba(23, 162, 184, 0.7)',
      veryLight: 'rgba(23, 162, 184, 0.1)'
    },
    gray: {
      main: 'rgba(108, 117, 125, 1)',
      light: 'rgba(108, 117, 125, 0.7)',
      veryLight: 'rgba(108, 117, 125, 0.1)'
    }
  };
}

/**
 * Generate chart tooltip HTML
 */
function generateTooltipHTML(title, items) {
  let html = `<div class="chart-tooltip">`;

  if (title) {
    html += `<div class="tooltip-title">${title}</div>`;
  }

  html += `<div class="tooltip-content">`;

  items.forEach(item => {
    html += `
      <div class="tooltip-item">
        <div class="tooltip-color" style="background-color: ${item.color}"></div>
        <div class="tooltip-label">${item.label}:</div>
        <div class="tooltip-value">${item.value}</div>
      </div>
    `;
  });

  html += `</div></div>`;

  return html;
}

/**
 * Calculate period-over-period change
 */
function calculateChange(current, previous) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Generate a PDF report with all charts
 */
function generatePDFReport() {
  // In a real app, this would generate a PDF with all charts
  // For this prototype, we'll just show a notification

  showNotification('Rapport généré', 'Le rapport PDF a été généré et téléchargé avec succès');
}

/**
 * Generate comparative data table
 */
function generateComparativeTable(data, periods, metrics) {
  const table = document.createElement('table');
  table.className = 'comparative-table';

  // Create header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Add empty cell for metrics column
  const emptyHeader = document.createElement('th');
  headerRow.appendChild(emptyHeader);

  // Add period headers
  periods.forEach(period => {
    const th = document.createElement('th');
    th.textContent = period;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create body
  const tbody = document.createElement('tbody');

  // Add rows for each metric
  metrics.forEach(metric => {
    const row = document.createElement('tr');

    // Add metric name
    const metricCell = document.createElement('td');
    metricCell.className = 'metric-name';
    metricCell.textContent = metric.name;
    row.appendChild(metricCell);

    // Add values for each period
    periods.forEach(period => {
      const valueCell = document.createElement('td');
      const value = data[metric.id][period];

      valueCell.textContent = metric.format ? metric.format(value) : value;

      // Add change indicator if previous period exists
      const prevPeriodIndex = periods.indexOf(period) - 1;
      if (prevPeriodIndex >= 0) {
        const prevPeriod = periods[prevPeriodIndex];
        const prevValue = data[metric.id][prevPeriod];
        const change = calculateChange(value, prevValue);

        const indicator = document.createElement('span');
        indicator.className = `change-indicator ${change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'}`;
        indicator.innerHTML = `${Math.abs(change).toFixed(1)}% ${change > 0 ? '↑' : change < 0 ? '↓' : '-'}`;

        valueCell.appendChild(indicator);
      }

      row.appendChild(valueCell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  return table;
}

/**
 * Create a simple sparkline chart
 */
function createSparkline(container, data, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = options.width || 100;
  canvas.height = options.height || 30;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Set default options
  const color = options.color || 'rgba(59, 89, 152, 1)';
  const fillColor = options.fillColor || 'rgba(59, 89, 152, 0.1)';
  const lineWidth = options.lineWidth || 2;

  // Calculate min and max values
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  // Draw sparkline
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = fillColor;
  ctx.lineWidth = lineWidth;

  // Draw the line
  data.forEach((value, i) => {
    const x = (i / (data.length - 1)) * canvas.width;
    const normalizedValue = range === 0 ? 0.5 : (value - min) / range;
    const y = canvas.height - (normalizedValue * canvas.height);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  // If fill option is enabled, close the path and fill
  if (options.fill !== false) {
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
  }

  ctx.stroke();

  // Add dot at the end if showEndDot option is enabled
  if (options.showEndDot) {
    const lastValue = data[data.length - 1];
    const x = canvas.width - 4;
    const normalizedValue = range === 0 ? 0.5 : (lastValue - min) / range;
    const y = canvas.height - (normalizedValue * canvas.height);

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

/**
 * Create a gauge chart
 */
function createGaugeChart(container, value, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = options.size || 200;
  canvas.height = options.size || 200;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Set default options
  const min = options.min || 0;
  const max = options.max || 100;
  const colorRanges = options.colorRanges || [
    { min: 0, max: 60, color: 'rgba(220, 53, 69, 1)' },
    { min: 60, max: 80, color: 'rgba(255, 193, 7, 1)' },
    { min: 80, max: 100, color: 'rgba(40, 167, 69, 1)' }
  ];

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;

  // Draw gauge background
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25, false);
  ctx.lineWidth = radius * 0.2;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.stroke();

  // Calculate needle position
  const normalizedValue = (value - min) / (max - min);
  const needleAngle = (normalizedValue * 1.5 + 0.75) * Math.PI;

  // Determine color based on value
  let needleColor;
  for (const range of colorRanges) {
    if (value >= range.min && value <= range.max) {
      needleColor = range.color;
      break;
    }
  }
  needleColor = needleColor || colorRanges[colorRanges.length - 1].color;

  // Draw gauge value
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI * 0.75, needleAngle, false);
  ctx.lineWidth = radius * 0.2;
  ctx.strokeStyle = needleColor;
  ctx.stroke();

  // Draw gauge center
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.1, 0, Math.PI * 2, false);
  ctx.fillStyle = needleColor;
  ctx.fill();

  // Draw needle
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + radius * 0.8 * Math.cos(needleAngle),
    centerY + radius * 0.8 * Math.sin(needleAngle)
  );
  ctx.lineWidth = radius * 0.05;
  ctx.strokeStyle = needleColor;
  ctx.stroke();

  // Draw value text
  ctx.fillStyle = '#333';
  ctx.font = `${radius * 0.25}px var(--font-family-headings)`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${value}%`, centerX, centerY + radius * 0.5);

  // Draw label if provided
  if (options.label) {
    ctx.fillStyle = '#666';
    ctx.font = `${radius * 0.15}px var(--font-family-main)`;
    ctx.fillText(options.label, centerX, centerY + radius * 0.8);
  }

  return canvas;
}

/**
 * Create a KPI card
 */
function createKPICard(title, value, change, options = {}) {
  const card = document.createElement('div');
  card.className = 'kpi-card';

  // Create card header
  const header = document.createElement('div');
  header.className = 'kpi-header';

  const titleEl = document.createElement('div');
  titleEl.className = 'kpi-title';
  titleEl.textContent = title;
  header.appendChild(titleEl);

  if (options.icon) {
    const iconEl = document.createElement('div');
    iconEl.className = 'kpi-icon';
    iconEl.innerHTML = `<i class="${options.icon}"></i>`;
    header.insertBefore(iconEl, titleEl);
  }

  card.appendChild(header);

  // Create card body
  const body = document.createElement('div');
  body.className = 'kpi-body';

  const valueEl = document.createElement('div');
  valueEl.className = 'kpi-value';
  valueEl.textContent = value;
  body.appendChild(valueEl);

  if (change !== undefined) {
    const changeEl = document.createElement('div');
    changeEl.className = `kpi-change ${change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'}`;

    const changeIconEl = document.createElement('i');
    changeIconEl.className = change > 0 ? 'fas fa-arrow-up' : change < 0 ? 'fas fa-arrow-down' : 'fas fa-minus';
    changeEl.appendChild(changeIconEl);

    const changeTextEl = document.createElement('span');
    changeTextEl.textContent = ` ${Math.abs(change).toFixed(1)}%`;
    changeEl.appendChild(changeTextEl);

    body.appendChild(changeEl);
  }

  if (options.sparklineData) {
    const sparklineContainer = document.createElement('div');
    sparklineContainer.className = 'kpi-sparkline';
    createSparkline(sparklineContainer, options.sparklineData, {
      color: change > 0 ? 'rgba(40, 167, 69, 1)' : change < 0 ? 'rgba(220, 53, 69, 1)' : 'rgba(108, 117, 125, 1)',
      fillColor: change > 0 ? 'rgba(40, 167, 69, 0.1)' : change < 0 ? 'rgba(220, 53, 69, 0.1)' : 'rgba(108, 117, 125, 0.1)',
      showEndDot: true
    });
    body.appendChild(sparklineContainer);
  }

  card.appendChild(body);

  // Create card footer if subtitle provided
  if (options.subtitle) {
    const footer = document.createElement('div');
    footer.className = 'kpi-footer';
    footer.textContent = options.subtitle;
    card.appendChild(footer);
  }

  return card;
}

/**
 * Add event listener once DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initChartsPage();
});