// Initialize socket connection with credentials
const socket = io('http://localhost:3000', {
    withCredentials: true
});

// Get references to DOM elements
const messageList = document.getElementById('message-list');
const messageContent = document.getElementById('message-content');
const sendMessageButton = document.getElementById('send-message');
const chatHeader = document.getElementById('chat-header');

// Function to get a specific cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to initialize after DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    
    // Log the full cookie string for debugging
    console.log('Full cookies:', document.cookie);

    // Retrieve and log user_id cookie value
    let rawUserId = getCookie('user_id');
    console.log('Raw user_id cookie value:', rawUserId);

    let currentUser_id = parseInt(rawUserId, 10); // Convert the raw value to integer

    if (rawUserId) {
        console.log('Retrieved user_id from cookies:', currentUser_id);
    } else {
        console.error('User ID cookie is missing or empty.');
    }

    if (isNaN(currentUser_id)) {
        console.error('User ID cookie is not a valid number:', rawUserId);
    } else {
        console.log('Final parsed user_id:', currentUser_id);
    }

    // Set default chat room and initialize user_id
    let currentChat_id = 'general'; // Default chat room
    let currentDiscussion_id = null; // Variable for discussion ID

    // Function to open a chat room
    function openChat(chat_id) {
        currentChat_id = chat_id;
        chatHeader.innerHTML = `<i class="material-icons">chat</i> ${chat_id}`;

        // Notify the server to join the specified chat room
        socket.emit('joinChat', chat_id);

        // Fetch messages for the current chat from the server
        fetch(`/api/messages/${chat_id}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(messages => {
                messageList.innerHTML = messages.map(msg => `
                    <div class="message ${msg.user_id === currentUser_id ? 'sent' : 'received'}">
                        <p>${msg.content}</p>
                    </div>
                `).join('');
                messageList.scrollTop = messageList.scrollHeight;
            })
            .catch(error => console.error('Fetch operation problem:', error));
    }

    // Function to get the current discussion ID
    function getCurrentDiscussion_id() {
        return currentDiscussion_id;
    }

    // Function to set the discussion ID when joining a discussion
    function joinDiscussion(discussion_id) {
        currentDiscussion_id = discussion_id;
    }

    // Function to send a message
    function sendMessage(chat_id, message, discussion_id) {
        console.log('Sending message with user ID:', currentUser_id); // Log the current user ID

        if (!isNaN(currentUser_id)) { // Validate that user_id is defined and a number
            socket.emit('sendMessage', {
                chat_id: chat_id,
                user_id: currentUser_id, // Send user_id as an integer
                content: message,
                discussion_id: discussion_id
            });
        } else {
            console.error('User ID is not defined. Cannot send message.');
        }
    }

    // Function to handle message sending via button click or Enter key
    function handleMessageSend() {
        const message = messageContent.value.trim();

        if (message) {
            const chat_id = currentChat_id;
            const discussion_id = getCurrentDiscussion_id();

            // Call the sendMessage function
            sendMessage(chat_id, message, discussion_id);

            messageContent.value = ''; // Clear the input field after sending the message
            console.log('Message sent!');
        } else {
            console.log('Cannot send an empty message');
        }
    }

    // Event listeners for sending messages
    sendMessageButton.addEventListener('click', handleMessageSend);
    messageContent.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleMessageSend();
            e.preventDefault();
        }
    });

    // Listen for incoming messages from the server
    socket.on('receiveMessage', (data) => {
        if (data.chat_id === currentChat_id) {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${data.user_id === currentUser_id ? 'sent' : 'received'}`;
            messageElement.innerHTML = `<p>${data.content}</p>`;
            messageList.appendChild(messageElement);
            messageList.scrollTop = messageList.scrollHeight;
        }
    });

    // Open the initial chat room
    openChat(currentChat_id);
});

// Hamburger menu JavaScript for toggling sidebar visibility
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const chatContainer = document.querySelector('#chat-container');

    hamburgerMenu.addEventListener('click', () => {
        console.log('Hamburger menu clicked');
        sidebar.classList.toggle('open');
        chatContainer.classList.toggle('sidebar-open');
    });
});