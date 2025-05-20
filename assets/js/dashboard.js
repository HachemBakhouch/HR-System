/**
 * dashboard.js - Dashboard functionality for the Mazzaro Milano HR System
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dashboard components
  initDashboard();
  initDashboardCharts();
  initTaskCheckboxes();
  initEventHandlers();
});

/**
 * Initialize dashboard
 */
function initDashboard() {
  // Check if we're on the dashboard page
  if (!document.querySelector('.dashboard-content')) return;
  
  // Update greeting based on time of day
  updateGreeting();
  
  // Load recent activity (in a real app, this would be from an API)
  // loadRecentActivity();
  
  // Load current tasks (in a real app, this would be from an API)
  // loadCurrentTasks();
  
  // Load upcoming events (in a real app, this would be from an API)
  // loadUpcomingEvents();
}

/**
 * Update greeting based on time of day
 */
function updateGreeting() {
  const welcomeMessage = document.querySelector('.welcome-message h2');
  if (!welcomeMessage) return;
  
  const hour = new Date().getHours();
  const userName = localStorage.getItem('userName') || 'Admin Mazzaro';
  
  let greeting = '';
  if (hour < 12) {
    greeting = 'Bonjour';
  } else if (hour < 18) {
    greeting = 'Bon après-midi';
  } else {
    greeting = 'Bonsoir';
  }
  
  welcomeMessage.textContent = `${greeting}, ${userName} 👋`;
}

/**
 * Initialize dashboard charts
 */
function initDashboardCharts() {
  initPerformanceChart();
  initAttendanceChart();
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
  
  // Create chart
  new Chart(ctx, {
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
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y + '%';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
          ticks: {
            callback: function(value) {
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
 * Initialize attendance chart
 */
function initAttendanceChart() {
  const chartElement = document.getElementById('attendanceChart');
  if (!chartElement) return;
  
  const ctx = chartElement.getContext('2d');
  
  // Attendance data for the week
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const onTimeData = [45, 47, 44, 42, 46, 25, 10];
  const lateData = [3, 2, 5, 7, 4, 2, 1];
  const absentData = [2, 1, 1, 1, 0, 3, 19];
  
  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: 'À l\'heure',
          data: onTimeData,
          backgroundColor: 'rgba(59, 89, 152, 0.7)',
          borderColor: 'rgba(59, 89, 152, 1)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'En retard',
          data: lateData,
          backgroundColor: 'rgba(255, 193, 7, 0.7)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Absent',
          data: absentData,
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: 'rgba(220, 53, 69, 1)',
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
 * Initialize task checkboxes
 */
function initTaskCheckboxes() {
  const taskCheckboxes = document.querySelectorAll('.task-checkbox input[type="checkbox"]');
  
  taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskItem = this.closest('.task-item');
      
      if (this.checked) {
        taskItem.classList.add('completed');
        
        // In a real app, this would update the task status via API
        // For this prototype, we'll just show a notification
        setTimeout(() => {
          showNotification('Tâche terminée', 'La tâche a été marquée comme terminée');
        }, 500);
      } else {
        taskItem.classList.remove('completed');
      }
    });
  });
}

/**
 * Initialize event handlers
 */
function initEventHandlers() {
  // Monthly/Weekly toggle for performance chart
  const viewToggle = document.querySelector('.chart-actions button');
  if (viewToggle) {
    viewToggle.addEventListener('click', function() {
      const isMonthly = this.textContent.includes('Mensuel');
      
      if (isMonthly) {
        this.textContent = 'Hebdomadaire';
        // Update chart data to weekly view (would be implemented in a real app)
      } else {
        this.textContent = 'Mensuel';
        // Update chart data to monthly view (would be implemented in a real app)
      }
    });
  }
  
  // Export chart data
  const exportButton = document.querySelector('.chart-actions button:nth-child(2)');
  if (exportButton) {
    exportButton.addEventListener('click', function() {
      // In a real app, this would generate and download a CSV or Excel file
      showNotification('Export réussi', 'Les données ont été exportées avec succès');
    });
  }
  
  // Add new task button
  const addTaskButton = document.querySelector('.card-body .btn-primary');
  if (addTaskButton) {
    addTaskButton.addEventListener('click', function() {
      // In a real app, this would open a modal to add a new task
      showNotification('Nouvelle tâche', 'Fonctionnalité en cours de développement');
    });
  }
}

/**
 * Load recent activity data
 */
function loadRecentActivity() {
  // In a real app, this would be an API call
  // For this prototype, the data is already in the HTML
}

/**
 * Load current tasks data
 */
function loadCurrentTasks() {
  // In a real app, this would be an API call
  // For this prototype, the data is already in the HTML
}

/**
 * Load upcoming events data
 */
function loadUpcomingEvents() {
  // In a real app, this would be an API call
  // For this prototype, the data is already in the HTML
}

/**
 * Generate random data for demo purposes
 */
function generateRandomData(min, max, count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return data;
}

/**
 * Get current performance data
 */
function getCurrentPerformanceData() {
  // In a real app, this would be an API call
  // For this prototype, we'll return some sample data
  return {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
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
      }
    ]
  };
}

/**
 * Get current attendance data
 */
function getCurrentAttendanceData() {
  // In a real app, this would be an API call
  // For this prototype, we'll return some sample data
  return {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'À l\'heure',
        data: [45, 47, 44, 42, 46, 25, 10],
        backgroundColor: 'rgba(59, 89, 152, 0.7)',
        borderColor: 'rgba(59, 89, 152, 1)',
        borderWidth: 1
      },
      {
        label: 'En retard',
        data: [3, 2, 5, 7, 4, 2, 1],
        backgroundColor: 'rgba(255, 193, 7, 0.7)',
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 1
      },
      {
        label: 'Absent',
        data: [2, 1, 1, 1, 0, 3, 19],
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1
      }
    ]
  };
}

/**
 * Export chart data to CSV
 */
function exportChartToCSV(chartId) {
  const chart = Chart.getChart(chartId);
  if (!chart) return;
  
  let csvContent = 'data:text/csv;charset=utf-8,';
  
  // Add headers
  const headers = ['Label'];
  chart.data.datasets.forEach(dataset => {
    headers.push(dataset.label);
  });
  csvContent += headers.join(',') + '\n';
  
  // Add data rows
  chart.data.labels.forEach((label, i) => {
    let row = [label];
    chart.data.datasets.forEach(dataset => {
      row.push(dataset.data[i]);
    });
    csvContent += row.join(',') + '\n';
  });
  
  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${chartId}_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date
 */
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
}

/**
 * Format time
 */
function formatTime(date) {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString('fr-FR', options);
}

/**
 * Get current week dates
 */
function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
  
  const monday = new Date(now.setDate(diff));
  const weekDates = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDates.push(day);
  }
  
  return weekDates;
}

/**
 * Add event listener once the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});