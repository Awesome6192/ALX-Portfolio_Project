document.addEventListener('DOMContentLoaded', () => {
    const submitPostButton = document.getElementById('submit-post');
    const postContentTextarea = document.getElementById('post-content');
    const postList = document.getElementById('post-list');

    // Fetch posts from the server
    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            displayPosts(data.posts);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    // Display posts in the DOM
    function displayPosts(posts) {
        postList.innerHTML = '';
        posts.forEach(post => {
            const postItem = document.createElement('li');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <div class="post-header">
                    <img src="/images/default-avatar.png" alt="User Avatar"> <!-- Replace with actual avatar -->
                    <h3>Username</h3> <!-- Replace with actual username -->
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-footer">
                    <button class="like-button">Like</button>
                    <button class="comment-button">Comment</button>
                </div>
            `;
            postList.appendChild(postItem);
        });
    }

    // Create a new post
    async function createPost(content) {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('Post created:', data);
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    }

    // Fetch a specific tweet by its ID
    async function fetchTweet(tweetId) {
        try {
            const response = await fetch(`/api/tweet/1831054144834326598`);
            const data = await response.json();
            console.log(data);
            displayTweet(data);
        } catch (error) {
            console.error('Error fetching tweet:', error);
        }
    }

    // Display a fetched tweet in the DOM
    function displayTweet(tweet) {
        const postItem = document.createElement('li');
        postItem.className = 'post-item';
        postItem.innerHTML = `
            <div class="post-header">
                <img src="/images/default-avatar.png" alt="User Avatar"> <!-- Replace with actual avatar -->
                <h3>${tweet.data.author_id}</h3> <!-- Display the author's ID -->
            </div>
            <div class="post-content">${tweet.data.text}</div>
            <div class="post-footer">
                <button class="like-button">Like</button>
                <button class="comment-button">Comment</button>
            </div>
        `;
        postList.appendChild(postItem);
    }

    // Event listener for the submit post button
    submitPostButton.addEventListener('click', () => {
        const content = postContentTextarea.value.trim();
        if (content) {
            createPost(content);
            postContentTextarea.value = '';
        }
    });

    // Initial fetch of posts
    fetchPosts();

    // Example usage of fetching a tweet (Replace with actual tweet ID)
    fetchTweet('1831054144834326598'); 
});