document.addEventListener('DOMContentLoaded', () => {
    // Get references to the search button, search query input, and search results container
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const searchResults = document.getElementById('search-results');

    // Add an event listener for the search button's click event
    searchButton.addEventListener('click', async () => {
        // Get and trim the search query value
        const query = searchQuery.value.trim();

        // Check if the search query is empty and alert the user if so
        if (!query) {
            alert('Please enter a search query.');
            return;
        }

        try {
            // Fetch search results from the server
            const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the response JSON
            const users = await response.json();

            // Display the search results
            displayResults(users);
        } catch (error) {
            // Log any errors and show an error message in the search results container
            console.error('Error fetching search results:', error);
            searchResults.innerHTML = '<p>Failed to load search results.</p>';
        }
    });

    // Function to display the search results
    function displayResults(users) {
        // Clear previous results
        searchResults.innerHTML = '';

        // Check if there are no users found
        if (users.length === 0) {
            searchResults.innerHTML = '<p>No users found.</p>';
            return;
        }

        // Create a list to display the users
        const list = document.createElement('ul');
        users.forEach(user => {
            const listItem = document.createElement('li');
            // Set the content of each list item
            listItem.textContent = `Username: ${user.username}, Email: ${user.email}`;
            // Append the list item to the list
            list.appendChild(listItem);
        });

        // Append the list to the search results container
        searchResults.appendChild(list);
    }
});

// Hamburger menu JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the hamburger menu, sidebar, and chat container
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const chatContainer = document.querySelector('#container-search');

    // Add an event listener for the hamburger menu's click event
    hamburgerMenu.addEventListener('click', () => {
        // Toggle the 'open' class on the sidebar to show or hide it
        sidebar.classList.toggle('open');
        // Toggle the 'sidebar-open' class on the chat container to adjust its visibility
        chatContainer.classList.toggle('sidebar-open');
    });
});