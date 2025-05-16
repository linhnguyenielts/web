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
});
