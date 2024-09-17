document.addEventListener('DOMContentLoaded', () => {
    // Handle WebSocket connection and notifications
    const socket = new WebSocket('ws://localhost:3000'); // Connect to the WebSocket server
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const containerNotifications = document.querySelector('#container-notifications');

    // Function to display a notification
    function displayNotification(notification) {
        const container = document.getElementById('container-notifications');
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification';
        notificationElement.innerHTML = `<p>${notification.message}</p>`;
        container.appendChild(notificationElement);
    }

    // Handle incoming messages from WebSocket
    socket.addEventListener('message', function(event) {
        try {
            const notification = JSON.parse(event.data);
            displayNotification(notification);
        } catch (error) {
            console.error('Error parsing notification data:', error);
        }
    });

    // Handle WebSocket errors
    socket.addEventListener('error', function(event) {
        console.error('WebSocket error:', event);
    });

    // Handle WebSocket connection closure
    socket.addEventListener('close', function(event) {
        console.log('WebSocket connection closed:', event);
    });

    // Refresh page function
    document.getElementById('home-icon').addEventListener('click', () => {
        window.location.reload();
    });

    // Hamburger menu JavaScript

    if (hamburgerMenu && sidebar && containerNotifications) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            containerNotifications.classList.toggle('sidebar-open');
        });
    }
});