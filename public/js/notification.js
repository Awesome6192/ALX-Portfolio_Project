document.addEventListener('DOMContentLoaded', () => {
    // Create a WebSocket connection to the server at ws://localhost:3000
    const socket = new WebSocket('ws://localhost:3000'); 

    // Get references to DOM elements
    const hamburgerMenu = document.querySelector('.hamburger-menu'); // Hamburger menu for toggling the sidebar
    const sidebar = document.querySelector('.sidebar'); // Sidebar element
    const containerNotifications = document.querySelector('#container-notifications'); // Container for notifications

    /**
     * Display a notification on the page.
     * @param {Object} notification - The notification object containing message to display.
     */
    function displayNotification(notification) {
        const container = document.getElementById('container-notifications');
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification'; // Assign a class for styling
        notificationElement.innerHTML = `<p>${notification.message}</p>`; // Set the content of the notification
        container.appendChild(notificationElement); // Append the new notification to the container
    }

    // Handle incoming messages from the WebSocket
    socket.addEventListener('message', function(event) {
        try {
            const notification = JSON.parse(event.data); // Parse the incoming message
            displayNotification(notification); // Display the notification
        } catch (error) {
            console.error('Error parsing notification data:', error); // Log any parsing errors
        }
    });

    // Handle WebSocket errors
    socket.addEventListener('error', function(event) {
        console.error('WebSocket error:', event); // Log WebSocket errors
    });

    // Handle WebSocket connection closure
    socket.addEventListener('close', function(event) {
        console.log('WebSocket connection closed:', event); // Log WebSocket connection closures
    });

    // Refresh the page when the home icon is clicked
    document.getElementById('home-icon').addEventListener('click', () => {
        window.location.reload(); // Reload the current page
    });

    // Hamburger menu functionality
    if (hamburgerMenu && sidebar && containerNotifications) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open'); // Toggle the 'open' class on the sidebar
            containerNotifications.classList.toggle('sidebar-open'); // Toggle the 'sidebar-open' class on the notifications container
        });
    }
});