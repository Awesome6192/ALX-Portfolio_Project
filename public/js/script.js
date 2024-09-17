document.addEventListener('DOMContentLoaded', () => {
    // Login Form Handling
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailOrUsername = document.getElementById('identifier').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ identifier: emailOrUsername, password })
                });

                if (response.ok) {
                    window.location.href = '/home.html'; // Redirect on successful login
                } else {
                    const data = await response.json();
                    alert(data.errors[0]?.msg || 'Unknown error');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred while logging in.');
            }
        });
    }

    // Registration Form Handling
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Check if passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return; // Stop form submission
            }

            try {
                const response = await fetch('/api/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, username, password })
                });

                if (response.ok) {
                    window.location.href = '/home.html'; // Redirect on successful registration
                } else {
                    const data = await response.json();
                    alert(data.errors[0]?.msg || 'Unknown error');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred while registering.');
            }
        });
    }

    // Logout Button Handling
    const logoutButton = document.getElementById('logout-button'); // Ensure this exists in your HTML

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/user/logout', {
                    method: 'POST',
                    credentials: 'include' // Ensure cookies are included
                });

                if (response.ok) {
                    window.location.href = '/login.html'; // Redirect on successful logout
                } else {
                    alert('Error logging out');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('An error occurred while logging out.');
            }
        });
    }
});