/**
 * Auth Module: Registration, Login, and Session Protection
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initRegisterForm();
  initDemoFillButton();
});

/**
 * Handle Login Form
 */
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('login-submit-btn');

    if (!email || !password) {
      showToast('Please fill in both email and password.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'Signing in...';

    const res = await apiRequest('/auth/login', 'POST', { email, password });
    submitBtn.disabled = false;
    submitBtn.innerText = 'Login';

    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast('Welcome back, ' + res.user.name + '!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    } else {
      showToast(res.message || 'Login failed. Please check credentials.', 'error');
    }
  });
}

/**
 * Handle Register Form
 */
function initRegisterForm() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('register-submit-btn');

    if (!name || !email || !password) {
      showToast('Please enter all required fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    // Collect selected genres
    const genreCheckboxes = document.querySelectorAll('input[name="genres"]:checked');
    const selectedGenres = Array.from(genreCheckboxes).map(cb => cb.value);

    submitBtn.disabled = true;
    submitBtn.innerText = 'Creating Account...';

    const res = await apiRequest('/auth/register', 'POST', {
      name,
      email,
      password,
      confirmPassword,
      preferredGenres: selectedGenres
    });

    submitBtn.disabled = false;
    submitBtn.innerText = 'Create Account';

    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast('Account created successfully! Welcome ' + res.user.name, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } else {
      showToast(res.message || 'Registration failed.', 'error');
    }
  });
}

/**
 * Demo Auto-fill Helper for Quick Testing & Viva Evaluation
 */
function initDemoFillButton() {
  const demoBtn = document.getElementById('btn-fill-demo');
  if (!demoBtn) return;

  demoBtn.addEventListener('click', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput && passwordInput) {
      emailInput.value = 'alex@example.com';
      passwordInput.value = 'password123';
      showToast('Demo credentials filled! Click Login to continue.', 'info');
    }
  });
}

/**
 * Route Guard for Protected Pages (Dashboard, Recommendations, Profile)
 */
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to access this page.', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
    return null;
  }
  return user;
}
