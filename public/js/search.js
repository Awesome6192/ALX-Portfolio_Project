document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchQuery = document.getElementById('search-query');
    const searchResults = document.getElementById('search-results');

    searchButton.addEventListener('click', async () => {
        const query = searchQuery.value.trim();
        if (!query) {
            alert('Please enter a search query.');
            return;
        }

        try {
            const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const users = await response.json();
            displayResults(users);
        } catch (error) {
            console.error('Error fetching search results:', error);
            searchResults.innerHTML = '<p>Failed to load search results.</p>';
        }
    });

    function displayResults(users) {
        searchResults.innerHTML = '';

        if (users.length === 0) {
            searchResults.innerHTML = '<p>No users found.</p>';
            return;
        }

        const list = document.createElement('ul');
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `Username: ${user.username}, Email: ${user.email}`;
            list.appendChild(listItem);
        });

        searchResults.appendChild(list);
    }
});