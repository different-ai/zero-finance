const { Client, Events, GatewayIntentBits } = require('discord.js');
// load env
require('dotenv').config();
const fs = require('fs').promises;

// Initialize Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// In-memory storage
const messageStore = {
  messages: [],
  channels: new Map(),
  users: new Map()
};

// Save to file periodically
async function saveToFile() {
  try {
    await fs.writeFile(
      'discord_messages.json', 
      JSON.stringify(messageStore, (key, value) => {
        if (value instanceof Map) {
          return Object.fromEntries(value);
        }
        return value;
      }, 2)
    );
    console.log('Messages saved to file successfully');
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

// Load previous messages if they exist
async function loadFromFile() {
  try {
    const data = await fs.readFile('discord_messages.json', 'utf8');
    const parsed = JSON.parse(data);
    messageStore.messages = parsed.messages;
    messageStore.channels = new Map(Object.entries(parsed.channels));
    messageStore.users = new Map(Object.entries(parsed.users));
    console.log('Previous messages loaded successfully');
  } catch (error) {
    console.log('No previous messages found or error loading:', error);
  }
}

// Store new message
function storeMessage(message) {
  const messageData = {
    id: message.id,
    content: message.content,
    authorId: message.author.id,
    channelId: message.channel.id,
    guildId: message.guild?.id,
    timestamp: message.createdTimestamp,
    attachments: Array.from(message.attachments.values()).map(att => ({
      url: att.url,
      name: att.name
    })),
  };

  // Store message
  messageStore.messages.push(messageData);

  // Update channel info
  messageStore.channels.set(message.channel.id, {
    name: message.channel.name,
    type: message.channel.type
  });

  // Update user info
  messageStore.users.set(message.author.id, {
    username: message.author.username,
    discriminator: message.author.discriminator,
    bot: message.author.bot
  });
}

// Message event handler
client.on(Events.MessageCreate, async message => {
  storeMessage(message);
  
  // Save to file every 100 messages
  if (messageStore.messages.length % 100 === 0) {
    await saveToFile();
  }
});

// Load previous messages when starting up
client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await loadFromFile();
});

// Search functionality
function searchMessages(query) {
  return messageStore.messages.filter(msg => 
    msg.content.toLowerCase().includes(query.toLowerCase())
  );
}

// Get messages for a specific channel
function getChannelMessages(channelId) {
  return messageStore.messages.filter(msg => msg.channelId === channelId);
}

// Get messages from a specific user
function getUserMessages(userId) {
  return messageStore.messages.filter(msg => msg.authorId === userId);
}

// Connect to Discord
client.login(process.env.DISCORD_TOKEN);

module.exports = {
  messageStore,
  searchMessages,
  getChannelMessages,
  getUserMessages
};