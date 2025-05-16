const backendURL = ''; // empty because frontend & backend served together

function updateUI(loggedIn, username = '') {
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const userNameDisplay = document.getElementById('userNameDisplay');

  if (loggedIn) {
    if (signInBtn) signInBtn.style.display = 'none';
    if (signOutBtn) signOutBtn.style.display = 'inline-block';
    if (userNameDisplay) userNameDisplay.textContent = `Hello, ${username}`;
  } else {
    if (signInBtn) signInBtn.style.display = 'inline-block';
    if (signOutBtn) signOutBtn.style.display = 'none';
    if (userNameDisplay) userNameDisplay.textContent = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
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

  // Sign out button logic (if exists)
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
});
