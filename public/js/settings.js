document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu JavaScript
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const containerSettings = document.querySelector('#container-settings');

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            containerSettings.classList.toggle('sidebar-open');
        });
    }

    // Update Settings Form Handling
    const settingsForm = document.querySelector('.settings-form');

    if (settingsForm) {
        settingsForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Get form values
            const previousPassword = document.getElementById('previous-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const language = document.getElementById('language').value;

            // Validate passwords
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return; // Stop form submission
            }

            // Prepare data to send
            const data = {
                previousPassword,
                newPassword,
                username,
                email,
                language
            };

            try {
                const response = await fetch('/api/user/settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Settings updated successfully');
                    window.location.reload(); // Reload page or redirect as needed
                } else {
                    const result = await response.json();
                    alert(result.errors[0]?.msg || 'Unknown error');
                }
            } catch (error) {
                console.error('Error updating settings:', error);
                alert('An error occurred while updating settings.');
            }
        });
    }

    // Refresh Page Function
    function refreshPage() {
        window.location.reload();
    }

    // Add event listener to the home icon to refresh the page
    const homeIcon = document.getElementById('home-icon');
    if (homeIcon) {
        homeIcon.addEventListener('click', refreshPage);
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