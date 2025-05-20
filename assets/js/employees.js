/**
 * employees.js - Employee management functionality for the Mazzaro Milano HR System
 */

document.addEventListener('DOMContentLoaded', () => {
  initEmployeesPage();
  initViewSwitcher();
  initEmployeeModals();
  initEmployeeActions();
  initEmployeeSearch();
  loadEmployeeData();
});

/**
 * Initialize employees page
 */
function initEmployeesPage() {
  // Check if we're on the employee page
  if (!document.querySelector('.employees-content')) return;
  
  // Set up any initial states or configurations
  configureEmployeeFilters();
}

/**
 * Initialize view switcher between grid and list views
 */
function initViewSwitcher() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const viewContainers = document.querySelectorAll('.view-container');
  
  if (viewBtns.length === 0 || viewContainers.length === 0) return;
  
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Get the view type from data attribute
      const viewType = btn.getAttribute('data-view');
      
      // Update active class on buttons
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show/hide view containers
      viewContainers.forEach(container => {
        if (container.classList.contains(`${viewType}-view`)) {
          container.classList.add('active');
        } else {
          container.classList.remove('active');
        }
      });
      
      // Save preference
      localStorage.setItem('employeeViewPreference', viewType);
    });
  });
  
  // Load saved preference if available
  const savedViewPreference = localStorage.getItem('employeeViewPreference');
  if (savedViewPreference) {
    const targetBtn = document.querySelector(`.view-btn[data-view="${savedViewPreference}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }
}

/**
 * Initialize employee modals
 */
function initEmployeeModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal');
      const employeeId = trigger.getAttribute('data-id');
      
      openEmployeeModal(modalId, employeeId);
    });
  });
}

/**
 * Open employee modal
 */
function openEmployeeModal(modalId, employeeId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  // Show modal
  modal.classList.add('active');
  
  // Get employee data if ID is provided
  if (employeeId) {
    populateEmployeeModal(modalId, employeeId);
  }
}

/**
 * Populate employee modal with data
 */
function populateEmployeeModal(modalId, employeeId) {
  // In a real app, this would fetch data from an API
  // For this prototype, we'll simulate it with demo data
  const employee = getEmployeeById(employeeId);
  
  if (!employee) return;
  
  switch (modalId) {
    case 'viewEmployeeModal':
      populateViewModal(employee);
      break;
    case 'editEmployeeModal':
      populateEditModal(employee);
      break;
    case 'deleteEmployeeModal':
      populateDeleteModal(employee);
      break;
  }
}

/**
 * Populate view employee modal
 */
function populateViewModal(employee) {
  const modal = document.getElementById('viewEmployeeModal');
  if (!modal) return;
  
  // Set employee photo
  const avatar = modal.querySelector('.employee-avatar-lg img');
  if (avatar) {
    avatar.src = employee.photo;
    avatar.alt = employee.firstName + ' ' + employee.lastName;
  }
  
  // Set employee name and position
  const name = modal.querySelector('.employee-name');
  if (name) {
    name.textContent = employee.firstName + ' ' + employee.lastName;
  }
  
  const position = modal.querySelector('.employee-position');
  if (position) {
    position.textContent = employee.position + ' - ' + employee.store;
  }
  
  // Set personal information
  const email = modal.querySelector('.info-item:nth-child(1) .info-value');
  if (email) {
    email.textContent = employee.email;
  }
  
  const phone = modal.querySelector('.info-item:nth-child(2) .info-value');
  if (phone) {
    phone.textContent = employee.phone;
  }
  
  const birthDate = modal.querySelector('.info-item:nth-child(3) .info-value');
  if (birthDate) {
    birthDate.textContent = employee.birthDate;
  }
  
  const address = modal.querySelector('.info-item:nth-child(4) .info-value');
  if (address) {
    address.textContent = employee.address;
  }
  
  // Set professional information
  const id = modal.querySelector('.info-item:nth-child(5) .info-value');
  if (id) {
    id.textContent = employee.id;
  }
  
  const hireDate = modal.querySelector('.info-item:nth-child(6) .info-value');
  if (hireDate) {
    hireDate.textContent = employee.hireDate;
  }
  
  const store = modal.querySelector('.info-item:nth-child(7) .info-value');
  if (store) {
    store.textContent = employee.store;
  }
  
  // Set statistics
  const attendance = modal.querySelector('.stat-box:nth-child(1) .stat-value');
  if (attendance) {
    attendance.textContent = employee.attendance + '%';
  }
  
  const tickets = modal.querySelector('.stat-box:nth-child(2) .stat-value');
  if (tickets) {
    tickets.textContent = employee.tickets;
  }
  
  const leaveRemaining = modal.querySelector('.stat-box:nth-child(3) .stat-value');
  if (leaveRemaining) {
    leaveRemaining.textContent = employee.leaveRemaining;
  }
  
  const yearsOfService = modal.querySelector('.stat-box:nth-child(4) .stat-value');
  if (yearsOfService) {
    yearsOfService.textContent = employee.yearsOfService;
  }
  
  // Set evaluation rating
  setRating(modal.querySelector('.employee-rating'), employee.rating);
  
  // Update the edit and delete buttons with the correct employee ID
  const editBtn = modal.querySelector('.modal-footer [data-modal="editEmployeeModal"]');
  const deleteBtn = modal.querySelector('.modal-footer [data-modal="deleteEmployeeModal"]');
  
  if (editBtn) {
    editBtn.setAttribute('data-id', employee.id);
  }
  
  if (deleteBtn) {
    deleteBtn.setAttribute('data-id', employee.id);
  }
}

/**
 * Populate edit employee modal
 */
function populateEditModal(employee) {
  // This would be similar to populateViewModal but for the edit form fields
  // For brevity, we'll skip the implementation in this prototype
  console.log('Edit modal for employee:', employee);
}

/**
 * Populate delete employee modal
 */
function populateDeleteModal(employee) {
  const modal = document.getElementById('deleteEmployeeModal');
  if (!modal) return;
  
  const avatar = modal.querySelector('.employee-avatar-sm img');
  if (avatar) {
    avatar.src = employee.photo;
    avatar.alt = employee.firstName + ' ' + employee.lastName;
  }
  
  const name = modal.querySelector('.employee-name');
  if (name) {
    name.textContent = employee.firstName + ' ' + employee.lastName;
  }
  
  const position = modal.querySelector('.employee-position');
  if (position) {
    position.textContent = employee.position + ' - ' + employee.store;
  }
  
  const id = modal.querySelector('.employee-id');
  if (id) {
    id.textContent = 'ID: ' + employee.id;
  }
  
  // Set employee ID on delete button
  const deleteBtn = modal.querySelector('.btn-danger');
  if (deleteBtn) {
    deleteBtn.setAttribute('data-id', employee.id);
    deleteBtn.textContent = 'Supprimer ' + employee.firstName + ' ' + employee.lastName;
  }
}

/**
 * Initialize employee actions
 */
function initEmployeeActions() {
  // Add employee form submission
  const addEmployeeForm = document.getElementById('addEmployeeForm');
  if (addEmployeeForm) {
    addEmployeeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulate adding employee
      showNotification('Succès', 'Nouvel employé ajouté avec succès');
      
      // Close modal
      const modal = this.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
      
      // Reset form
      this.reset();
      
      // In a real application, we would reload the employee list or add the new employee to the DOM
    });
  }
  
  // Delete employee confirmation
  const deleteButtons = document.querySelectorAll('.modal-overlay .btn-danger');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const employeeId = this.getAttribute('data-id');
      
      // Simulate deleting employee
      showNotification('Succès', 'Employé supprimé avec succès');
      
      // Close modal
      const modal = this.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
      
      // In a real application, we would remove the employee from the DOM or reload the list
    });
  });
  
  // Initialize password toggles in forms
  const passwordToggles = document.querySelectorAll('.password-toggle');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const passwordField = this.previousElementSibling;
      const icon = this.querySelector('i');
      
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

/**
 * Configure employee filters
 */
function configureEmployeeFilters() {
  const storeFilter = document.querySelector('select:nth-of-type(1)');
  const positionFilter = document.querySelector('select:nth-of-type(2)');
  
  if (storeFilter && positionFilter) {
    storeFilter.addEventListener('change', function() {
      filterEmployees();
    });
    
    positionFilter.addEventListener('change', function() {
      filterEmployees();
    });
  }
}

/**
 * Initialize employee search
 */
function initEmployeeSearch() {
  const searchInput = document.querySelector('input[placeholder="Rechercher un employé..."]');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterEmployees();
    });
  }
}

/**
 * Filter employees based on search and filter criteria
 */
function filterEmployees() {
  const searchInput = document.querySelector('input[placeholder="Rechercher un employé..."]');
  const storeFilter = document.querySelector('select:nth-of-type(1)');
  const positionFilter = document.querySelector('select:nth-of-type(2)');
  
  if (!searchInput || !storeFilter || !positionFilter) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const selectedStore = storeFilter.value;
  const selectedPosition = positionFilter.value;
  
  // Get all employee cards and rows
  const employeeCards = document.querySelectorAll('.employee-card');
  const employeeRows = document.querySelectorAll('.table tbody tr');
  
  // Helper to check if an element should be visible
  const shouldBeVisible = (name, position, store) => {
    const matchesSearch = searchTerm === '' || name.toLowerCase().includes(searchTerm);
    const matchesStore = selectedStore === '' || store.includes(selectedStore);
    const matchesPosition = selectedPosition === '' || position.includes(selectedPosition);
    
    return matchesSearch && matchesStore && matchesPosition;
  };
  
  // Filter cards
  employeeCards.forEach(card => {
    const name = card.querySelector('.employee-name').textContent;
    const positionText = card.querySelector('.employee-position').textContent;
    
    const position = positionText.split(' - ')[0].toLowerCase();
    const store = positionText.split(' - ')[1].toLowerCase();
    
    if (shouldBeVisible(name, position, store)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Filter rows
  employeeRows.forEach(row => {
    const name = row.querySelector('td:nth-child(2)').textContent.trim();
    const position = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
    const store = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
    
    if (shouldBeVisible(name, position, store)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

/**
 * Load employee data
 */
function loadEmployeeData() {
  // In a real app, this would be an API call
  // For this prototype, we'll use the sample data in getEmployees()
  
  // If we wanted to load the data dynamically, we would use:
  // const employees = getEmployees();
  // renderEmployees(employees);
}

/**
 * Get all employees
 */
function getEmployees() {
  // Sample employee data
  return [
    {
      id: 'EMP001',
      firstName: 'Sarah',
      lastName: 'Trabelsi',
      email: 'sarah.t@mazzaro.com',
      phone: '+216 29 123 456',
      birthDate: '15/03/1989',
      address: 'Rue de Marseille, Tunis',
      position: 'Responsable',
      store: 'Boutique Nord',
      hireDate: '15/05/2017',
      attendance: 95,
      tickets: 12,
      leaveRemaining: 3,
      yearsOfService: 8,
      rating: 4.5,
      photo: '../assets/img/avatars/employee1.jpg'
    },
    {
      id: 'EMP002',
      firstName: 'Ahmed',
      lastName: 'Karim',
      email: 'ahmed.k@mazzaro.com',
      phone: '+216 29 234 567',
      birthDate: '22/07/1995',
      address: 'Avenue Habib Bourguiba, Tunis',
      position: 'Vendeur',
      store: 'Boutique Sud',
      hireDate: '03/06/2023',
      attendance: 82,
      tickets: 5,
      leaveRemaining: 7,
      yearsOfService: 2,
      rating: 3.5,
      photo: '../assets/img/avatars/employee2.jpg'
    },
    {
      id: 'EMP003',
      firstName: 'Fatma',
      lastName: 'Ben Ali',
      email: 'fatma.b@mazzaro.com',
      phone: '+216 29 345 678',
      birthDate: '08/12/1992',
      address: 'Rue de France, Tunis',
      position: 'Caissière',
      store: 'Boutique Est',
      hireDate: '10/12/2021',
      attendance: 91,
      tickets: 8,
      leaveRemaining: 5,
      yearsOfService: 3,
      rating: 4.0,
      photo: '../assets/img/avatars/employee3.jpg'
    },
    {
      id: 'EMP004',
      firstName: 'Mehdi',
      lastName: 'Selmi',
      email: 'mehdi.s@mazzaro.com',
      phone: '+216 29 456 789',
      birthDate: '17/09/1988',
      address: 'Avenue Mohamed V, Tunis',
      position: 'Magasinier',
      store: 'Boutique Ouest',
      hireDate: '05/07/2020',
      attendance: 97,
      tickets: 3,
      leaveRemaining: 8,
      yearsOfService: 5,
      rating: 5.0,
      photo: '../assets/img/avatars/employee4.jpg'
    },
    {
      id: 'EMP005',
      firstName: 'Amina',
      lastName: 'Slimani',
      email: 'amina.s@mazzaro.com',
      phone: '+216 29 567 890',
      birthDate: '25/05/1990',
      address: 'Rue Ibn Khaldoun, Tunis',
      position: 'Responsable',
      store: 'Boutique Centre',
      hireDate: '18/03/2019',
      attendance: 94,
      tickets: 15,
      leaveRemaining: 2,
      yearsOfService: 6,
      rating: 4.5,
      photo: '../assets/img/avatars/employee5.jpg'
    },
    {
      id: 'EMP006',
      firstName: 'Youssef',
      lastName: 'Miled',
      email: 'youssef.m@mazzaro.com',
      phone: '+216 29 678 901',
      birthDate: '14/02/1997',
      address: 'Rue Alain Savary, Tunis',
      position: 'Vendeur',
      store: 'Boutique Nord',
      hireDate: '22/09/2024',
      attendance: 88,
      tickets: 4,
      leaveRemaining: 10,
      yearsOfService: 1,
      rating: 3.0,
      photo: '../assets/img/avatars/employee6.jpg'
    }
  ];
}

/**
 * Get employee by ID
 */
function getEmployeeById(id) {
  const employees = getEmployees();
  return employees.find(employee => employee.id === id);
}

/**
 * Set rating stars
 */
function setRating(container, rating) {
  if (!container) return;
  
  // Clear existing stars
  container.innerHTML = '';
  
  // Add filled stars
  const fullStars = Math.floor(rating);
  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement('i');
    star.className = 'fas fa-star';
    container.appendChild(star);
  }
  
  // Add half star if needed
  if (rating % 1 >= 0.5) {
    const halfStar = document.createElement('i');
    halfStar.className = 'fas fa-star-half-alt';
    container.appendChild(halfStar);
  }
  
  // Add empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    const star = document.createElement('i');
    star.className = 'far fa-star';
    container.appendChild(star);
  }
  
  // Add rating text if needed
  const ratingValue = container.querySelector('.rating-value');
  if (ratingValue) {
    ratingValue.textContent = rating + '/5';
  }
}

/**
 * Render employees to DOM
 */
function renderEmployees(employees) {
  // This function would dynamically create employee cards and table rows
  // For this prototype, we'll skip the implementation as the HTML is already in place
}

/**
 * Export data to CSV
 */
function exportToCSV() {
  const employees = getEmployees();
  
  // Create CSV content
  let csvContent = 'ID,Nom,Prénom,Poste,Boutique,Email,Téléphone,Date embauche,Évaluation\n';
  
  employees.forEach(employee => {
    csvContent += `${employee.id},${employee.lastName},${employee.firstName},${employee.position},${employee.store},${employee.email},${employee.phone},${employee.hireDate},${employee.rating}\n`;
  });
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Employés_Mazzaro_Milano.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}