// Initialize socket connection with credentials
const socket = io('http://localhost:3000', {
    withCredentials: true
});

// After successful login, set the currentUser_id
currentUser_id = user.user_id; // Ensure this is set from the login response

// Emit the user_connected event to notify the server with user ID
console.log('Current User ID:', currentUser_id);
socket.emit('user_connected', { user_id: currentUser_id });

// Get references to DOM elements
const messageList = document.getElementById('message-list'); // List to display messages
const messageContent = document.getElementById('message-content'); // Input field for new messages
const sendMessageButton = document.getElementById('send-message'); // Button to send messages
const chatHeader = document.getElementById('chat-header'); // Header displaying the current chat

// Set default values for current chat and user IDs
let currentChat_id = 'general'; // Default chat room
let currentUser_id = 1; // Assuming user_id is an integer

// Initialize variable to store the discussion ID
let currentDiscussion_id = null;

// Function to open a chat room
function openChat(chat_id) {
    currentChat_id = chat_id; // Update the current chat ID
    chatHeader.innerHTML = `<i class="material-icons">chat</i> ${chat_id}`; // Update chat header

    // Notify the server to join the specified chat room
    socket.emit('joinChat', chat_id);

    // Fetch messages for the current chat from the server
    fetch(`/api/messages/${chat_id}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json(); // Parse the JSON response
        })
        .then(messages => {
            messageList.innerHTML = messages.map(msg => `
                <div class="message ${msg.user_id === currentUser_id ? 'sent' : 'received'}">
                    <p>${msg.content}</p>
                </div>
            `).join(''); // Join messages into a single HTML string
            messageList.scrollTop = messageList.scrollHeight; // Scroll to the bottom of the message list
        })
        .catch(error => console.error('Fetch operation problem:', error));
}

// Function to get the current discussion ID
function getCurrentDiscussion_id() {
    return currentDiscussion_id; // Return the stored discussion ID
}

// Function to set the discussion ID when joining a discussion
function joinDiscussion(discussion_id) {
    currentDiscussion_id = discussion_id; // Store discussionId when joining a discussion
}

// Function to send a message
function sendMessage(chat_id, message, discussion_id) {
    console.log('Sending message with user ID:', currentUser_id); // Log the current user ID

    // Emit the message event to the server with the necessary data
    socket.emit('sendMessage', {
        chat_id: chat_id,
        user_id: currentUser_id, // Send user_id as an integer
        content: message,
        discussion_id: discussion_id
    });
}

// Function to handle message sending via button click or Enter key
function handleMessageSend() {
    const message = messageContent.value.trim(); // Get and trim the message content

    if (message) {
        const chat_id = currentChat_id; // Get the current chat ID
        const discussion_id = getCurrentDiscussion_id(); // Get the current discussion ID

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
        e.preventDefault(); // Prevent form submission if in a form
    }
});

// Listen for incoming messages from the server
socket.on('receiveMessage', (data) => {
    if (data.chat_id === currentChat_id) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${data.user_id === currentUser_id ? 'sent' : 'received'}`;
        messageElement.innerHTML = `<p>${data.content}</p>`;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight; // Scroll to the bottom
    }
});

// Open the initial chat room
openChat(currentChat_id);

// Hamburger menu JavaScript for toggling sidebar visibility
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu'); // Hamburger menu element
    const sidebar = document.querySelector('.sidebar'); // Sidebar element
    const chatContainer = document.querySelector('#chat-container'); // Chat container element

    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('open'); // Toggle sidebar visibility
        chatContainer.classList.toggle('sidebar-open'); // Adjust chat container layout
    });
});