document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const clubList = document.getElementById('club-list');
    const profileInfo = document.getElementById('profile-info');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const email = formData.get('email');
            const username = formData.get('username');
            const password = formData.get('password');

            try {
                const response = await fetch('/api/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful');
                    window.location.href = 'login.html'; // Redirect to login page after successful registration
                } else {
                    alert(`Registration failed: ${data.errors.map(err => err.msg).join(', ')}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while registering. Please try again.');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');

            try {
                const response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include' // Ensure cookies are sent with the request
                });
                const data = await response.json();
                if (response.ok) {
                    sessionStorage.setItem('userId', data.userId); // Store user ID for future use
                    window.location.href = 'index.html'; // Redirect to home page after successful login
                } else {
                    alert(`Login failed: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while logging in. Please try again.');
            }
        });
    }

    if (clubList) {
        const loadClubs = async () => {
            try {
                const response = await fetch('/api/clubs');
                const data = await response.json();
                if (response.ok) {
                    clubList.innerHTML = data.clubs.map(club => `
                        <li class="club-item">
                            <span>${club.name}</span>
                            <span>${club.country}</span>
                        </li>
                    `).join('');
                } else {
                    console.log('Error fetching clubs:', data);
                    clubList.innerHTML = '<li>No clubs found.</li>';
                }
            } catch (error) {
                console.error('Error:', error);
                clubList.innerHTML = '<li>Error loading clubs.</li>';
            }
        };

        loadClubs();
    }

    if (profileInfo) {
        const loadProfile = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                const response = await fetch(`/api/user/profile?userId=${userId}`, {
                    credentials: 'include' // Ensure cookies are sent with the request
                });
                const data = await response.json();
                if (response.ok) {
                    profileInfo.innerHTML = `
                        <p><strong>Username:</strong> ${data.username}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Favorite Club:</strong> ${data.favoriteClub}</p>
                    `;
                } else {
                    console.log('Error fetching profile:', data);
                    profileInfo.innerHTML = '<p>No profile information found.</p>';
                }
            } catch (error) {
                console.error('Error:', error);
                profileInfo.innerHTML = '<p>Error loading profile information.</p>';
            }
        };

        loadProfile();
    }
});