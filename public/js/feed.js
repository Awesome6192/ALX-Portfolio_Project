document.addEventListener('DOMContentLoaded', () => {
    const submitPostButton = document.getElementById('submit-post');
    const postContentTextarea = document.getElementById('post-content');
    const postList = document.getElementById('post-list');
    const imageUpload = document.getElementById('image-upload');
    const videoUpload = document.getElementById('video-upload');

    // Function to fetch and display posts
    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts', {
                method: 'GET',
                credentials: 'include'  // Ensure cookies are sent with the request
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
                alert('Unexpected posts data structure.');
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            alert('Error loading posts. Please try again later.');
        }
    }

    // Function to display posts
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

        // Add event listeners for comments and likes
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', handleLike);
        });
        document.querySelectorAll('.submit-comment-button').forEach(button => {
            button.addEventListener('click', handleComment);
        });
    }

    // Function to handle liking a post
    async function handleLike(event) {
        const postId = event.target.dataset.postId;
        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                credentials: 'include'  // Ensure cookies are sent with the request
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
            alert('Error liking post. Please try again later.');
        }
    }

    // Function to handle commenting on a post
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
                    credentials: 'include',  // Ensure cookies are sent with the request
                    body: JSON.stringify({ content })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Comment error data:', errorData);
                    throw new Error('Network response was not ok');
                }

                // Refresh posts after adding a comment
                fetchPosts();
            } catch (error) {
                console.error('Error commenting on post:', error);
                alert('Error commenting on post. Please try again later.');
            }
        }
    }

    // Function to create a new post
    async function createPost(content, imageFile, videoFile) {
        try {
            const formData = new FormData();
            formData.append('content', content);
            if (imageFile) formData.append('image', imageFile);
            if (videoFile) formData.append('video', videoFile);

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
                credentials: 'include'  // Ensure cookies are sent with the request
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
            alert('Error creating post. Please try again later.');
        }
    }

    // Add event listener to the submit post button
    submitPostButton.addEventListener('click', () => {
        const content = postContentTextarea.value.trim();
        const imageFile = imageUpload.files[0];
        const videoFile = videoUpload.files[0];

        if (content || imageFile || videoFile) {
            createPost(content, imageFile, videoFile);
            postContentTextarea.value = ''; // Clear the textarea after submission
            imageUpload.value = ''; // Clear the file input
            videoUpload.value = ''; // Clear the file input
        }
    });

    // Load posts when the page loads
    fetchPosts();
});