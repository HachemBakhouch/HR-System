/**
 * main.js - Core functionality for the Mazzaro Milano HR System
 */

// Global variables
let sidebarCollapsed = false;
const mobileBreakpoint = 992;

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const header = document.querySelector('.header');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const userProfileDropdown = document.querySelector('.user-profile');
const userDropdownMenu = document.querySelector('.user-dropdown-menu');
const notificationBtn = document.querySelector('.notification-btn');
const notificationPanel = document.querySelector('.notification-panel');
const modalTriggers = document.querySelectorAll('[data-modal]');
const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-cancel');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeSidebar();
  initializeDropdowns();
  initializeModals();
  handleResponsiveLayout();
  
  // Additional initializations based on page
  if (document.querySelector('.chart-container')) {
    initializeCharts();
  }
  
  if (document.querySelector('.current-time')) {
    initializeClockWidget();
  }
  
  if (document.querySelector('.calendar-grid')) {
    initializeCalendar();
  }
});

/**
 * Initialize sidebar functionality
 */
function initializeSidebar() {
  // Set active menu item based on current URL
  const currentUrl = window.location.pathname;
  const menuItems = document.querySelectorAll('.sidebar-link');
  
  menuItems.forEach(item => {
    if (currentUrl === item.getAttribute('href') || 
        (currentUrl.includes(item.getAttribute('href')) && item.getAttribute('href') !== '/')) {
      item.classList.add('active');
    }
  });
  
  // Toggle sidebar
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  
  // Close sidebar on overlay click (mobile view)
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      if (window.innerWidth < mobileBreakpoint) {
        sidebar.classList.remove('sidebar-visible');
        sidebarOverlay.classList.remove('overlay-visible');
      }
    });
  }
}

/**
 * Toggle sidebar collapsed state
 */
function toggleSidebar() {
  if (window.innerWidth < mobileBreakpoint) {
    // Mobile behavior - show/hide sidebar
    sidebar.classList.toggle('sidebar-visible');
    sidebarOverlay.classList.toggle('overlay-visible');
  } else {
    // Desktop behavior - collapse/expand sidebar
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    mainContent.classList.toggle('main-content-collapsed', sidebarCollapsed);
    header.classList.toggle('header-collapsed', sidebarCollapsed);
    
    // Store user preference
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }
}

/**
 * Initialize dropdown menus
 */
function initializeDropdowns() {
  // User profile dropdown
  if (userProfileDropdown && userDropdownMenu) {
    userProfileDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdownMenu.classList.toggle('show');
    });
  }
  
  // Notification panel
  if (notificationBtn && notificationPanel) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationPanel.classList.toggle('show');
    });
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    if (userDropdownMenu) {
      userDropdownMenu.classList.remove('show');
    }
    if (notificationPanel) {
      notificationPanel.classList.remove('show');
    }
  });
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
  // Open modal
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
      }
    });
  });
  
  // Close modal
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Close modal when clicking outside
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
}

/**
 * Handle responsive layout
 */
function handleResponsiveLayout() {
  // Check initial state
  checkWindowSize();
  
  // Listen for window resize
  window.addEventListener('resize', checkWindowSize);
}

/**
 * Check window size and adjust layout accordingly
 */
function checkWindowSize() {
  if (window.innerWidth < mobileBreakpoint) {
    // Mobile layout
    if (sidebar) {
      sidebar.classList.remove('sidebar-collapsed');
      if (sidebarCollapsed) {
        sidebar.classList.remove('sidebar-visible');
      }
    }
    if (mainContent) {
      mainContent.classList.remove('main-content-collapsed');
    }
    if (header) {
      header.classList.remove('header-collapsed');
    }
  } else {
    // Desktop layout
    if (sidebar) {
      sidebar.classList.remove('sidebar-visible');
      if (sidebarCollapsed) {
        sidebar.classList.add('sidebar-collapsed');
      }
    }
    if (mainContent && sidebarCollapsed) {
      mainContent.classList.add('main-content-collapsed');
    }
    if (header && sidebarCollapsed) {
      header.classList.add('header-collapsed');
    }
    if (sidebarOverlay) {
      sidebarOverlay.classList.remove('overlay-visible');
    }
  }
}

/**
 * Initialize charts and graphs
 */
function initializeCharts() {
  // Sample chart initialization
  const attendanceChartEl = document.getElementById('attendanceChart');
  if (attendanceChartEl) {
    const ctx = attendanceChartEl.getContext('2d');
    
    // Sample data for attendance chart
    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const onTimeData = [45, 47, 44, 42, 46, 25, 10];
    const lateData = [3, 2, 5, 7, 4, 2, 1];
    const absentData = [2, 1, 1, 1, 0, 3, 19];
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'À l\'heure',
            data: onTimeData,
            backgroundColor: 'rgba(59, 89, 152, 0.7)',
            borderColor: 'rgba(59, 89, 152, 1)',
            borderWidth: 1
          },
          {
            label: 'En retard',
            data: lateData,
            backgroundColor: 'rgba(255, 193, 7, 0.7)',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 1
          },
          {
            label: 'Absent',
            data: absentData,
            backgroundColor: 'rgba(220, 53, 69, 0.7)',
            borderColor: 'rgba(220, 53, 69, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  const performanceChartEl = document.getElementById('performanceChart');
  if (performanceChartEl) {
    const ctx = performanceChartEl.getContext('2d');
    
    // Sample data for performance chart
    const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const storeData = [
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
    ];
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: storeData
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 50,
            max: 100
          }
        }
      }
    });
  }
}

/**
 * Initialize clock widget for attendance tracking
 */
function initializeClockWidget() {
  const timeElement = document.querySelector('.current-time');
  const dateElement = document.querySelector('.current-date');
  
  if (timeElement && dateElement) {
    updateClock();
    setInterval(updateClock, 1000);
  }
  
  // Clock in/out functionality
  const clockInBtn = document.querySelector('.clock-in');
  const clockOutBtn = document.querySelector('.clock-out');
  
  if (clockInBtn) {
    clockInBtn.addEventListener('click', () => {
      // Log clock in time
      const now = new Date();
      showNotification('Pointage enregistré', `Heure d'arrivée: ${formatTime(now)}`);
      
      // Disable clock in button after use
      clockInBtn.classList.add('disabled');
      clockInBtn.disabled = true;
      
      // Enable clock out button
      if (clockOutBtn) {
        clockOutBtn.classList.remove('disabled');
        clockOutBtn.disabled = false;
      }
      
      // Store clock in status
      localStorage.setItem('clockedIn', 'true');
      localStorage.setItem('clockInTime', now.toISOString());
    });
  }
  
  if (clockOutBtn) {
    clockOutBtn.addEventListener('click', () => {
      // Log clock out time
      const now = new Date();
      const clockInTime = localStorage.getItem('clockInTime');
      let message = `Heure de départ: ${formatTime(now)}`;
      
      if (clockInTime) {
        const clockInDate = new Date(clockInTime);
        const duration = calculateDuration(clockInDate, now);
        message += `<br>Durée: ${duration}`;
      }
      
      showNotification('Pointage enregistré', message);
      
      // Disable clock out button after use
      clockOutBtn.classList.add('disabled');
      clockOutBtn.disabled = true;
      
      // Store clock out status
      localStorage.setItem('clockedIn', 'false');
      localStorage.removeItem('clockInTime');
    });
  }
  
  // Check if already clocked in
  const isClocked = localStorage.getItem('clockedIn') === 'true';
  if (isClocked && clockInBtn && clockOutBtn) {
    clockInBtn.classList.add('disabled');
    clockInBtn.disabled = true;
    clockOutBtn.classList.remove('disabled');
    clockOutBtn.disabled = false;
  } else if (clockOutBtn) {
    clockOutBtn.classList.add('disabled');
    clockOutBtn.disabled = true;
  }
}

/**
 * Update clock display
 */
function updateClock() {
  const now = new Date();
  const timeElement = document.querySelector('.current-time');
  const dateElement = document.querySelector('.current-date');
  
  if (timeElement) {
    timeElement.textContent = formatTime(now);
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
 * Calculate duration between two dates
 */
function calculateDuration(start, end) {
  const diff = Math.abs(end - start);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}min`;
}

/**
 * Initialize calendar functionality
 */
function initializeCalendar() {
  const calendarTitle = document.querySelector('.calendar-title');
  const prevMonthBtn = document.querySelector('.prev-month');
  const nextMonthBtn = document.querySelector('.next-month');
  const todayBtn = document.querySelector('.today-btn');
  const calendarGrid = document.querySelector('.calendar-grid');
  
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  
  // Initial render
  renderCalendar(currentMonth, currentYear);
  
  // Previous month button
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentMonth, currentYear);
    });
  }
  
  // Next month button
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentMonth, currentYear);
    });
  }
  
  // Today button
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      const today = new Date();
      currentMonth = today.getMonth();
      currentYear = today.getFullYear();
      renderCalendar(currentMonth, currentYear);
    });
  }
  
  /**
   * Render calendar for given month and year
   */
  function renderCalendar(month, year) {
    if (!calendarGrid || !calendarTitle) return;
    
    // Update calendar title
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    calendarTitle.textContent = `${monthNames[month]} ${year}`;
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    dayNames.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-day-header';
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    
    // Adjust first day to start from Monday (1) instead of Sunday (0)
    let dayOfWeek = firstDay.getDay() || 7;
    dayOfWeek = dayOfWeek === 1 ? 1 : dayOfWeek - 1;
    
    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Add days from previous month
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const day = document.createElement('div');
      day.className = 'calendar-day other-month';
      
      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      dayNumber.textContent = daysInPrevMonth - i;
      
      day.appendChild(dayNumber);
      calendarGrid.appendChild(day);
    }
    
    // Add days of current month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day';
      
      // Check if it's today
      if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        day.classList.add('today');
      }
      
      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dayNumber.classList.add('today');
      }
      dayNumber.textContent = i;
      
      day.appendChild(dayNumber);
      
      // Add sample events
      addSampleEvents(day, i, month, year);
      
      calendarGrid.appendChild(day);
    }
    
    // Calculate how many days we need from next month
    const totalCells = 42; // 6 rows x 7 days
    const cellsUsed = dayOfWeek + daysInMonth;
    const cellsRemaining = totalCells - cellsUsed;
    
    // Add days from next month
    for (let i = 1; i <= cellsRemaining; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day other-month';
      
      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      dayNumber.textContent = i;
      
      day.appendChild(dayNumber);
      calendarGrid.appendChild(day);
    }
  }
  
  /**
   * Add sample events to calendar
   */
  function addSampleEvents(dayElement, day, month, year) {
    // Sample events (would be fetched from an API in a real application)
    const events = [
      { title: 'Réunion personnel', day: 10, type: 'primary' },
      { title: 'Formation Shopify', day: 15, type: 'secondary' },
      { title: 'Inventaire', day: 20, type: 'info' },
      { title: 'Jour férié', day: 25, type: 'success' }
    ];
    
    events.forEach(event => {
      if (event.day === day) {
        const eventEl = document.createElement('div');
        eventEl.className = `event ${event.type}`;
        eventEl.textContent = event.title;
        dayElement.appendChild(eventEl);
      }
    });
  }
}

/**
 * Show notification message
 */
function showNotification(title, message) {
  // Create notification container if it doesn't exist
  let notifContainer = document.querySelector('.notification-container');
  if (!notifContainer) {
    notifContainer = document.createElement('div');
    notifContainer.className = 'notification-container';
    document.body.appendChild(notifContainer);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  
  // Add notification content
  notification.innerHTML = `
    <div class="notification-header">
      <h4>${title}</h4>
      <button class="notification-close">&times;</button>
    </div>
    <div class="notification-body">
      ${message}
    </div>
  `;
  
  // Add notification to container
  notifContainer.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
  }
  
  // Auto close after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}