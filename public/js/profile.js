document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch user profile data
    async function fetchUserProfile() {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Ensure cookies (session) are sent with request
            });

            if (response.ok) {
                const userProfile = await response.json();

                // Display user profile information on the page
                document.getElementById('username').textContent = `Username: ${userProfile.username}`;
                document.getElementById('email').textContent = `Email: ${userProfile.email}`;
                document.getElementById('favorite-club').textContent = `Favorite Club: ${userProfile.favoriteClub}`;
                document.getElementById('member-since').textContent = `Member Since: ${new Date(userProfile.createdAt).toLocaleDateString()}`;
            } else {
                // Handle errors
                console.error('Failed to fetch user profile:', await response.json());
                // Optionally show an error message to the user
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    fetchUserProfile();
});