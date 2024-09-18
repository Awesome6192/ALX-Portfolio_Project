document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const clubList = document.getElementById('club-list'); // Element to display the list of clubs
    const clubContent = document.getElementById('club-content'); // Element to display information about the selected club
    const clubContentInput = document.getElementById('club-content-input'); // Input field for new club information
    const submitClubInfoButton = document.getElementById('submit-club-info'); // Button to submit new club information
    const clubHeader = document.getElementById('club-header'); // Header displaying the current club
    let currentClubId = 'default'; // Default club ID
    let currentUserId = 'user123'; // Example user ID for submitting information

    /**
     * Fetch and display the list of clubs.
     */
    function loadClubList() {
        fetch('/api/clubs') // Request the list of clubs from the API
            .then(response => response.json()) // Parse the JSON response
            .then(clubs => {
                // Generate HTML for each club and set it to the club list element
                clubList.innerHTML = clubs.map(club => `
                    <div class="club-item" data-id="${club.id}">
                        ${club.name}
                    </div>
                `).join('');
                
                // Add click event listener to each club item
                document.querySelectorAll('#club-list .club-item').forEach(item => {
                    item.addEventListener('click', function() {
                        openClub(this.dataset.id); // Open the selected club
                    });
                });
            });
    }

    /**
     * Open a specific club and display its information.
     * @param {string} clubId - The ID of the club to open.
     */
    function openClub(clubId) {
        currentClubId = clubId; // Update the current club ID
        clubHeader.innerHTML = `<i class="material-icons">sports_soccer</i> ${clubId}`; // Update the club header
        
        // Fetch club information from the API
        fetch(`/api/clubs/${clubId}`)
            .then(response => response.json()) // Parse the JSON response
            .then(info => {
                // Display club information in the club content element
                clubContent.innerHTML = `
                    <div class="club-info">
                        <p>${info.description}</p>
                    </div>
                `;
            });
    }

    /**
     * Submit new information for the current club.
     */
    function submitClubInfo() {
        const info = clubContentInput.value.trim(); // Get and trim the input value
        if (info) {
            // Send the new information to the server via POST request
            fetch(`/api/clubs/${currentClubId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indicate that the request body contains JSON
                },
                body: JSON.stringify({
                    userId: currentUserId, // ID of the user submitting the information
                    description: info // New information for the club
                })
            }).then(response => response.json()) // Parse the JSON response
            .then(result => {
                if (result.success) {
                    clubContentInput.value = ''; // Clear the input field
                    openClub(currentClubId); // Refresh the club information
                }
            });
        }
    }

    // Add click event listener to the submit button
    submitClubInfoButton.addEventListener('click', submitClubInfo);

    // Initialize the club list on page load
    loadClubList();
});

// Hamburger menu JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the hamburger menu, sidebar, and chat container
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const chatContainer = document.querySelector('#club-container');

    // Toggle the visibility of the sidebar when the hamburger menu is clicked
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        chatContainer.classList.toggle('sidebar-open');
    });
});