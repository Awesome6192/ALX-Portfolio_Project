FanFaction MVP

FanFaction is a web application that allows football fans to interact, discuss their favorite clubs, and engage in debates about which clubs are the best. This MVP (Minimum Viable Product) focuses on providing discussion threads and Twitter API integration to embed tweets related to football discussions.

Features
- User Registration and Authentication: Users can sign up and log in to participate in discussions.
- Discussion Threads: Users can create, comment, and engage in threads discussing various football topics.

- Notifications: Users will receive notifications when their posts are commented on.
- Responsive UI: The user interface is designed to be mobile-friendly.

Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL (for user data, discussion threads, and other persistent data)
- Twitter API: Used for embedding tweets in discussion threads
- Others: `ngrok` for local development (temporary URL for testing Twitter API)

Setup Instructions

Prerequisites
Ensure that the following tools are installed on your machine:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [ngrok](https://ngrok.com/) (for local testing)
- [Git](https://git-scm.com/)

Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/FanFaction-MVP.git
   cd FanFaction-MVP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MySQL database:
   - Create a MySQL database (e.g., `fanfaction_db`).
   - Update the `.env` file with your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=fanfaction_db
     ```

4. Migrate the database (optional):
   ```bash
   npx sequelize db:migrate
   ```

5. Set up environment variables:
   - Create a `.env` file with your settings:
     ```
     PORT=3000
     TWITTER_API_KEY=your_twitter_api_key
     TWITTER_API_SECRET=your_twitter_api_secret
     CALLBACK_URL=https://your-ngrok-url.com/auth/twitter/callback
     ```

6. Start the server:
   ```bash
   npm start
   ```
   Your server should now be running at `http://localhost:3000`.

7. Expose your local server with ngrok (for testing Twitter integration):
   ```bash
   ./ngrok http 3000
   ```
   Copy the ngrok URL and update your Twitter API settings for the callback URL.

Usage
- Access the app by navigating to the `ngrok` URL or `http://localhost:3000` (for local development).
- Register for an account, create or join discussions, and embed tweets in your posts.
- Twitter API integration will allow you to fetch and embed tweets directly into discussion threads.

Testing
You can run automated tests using:
```bash
npm test
```

Known Issues
- Temporary URL (`ngrok`): The app currently uses `ngrok` for local testing, which generates a new URL each time it’s started. A more permanent hosting solution will be implemented in the future.
- Twitter API Rate Limits: If you experience issues embedding tweets, it could be due to Twitter’s API rate limits during testing.