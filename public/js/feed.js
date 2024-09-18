document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const submitPostButton = document.getElementById('submit-post'); // Button to submit a new post
    const postContentTextarea = document.getElementById('post-content'); // Textarea for post content
    const postList = document.getElementById('post-list'); // Element to display the list of posts
    const imageUpload = document.getElementById('image-upload'); // File input for image upload
    const videoUpload = document.getElementById('video-upload'); // File input for video upload
    const hamburgerMenu = document.querySelector('.hamburger-menu'); // Hamburger menu for sidebar toggle
    const sidebar = document.querySelector('.sidebar'); // Sidebar element

    // Toggle sidebar visibility when hamburger menu is clicked
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    /**
     * Debounce function to limit the rate of function execution.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The delay in milliseconds.
     * @returns {Function} - A debounced version of the input function.
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Fetch and display posts from the server.
     */
    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts', {
                method: 'GET',
                credentials: 'include' // Include cookies in the request
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Fetch error data:', errorData);
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data.posts && Array.isArray(data.posts)) {
                displayPosts(data.posts);
            } else {
                console.error('Unexpected posts data structure:', data);
                showNotification('Unexpected posts data structure.', 'error');
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            showNotification('Error loading posts. Please try again later.', 'error');
        }
    }

    /**
     * Display a list of posts in the postList element.
     * @param {Array} posts - Array of post objects to display.
     */
    function displayPosts(posts) {
        postList.innerHTML = '';
        posts.forEach(post => {
            const postItem = document.createElement('li');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <div class="post-header">
                    <img src="/images/default-avatar.png" alt="User Avatar">
                    <h3>${post.username || 'Username'}</h3>
                </div>
                <div class="post-content">${post.content || 'No content available'}</div>
                ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-media">` : ''}
                ${post.video ? `<video controls src="${post.video}" class="post-media"></video>` : ''}
                <div class="post-footer">
                    <button class="like-button" data-post-id="${post.id}">Like (${post.likes || 0})</button>
                    <button class="comment-button" data-post-id="${post.id}">Comment</button>
                    <div class="comments-section" id="comments-${post.id}">
                        ${post.comments.map(comment => `
                            <div class="comment-item">
                                <strong>${comment.username}</strong>: ${comment.content}
                            </div>
                        `).join('')}
                        <textarea class="comment-input" placeholder="Add a comment..."></textarea>
                        <button class="submit-comment-button" data-post-id="${post.id}">Submit</button>
                    </div>
                </div>
            `;
            postList.appendChild(postItem);
        });

        // Add event listeners for likes and comments with debounce
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', debounce(handleLike, 300)); // Debounced like button handler
        });
        document.querySelectorAll('.submit-comment-button').forEach(button => {
            button.addEventListener('click', debounce(handleComment, 300)); // Debounced comment button handler
        });
    }

    /**
     * Handle liking a post.
     * @param {Event} event - The click event.
     */
    async function handleLike(event) {
        const postId = event.target.dataset.postId;
        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                credentials: 'include' // Include cookies in the request
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Like error data:', errorData);
                throw new Error('Network response was not ok');
            }

            // Refresh posts after liking
            fetchPosts();
        } catch (error) {
            console.error('Error liking post:', error);
            showNotification('Error liking post. Please try again later.', 'error');
        }
    }

    /**
     * Handle commenting on a post.
     * @param {Event} event - The click event.
     */
    async function handleComment(event) {
        const postId = event.target.dataset.postId;
        const commentInput = document.querySelector(`#comments-${postId} .comment-input`);
        const content = commentInput.value.trim();
        if (content) {
            try {
                const response = await fetch(`/api/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // Include cookies in the request
                    body: JSON.stringify({ content })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Comment error data:', errorData);
                    throw new Error('Network response was not ok');
                }

                // Clear comment input after submission
                commentInput.value = '';

                // Refresh posts after adding a comment
                fetchPosts();
            } catch (error) {
                console.error('Error commenting on post:', error);
                showNotification('Error commenting on post. Please try again later.', 'error');
            }
        }
    }

    /**
     * Create a new post with content, image, and video.
     * @param {string} content - Post content.
     * @param {File} [imageFile] - Optional image file.
     * @param {File} [videoFile] - Optional video file.
     */
    async function createPost(content, imageFile, videoFile) {
        if (imageFile && imageFile.size > 5 * 1024 * 1024) { // Image size limit is 5MB
            showNotification('Image file is too large. Max size is 5MB.', 'error');
            return;
        }

        if (videoFile && videoFile.size > 10 * 1024 * 1024) { // Video size limit is 10MB
            showNotification('Video file is too large. Max size is 10MB.', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (imageFile) formData.append('image', imageFile);
            if (videoFile) formData.append('video', videoFile);

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Include cookies in the request
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Post creation error data:', errorData);
                throw new Error('Network response was not ok');
            }
            
            // Reload posts after creating a new one
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
            showNotification('Error creating post. Please try again later.', 'error');
        }
    }

    // Add event listener to the submit post button
    submitPostButton.addEventListener('click', () => {
        const content = postContentTextarea.value.trim(); // Get post content
        const imageFile = imageUpload.files[0]; // Get selected image file
        const videoFile = videoUpload.files[0]; // Get selected video file

        if (content || imageFile || videoFile) {
            createPost(content, imageFile, videoFile);
            postContentTextarea.value = ''; // Clear the textarea after submission
            imageUpload.value = ''; // Clear the file input
            videoUpload.value = ''; // Clear the file input
        }
    });

    /**
     * Refresh the page.
     */
    function refreshPage() {
        window.location.reload();
    }

    /**
     * Show a notification to the user.
     * @param {string} message - The notification message.
     * @param {string} type - The type of notification (e.g., 'error', 'success').
     */
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerText = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000); // Remove notification after 3 seconds
    }

    // Load posts when the page loads
    fetchPosts();
});