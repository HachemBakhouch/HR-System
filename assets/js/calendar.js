/**
 * calendar.js - Calendar functionality for the Mazzaro Milano HR System
 */

document.addEventListener('DOMContentLoaded', () => {
    initCalendarPage();
    initCalendarNavigation();
    initEventModal();
    initViewSwitcher();
    initFilters();
    initExportFunction();
});

/**
 * Initialize calendar page
 */
function initCalendarPage() {
    // Check if we're on the calendar page
    if (!document.querySelector('.calendar-content')) return;

    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Initialize with current month view
    renderMonthView(currentMonth, currentYear);

    // Load events (in a real app, this would be from an API)
    loadEvents();
}

/**
 * Initialize calendar navigation
 */
function initCalendarNavigation() {
    const prevBtn = document.querySelector('.calendar-nav-btn.prev');
    const nextBtn = document.querySelector('.calendar-nav-btn.next');
    const todayBtn = document.querySelector('.calendar-nav-btn.today');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateCalendar('prev');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateCalendar('next');
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            navigateCalendar('today');
        });
    }
}

/**
 * Navigate calendar based on direction
 */
function navigateCalendar(direction) {
    const currentViewEl = document.querySelector('.calendar-container');
    if (!currentViewEl) return;

    // Get current view type
    const viewType = currentViewEl.getAttribute('data-view') || 'month';

    // Get current date from data attribute
    const currentDateAttr = document.querySelector('.calendar-header').getAttribute('data-date');
    const currentDate = currentDateAttr ? new Date(currentDateAttr) : new Date();

    let newDate = new Date(currentDate);

    switch (direction) {
        case 'prev':
            if (viewType === 'month') {
                newDate.setMonth(currentDate.getMonth() - 1);
            } else if (viewType === 'week') {
                newDate.setDate(currentDate.getDate() - 7);
            } else if (viewType === 'day') {
                newDate.setDate(currentDate.getDate() - 1);
            }
            break;
        case 'next':
            if (viewType === 'month') {
                newDate.setMonth(currentDate.getMonth() + 1);
            } else if (viewType === 'week') {
                newDate.setDate(currentDate.getDate() + 7);
            } else if (viewType === 'day') {
                newDate.setDate(currentDate.getDate() + 1);
            }
            break;
        case 'today':
            newDate = new Date();
            break;
    }

    // Render appropriate view
    if (viewType === 'month') {
        renderMonthView(newDate.getMonth(), newDate.getFullYear());
    } else if (viewType === 'week') {
        renderWeekView(newDate);
    } else if (viewType === 'day') {
        renderDayView(newDate);
    }
}

/**
 * Initialize event modal
 */
function initEventModal() {
    const addEventBtn = document.querySelector('.add-event-btn');
    const eventForm = document.getElementById('eventForm');

    if (addEventBtn) {
        addEventBtn.addEventListener('click', () => {
            openEventModal();
        });
    }

    if (eventForm) {
        eventForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const title = document.getElementById('event-title').value;
            const start = document.getElementById('event-start').value;
            const end = document.getElementById('event-end').value;
            const type = document.getElementById('event-type').value;
            const allDay = document.getElementById('event-all-day').checked;
            const description = document.getElementById('event-description').value;
            const location = document.getElementById('event-location').value;
            const attendees = document.getElementById('event-attendees').value;

            if (!title || !start) {
                alert('Veuillez saisir au moins un titre et une date de début');
                return;
            }

            // Create event object
            const newEvent = {
                id: 'event-' + Date.now(),
                title,
                start,
                end: end || start,
                type,
                allDay,
                description,
                location,
                attendees: attendees.split(',').map(attendee => attendee.trim())
            };

            // In a real app, this would be sent to an API
            // For this prototype, we'll just add it to the calendar
            addEvent(newEvent);

            // Close modal
            const modal = this.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
            }

            // Reset form
            this.reset();
        });
    }

    // Event delegation for existing events
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('calendar-event') || e.target.closest('.calendar-event')) {
            const eventEl = e.target.classList.contains('calendar-event') ? e.target : e.target.closest('.calendar-event');
            const eventId = eventEl.getAttribute('data-id');
            openEventModal(eventId);
        }
    });
}

/**
 * Open event modal (empty for new event, or populated for existing)
 */
function openEventModal(eventId = null) {
    const modal = document.getElementById('eventModal');
    if (!modal) return;

    // Set modal title based on if it's new or existing
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = eventId ? 'Modifier l\'événement' : 'Ajouter un événement';
    }

    // Get form
    const eventForm = document.getElementById('eventForm');
    if (!eventForm) return;

    // If editing existing event, populate the form
    if (eventId) {
        const event = getEventById(eventId);
        if (event) {
            // Set form ID
            eventForm.setAttribute('data-event-id', eventId);

            // Populate form fields
            document.getElementById('event-title').value = event.title || '';
            document.getElementById('event-start').value = formatDateTimeForInput(new Date(event.start)) || '';
            document.getElementById('event-end').value = formatDateTimeForInput(new Date(event.end)) || '';
            document.getElementById('event-type').value = event.type || 'default';
            document.getElementById('event-all-day').checked = event.allDay || false;
            document.getElementById('event-description').value = event.description || '';
            document.getElementById('event-location').value = event.location || '';
            document.getElementById('event-attendees').value = event.attendees ? event.attendees.join(', ') : '';

            // Show delete button
            const deleteBtn = modal.querySelector('.delete-event-btn');
            if (deleteBtn) {
                deleteBtn.style.display = 'inline-block';
                deleteBtn.setAttribute('data-id', eventId);
            }
        }
    } else {
        // Reset form for new event
        eventForm.reset();
        eventForm.removeAttribute('data-event-id');

        // Set default start/end time to current time rounded to nearest half hour
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
        now.setSeconds(0);

        document.getElementById('event-start').value = formatDateTimeForInput(now);

        const end = new Date(now);
        end.setHours(end.getHours() + 1);
        document.getElementById('event-end').value = formatDateTimeForInput(end);

        // Hide delete button
        const deleteBtn = modal.querySelector('.delete-event-btn');
        if (deleteBtn) {
            deleteBtn.style.display = 'none';
        }
    }

    // Show modal
    modal.classList.add('active');
}

/**
 * Format date and time for datetime-local input
 */
function formatDateTimeForInput(date) {
    return date.toISOString().slice(0, 16);
}

/**
 * Initialize view switcher
 */
function initViewSwitcher() {
    const viewBtns = document.querySelectorAll('.calendar-view-btn');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Get view type
            const viewType = this.getAttribute('data-view');

            // Update active class
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Get current date
            const currentDateAttr = document.querySelector('.calendar-header').getAttribute('data-date');
            const currentDate = currentDateAttr ? new Date(currentDateAttr) : new Date();

            // Render appropriate view
            if (viewType === 'month') {
                renderMonthView(currentDate.getMonth(), currentDate.getFullYear());
            } else if (viewType === 'week') {
                renderWeekView(currentDate);
            } else if (viewType === 'day') {
                renderDayView(currentDate);
            } else if (viewType === 'list') {
                renderListView(currentDate);
            }
        });
    });
}

/**
 * Initialize calendar filters
 */
function initFilters() {
    const eventTypeFilter = document.querySelector('select[name="event-type-filter"]');
    const storeFilter = document.querySelector('select[name="store-filter"]');

    if (eventTypeFilter) {
        eventTypeFilter.addEventListener('change', filterEvents);
    }

    if (storeFilter) {
        storeFilter.addEventListener('change', filterEvents);
    }
}

/**
 * Filter events based on current filter settings
 */
function filterEvents() {
    const eventTypeFilter = document.querySelector('select[name="event-type-filter"]').value;
    const storeFilter = document.querySelector('select[name="store-filter"]').value;

    // Get all events
    const events = document.querySelectorAll('.calendar-event');

    events.forEach(event => {
        let showEvent = true;

        // Event type filter
        if (eventTypeFilter !== 'all') {
            const eventType = event.getAttribute('data-type');
            if (eventType !== eventTypeFilter) {
                showEvent = false;
            }
        }

        // Store filter
        if (storeFilter !== 'all') {
            const eventStore = event.getAttribute('data-store');
            if (eventStore !== storeFilter) {
                showEvent = false;
            }
        }

        // Show/hide event
        if (showEvent) {
            event.style.display = '';
        } else {
            event.style.display = 'none';
        }
    });
}

/**
 * Initialize calendar export functionality
 */
function initExportFunction() {
    const exportBtn = document.querySelector('.export-calendar-btn');

    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            exportCalendar();
        });
    }
}

/**
 * Export calendar events
 */
function exportCalendar() {
    // In a real app, this would generate a file in iCal or CSV format
    // For this prototype, we'll just show a notification

    showNotification('Calendrier exporté', 'Votre calendrier a été exporté avec succès');
}

/**
 * Render month view
 */
function renderMonthView(month, year) {
    const calendarContainer = document.querySelector('.calendar-container');
    if (!calendarContainer) return;

    // Set view type
    calendarContainer.setAttribute('data-view', 'month');

    // Update header
    updateCalendarHeader(new Date(year, month, 1), 'month');

    // Get calendar grid
    const calendarGrid = calendarContainer.querySelector('.calendar-grid');
    if (!calendarGrid) return;

    // Clear existing content
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

    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    let dayOfWeek = firstDay.getDay();
    // Adjust to start week on Monday (0 = Monday, 6 = Sunday)
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

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

        // Check if it's a weekend
        const currentDate = new Date(year, month, i);
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            day.classList.add('weekend');
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
    const remainingCells = 42 - totalCells; // Always show 6 weeks (42 cells)

    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }

    // Add events to calendar
    renderEvents();
}

/**
 * Render week view
 */
function renderWeekView(date) {
    const calendarContainer = document.querySelector('.calendar-container');
    if (!calendarContainer) return;

    // Set view type
    calendarContainer.setAttribute('data-view', 'week');

    // Update header
    updateCalendarHeader(date, 'week');

    // Get calendar content
    const calendarContent = calendarContainer.querySelector('.calendar-content');
    if (!calendarContent) return;

    // Clear existing content
    calendarContent.innerHTML = '';

    // Create week view container
    const weekView = document.createElement('div');
    weekView.className = 'week-view';

    // Get start of week (Monday)
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
    startOfWeek.setDate(startOfWeek.getDate() - diff);

    // Create time column
    const timeColumn = document.createElement('div');
    timeColumn.className = 'week-time-column';

    // Add header for time column
    const timeHeader = document.createElement('div');
    timeHeader.className = 'week-time-header';
    timeColumn.appendChild(timeHeader);

    // Add time cells
    for (let hour = 8; hour < 20; hour++) {
        const timeCell = document.createElement('div');
        timeCell.className = 'week-time-cell';
        timeCell.textContent = `${hour}:00`;
        timeColumn.appendChild(timeCell);
    }

    weekView.appendChild(timeColumn);

    // Create day columns
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);

        const dayColumn = document.createElement('div');
        dayColumn.className = 'week-day-column';

        // Add header with day name and date
        const dayHeader = document.createElement('div');
        dayHeader.className = 'week-day-header';

        const dayName = document.createElement('div');
        dayName.className = 'week-day-name';
        dayName.textContent = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i];
        dayHeader.appendChild(dayName);

        const dayDate = document.createElement('div');
        dayDate.className = 'week-day-date';
        dayDate.textContent = currentDate.getDate();

        // Check if it's today
        const today = new Date();
        if (
            currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        ) {
            dayDate.classList.add('today');
        }

        dayHeader.appendChild(dayDate);
        dayColumn.appendChild(dayHeader);

        // Add hour cells
        for (let hour = 8; hour < 20; hour++) {
            const hourCell = document.createElement('div');
            hourCell.className = 'week-hour-cell';
            hourCell.setAttribute('data-date', currentDate.toISOString().split('T')[0]);
            hourCell.setAttribute('data-hour', hour);
            dayColumn.appendChild(hourCell);
        }

        weekView.appendChild(dayColumn);
    }

    calendarContent.appendChild(weekView);

    // Add events to week view
    renderWeekEvents(startOfWeek);
}

/**
 * Render day view
 */
function renderDayView(date) {
    const calendarContainer = document.querySelector('.calendar-container');
    if (!calendarContainer) return;

    // Set view type
    calendarContainer.setAttribute('data-view', 'day');

    // Update header
    updateCalendarHeader(date, 'day');

    // Get calendar content
    const calendarContent = calendarContainer.querySelector('.calendar-content');
    if (!calendarContent) return;

    // Clear existing content
    calendarContent.innerHTML = '';

    // Create day view container
    const dayView = document.createElement('div');
    dayView.className = 'day-view';

    // Create schedule container
    const schedule = document.createElement('div');
    schedule.className = 'day-schedule';

    // Add hours
    for (let hour = 8; hour < 20; hour++) {
        const hourRow = document.createElement('div');
        hourRow.className = 'day-hour-row';

        const hourLabel = document.createElement('div');
        hourLabel.className = 'day-hour-label';
        hourLabel.textContent = `${hour}:00`;
        hourRow.appendChild(hourLabel);

        const hourContent = document.createElement('div');
        hourContent.className = 'day-hour-content';
        hourContent.setAttribute('data-hour', hour);
        hourContent.setAttribute('data-date', date.toISOString().split('T')[0]);
        hourRow.appendChild(hourContent);

        schedule.appendChild(hourRow);
    }

    dayView.appendChild(schedule);
    calendarContent.appendChild(dayView);

    // Add events to day view
    renderDayEvents(date);
}

/**
 * Render list view
 */
function renderListView(date) {
    const calendarContainer = document.querySelector('.calendar-container');
    if (!calendarContainer) return;

    // Set view type
    calendarContainer.setAttribute('data-view', 'list');

    // Update header
    updateCalendarHeader(date, 'list');

    // Get calendar content
    const calendarContent = calendarContainer.querySelector('.calendar-content');
    if (!calendarContent) return;

    // Clear existing content
    calendarContent.innerHTML = '';

    // Create list view container
    const listView = document.createElement('div');
    listView.className = 'list-view';

    // Create list header
    const listHeader = document.createElement('div');
    listHeader.className = 'list-header';

    const dateHeader = document.createElement('div');
    dateHeader.className = 'list-header-cell date-header';
    dateHeader.textContent = 'Date';
    listHeader.appendChild(dateHeader);

    const timeHeader = document.createElement('div');
    timeHeader.className = 'list-header-cell time-header';
    timeHeader.textContent = 'Heure';
    listHeader.appendChild(timeHeader);

    const titleHeader = document.createElement('div');
    titleHeader.className = 'list-header-cell title-header';
    titleHeader.textContent = 'Événement';
    listHeader.appendChild(titleHeader);

    const typeHeader = document.createElement('div');
    typeHeader.className = 'list-header-cell type-header';
    typeHeader.textContent = 'Type';
    listHeader.appendChild(typeHeader);

    const locationHeader = document.createElement('div');
    locationHeader.className = 'list-header-cell location-header';
    locationHeader.textContent = 'Lieu';
    listHeader.appendChild(locationHeader);

    listView.appendChild(listHeader);

    // Create list body
    const listBody = document.createElement('div');
    listBody.className = 'list-body';

    // Get events for the current month
    const events = getEventsForMonth(date.getMonth(), date.getFullYear());

    // Sort events by date
    events.sort((a, b) => new Date(a.start) - new Date(b.start));

    if (events.length === 0) {
        const noEvents = document.createElement('div');
        noEvents.className = 'no-events';
        noEvents.textContent = 'Aucun événement pour cette période';
        listBody.appendChild(noEvents);
    } else {
        // Group events by day
        const groupedEvents = groupEventsByDay(events);

        // Add events to list
        for (const dayKey in groupedEvents) {
            const dayDate = new Date(dayKey);

            // Add day separator
            const daySeparator = document.createElement('div');
            daySeparator.className = 'day-separator';
            daySeparator.textContent = formatDate(dayDate);
            listBody.appendChild(daySeparator);

            // Add events for this day
            groupedEvents[dayKey].forEach(event => {
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                listItem.setAttribute('data-id', event.id);

                const dateCell = document.createElement('div');
                dateCell.className = 'list-cell date-cell';
                dateCell.textContent = formatDate(new Date(event.start));
                listItem.appendChild(dateCell);

                const timeCell = document.createElement('div');
                timeCell.className = 'list-cell time-cell';
                timeCell.textContent = event.allDay ? 'Toute la journée' : formatTime(new Date(event.start));
                listItem.appendChild(timeCell);

                const titleCell = document.createElement('div');
                titleCell.className = 'list-cell title-cell';
                titleCell.textContent = event.title;
                listItem.appendChild(titleCell);

                const typeCell = document.createElement('div');
                typeCell.className = 'list-cell type-cell';
                const typeSpan = document.createElement('span');
                typeSpan.className = `event-type-indicator ${event.type}`;
                typeSpan.textContent = getEventTypeName(event.type);
                typeCell.appendChild(typeSpan);
                listItem.appendChild(typeCell);

                const locationCell = document.createElement('div');
                locationCell.className = 'list-cell location-cell';
                locationCell.textContent = event.location || '-';
                listItem.appendChild(locationCell);

                listItem.addEventListener('click', () => {
                    openEventModal(event.id);
                });

                listBody.appendChild(listItem);
            });
        }
    }

    listView.appendChild(listBody);
    calendarContent.appendChild(listView);
}

/**
 * Update calendar header with appropriate title and date
 */
function updateCalendarHeader(date, viewType) {
    const calendarTitle = document.querySelector('.calendar-title');
    const calendarHeader = document.querySelector('.calendar-header');

    if (!calendarTitle || !calendarHeader) return;

    // Store current date for navigation
    calendarHeader.setAttribute('data-date', date.toISOString());

    // Set title based on view type
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    if (viewType === 'month') {
        calendarTitle.textContent = `${months[date.getMonth()]} ${date.getFullYear()}`;
    } else if (viewType === 'week') {
        // Get start and end of week
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
        startOfWeek.setDate(startOfWeek.getDate() - diff);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        // Format dates
        const startMonth = months[startOfWeek.getMonth()].substring(0, 3);
        const endMonth = months[endOfWeek.getMonth()].substring(0, 3);

        if (startOfWeek.getMonth() === endOfWeek.getMonth() && startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
            calendarTitle.textContent = `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startMonth} ${startOfWeek.getFullYear()}`;
        } else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
            calendarTitle.textContent = `${startOfWeek.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth} ${startOfWeek.getFullYear()}`;
        } else {
            calendarTitle.textContent = `${startOfWeek.getDate()} ${startMonth} ${startOfWeek.getFullYear()} - ${endOfWeek.getDate()} ${endMonth} ${endOfWeek.getFullYear()}`;
        }
    } else if (viewType === 'day') {
        calendarTitle.textContent = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } else if (viewType === 'list') {
        calendarTitle.textContent = `Liste des événements - ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
}

/**
 * Add event to calendar
 */
function addEvent(event) {
    // In a real app, this would be an API call
    // For this prototype, we'll just add it to localStorage

    // Get existing events
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    // Add new event
    events.push(event);

    // Save to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(events));

    // Add to calendar
    renderEvents();

    // Show notification
    showNotification('Événement ajouté', 'L\'événement a été ajouté avec succès');
}

/**
 * Update existing event
 */
function updateEvent(eventId, updatedEvent) {
    // Get existing events
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    // Find event index
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex !== -1) {
        // Update event
        events[eventIndex] = {
            ...events[eventIndex],
            ...updatedEvent
        };

        // Save to localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(events));

        // Update calendar
        renderEvents();

        // Show notification
        showNotification('Événement mis à jour', 'L\'événement a été mis à jour avec succès');
    }
}

/**
 * Delete event
 */
function deleteEvent(eventId) {
    // Get existing events
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    // Filter out the deleted event
    events = events.filter(e => e.id !== eventId);

    // Save to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(events));

    // Update calendar
    renderEvents();

    // Show notification
    showNotification('Événement supprimé', 'L\'événement a été supprimé avec succès');
}

/**
 * Get event by ID
 */
function getEventById(eventId) {
    // Get existing events
    const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    // Find and return event
    return events.find(e => e.id === eventId);
}

/**
 * Get events for specific date
 */
function getEventsForDate(date) {
    // Get existing events
    const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    // Format date as YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];

    // Return events for this date
    return events.filter(event => {
        const eventStart = new Date(event.start).toISOString().split('T')[0];
        const eventEnd = new Date(event.end).toISOString().split('T')[0];

        // Check if the date is between start and end dates
        return dateString >= eventStart && dateString <= eventEnd;
    });
}

/**
 * Get events for specific month
 */
function getEventsForMonth(month, year) {
    // Get existing events
    const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    // Return events for this month
    return events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
}

/**
 * Group events by day
 */
function groupEventsByDay(events) {
    const grouped = {};

    events.forEach(event => {
        const dateKey = new Date(event.start).toISOString().split('T')[0];

        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }

        grouped[dateKey].push(event);
    });

    return grouped;
}

/**
 * Render events on calendar
 */
function renderEvents() {
    // Get current view type
    const calendarContainer = document.querySelector('.calendar-container');
    if (!calendarContainer) return;

    const viewType = calendarContainer.getAttribute('data-view') || 'month';

    // Clear existing events
    const existingEvents = document.querySelectorAll('.calendar-event');
    existingEvents.forEach(event => event.remove());

    if (viewType === 'month') {
        renderMonthEvents();
    } else if (viewType === 'week') {
        const dateAttr = document.querySelector('.calendar-header').getAttribute('data-date');
        const date = dateAttr ? new Date(dateAttr) : new Date();

        // Get start of week
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
        startOfWeek.setDate(startOfWeek.getDate() - diff);

        renderWeekEvents(startOfWeek);
    } else if (viewType === 'day') {
        const dateAttr = document.querySelector('.calendar-header').getAttribute('data-date');
        const date = dateAttr ? new Date(dateAttr) : new Date();

        renderDayEvents(date);
    } else if (viewType === 'list') {
        const dateAttr = document.querySelector('.calendar-header').getAttribute('data-date');
        const date = dateAttr ? new Date(dateAttr) : new Date();

        renderListView(date);
    }
}

/**
 * Render events on month view
 */
function renderMonthEvents() {
    // Get all day cells
    const dayCells = document.querySelectorAll('.calendar-day');

    dayCells.forEach(cell => {
        const dateAttr = cell.getAttribute('data-date');
        if (!dateAttr) return;

        const date = new Date(dateAttr);
        const events = getEventsForDate(date);

        // Add events to the cell
        events.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `calendar-event ${event.type}`;
            eventEl.textContent = event.title;
            eventEl.setAttribute('data-id', event.id);
            eventEl.setAttribute('data-type', event.type);
            eventEl.setAttribute('title', event.title);

            if (event.location) {
                eventEl.setAttribute('data-location', event.location);
            }

            // Add store attribute if available
            if (event.store) {
                eventEl.setAttribute('data-store', event.store);
            }

            cell.appendChild(eventEl);
        });

        // If too many events, add "more" indicator
        if (events.length > 3) {
            // Keep only first 2 events
            const eventsToKeep = cell.querySelectorAll('.calendar-event');
            for (let i = 2; i < eventsToKeep.length; i++) {
                eventsToKeep[i].remove();
            }

            // Add more indicator
            const moreIndicator = document.createElement('div');
            moreIndicator.className = 'more-events';
            moreIndicator.textContent = `+${events.length - 2} plus`;
            cell.appendChild(moreIndicator);
        }
    });
}

/**
 * Render events on week view
 */
function renderWeekEvents(startOfWeek) {
    // Get all hour cells
    const hourCells = document.querySelectorAll('.week-hour-cell');

    // Process each day of the week
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);

        // Get events for this date
        const events = getEventsForDate(currentDate);

        // Group all-day events
        const allDayEvents = events.filter(event => event.allDay);
        const timedEvents = events.filter(event => !event.allDay);

        // Add all-day events to day header
        const dayHeader = document.querySelector(`.week-day-column:nth-child(${i + 2}) .week-day-header`);

        if (dayHeader && allDayEvents.length > 0) {
            const allDayContainer = document.createElement('div');
            allDayContainer.className = 'all-day-container';

            allDayEvents.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = `calendar-event all-day ${event.type}`;
                eventEl.textContent = event.title;
                eventEl.setAttribute('data-id', event.id);
                eventEl.setAttribute('data-type', event.type);

                allDayContainer.appendChild(eventEl);
            });

            dayHeader.appendChild(allDayContainer);
        }

        // Add timed events to appropriate hour cells
        timedEvents.forEach(event => {
            const startTime = new Date(event.start);
            const endTime = new Date(event.end);

            // Only process events for the current day
            if (startTime.getDate() !== currentDate.getDate() ||
                startTime.getMonth() !== currentDate.getMonth() ||
                startTime.getFullYear() !== currentDate.getFullYear()) {
                return;
            }

            // Calculate position and height
            const startHour = startTime.getHours();
            const startMinute = startTime.getMinutes();
            const endHour = endTime.getHours();
            const endMinute = endTime.getMinutes();

            // Skip events outside our display hours (8-20)
            if (endHour < 8 || startHour >= 20) return;

            // Adjust start if before 8am
            const adjustedStartHour = Math.max(8, startHour);
            const adjustedStartMinute = startHour < 8 ? 0 : startMinute;

            // Adjust end if after 8pm
            const adjustedEndHour = Math.min(20, endHour);
            const adjustedEndMinute = endHour >= 20 ? 0 : endMinute;

            // Find starting cell
            const startCell = document.querySelector(`.week-day-column:nth-child(${i + 2}) .week-hour-cell[data-hour="${adjustedStartHour}"]`);

            if (startCell) {
                // Create event element
                const eventEl = document.createElement('div');
                eventEl.className = `calendar-event timed ${event.type}`;
                eventEl.textContent = event.title;
                eventEl.setAttribute('data-id', event.id);
                eventEl.setAttribute('data-type', event.type);

                // Calculate top position (percentage of hour)
                const topPercentage = (adjustedStartMinute / 60) * 100;
                eventEl.style.top = `${topPercentage}%`;

                // Calculate duration in minutes
                const durationInMinutes =
                    ((adjustedEndHour - adjustedStartHour) * 60) +
                    (adjustedEndMinute - adjustedStartMinute);

                // Calculate height (percentage of total hours)
                const heightPercentage = (durationInMinutes / 60) * 100;
                eventEl.style.height = `${heightPercentage}%`;

                startCell.appendChild(eventEl);
            }
        });
    }
}

/**
 * Render events on day view
 */
function renderDayEvents(date) {
    // Get events for this date
    const events = getEventsForDate(date);

    // Group all-day events
    const allDayEvents = events.filter(event => event.allDay);
    const timedEvents = events.filter(event => !event.allDay);

    // Get day view container
    const dayView = document.querySelector('.day-view');
    if (!dayView) return;

    // Add all-day events section if needed
    if (allDayEvents.length > 0) {
        const allDaySection = document.createElement('div');
        allDaySection.className = 'all-day-section';

        const allDayLabel = document.createElement('div');
        allDayLabel.className = 'all-day-label';
        allDayLabel.textContent = 'Toute la journée';
        allDaySection.appendChild(allDayLabel);

        const allDayEvents = document.createElement('div');
        allDayEvents.className = 'all-day-events';

        // Add each all-day event
        allDayEvents.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `calendar-event all-day ${event.type}`;
            eventEl.textContent = event.title;
            eventEl.setAttribute('data-id', event.id);
            eventEl.setAttribute('data-type', event.type);

            allDayEvents.appendChild(eventEl);
        });

        allDaySection.appendChild(allDayEvents);
        dayView.insertBefore(allDaySection, dayView.firstChild);
    }

    // Add timed events to appropriate hour cells
    timedEvents.forEach(event => {
        const startTime = new Date(event.start);
        const endTime = new Date(event.end);

        // Only process events for the current day
        if (startTime.getDate() !== date.getDate() ||
            startTime.getMonth() !== date.getMonth() ||
            startTime.getFullYear() !== date.getFullYear()) {
            return;
        }

        // Calculate position and height
        const startHour = startTime.getHours();
        const startMinute = startTime.getMinutes();
        const endHour = endTime.getHours();
        const endMinute = endTime.getMinutes();

        // Skip events outside our display hours (8-20)
        if (endHour < 8 || startHour >= 20) return;

        // Adjust start if before 8am
        const adjustedStartHour = Math.max(8, startHour);
        const adjustedStartMinute = startHour < 8 ? 0 : startMinute;

        // Adjust end if after 8pm
        const adjustedEndHour = Math.min(20, endHour);
        const adjustedEndMinute = endHour >= 20 ? 0 : endMinute;

        // Find starting cell
        const startCell = document.querySelector(`.day-hour-content[data-hour="${adjustedStartHour}"]`);

        if (startCell) {
            // Create event element
            const eventEl = document.createElement('div');
            eventEl.className = `calendar-event timed ${event.type}`;
            eventEl.setAttribute('data-id', event.id);
            eventEl.setAttribute('data-type', event.type);

            // Add event title
            const eventTitle = document.createElement('div');
            eventTitle.className = 'event-title';
            eventTitle.textContent = event.title;
            eventEl.appendChild(eventTitle);

            // Add event time
            const eventTime = document.createElement('div');
            eventTime.className = 'event-time';
            eventTime.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            eventEl.appendChild(eventTime);

            // Add location if available
            if (event.location) {
                const eventLocation = document.createElement('div');
                eventLocation.className = 'event-location';
                eventLocation.textContent = event.location;
                eventEl.appendChild(eventLocation);
            }

            // Calculate top position (percentage of hour)
            const topPercentage = (adjustedStartMinute / 60) * 100;
            eventEl.style.top = `${topPercentage}%`;

            // Calculate duration in minutes
            const durationInMinutes =
                ((adjustedEndHour - adjustedStartHour) * 60) +
                (adjustedEndMinute - adjustedStartMinute);

            // Calculate height (percentage of total hours)
            const heightPercentage = (durationInMinutes / 60) * 100;
            eventEl.style.height = `${heightPercentage}%`;

            startCell.appendChild(eventEl);
        }
    });
}

/**
 * Load sample events
 */
function loadEvents() {
    // Check if we already have events in localStorage
    const existingEvents = localStorage.getItem('calendarEvents');

    if (!existingEvents) {
        // Sample events
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const sampleEvents = [
            {
                id: 'event-1',
                title: 'Réunion du personnel',
                start: new Date(currentYear, currentMonth, 15, 10, 0).toISOString(),
                end: new Date(currentYear, currentMonth, 15, 12, 0).toISOString(),
                type: 'meeting',
                allDay: false,
                description: 'Réunion mensuelle avec tous les responsables de boutique',
                location: 'Siège social',
                attendees: ['Sarah Trabelsi', 'Ahmed Karim', 'Fatma Ben Ali', 'Mehdi Selmi', 'Amina Slimani']
            },
            {
                id: 'event-2',
                title: 'Inventaire mensuel',
                start: new Date(currentYear, currentMonth, 25, 8, 0).toISOString(),
                end: new Date(currentYear, currentMonth, 25, 18, 0).toISOString(),
                type: 'task',
                allDay: true,
                description: 'Inventaire mensuel de toutes les boutiques',
                location: 'Toutes les boutiques',
                attendees: []
            },
            {
                id: 'event-3',
                title: 'Formation Shopify',
                start: new Date(currentYear, currentMonth, 20, 14, 0).toISOString(),
                end: new Date(currentYear, currentMonth, 20, 17, 0).toISOString(),
                type: 'training',
                allDay: false,
                description: 'Formation sur les nouvelles fonctionnalités de Shopify',
                location: 'Salle de formation',
                attendees: ['Sarah Trabelsi', 'Mehdi Selmi', 'Amina Slimani']
            },
            {
                id: 'event-4',
                title: 'Jour férié',
                start: new Date(currentYear, currentMonth, 1).toISOString(),
                end: new Date(currentYear, currentMonth, 1).toISOString(),
                type: 'holiday',
                allDay: true,
                description: 'Jour férié - Fête du Travail',
                location: '',
                attendees: []
            },
            {
                id: 'event-5',
                title: 'Évaluations trimestrielles',
                start: new Date(currentYear, currentMonth, 10, 9, 0).toISOString(),
                end: new Date(currentYear, currentMonth, 12, 18, 0).toISOString(),
                type: 'review',
                allDay: true,
                description: 'Évaluations trimestrielles des employés',
                location: 'Bureaux RH',
                attendees: []
            },
            {
                id: 'event-6',
                title: 'Entretien candidat',
                start: new Date(currentYear, currentMonth, currentMonth === now.getMonth() ? now.getDate() + 2 : 18, 11, 0).toISOString(),
                end: new Date(currentYear, currentMonth, currentMonth === now.getMonth() ? now.getDate() + 2 : 18, 12, 0).toISOString(),
                type: 'recruitment',
                allDay: false,
                description: 'Entretien avec un candidat pour le poste de vendeur',
                location: 'Bureaux RH',
                attendees: ['Sarah Trabelsi', 'Ahmed Karim']
            }
        ];

        // Save sample events to localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(sampleEvents));
    }

    // Render events
    renderEvents();
}

/**
 * Format date for display
 */
function formatDate(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

/**
 * Format time for display (HH:MM)
 */
function formatTime(date) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get event type name
 */
function getEventTypeName(type) {
    const eventTypes = {
        'default': 'Événement',
        'meeting': 'Réunion',
        'task': 'Tâche',
        'holiday': 'Jour férié',
        'training': 'Formation',
        'review': 'Évaluation',
        'recruitment': 'Recrutement',
        'leave': 'Congé'
    };

    return eventTypes[type] || 'Événement';
}

/**
 * Add event listener once DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the calendar page
    initCalendarPage();
});