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

    // Fetch and display posts from the server
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
            console.log('Fetched posts:', data); // Log the data

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

    // Display a list of posts in the postList element
    function displayPosts(posts) {
        postList.innerHTML = '';
        posts.forEach(post => {
            const postItem = document.createElement('li');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <div class="post-header">
                    <img src="/images/default-avatar.jpg" alt="User Avatar">
                    <h3>${post.User.username || 'Username'}</h3>
                </div>
                <div class="post-content">${post.content || 'No content available'}</div>
                ${post.image_url ? `<img src="${post.image_url}" alt="Post Image" class="post-media">` : ''}
                ${post.video_url ? `<video controls src="${post.video_url}" class="post-media"></video>` : ''}
                <div class="post-footer">
                    <button class="like-button" data-post-id="${post.post_id}">Like (${post.likes || 0})</button>
                    <button class="comment-button" data-post-id="${post.post_id}">Comment</button>
                    <div class="comments-section" id="comments-${post.post_id}">
                        ${post.comments ? post.comments.map(comment => `
                            <div class="comment-item">
                                <strong>${comment.username}</strong>: ${comment.content}
                            </div>
                        `).join('') : ''}
                        <textarea class="comment-input" placeholder="Add a comment..."></textarea>
                        <button class="submit-comment-button" data-post-id="${post.post_id}">Submit</button>
                    </div>
                </div>
            `;
            postList.appendChild(postItem);
        });

        // Add event listeners for likes and comments
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', handleLike);
        });
        document.querySelectorAll('.submit-comment-button').forEach(button => {
            button.addEventListener('click', handleComment);
        });
    }

    // Handle liking a post
    async function handleLike(postId) {
        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error liking post: ${errorData.error || response.statusText}`);
            }
    
            const like = await response.json();
            console.log('Like added:', like);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }
    

    function getUserIdFromCookies() {
        console.log('Current cookies:', document.cookie);
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === 'user_id') {
                const decodedValue = decodeURIComponent(value);
                console.log('Found user_id:', decodedValue);
                return decodedValue;
            }
        }
        console.log('user_id not found');
        return null;
    }
    
    // Handle commenting on a post
    async function handleComment(event) {
        const postId = event.target.dataset.postId;
        const commentInput = document.querySelector(`#comments-${postId} .comment-input`);
        const content = commentInput.value.trim();
        const userId = getUserIdFromCookies();
    
        console.log('User ID:', userId);
        console.log('Comment Content:', content);
    
        if (!userId || !content) {
            console.error('Comment content or User ID is missing.');
            return;
        }
    
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ user_id: userId, comment_text: content })
            });
    
            // Handle response...
        } catch (error) {
            console.error('Error commenting on post:', error);
        }
    }
    

    // Create a new post with content, image, and video
    async function createPost() {
        const content = postContentTextarea.value.trim();
        const imageFile = imageUpload.files[0];
        const videoFile = videoUpload.files[0];

        const formData = new FormData();
        if (content) formData.append('content', content);
        if (imageFile) formData.append('image', imageFile);
        if (videoFile) formData.append('video', videoFile);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Post created:', data);
                // Refresh posts or update UI as needed
                fetchPosts();
            } else {
                console.error('Error creating post:', data.error);
            }
        } catch (err) {
            console.error('Error creating post:', err);
        }
    }

    // Add event listener to the submit post button
    submitPostButton.addEventListener('click', () => {
        createPost();
        postContentTextarea.value = '';
        imageUpload.value = '';
        videoUpload.value = '';
    });

    // Show a notification to the user
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerText = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Load posts when the page loads
    fetchPosts();
});