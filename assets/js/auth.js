/**
 * auth.js - Authentication functionality for the Mazzaro Milano HR System
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize authentication forms
  initLoginForm();
  initForgotPasswordForm();
  initResetPasswordForm();
  initPasswordVisibility();
});

/**
 * Initialize login form functionality
 */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('rememberMe')?.checked || false;
      
      // Basic validation
      if (!username || !password) {
        showFormError(loginForm, 'Veuillez remplir tous les champs.');
        return;
      }
      
      // Show loading state
      const submitButton = loginForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion en cours...';
      }
      
      // In a real application, this would be an API call
      // For this prototype, we'll simulate authentication
      simulateAuth(username, password, rememberMe).then(response => {
        if (response.success) {
          // Store authentication token
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('userName', response.name);
          
          // Redirect based on user role
          redirectToDashboard(response.role);
        } else {
          showFormError(loginForm, response.message);
          
          // Reset button state
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Se connecter';
          }
        }
      });
    });
  }
}

/**
 * Initialize forgot password form functionality
 */
function initForgotPasswordForm() {
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const email = document.getElementById('email').value;
      
      // Basic validation
      if (!email) {
        showFormError(forgotPasswordForm, 'Veuillez saisir votre adresse e-mail.');
        return;
      }
      
      if (!isValidEmail(email)) {
        showFormError(forgotPasswordForm, 'Veuillez saisir une adresse e-mail valide.');
        return;
      }
      
      // Show loading state
      const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      }
      
      // In a real application, this would be an API call
      // For this prototype, we'll simulate the request
      setTimeout(() => {
        // Show success message
        forgotPasswordForm.innerHTML = `
          <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <p>Un e-mail a été envoyé à <strong>${email}</strong> avec les instructions pour réinitialiser votre mot de passe.</p>
          </div>
          <div class="text-center mt-3">
            <a href="login.html" class="btn btn-primary">Retour à la connexion</a>
          </div>
        `;
      }, 1500);
    });
  }
}

/**
 * Initialize reset password form functionality
 */
function initResetPasswordForm() {
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Basic validation
      if (!password || !confirmPassword) {
        showFormError(resetPasswordForm, 'Veuillez remplir tous les champs.');
        return;
      }
      
      if (password !== confirmPassword) {
        showFormError(resetPasswordForm, 'Les mots de passe ne correspondent pas.');
        return;
      }
      
      if (password.length < 8) {
        showFormError(resetPasswordForm, 'Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }
      
      // Show loading state
      const submitButton = resetPasswordForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Réinitialisation en cours...';
      }
      
      // In a real application, this would be an API call
      // For this prototype, we'll simulate the request
      setTimeout(() => {
        // Show success message
        resetPasswordForm.innerHTML = `
          <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <p>Votre mot de passe a été réinitialisé avec succès.</p>
          </div>
          <div class="text-center mt-3">
            <a href="login.html" class="btn btn-primary">Se connecter</a>
          </div>
        `;
      }, 1500);
    });
  }
}

/**
 * Initialize password visibility toggle
 */
function initPasswordVisibility() {
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
 * Show form error message
 */
function showFormError(form, message) {
  // Remove existing error message
  const existingError = form.querySelector('.alert-danger');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message
  const error = document.createElement('div');
  error.className = 'alert alert-danger';
  error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  // Insert error before the first form element
  form.insertBefore(error, form.firstChild);
  
  // Scroll to error
  error.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Simulate authentication (for prototype)
 */
function simulateAuth(username, password, rememberMe) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Demo credentials for different user roles
      const users = [
        { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin Mazzaro' },
        { username: 'secteur', password: 'secteur123', role: 'sector', name: 'Manager Nord' },
        { username: 'boutique', password: 'boutique123', role: 'store', name: 'Responsable Boutique' },
        { username: 'employe', password: 'employe123', role: 'employee', name: 'Ahmed Employe' }
      ];
      
      // Find user
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        resolve({
          success: true,
          token: 'demo-token-' + Math.random().toString(36).substring(2),
          role: user.role,
          name: user.name
        });
      } else {
        resolve({
          success: false,
          message: 'Identifiant ou mot de passe incorrect.'
        });
      }
    }, 1000);
  });
}

/**
 * Redirect to dashboard based on user role
 */
function redirectToDashboard(role) {
  switch (role) {
    case 'admin':
      window.location.href = '/admin/index.html';
      break;
    case 'sector':
      window.location.href = '/sector/index.html';
      break;
    case 'store':
      window.location.href = '/store/index.html';
      break;
    case 'employee':
      window.location.href = '/employee/index.html';
      break;
    default:
      window.location.href = '/auth/login.html';
  }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return !!token; // Convert to boolean
}

/**
 * Get current user role
 */
function getUserRole() {
  return localStorage.getItem('userRole') || '';
}

/**
 * Get current user name
 */
function getUserName() {
  return localStorage.getItem('userName') || 'Utilisateur';
}

/**
 * Logout current user
 */
function logout() {
  // Clear authentication data
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  
  // Redirect to login page
  window.location.href = '/auth/login.html';
}

// Export functions
window.auth = {
  isAuthenticated,
  getUserRole,
  getUserName,
  logout
};

// Check authentication on protected pages
(function checkAuth() {
  // Get current path
  const currentPath = window.location.pathname;
  
  // Skip check on auth pages
  if (currentPath.includes('/auth/')) {
    // If already authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated()) {
      redirectToDashboard(getUserRole());
    }
    return;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    window.location.href = '/auth/login.html';
    return;
  }
  
  // Check if user has access to the current section
  const userRole = getUserRole();
  
  if (currentPath.includes('/admin/') && userRole !== 'admin') {
    redirectToDashboard(userRole);
  } else if (currentPath.includes('/sector/') && userRole !== 'sector' && userRole !== 'admin') {
    redirectToDashboard(userRole);
  } else if (currentPath.includes('/store/') && userRole !== 'store' && userRole !== 'sector' && userRole !== 'admin') {
    redirectToDashboard(userRole);
  } else if (currentPath.includes('/employee/') && userRole !== 'employee' && userRole !== 'store' && userRole !== 'sector' && userRole !== 'admin') {
    redirectToDashboard(userRole);
  }
})();