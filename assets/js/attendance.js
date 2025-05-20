/**
 * attendance.js - Attendance tracking functionality for the Mazzaro Milano HR System
 */

document.addEventListener('DOMContentLoaded', () => {
  initAttendancePage();
  initClockWidget();
  initAttendanceFilters();
  initAttendanceExport();
  initAttendanceChart();
});

/**
 * Initialize attendance page
 */
function initAttendancePage() {
  // Check if we're on the attendance page
  if (!document.querySelector('.attendance-content')) return;
  
  // Load attendance data (in a real app, this would be from an API)
  loadAttendanceData();
}

/**
 * Initialize clock widget
 */
function initClockWidget() {
  const clockElement = document.querySelector('.current-time');
  const dateElement = document.querySelector('.current-date');
  
  if (clockElement && dateElement) {
    // Update clock initially and then every second
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initialize clock in/out buttons
    initClockButtons();
  }
}

/**
 * Update clock display
 */
function updateClock() {
  const now = new Date();
  const clockElement = document.querySelector('.current-time');
  const dateElement = document.querySelector('.current-date');
  
  if (clockElement) {
    clockElement.textContent = formatTime(now);
  }
  
  if (dateElement) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('fr-FR', options);
  }
}

/**
 * Format time as HH:MM:SS
 */
function formatTime(date) {
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false
  });
}

/**
 * Initialize clock in/out buttons
 */
function initClockButtons() {
  const clockInBtn = document.querySelector('.clock-in');
  const clockOutBtn = document.querySelector('.clock-out');
  
  if (clockInBtn && clockOutBtn) {
    // Check if already clocked in
    const isClocked = localStorage.getItem('clockedIn') === 'true';
    
    if (isClocked) {
      clockInBtn.classList.add('disabled');
      clockInBtn.disabled = true;
      clockOutBtn.classList.remove('disabled');
      clockOutBtn.disabled = false;
    } else {
      clockOutBtn.classList.add('disabled');
      clockOutBtn.disabled = true;
    }
    
    // Clock in button
    clockInBtn.addEventListener('click', function() {
      // Record clock in time
      const now = new Date();
      
      // Store clock in status and time
      localStorage.setItem('clockedIn', 'true');
      localStorage.setItem('clockInTime', now.toISOString());
      
      // Disable clock in button and enable clock out button
      this.classList.add('disabled');
      this.disabled = true;
      clockOutBtn.classList.remove('disabled');
      clockOutBtn.disabled = false;
      
      // Add to attendance list (in a real app, this would be sent to an API)
      addAttendanceRecord('in', now);
      
      // Show notification
      showNotification('Pointage', `Heure d'arrivée enregistrée: ${formatTime(now)}`);
    });
    
    // Clock out button
    clockOutBtn.addEventListener('click', function() {
      // Record clock out time
      const now = new Date();
      
      // Get clock in time if available
      const clockInTime = localStorage.getItem('clockInTime');
      let message = `Heure de départ enregistrée: ${formatTime(now)}`;
      
      if (clockInTime) {
        const clockInDate = new Date(clockInTime);
        const duration = calculateDuration(clockInDate, now);
        message += `<br>Durée de travail: ${duration}`;
      }
      
      // Reset clock status
      localStorage.setItem('clockedIn', 'false');
      localStorage.removeItem('clockInTime');
      
      // Disable clock out button and enable clock in button
      this.classList.add('disabled');
      this.disabled = true;
      clockInBtn.classList.remove('disabled');
      clockInBtn.disabled = false;
      
      // Add to attendance list (in a real app, this would be sent to an API)
      addAttendanceRecord('out', now);
      
      // Show notification
      showNotification('Pointage', message);
    });
  }
}

/**
 * Calculate duration between two dates
 */
function calculateDuration(start, end) {
  const diff = Math.abs(end - start);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}min`;
}

/**
 * Add attendance record to list
 */
function addAttendanceRecord(type, time) {
  const attendanceList = document.querySelector('.attendance-list');
  if (!attendanceList) return;
  
  // Get current user
  const userName = localStorage.getItem('userName') || 'Utilisateur';
  const userRole = localStorage.getItem('userRole') || 'employee';
  
  // For a real application, this would be an API call
  // For this prototype, we'll just update the UI
  
  if (type === 'in') {
    // Create a new attendance item for clock in
    const newItem = document.createElement('div');
    newItem.className = 'attendance-item';
    newItem.innerHTML = `
      <div class="attendance-employee">
        <div class="attendance-avatar">
          <img src="../assets/img/avatars/${userRole}.jpg" alt="${userName}">
        </div>
        <div class="attendance-name">${userName}</div>
      </div>
      <div class="attendance-time">
        <div class="time-in">
          <span class="time-value">${formatTime(time)}</span>
          <span class="time-label">Arrivée</span>
        </div>
        <div class="time-separator">-</div>
        <div class="time-out">
          <span class="time-value">--:--:--</span>
          <span class="time-label">Départ</span>
        </div>
      </div>
      <div class="attendance-status on-time">En cours</div>
    `;
    
    // Insert at the top of the list
    attendanceList.insertBefore(newItem, attendanceList.firstChild);
  } else if (type === 'out') {
    // Update the first attendance item (assuming it's the current user's)
    const firstItem = attendanceList.querySelector('.attendance-item:first-child');
    if (firstItem) {
      const timeOutEl = firstItem.querySelector('.time-out .time-value');
      const statusEl = firstItem.querySelector('.attendance-status');
      
      if (timeOutEl) {
        timeOutEl.textContent = formatTime(time);
      }
      
      if (statusEl) {
        statusEl.className = 'attendance-status on-time';
        statusEl.textContent = 'Terminé';
      }
    }
  }
}

/**
 * Initialize attendance filters
 */
function initAttendanceFilters() {
  const dateFilterInput = document.querySelector('input[type="date"]');
  const storeFilterSelect = document.querySelector('select[name="store-filter"]');
  const statusFilterSelect = document.querySelector('select[name="status-filter"]');
  
  if (dateFilterInput) {
    dateFilterInput.addEventListener('change', function() {
      filterAttendanceRecords();
    });
  }
  
  if (storeFilterSelect) {
    storeFilterSelect.addEventListener('change', function() {
      filterAttendanceRecords();
    });
  }
  
  if (statusFilterSelect) {
    statusFilterSelect.addEventListener('change', function() {
      filterAttendanceRecords();
    });
  }
}

/**
 * Filter attendance records
 */
function filterAttendanceRecords() {
  const dateFilter = document.querySelector('input[type="date"]').value;
  const storeFilter = document.querySelector('select[name="store-filter"]').value;
  const statusFilter = document.querySelector('select[name="status-filter"]').value;
  
  const attendanceItems = document.querySelectorAll('.attendance-item');
  
  attendanceItems.forEach(item => {
    // In a real app, these filters would be applied based on actual data attributes
    // For this prototype, we'll just simulate filtering
    
    let showItem = true;
    
    // Date filter (simplified for prototype)
    if (dateFilter && Math.random() > 0.7) {
      showItem = false;
    }
    
    // Store filter
    if (storeFilter && storeFilter !== 'all') {
      const itemStore = item.querySelector('.attendance-name').textContent.includes('Nord') ? 'north' :
                        item.querySelector('.attendance-name').textContent.includes('Sud') ? 'south' :
                        item.querySelector('.attendance-name').textContent.includes('Est') ? 'east' :
                        item.querySelector('.attendance-name').textContent.includes('Ouest') ? 'west' :
                        'center';
      
      if (storeFilter !== itemStore) {
        showItem = false;
      }
    }
    
    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      const itemStatus = item.querySelector('.attendance-status').classList.contains('on-time') ? 'ontime' :
                         item.querySelector('.attendance-status').classList.contains('late') ? 'late' :
                         'absent';
      
      if (statusFilter !== itemStatus) {
        showItem = false;
      }
    }
    
    // Show/hide item
    if (showItem) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

/**
 * Initialize attendance export
 */
function initAttendanceExport() {
  const exportButton = document.querySelector('.btn-export');
  
  if (exportButton) {
    exportButton.addEventListener('click', function() {
      exportAttendanceData();
    });
  }
}

/**
 * Export attendance data
 */
function exportAttendanceData() {
  // In a real app, this would generate a CSV/Excel file with the data
  // For this prototype, we'll just show a notification
  
  showNotification('Export', 'Les données de présence ont été exportées avec succès');
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
  
  new Chart(ctx, {
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
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y + '%';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
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
 * Load attendance data
 */
function loadAttendanceData() {
  // In a real app, this would be an API call
  // For this prototype, the data is already in the HTML
}

/**
 * Generate random attendance data
 */
function generateAttendanceData(count) {
  const data = [];
  const stores = ['Boutique Nord', 'Boutique Sud', 'Boutique Est', 'Boutique Ouest', 'Boutique Centre'];
  const statuses = ['on-time', 'late', 'absent'];
  const statusLabels = {
    'on-time': 'À l\'heure',
    'late': 'En retard',
    'absent': 'Absent'
  };
  
  // Sample employee names
  const employees = [
    { name: 'Sarah Trabelsi', avatar: 'employee1.jpg' },
    { name: 'Ahmed Karim', avatar: 'employee2.jpg' },
    { name: 'Fatma Ben Ali', avatar: 'employee3.jpg' },
    { name: 'Mehdi Selmi', avatar: 'employee4.jpg' },
    { name: 'Amina Slimani', avatar: 'employee5.jpg' },
    { name: 'Youssef Miled', avatar: 'employee6.jpg' }
  ];
  
  // Current date
  const now = new Date();
  
  // Generate random attendance records
  for (let i = 0; i < count; i++) {
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const store = stores[Math.floor(Math.random() * stores.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Random time in today (between 8:00 and 9:30 for in, between 17:00 and 18:30 for out)
    const timeIn = new Date(now);
    timeIn.setHours(8 + Math.floor(Math.random() * 2));
    timeIn.setMinutes(Math.floor(Math.random() * 90));
    timeIn.setSeconds(Math.floor(Math.random() * 60));
    
    const timeOut = new Date(now);
    timeOut.setHours(17 + Math.floor(Math.random() * 2));
    timeOut.setMinutes(Math.floor(Math.random() * 90));
    timeOut.setSeconds(Math.floor(Math.random() * 60));
    
    data.push({
      employee: employee.name,
      avatar: employee.avatar,
      store: store,
      timeIn: status !== 'absent' ? formatTime(timeIn) : '--:--:--',
      timeOut: status !== 'absent' ? formatTime(timeOut) : '--:--:--',
      status: status,
      statusLabel: statusLabels[status]
    });
  }
  
  return data;
}

/**
 * Render attendance data
 */
function renderAttendanceData(data) {
  const attendanceList = document.querySelector('.attendance-list');
  if (!attendanceList) return;
  
  // Clear existing data
  attendanceList.innerHTML = '';
  
  // Add each attendance record
  data.forEach(record => {
    const item = document.createElement('div');
    item.className = 'attendance-item';
    
    item.innerHTML = `
      <div class="attendance-employee">
        <div class="attendance-avatar">
          <img src="../assets/img/avatars/${record.avatar}" alt="${record.employee}">
        </div>
        <div class="attendance-name">${record.employee}</div>
      </div>
      <div class="attendance-time">
        <div class="time-in">
          <span class="time-value">${record.timeIn}</span>
          <span class="time-label">Arrivée</span>
        </div>
        <div class="time-separator">-</div>
        <div class="time-out">
          <span class="time-value">${record.timeOut}</span>
          <span class="time-label">Départ</span>
        </div>
      </div>
      <div class="attendance-status ${record.status}">${record.statusLabel}</div>
    `;
    
    attendanceList.appendChild(item);
  });
}

/**
 * Get day name from date
 */
function getDayName(date) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[date.getDay()];
}

/**
 * Get month name from date
 */
function getMonthName(date) {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return months[date.getMonth()];
}

/**
 * Format date as DD/MM/YYYY
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Get attendance stats for employee
 */
function getEmployeeAttendanceStats(employeeId) {
  // In a real app, this would be an API call
  // For this prototype, we'll return sample data
  
  return {
    total: 22,
    onTime: 19,
    late: 2,
    absent: 1,
    onTimePercentage: 86,
    latePercentage: 9,
    absentPercentage: 5
  };
}

/**
 * Get attendance stats for store
 */
function getStoreAttendanceStats(storeId) {
  // In a real app, this would be an API call
  // For this prototype, we'll return sample data
  
  return {
    total: 220,
    onTime: 195,
    late: 15,
    absent: 10,
    onTimePercentage: 89,
    latePercentage: 7,
    absentPercentage: 4
  };
}

/**
 * Get overall attendance stats
 */
function getOverallAttendanceStats() {
  // In a real app, this would be an API call
  // For this prototype, we'll return sample data
  
  return {
    total: 1100,
    onTime: 990,
    late: 77,
    absent: 33,
    onTimePercentage: 90,
    latePercentage: 7,
    absentPercentage: 3
  };
}

/**
 * Handle manual attendance entry
 */
function handleManualAttendanceEntry() {
  const manualForm = document.getElementById('manualAttendanceForm');
  
  if (manualForm) {
    manualForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const employee = document.getElementById('employee').value;
      const date = document.getElementById('date').value;
      const timeIn = document.getElementById('timeIn').value;
      const timeOut = document.getElementById('timeOut').value;
      const status = document.getElementById('status').value;
      
      // In a real app, this would be sent to an API
      // For this prototype, we'll just show a notification
      
      showNotification('Pointage manuel', 'Pointage enregistré avec succès');
      
      // Close modal if applicable
      const modal = this.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
      
      // Reset form
      this.reset();
    });
  }
}

/**
 * Add event listener once DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the attendance page
  initAttendancePage();
});