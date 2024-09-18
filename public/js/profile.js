document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch user profile data
    async function fetchUserProfile() {
        try {
            // Make a GET request to fetch the user's profile data
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json' // Set the content type of the request
                },
                credentials: 'include' // Include cookies with the request for authentication/session
            });

            if (response.ok) {
                // Parse the JSON response if the request was successful
                const userProfile = await response.json();

                // Display user profile information on the page
                document.getElementById('username').textContent = `Username: ${userProfile.username}`;
                document.getElementById('email').textContent = `Email: ${userProfile.email}`;
                document.getElementById('favorite-club').textContent = `Favorite Club: ${userProfile.favoriteClub}`;
                document.getElementById('member-since').textContent = `Member Since: ${new Date(userProfile.createdAt).toLocaleDateString()}`;
            } else {
                // Handle HTTP errors (e.g., 404 or 500) and log them to the console
                console.error('Failed to fetch user profile:', await response.json());
                // Optionally, you might want to show an error message to the user here
            }
        } catch (error) {
            // Handle network errors or other unexpected issues
            console.error('Error fetching user profile:', error);
        }
    }

    // Call the function to fetch and display the user profile when the DOM is loaded
    fetchUserProfile();
});

// Hamburger menu JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Select elements for the hamburger menu, sidebar, and profile container
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const profileContainer = document.querySelector('#container-profile');

    // Add a click event listener to the hamburger menu
    hamburgerMenu.addEventListener('click', () => {
        // Toggle 'open' class on the sidebar to show/hide it
        sidebar.classList.toggle('open');
        // Toggle 'sidebar-open' class on the profile container to adjust its visibility
        profileContainer.classList.toggle('sidebar-open');
    });
});