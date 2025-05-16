const backendURL = ''; // empty because frontend & backend served together

function abbreviateUsername(username) {
  if (username.length <= 3) return username.toUpperCase();
  return username.slice(0, 3).toUpperCase();
}

function updateUI(loggedIn, username = '') {
  const signInBtn = document.getElementById('signInBtn');
  const userDropdown = document.getElementById('userDropdown');
  const userAbbr = document.getElementById('userAbbr');
  const signOutBtn = document.getElementById('signOutBtn');

  if (loggedIn) {
    if (signInBtn) signInBtn.style.display = 'none';
    if (userDropdown) userDropdown.style.display = 'inline-block';
    if (userAbbr) userAbbr.textContent = abbreviateUsername(username);
    if (signOutBtn) signOutBtn.style.display = 'none'; // hide sign out initially
  } else {
    if (signInBtn) signInBtn.style.display = 'inline-block';
    if (userDropdown) userDropdown.style.display = 'none';
    if (signOutBtn) signOutBtn.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  fetch('/me', { credentials: 'include' })
    .then(res => {
      if (!res.ok) throw new Error('Not logged in');
      return res.json();
    })
    .then(data => {
      updateUI(true, data.user.username);
    })
    .catch(() => {
      updateUI(false);
    });

  // Toggle sign out button when username clicked
  const userAbbr = document.getElementById('userAbbr');
  if (userAbbr) {
    userAbbr.addEventListener('click', () => {
      const signOutBtn = document.getElementById('signOutBtn');
      if (!signOutBtn) return;
      signOutBtn.style.display = signOutBtn.style.display === 'none' ? 'inline-block' : 'none';
    });
  }

  // Sign out button logic
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      fetch('/logout', { method: 'POST', credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.success) updateUI(false);
          else alert('Logout failed');
        });
    });
  }

  // Modal and login button handlers
  const loginModal = document.getElementById('loginModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalLoginBtn = document.getElementById('modalLoginBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalUsername = document.getElementById('modalUsername');
  const modalPassword = document.getElementById('modalPassword');
  const signInBtn = document.getElementById('signInBtn');

  if (signInBtn && loginModal && modalOverlay) {
    signInBtn.addEventListener('click', () => {
      loginModal.style.display = 'block';
      modalOverlay.style.display = 'block';
      modalUsername.focus();
    });
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
      loginModal.style.display = 'none';
      modalOverlay.style.display = 'none';
      modalUsername.value = '';
      modalPassword.value = '';
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      loginModal.style.display = 'none';
      modalOverlay.style.display = 'none';
      modalUsername.value = '';
      modalPassword.value = '';
    });
  }

  if (modalLoginBtn) {
    modalLoginBtn.addEventListener('click', () => {
      const username = modalUsername.value.trim();
      const password = modalPassword.value;

      if (!username || !password) {
        alert('Please enter username and password');
        return;
      }

      fetch('/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            updateUI(true, username);
            loginModal.style.display = 'none';
            modalOverlay.style.display = 'none';
            modalUsername.value = '';
            modalPassword.value = '';
          } else {
            alert('Login failed: ' + (data.message || 'Invalid credentials'));
          }
        })
        .catch(() => alert('Error connecting to server'));
    });
  }
});

