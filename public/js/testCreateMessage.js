const sequelize = require('./config/database'); // Your database connection
const Message = require('./models/message');    // Your Message model

(async () => {
    try {
        // Ensure database tables are created
        await sequelize.sync();

        // Wrap the message creation in a transaction for consistency
        const result = await sequelize.transaction(async (t) => {
            // Create a message
            const message = await Message.create({
                chat_id: '1',
                user_id: 1,
                content: 'Test message',
            }, { transaction: t });

            // Log the created message
            console.log('Message created:', message.toJSON());

            return message;
        });

    } catch (error) {
        // Catch and log any error that occurs
        console.error('Error creating message:', error);
    } finally {
        // Close the database connection when finished
        await sequelize.close();
    }
})();