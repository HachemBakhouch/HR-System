/**
 * leave.js - Leave management functionality for the Mazzaro Milano HR System
 */

document.addEventListener('DOMContentLoaded', () => {
  initLeavePage();
  initLeaveRequestForm();
  initLeaveFilters();
  initLeaveActions();
  initLeaveCalendar();
});

/**
 * Initialize leave management page
 */
function initLeavePage() {
  // Check if we're on the leave page
  if (!document.querySelector('.leave-content')) return;
  
  // Load leave data (in a real app, this would be from an API)
  loadLeaveData();
  
  // Update leave balance display
  updateLeaveBalance();
}

/**
 * Initialize leave request form
 */
function initLeaveRequestForm() {
  const leaveForm = document.getElementById('leaveRequestForm');
  
  if (leaveForm) {
    // Set min date for start and end date inputs
    const startDateInput = document.getElementById('leave-start-date');
    const endDateInput = document.getElementById('leave-end-date');
    
    if (startDateInput && endDateInput) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const formattedTomorrow = tomorrow.toISOString().split('T')[0];
      
      startDateInput.setAttribute('min', formattedTomorrow);
      endDateInput.setAttribute('min', formattedTomorrow);
      
      // Update end date min value when start date changes
      startDateInput.addEventListener('change', function() {
        const startDate = new Date(this.value);
        endDateInput.setAttribute('min', this.value);
        
        // If end date is before start date, update it
        if (new Date(endDateInput.value) < startDate) {
          endDateInput.value = this.value;
        }
        
        // Update days calculation
        updateDaysCalculation();
      });
      
      // Update days calculation when end date changes
      endDateInput.addEventListener('change', updateDaysCalculation);
    }
    
    // Form submission
    leaveForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const leaveType = document.getElementById('leave-type').value;
      const startDate = document.getElementById('leave-start-date').value;
      const endDate = document.getElementById('leave-end-date').value;
      const reason = document.getElementById('leave-reason').value;
      
      if (!leaveType || !startDate || !endDate || !reason) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      // Calculate number of days
      const days = calculateBusinessDays(new Date(startDate), new Date(endDate));
      
      // In a real app, this would be an API call to submit the leave request
      // For this prototype, we'll add a new leave request to the UI
      
      addLeaveRequest({
        type: leaveType,
        startDate,
        endDate,
        days,
        reason,
        status: 'pending'
      });
      
      // Show notification
      showNotification('Demande envoyée', 'Votre demande de congé a été soumise avec succès');
      
      // Reset form
      this.reset();
      
      // Update leave balance
      updateLeaveBalance();
    });
  }
}

/**
 * Update days calculation in leave request form
 */
function updateDaysCalculation() {
  const startDateInput = document.getElementById('leave-start-date');
  const endDateInput = document.getElementById('leave-end-date');
  const daysCalculation = document.getElementById('days-calculation');
  
  if (startDateInput && endDateInput && daysCalculation) {
    if (startDateInput.value && endDateInput.value) {
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);
      
      const days = calculateBusinessDays(startDate, endDate);
      daysCalculation.textContent = `${days} jour(s) ouvrable(s)`;
      daysCalculation.parentElement.style.display = 'block';
    } else {
      daysCalculation.parentElement.style.display = 'none';
    }
  }
}

/**
 * Calculate business days between two dates (excluding weekends)
 */
function calculateBusinessDays(startDate, endDate) {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  
  return count;
}

/**
 * Initialize leave filters
 */
function initLeaveFilters() {
  const statusFilter = document.querySelector('select[name="status-filter"]');
  const typeFilter = document.querySelector('select[name="type-filter"]');
  const dateFilter = document.querySelector('select[name="date-filter"]');
  
  const filters = [statusFilter, typeFilter, dateFilter];
  
  filters.forEach(filter => {
    if (filter) {
      filter.addEventListener('change', filterLeaveRequests);
    }
  });
}

/**
 * Filter leave requests based on current filter settings
 */
function filterLeaveRequests() {
  const statusFilter = document.querySelector('select[name="status-filter"]').value;
  const typeFilter = document.querySelector('select[name="type-filter"]').value;
  const dateFilter = document.querySelector('select[name="date-filter"]').value;
  
  const leaveItems = document.querySelectorAll('.leave-item');
  
  leaveItems.forEach(item => {
    let showItem = true;
    
    // Status filter
    if (statusFilter !== 'all') {
      const itemStatus = item.querySelector('.leave-status').className.split(' ')[1];
      
      if (itemStatus !== statusFilter) {
        showItem = false;
      }
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      const itemType = item.getAttribute('data-type');
      
      if (itemType !== typeFilter) {
        showItem = false;
      }
    }
    
    // Date filter (simplified for prototype)
    if (dateFilter !== 'all') {
      const itemDate = new Date(item.getAttribute('data-start-date'));
      const now = new Date();
      
      if (dateFilter === 'upcoming') {
        if (itemDate < now) {
          showItem = false;
        }
      } else if (dateFilter === 'past') {
        if (itemDate >= now) {
          showItem = false;
        }
      }
    }
    
    // Show/hide item
    item.style.display = showItem ? '' : 'none';
  });
}

/**
 * Initialize leave actions
 */
function initLeaveActions() {
  // Cancel leave request buttons
  const cancelButtons = document.querySelectorAll('.leave-action[data-action="cancel"]');
  
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const leaveId = this.closest('.leave-item').getAttribute('data-id');
      cancelLeaveRequest(leaveId);
    });
  });
  
  // Admin actions (approve/reject) if user is admin
  if (isAdmin()) {
    const approveButtons = document.querySelectorAll('.leave-action[data-action="approve"]');
    const rejectButtons = document.querySelectorAll('.leave-action[data-action="reject"]');
    
    approveButtons.forEach(button => {
      button.addEventListener('click', function() {
        const leaveId = this.closest('.leave-item').getAttribute('data-id');
        updateLeaveStatus(leaveId, 'approved');
      });
    });
    
    rejectButtons.forEach(button => {
      button.addEventListener('click', function() {
        const leaveId = this.closest('.leave-item').getAttribute('data-id');
        updateLeaveStatus(leaveId, 'rejected');
      });
    });
  }
}

/**
 * Check if current user is admin
 */
function isAdmin() {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin' || userRole === 'sector';
}

/**
 * Cancel leave request
 */
function cancelLeaveRequest(leaveId) {
  const leaveItem = document.querySelector(`.leave-item[data-id="${leaveId}"]`);
  if (!leaveItem) return;
  
  // Check if it can be canceled (only pending requests can be canceled)
  const status = leaveItem.querySelector('.leave-status').className.split(' ')[1];
  
  if (status !== 'pending') {
    showNotification('Erreur', 'Seules les demandes en attente peuvent être annulées', 'error');
    return;
  }
  
  // In a real app, this would be an API call to cancel the request
  // For this prototype, we'll just update the UI
  
  // Update status
  const statusElement = leaveItem.querySelector('.leave-status');
  statusElement.className = 'leave-status canceled';
  statusElement.textContent = 'Annulé';
  
  // Hide cancel button
  const cancelButton = leaveItem.querySelector('.leave-action[data-action="cancel"]');
  if (cancelButton) {
    cancelButton.style.display = 'none';
  }
  
  // Show notification
  showNotification('Demande annulée', 'Votre demande de congé a été annulée avec succès');
  
  // Update leave balance
  updateLeaveBalance();
  
  // Update calendar
  updateLeaveCalendar();
}

/**
 * Update leave status (approve/reject)
 */
function updateLeaveStatus(leaveId, newStatus) {
  const leaveItem = document.querySelector(`.leave-item[data-id="${leaveId}"]`);
  if (!leaveItem) return;
  
  // Check if status can be changed (only pending requests can be approved/rejected)
  const currentStatus = leaveItem.querySelector('.leave-status').className.split(' ')[1];
  
  if (currentStatus !== 'pending') {
    showNotification('Erreur', 'Seules les demandes en attente peuvent être modifiées', 'error');
    return;
  }
  
  // In a real app, this would be an API call to update the request
  // For this prototype, we'll just update the UI
  
  // Update status
  const statusElement = leaveItem.querySelector('.leave-status');
  statusElement.className = `leave-status ${newStatus}`;
  
  const statusText = {
    'approved': 'Approuvé',
    'rejected': 'Rejeté'
  };
  
  statusElement.textContent = statusText[newStatus];
  
  // Hide admin action buttons
  const actionButtons = leaveItem.querySelectorAll('.leave-action[data-action]');
  actionButtons.forEach(button => {
    button.style.display = 'none';
  });
  
  // Show notification
  const notificationMessage = newStatus === 'approved' 
    ? 'La demande de congé a été approuvée'
    : 'La demande de congé a été rejetée';
  
  showNotification('Statut mis à jour', notificationMessage);
  
  // Update calendar
  updateLeaveCalendar();
}

/**
 * Add a new leave request to the UI
 */
function addLeaveRequest(data) {
  const leaveList = document.querySelector('.leave-history');
  if (!leaveList) return;
  
  // Generate unique ID for the new request
  const leaveId = 'leave-' + Date.now();
  
  // Format dates for display
  const formattedStartDate = formatDate(new Date(data.startDate));
  const formattedEndDate = formatDate(new Date(data.endDate));
  
  // Type mapping
  const typeTexts = {
    'annual': 'Congé annuel',
    'sick': 'Congé maladie',
    'personal': 'Congé personnel',
    'maternity': 'Congé maternité',
    'paternity': 'Congé paternité',
    'other': 'Autre'
  };
  
  // Status mapping
  const statusTexts = {
    'pending': 'En attente',
    'approved': 'Approuvé',
    'rejected': 'Rejeté',
    'canceled': 'Annulé'
  };
  
  // Create the new leave item
  const leaveItem = document.createElement('div');
  leaveItem.className = 'leave-item';
  leaveItem.setAttribute('data-id', leaveId);
  leaveItem.setAttribute('data-type', data.type);
  leaveItem.setAttribute('data-start-date', data.startDate);
  leaveItem.setAttribute('data-end-date', data.endDate);
  
  // Set leave item HTML
  leaveItem.innerHTML = `
    <div class="leave-info">
      <div class="leave-type">${typeTexts[data.type]}</div>
      <div class="leave-dates">
        <i class="fas fa-calendar-alt"></i>
        ${formattedStartDate} - ${formattedEndDate} (${data.days} jour${data.days > 1 ? 's' : ''})
      </div>
      <div class="leave-reason">${data.reason}</div>
    </div>
    <div class="leave-status ${data.status}">${statusTexts[data.status]}</div>
    <div class="leave-actions">
      <button class="leave-action" data-action="cancel">
        <i class="fas fa-times-circle"></i> Annuler
      </button>
      ${isAdmin() ? `
        <button class="leave-action" data-action="approve">
          <i class="fas fa-check-circle"></i> Approuver
        </button>
        <button class="leave-action" data-action="reject">
          <i class="fas fa-times-circle"></i> Rejeter
        </button>
      ` : ''}
    </div>
  `;
  
  // Add to the top of the list
  leaveList.insertBefore(leaveItem, leaveList.firstChild);
  
  // Add event listeners to the cancel button
  const cancelBtn = leaveItem.querySelector('.leave-action[data-action="cancel"]');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      cancelLeaveRequest(leaveId);
    });
  }
  
  // Add event listeners to the admin action buttons
  if (isAdmin()) {
    const approveBtn = leaveItem.querySelector('.leave-action[data-action="approve"]');
    const rejectBtn = leaveItem.querySelector('.leave-action[data-action="reject"]');
    
    if (approveBtn) {
      approveBtn.addEventListener('click', function() {
        updateLeaveStatus(leaveId, 'approved');
      });
    }
    
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        updateLeaveStatus(leaveId, 'rejected');
      });
    }
  }
  
  // Update calendar
  updateLeaveCalendar();
}

/**
 * Initialize leave calendar
 */
function initLeaveCalendar() {
  const calendarContainer = document.querySelector('.leave-calendar');
  if (!calendarContainer) return;
  
  // Get current date
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Render calendar
  renderCalendar(currentMonth, currentYear);
  
  // Add event listeners to navigation buttons
  const prevButton = document.querySelector('.prev-month');
  const nextButton = document.querySelector('.next-month');
  const todayButton = document.querySelector('.today-btn');
  
  if (prevButton) {
    prevButton.addEventListener('click', function() {
      const currentMonthEl = document.querySelector('.calendar-month');
      const parts = currentMonthEl.getAttribute('data-date').split('-');
      let year = parseInt(parts[0]);
      let month = parseInt(parts[1]) - 1;
      
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
      
      renderCalendar(month, year);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      const currentMonthEl = document.querySelector('.calendar-month');
      const parts = currentMonthEl.getAttribute('data-date').split('-');
      let year = parseInt(parts[0]);
      let month = parseInt(parts[1]) - 1;
      
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
      
      renderCalendar(month, year);
    });
  }
  
  if (todayButton) {
    todayButton.addEventListener('click', function() {
      const now = new Date();
      renderCalendar(now.getMonth(), now.getFullYear());
    });
  }
}

/**
 * Render calendar for a specific month and year
 */
function renderCalendar(month, year) {
  const calendarContainer = document.querySelector('.leave-calendar');
  if (!calendarContainer) return;
  
  // Get calendar elements
  const calendarTitle = calendarContainer.querySelector('.calendar-title');
  const calendarGrid = calendarContainer.querySelector('.calendar-days');
  
  if (!calendarTitle || !calendarGrid) return;
  
  // Update calendar title
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  calendarTitle.textContent = `${months[month]} ${year}`;
  
  // Store current month/year in a data attribute for navigation
  const currentMonthEl = document.querySelector('.calendar-month');
  if (currentMonthEl) {
    currentMonthEl.setAttribute('data-date', `${year}-${month + 1}`);
  }
  
  // Clear existing calendar days
  calendarGrid.innerHTML = '';
  
  // Get first day of month
  const firstDay = new Date(year, month, 1);
  
  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  let dayOfWeek = firstDay.getDay();
  // Adjust to start week on Monday (0 = Monday, 6 = Sunday)
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Add day headers
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  dayNames.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });
  
  // Add empty cells for days before first day of month
  for (let i = 0; i < dayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day other-month';
    calendarGrid.appendChild(emptyDay);
  }
  
  // Add days of month
  const today = new Date();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    
    // Check if it's today
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      day.classList.add('today');
    }
    
    // Add date number
    const dateNumber = document.createElement('div');
    dateNumber.className = 'date-number';
    dateNumber.textContent = i;
    day.appendChild(dateNumber);
    
    // Add data attribute for date
    const dateObj = new Date(year, month, i);
    day.setAttribute('data-date', dateObj.toISOString().split('T')[0]);
    
    // Add to calendar grid
    calendarGrid.appendChild(day);
  }
  
  // Add empty cells for days after last day of month (to complete grid)
  const totalCells = dayOfWeek + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  
  for (let i = 0; i < remainingCells; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day other-month';
    calendarGrid.appendChild(emptyDay);
  }
  
  // Add leave events to calendar
  addLeaveEventsToCalendar();
}

/**
 * Add leave events to calendar
 */
function addLeaveEventsToCalendar() {
  // Get all approved leave requests
  const leaveRequests = document.querySelectorAll('.leave-item');
  
  // Clear existing leave events from calendar
  const leaveEvents = document.querySelectorAll('.leave-event');
  leaveEvents.forEach(event => event.remove());
  
  // Add each leave request to calendar
  leaveRequests.forEach(request => {
    const status = request.querySelector('.leave-status').className.split(' ')[1];
    
    // Only add approved leave requests to calendar
    if (status === 'approved' || status === 'pending') {
      const startDate = new Date(request.getAttribute('data-start-date'));
      const endDate = new Date(request.getAttribute('data-end-date'));
      const type = request.getAttribute('data-type');
      
      // Add for each day in the range
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        // Skip weekends
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const dateString = currentDate.toISOString().split('T')[0];
          const calendarDay = document.querySelector(`.calendar-day[data-date="${dateString}"]`);
          
          if (calendarDay) {
            // Create leave event
            const leaveEvent = document.createElement('div');
            leaveEvent.className = `leave-event ${type} ${status}`;
            
            // Type texts
            const typeTexts = {
              'annual': 'Congé annuel',
              'sick': 'Congé maladie',
              'personal': 'Congé personnel',
              'maternity': 'Congé maternité',
              'paternity': 'Congé paternité',
              'other': 'Autre'
            };
            
            // Get employee name
            const employee = localStorage.getItem('userName') || 'Employé';
            
            leaveEvent.textContent = employee;
            leaveEvent.setAttribute('title', `${typeTexts[type]} - ${employee}`);
            
            calendarDay.appendChild(leaveEvent);
          }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  });
}

/**
 * Update leave calendar with current leave requests
 */
function updateLeaveCalendar() {
  addLeaveEventsToCalendar();
}

/**
 * Update leave balance display
 */
function updateLeaveBalance() {
  // In a real app, this would be fetched from an API
  // For this prototype, we'll use sample data
  
  const annualBalance = document.querySelector('.balance-value[data-type="annual"]');
  const sickBalance = document.querySelector('.balance-value[data-type="sick"]');
  const personalBalance = document.querySelector('.balance-value[data-type="personal"]');
  
  if (annualBalance) {
    annualBalance.textContent = '15';
  }
  
  if (sickBalance) {
    sickBalance.textContent = '10';
  }
  
  if (personalBalance) {
    personalBalance.textContent = '5';
  }
}

/**
 * Load leave data
 */
function loadLeaveData() {
  // In a real app, this would be an API call
  // For this prototype, the data is already in the HTML
}

/**
 * Format date for display (DD/MM/YYYY)
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Add event listener once DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the leave page
  initLeavePage();
});