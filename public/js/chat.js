// chat.js
const socket = io();
const messageList = document.getElementById('message-list');
const messageContent = document.getElementById('message-content');
const sendMessageButton = document.getElementById('send-message');
const chatHeader = document.getElementById('chat-header');
let currentChatId = 'general';
let currentUserId = 'user123';

function openChat(chatId) {
    currentChatId = chatId;
    chatHeader.innerHTML = `<i class="material-icons">chat</i> ${chatId}`;
    socket.emit('joinChat', chatId);

    fetch(`/api/messages/${chatId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(messages => {
            messageList.innerHTML = messages.map(msg => `
                <div class="message ${msg.userId === currentUserId ? 'sent' : 'received'}">
                    <p>${msg.content}</p>
                </div>
            `).join('');
            messageList.scrollTop = messageList.scrollHeight;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function sendMessage() {
    const message = messageContent.value.trim();
    if (message) {
        socket.emit('sendMessage', {
            chatId: currentChatId,
            userId: currentUserId,
            content: message
        });
        messageContent.value = '';
    }
}

socket.on('receiveMessage', (data) => {
    if (data.chatId === currentChatId) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${data.userId === currentUserId ? 'sent' : 'received'}`;
        messageElement.innerHTML = `<p>${data.content}</p>`;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;
    }
});

sendMessageButton.addEventListener('click', sendMessage);

// Optionally, you can set an initial chat room or add logic to dynamically populate the chat list
openChat(currentChatId);

// Hamburger menu JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const chatContainer = document.querySelector('#chat-container');

    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        chatContainer.classList.toggle('sidebar-open');
    });
});