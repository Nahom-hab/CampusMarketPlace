import axios from 'axios';

// Replace with your bot token and channel username
const BOT_TOKEN = '8028749136:AAH6og7aTJGQOd7uqyFjdDQfdZwFpzlxLcE';
const CHANNEL_ID = '-1002428610739'; // Use channel username with @ or chat ID
const WEB_APP_URL = 'https://t.me/Fikat_cinema_bot?start=webapp'; // Deep link to start the bot and trigger the web app

// Function to post to the Telegram channel
async function postToChannel() {
    const messageText = 'Access Our Movie Ticket Directly:';
    const inlineKeyboard = {
        inline_keyboard: [
            [
                {
                    text: 'Open ፍካት Cinema',
                    url: WEB_APP_URL // This deep link will open the bot and trigger the web app
                }
            ]
        ]
    };

    try {
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHANNEL_ID,
            text: messageText,
            reply_markup: inlineKeyboard
        });

        console.log('Message posted:', response.data);
    } catch (error) {
        console.error('Error posting to channel:', error.response ? error.response.data : error.message);
    }
}

// Call the function
postToChannel();
