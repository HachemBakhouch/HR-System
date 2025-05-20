/**
 * tickets.js - Tickets and tasks management functionality for the Mazzaro Milano HR System
 */

document.addEventListener('DOMContentLoaded', () => {
  initTicketsPage();
  initTicketFilters();
  initTicketActions();
  initTicketModals();
  initTicketCreateForm();
});

/**
 * Initialize tickets page
 */
function initTicketsPage() {
  // Check if we're on the tickets page
  if (!document.querySelector('.tickets-content')) return;
  
  // Load tickets data (in a real app, this would be from an API)
  loadTicketsData();
}

/**
 * Initialize ticket filters
 */
function initTicketFilters() {
  const searchInput = document.querySelector('input[type="search"]');
  const statusFilter = document.querySelector('select[name="status-filter"]');
  const priorityFilter = document.querySelector('select[name="priority-filter"]');
  const storeFilter = document.querySelector('select[name="store-filter"]');
  const sortOption = document.querySelector('select[name="sort-option"]');
  
  const filters = [searchInput, statusFilter, priorityFilter, storeFilter, sortOption];
  
  filters.forEach(filter => {
    if (filter) {
      filter.addEventListener('change', filterTickets);
    }
  });
  
  if (searchInput) {
    searchInput.addEventListener('input', filterTickets);
  }
}

/**
 * Filter tickets based on current filter settings
 */
function filterTickets() {
  const searchInput = document.querySelector('input[type="search"]');
  const statusFilter = document.querySelector('select[name="status-filter"]');
  const priorityFilter = document.querySelector('select[name="priority-filter"]');
  const storeFilter = document.querySelector('select[name="store-filter"]');
  const sortOption = document.querySelector('select[name="sort-option"]');
  
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const status = statusFilter ? statusFilter.value : 'all';
  const priority = priorityFilter ? priorityFilter.value : 'all';
  const store = storeFilter ? storeFilter.value : 'all';
  const sort = sortOption ? sortOption.value : 'date-desc';
  
  // Get all ticket items
  const ticketItems = document.querySelectorAll('.ticket-item');
  
  // Apply filters to each ticket
  ticketItems.forEach(ticket => {
    let showTicket = true;
    
    // Search filter
    if (searchTerm) {
      const ticketTitle = ticket.querySelector('.ticket-title').textContent.toLowerCase();
      const ticketDescription = ticket.querySelector('.ticket-description').textContent.toLowerCase();
      
      if (!ticketTitle.includes(searchTerm) && !ticketDescription.includes(searchTerm)) {
        showTicket = false;
      }
    }
    
    // Status filter
    if (status !== 'all') {
      const ticketStatus = ticket.querySelector('.ticket-status').className.split(' ')[1];
      
      if (ticketStatus !== status) {
        showTicket = false;
      }
    }
    
    // Priority filter
    if (priority !== 'all') {
      const ticketPriority = ticket.querySelector('.ticket-priority').className.split(' ')[1];
      
      if (ticketPriority !== priority) {
        showTicket = false;
      }
    }
    
    // Store filter
    if (store !== 'all') {
      const ticketStore = ticket.getAttribute('data-store');
      
      if (ticketStore !== store) {
        showTicket = false;
      }
    }
    
    // Show/hide ticket
    ticket.style.display = showTicket ? '' : 'none';
  });
  
  // Apply sorting
  sortTickets(sort);
}

/**
 * Sort tickets based on selected option
 */
function sortTickets(sortOption) {
  const ticketList = document.querySelector('.ticket-list');
  if (!ticketList) return;
  
  const tickets = Array.from(ticketList.querySelectorAll('.ticket-item'));
  
  // Sort tickets based on option
  tickets.sort((a, b) => {
    switch (sortOption) {
      case 'date-asc':
        return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
      case 'date-desc':
        return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
      case 'priority-high':
        return getPriorityValue(b) - getPriorityValue(a);
      case 'priority-low':
        return getPriorityValue(a) - getPriorityValue(b);
      case 'status':
        return getStatusValue(a) - getStatusValue(b);
      default:
        return 0;
    }
  });
  
  // Reorder tickets in the DOM
  tickets.forEach(ticket => {
    ticketList.appendChild(ticket);
  });
}

/**
 * Get numeric value for priority (for sorting)
 */
function getPriorityValue(ticket) {
  const priority = ticket.querySelector('.ticket-priority').className.split(' ')[1];
  
  switch (priority) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
}

/**
 * Get numeric value for status (for sorting)
 */
function getStatusValue(ticket) {
  const status = ticket.querySelector('.ticket-status').className.split(' ')[1];
  
  switch (status) {
    case 'new':
      return 4;
    case 'in-progress':
      return 3;
    case 'review':
      return 2;
    case 'completed':
      return 1;
    default:
      return 0;
  }
}

/**
 * Initialize ticket actions
 */
function initTicketActions() {
  // Ticket comment buttons
  const commentButtons = document.querySelectorAll('.ticket-action[data-action="comment"]');
  commentButtons.forEach(button => {
    button.addEventListener('click', function() {
      const ticketId = this.closest('.ticket-item').getAttribute('data-id');
      openCommentModal(ticketId);
    });
  });
  
  // Ticket edit buttons
  const editButtons = document.querySelectorAll('.ticket-action[data-action="edit"]');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const ticketId = this.closest('.ticket-item').getAttribute('data-id');
      openEditTicketModal(ticketId);
    });
  });
  
  // Ticket delete buttons
  const deleteButtons = document.querySelectorAll('.ticket-action[data-action="delete"]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const ticketId = this.closest('.ticket-item').getAttribute('data-id');
      openDeleteTicketModal(ticketId);
    });
  });
  
  // Status change buttons
  const statusButtons = document.querySelectorAll('.status-action');
  statusButtons.forEach(button => {
    button.addEventListener('click', function() {
      const ticketId = this.closest('.ticket-item').getAttribute('data-id');
      const newStatus = this.getAttribute('data-status');
      
      changeTicketStatus(ticketId, newStatus);
    });
  });
}

/**
 * Open comment modal for a ticket
 */
function openCommentModal(ticketId) {
  const commentModal = document.getElementById('commentModal');
  if (!commentModal) return;
  
  // Set ticket ID on the form
  const form = commentModal.querySelector('form');
  if (form) {
    form.setAttribute('data-ticket-id', ticketId);
  }
  
  // Get ticket title
  const ticket = document.querySelector(`.ticket-item[data-id="${ticketId}"]`);
  const ticketTitle = ticket ? ticket.querySelector('.ticket-title').textContent : '';
  
  // Set modal title
  const modalTitle = commentModal.querySelector('.modal-title');
  if (modalTitle) {
    modalTitle.textContent = `Commenter: ${ticketTitle}`;
  }
  
  // Show modal
  commentModal.classList.add('active');
}

/**
 * Open edit ticket modal
 */
function openEditTicketModal(ticketId) {
  const editModal = document.getElementById('editTicketModal');
  if (!editModal) return;
  
  // Get ticket data
  const ticket = document.querySelector(`.ticket-item[data-id="${ticketId}"]`);
  if (!ticket) return;
  
  const title = ticket.querySelector('.ticket-title').textContent;
  const description = ticket.querySelector('.ticket-description').textContent;
  const priority = ticket.querySelector('.ticket-priority').className.split(' ')[1];
  const status = ticket.querySelector('.ticket-status').className.split(' ')[1];
  const store = ticket.getAttribute('data-store');
  
  // Set form values
  const form = editModal.querySelector('form');
  if (form) {
    form.setAttribute('data-ticket-id', ticketId);
    
    const titleInput = form.querySelector('#edit-title');
    const descriptionInput = form.querySelector('#edit-description');
    const prioritySelect = form.querySelector('#edit-priority');
    const statusSelect = form.querySelector('#edit-status');
    const storeSelect = form.querySelector('#edit-store');
    
    if (titleInput) titleInput.value = title;
    if (descriptionInput) descriptionInput.value = description;
    if (prioritySelect) prioritySelect.value = priority;
    if (statusSelect) statusSelect.value = status;
    if (storeSelect) storeSelect.value = store;
  }
  
  // Set modal title
  const modalTitle = editModal.querySelector('.modal-title');
  if (modalTitle) {
    modalTitle.textContent = `Modifier le ticket: ${title}`;
  }
  
  // Show modal
  editModal.classList.add('active');
}

/**
 * Open delete ticket modal
 */
function openDeleteTicketModal(ticketId) {
  const deleteModal = document.getElementById('deleteTicketModal');
  if (!deleteModal) return;
  
  // Get ticket data
  const ticket = document.querySelector(`.ticket-item[data-id="${ticketId}"]`);
  if (!ticket) return;
  
  const title = ticket.querySelector('.ticket-title').textContent;
  
  // Set form values
  const form = deleteModal.querySelector('form');
  if (form) {
    form.setAttribute('data-ticket-id', ticketId);
  }
  
  // Update confirmation message
  const confirmationText = deleteModal.querySelector('.confirmation-text');
  if (confirmationText) {
    confirmationText.textContent = `Êtes-vous sûr de vouloir supprimer le ticket "${title}" ? Cette action est irréversible.`;
  }
  
  // Show modal
  deleteModal.classList.add('active');
}

/**
 * Change ticket status
 */
function changeTicketStatus(ticketId, newStatus) {
  // Get ticket element
  const ticket = document.querySelector(`.ticket-item[data-id="${ticketId}"]`);
  if (!ticket) return;
  
  // Update status in the UI
  const statusElement = ticket.querySelector('.ticket-status');
  if (statusElement) {
    // Remove old status class
    const statusClasses = ['new', 'in-progress', 'review', 'completed'];
    statusClasses.forEach(cls => {
      statusElement.classList.remove(cls);
    });
    
    // Add new status class
    statusElement.classList.add(newStatus);
    
    // Update status text
    const statusTexts = {
      'new': 'Nouveau',
      'in-progress': 'En cours',
      'review': 'En révision',
      'completed': 'Terminé'
    };
    
    statusElement.textContent = statusTexts[newStatus] || 'Inconnu';
  }
  
  // In a real app, this would be an API call to update the ticket status
  // For this prototype, we'll just show a notification
  
  showNotification('Statut mis à jour', 'Le statut du ticket a été mis à jour avec succès');
}

/**
 * Initialize ticket modals
 */
function initTicketModals() {
  // Comment form submission
  const commentForm = document.querySelector('#commentModal form');
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const ticketId = this.getAttribute('data-ticket-id');
      const comment = this.querySelector('textarea').value;
      
      if (!comment.trim()) {
        alert('Veuillez saisir un commentaire');
        return;
      }
      
      // In a real app, this would be an API call to add a comment
      // For this prototype, we'll just show a notification
      
      showNotification('Commentaire ajouté', 'Votre commentaire a été ajouté avec succès');
      
      // Close modal
      const modal = this.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
      
      // Reset form
      this.reset();
    });
  }
  
  // Edit ticket form submission
  const editForm = document.querySelector('#editTicketModal form');
  if (editForm) {
    editForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const ticketId = this.getAttribute('data-ticket-id');
      const title = this.querySelector('#edit-title').value;
      const description = this.querySelector('#edit-description').value;
      const priority = this.querySelector('#edit-priority').value;
      const status = this.querySelector('#edit-status').value;
      const store = this.querySelector('#edit-store').value;
      
      if (!title.trim() || !description.trim()) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      // In a real app, this would be an API call to update the ticket
      // For this prototype, we'll update the UI directly
      
      updateTicketUI(ticketId, {
        title,
        description,
        priority,
        status,
        store
      });
      
      // Show notification
      showNotification('Ticket mis à jour', 'Le ticket a été mis à jour avec succès');
      
      // Close modal
      const modal = this.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  }
  
  // Delete ticket form submission
  const deleteForm = document.querySelector('#deleteTicketModal form');
  if (deleteForm) {
    deleteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const ticketId = this.getAttribute('data-ticket-id');
      
      // In a real app, this would be an API call to delete the ticket
      // For this prototype, we'll remove the ticket from the UI
      
      const ticket = document.querySelector(`.ticket-item[data-id="${ticketId}"]`);
      if (ticket) {
        ticket.remove();
      }
      
      // Show notification
      showNotification('Ticket supprimé', 'Le ticket a été supprimé avec succès');
      
      // Close modal
      const modal = this.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/**
 * Initialize ticket create form
 */
function initTicketCreateForm() {
  const createForm = document.querySelector('#createTicketForm');
  if (!createForm) return;
  
  createForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const title = this.querySelector('#ticket-title').value;
    const description = this.querySelector('#ticket-description').value;
    const priority = this.querySelector('#ticket-priority').value;
    const assignees = this.querySelector('#ticket-assignees').value;
    const store = this.querySelector('#ticket-store').value;
    
    if (!title.trim() || !description.trim() || !assignees.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // In a real app, this would be an API call to create a new ticket
    // For this prototype, we'll add a new ticket to the UI
    
    const newTicket = createNewTicket({
      title,
      description,
      priority,
      assignees: assignees.split(','),
      store
    });
    
    // Show notification
    showNotification('Ticket créé', 'Le nouveau ticket a été créé avec succès');
    
    // Reset form
    this.reset();
    
    // Scroll to the new ticket
    if (newTicket) {
      newTicket.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/**
 * Create a new ticket in the UI
 */
function createNewTicket(data) {
  const ticketList = document.querySelector('.ticket-list');
  if (!ticketList) return null;
  
  // Generate unique ID for the new ticket
  const ticketId = 'ticket-' + Date.now();
  
  // Create new ticket element
  const ticketItem = document.createElement('div');
  ticketItem.className = 'ticket-item';
  ticketItem.setAttribute('data-id', ticketId);
  ticketItem.setAttribute('data-date', new Date().toISOString());
  ticketItem.setAttribute('data-store', data.store);
  
  // Priority class mapping
  const priorityClasses = {
    'high': 'high',
    'medium': 'medium',
    'low': 'low'
  };
  
  // Priority text mapping
  const priorityTexts = {
    'high': 'Haute',
    'medium': 'Moyenne',
    'low': 'Basse'
  };
  
  // Store text mapping
  const storeTexts = {
    'north': 'Boutique Nord',
    'south': 'Boutique Sud',
    'east': 'Boutique Est',
    'west': 'Boutique Ouest',
    'center': 'Boutique Centre'
  };
  
  // Set ticket HTML
  ticketItem.innerHTML = `
    <div class="ticket-header">
      <div class="ticket-id">
        <i class="fas fa-hashtag"></i>
        ${ticketId}
      </div>
      <div class="ticket-status new">Nouveau</div>
    </div>
    <div class="ticket-body">
      <h3 class="ticket-title">${data.title}</h3>
      <p class="ticket-description">${data.description}</p>
      <div class="ticket-meta">
        <div class="ticket-date">
          <i class="fas fa-calendar-alt"></i>
          ${formatDate(new Date())}
        </div>
        <div class="ticket-priority ${priorityClasses[data.priority]}">
          <i class="fas fa-flag"></i>
          Priorité ${priorityTexts[data.priority]}
        </div>
      </div>
      <div class="ticket-assignees">
        <!-- Placeholder for assignees, in a real app this would be dynamic -->
        <div class="ticket-assignee">
          <img src="../assets/img/avatars/employee1.jpg" alt="Assignee">
        </div>
        <div class="ticket-assignee">
          <img src="../assets/img/avatars/employee2.jpg" alt="Assignee">
        </div>
      </div>
    </div>
    <div class="ticket-footer">
      <div class="ticket-store">
        <i class="fas fa-store"></i>
        ${storeTexts[data.store]}
      </div>
      <div class="ticket-actions">
        <button class="ticket-action" data-action="comment">
          <i class="fas fa-comment"></i> Commenter
        </button>
        <button class="ticket-action" data-action="edit">
          <i class="fas fa-edit"></i> Modifier
        </button>
        <button class="ticket-action" data-action="delete">
          <i class="fas fa-trash"></i> Supprimer
        </button>
      </div>
    </div>
  `;
  
  // Add to the top of the list
  ticketList.insertBefore(ticketItem, ticketList.firstChild);
  
  // Add event listeners to the new ticket actions
  const commentBtn = ticketItem.querySelector('.ticket-action[data-action="comment"]');
  const editBtn = ticketItem.querySelector('.ticket-action[data-action="edit"]');
  const deleteBtn = ticketItem.querySelector('.ticket-action[data-action="delete"]');
  
  if (commentBtn) {
    commentBtn.addEventListener('click', function() {
      openCommentModal(ticketId);
    });
  }
  
  if (editBtn) {
    editBtn.addEventListener('click', function() {
      openEditTicketModal(ticketId);
    });
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      openDeleteTicketModal(ticketId);
    });
  }
  
  return ticketItem;
}

/**
 * Update ticket UI with new data
 */
function updateTicketUI(ticketId, data) {
  const ticket = document.querySelector(`.ticket-item[data-id="${ticketId}"]`);
  if (!ticket) return;
  
  // Update title and description
  const titleElement = ticket.querySelector('.ticket-title');
  const descriptionElement = ticket.querySelector('.ticket-description');
  
  if (titleElement) titleElement.textContent = data.title;
  if (descriptionElement) descriptionElement.textContent = data.description;
  
  // Update priority
  const priorityElement = ticket.querySelector('.ticket-priority');
  if (priorityElement) {
    // Remove old priority class
    const priorityClasses = ['high', 'medium', 'low'];
    priorityClasses.forEach(cls => {
      priorityElement.classList.remove(cls);
    });
    
    // Add new priority class
    priorityElement.classList.add(data.priority);
    
    // Update priority text
    const priorityTexts = {
      'high': 'Haute',
      'medium': 'Moyenne',
      'low': 'Basse'
    };
    
    priorityElement.innerHTML = `
      <i class="fas fa-flag"></i>
      Priorité ${priorityTexts[data.priority]}
    `;
  }
  
  // Update status
  const statusElement = ticket.querySelector('.ticket-status');
  if (statusElement) {
    // Remove old status class
    const statusClasses = ['new', 'in-progress', 'review', 'completed'];
    statusClasses.forEach(cls => {
      statusElement.classList.remove(cls);
    });
    
    // Add new status class
    statusElement.classList.add(data.status);
    
    // Update status text
    const statusTexts = {
      'new': 'Nouveau',
      'in-progress': 'En cours',
      'review': 'En révision',
      'completed': 'Terminé'
    };
    
    statusElement.textContent = statusTexts[data.status] || 'Inconnu';
  }
  
  // Update store
  ticket.setAttribute('data-store', data.store);
  
  const storeElement = ticket.querySelector('.ticket-store');
  if (storeElement) {
    const storeTexts = {
      'north': 'Boutique Nord',
      'south': 'Boutique Sud',
      'east': 'Boutique Est',
      'west': 'Boutique Ouest',
      'center': 'Boutique Centre'
    };
    
    storeElement.innerHTML = `
      <i class="fas fa-store"></i>
      ${storeTexts[data.store]}
    `;
  }
}

/**
 * Load tickets data
 */
function loadTicketsData() {
  // In a real app, this would be an API call
  // For this prototype, the data is already in the HTML
}

/**
 * Format date
 */
function formatDate(date) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString('fr-FR', options);
}

/**
 * Add event listener once DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the tickets page
  initTicketsPage();
});