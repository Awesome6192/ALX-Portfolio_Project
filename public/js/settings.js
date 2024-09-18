document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu JavaScript
    const hamburgerMenu = document.querySelector('.hamburger-menu'); // Selects the hamburger menu element
    const sidebar = document.querySelector('.sidebar'); // Selects the sidebar element
    const containerSettings = document.querySelector('#container-settings'); // Selects the settings container

    // If the hamburger menu element exists, add a click event listener
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            // Toggle the 'open' class on the sidebar to show or hide it
            sidebar.classList.toggle('open');
            // Toggle the 'sidebar-open' class on the settings container to adjust its visibility
            containerSettings.classList.toggle('sidebar-open');
        });
    }

    // Update Settings Form Handling
    const settingsForm = document.querySelector('.settings-form'); // Selects the settings form

    // If the settings form exists, add a submit event listener
    if (settingsForm) {
        settingsForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission behavior

            // Get form values
            const previousPassword = document.getElementById('previous-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const language = document.getElementById('language').value;

            // Validate if new passwords match
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match'); // Alert the user if passwords do not match
                return; // Stop form submission
            }

            // Prepare data to send in the request body
            const data = {
                previousPassword,
                newPassword,
                username,
                email,
                language
            };

            try {
                // Send the updated settings to the server
                const response = await fetch('/api/user/settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data) // Convert data to JSON format
                });

                // Check if the response is successful
                if (response.ok) {
                    alert('Settings updated successfully'); // Alert success message
                    window.location.reload(); // Reload the page or redirect as needed
                } else {
                    // Parse the response JSON and display error message
                    const result = await response.json();
                    alert(result.errors[0]?.msg || 'Unknown error');
                }
            } catch (error) {
                // Log any errors and display an alert
                console.error('Error updating settings:', error);
                alert('An error occurred while updating settings.');
            }
        });
    }

    // Refresh Page Function
    function refreshPage() {
        window.location.reload(); // Reloads the current page
    }

    // Add event listener to the home icon to refresh the page
    const homeIcon = document.getElementById('home-icon');
    if (homeIcon) {
        homeIcon.addEventListener('click', refreshPage);
    }

    // Logout Button Handling
    const logoutButton = document.getElementById('logout-button'); // Ensure this exists in your HTML

    // If the logout button exists, add a click event listener
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                // Send a request to log out the user
                const response = await fetch('/api/user/logout', {
                    method: 'POST',
                    credentials: 'include' // Ensure cookies are included with the request
                });

                // Check if the response is successful
                if (response.ok) {
                    window.location.href = '/login.html'; // Redirect to login page on successful logout
                } else {
                    alert('Error logging out'); // Display an error message if logout fails
                }
            } catch (error) {
                // Log any errors and display an alert
                console.error('Error during logout:', error);
                alert('An error occurred while logging out.');
            }
        });
    }
});