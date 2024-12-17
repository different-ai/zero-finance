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

// Change TARGET_CHANNEL_NAME to TARGET_CHANNEL_URL
const TARGET_CHANNEL_URL = process.env.TARGET_CHANNEL_URL || '';

// Add these constants at the top with other configurations
const MESSAGES_PER_FETCH = 100; // Discord's max limit per request
const FETCH_DELAY = 1000; // Delay between fetches to avoid rate limits

// Add this after client initialization
const log = (type, message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
};

// Helper function to extract channel ID from Discord URL
function getChannelIdFromUrl(url) {
  if (!url) return '';
  const matches = url.match(/channels\/\d+\/(\d+)/);
  return matches ? matches[1] : '';
}

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
    log('SAVE', `Saved ${messageStore.messages.length} messages, ${messageStore.channels.size} channels, ${messageStore.users.size} users`);
  } catch (error) {
    log('ERROR', `Failed to save messages: ${error.message}`);
  }
}

// Load previous messages if they exist
async function loadFromFile() {
  try {
    // Try to read the file
    const data = await fs.readFile('discord_messages.json', 'utf8');
    const parsed = JSON.parse(data);
    messageStore.messages = parsed.messages;
    messageStore.channels = new Map(Object.entries(parsed.channels));
    messageStore.users = new Map(Object.entries(parsed.users));
    log('LOAD', `Loaded ${messageStore.messages.length} messages, ${messageStore.channels.size} channels, ${messageStore.users.size} users`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it with empty data
      await saveToFile();
      log('INIT', 'Created new messages file with empty data');
    } else {
      // Other error occurred
      log('ERROR', `Error loading messages: ${error.message}`);
    }
  }
}

// Split message processing into smaller steps
function processMessageContent(message) {
  return {
    id: message.id,
    content: message.content,
    authorId: message.author.id,
    channelId: message.channel.id,
    channelName: message.channel.name,
    guildId: message.guild?.id,
    timestamp: message.createdTimestamp,
  };
}

function processAttachments(message) {
  return Array.from(message.attachments.values()).map(att => ({
    url: att.url,
    name: att.name
  }));
}

function updateChannelInfo(message) {
  messageStore.channels.set(message.channel.id, {
    name: message.channel.name,
    type: message.channel.type
  });
}

function updateUserInfo(message) {
  messageStore.users.set(message.author.id, {
    username: message.author.username,
    discriminator: message.author.discriminator,
    bot: message.author.bot
  });
}

// Progressive message storage with better logging
function storeMessage(message) {
  const targetChannelId = getChannelIdFromUrl(TARGET_CHANNEL_URL);
  
  if (targetChannelId && message.channel.id !== targetChannelId) {
    log('SKIP', `Message in channel ${message.channel.id} (not target channel)`);
    return;
  }

  // Process message in steps
  const baseMessageData = processMessageContent(message);
  const attachments = processAttachments(message);
  
  // Combine data
  const messageData = {
    ...baseMessageData,
    attachments,
  };

  // Update stores progressively
  messageStore.messages.push(messageData);
  updateChannelInfo(message);
  updateUserInfo(message);
  
  // Log progressively
  log('MESSAGE', `[${message.channel.name}] ${message.author.username}: ${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}`);
  
  if (attachments.length > 0) {
    log('ATTACHMENTS', `${attachments.length} attachments from ${message.author.username}`);
  }

  return messageData;
}

// Throttled save function to prevent too frequent saves
let saveTimeout = null;
function throttledSave() {
  if (saveTimeout) return;
  
  saveTimeout = setTimeout(async () => {
    await saveToFile();
    saveTimeout = null;
  }, 5000); // Save at most every 5 seconds
}

// Update message event handler to use throttled save
client.on(Events.MessageCreate, async message => {
  storeMessage(message);
  throttledSave();
});

// Load previous messages when starting up
client.once(Events.ClientReady, async () => {
  log('READY', `Logged in as ${client.user.tag}`);
  log('CONFIG', `Target channel: ${TARGET_CHANNEL_URL || 'ALL CHANNELS'}`);
  await loadFromFile();
  
  // If there's a target channel, fetch its history
  const targetChannelId = getChannelIdFromUrl(TARGET_CHANNEL_URL);
  if (targetChannelId) {
    log('FETCH', `Starting historical message fetch for channel: ${targetChannelId}`);
    await fetchHistoricalMessages(targetChannelId);
  }
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

// Add this new function for real-time channel monitoring
function setTargetChannel(channelUrl) {
  if (channelUrl) {
    const channelId = getChannelIdFromUrl(channelUrl);
    if (!channelId) {
      log('ERROR', 'Invalid Discord channel URL');
      return;
    }
    log('CONFIG', `Now monitoring channel: ${channelUrl}`);
    process.env.TARGET_CHANNEL_URL = channelUrl;
  } else {
    log('CONFIG', 'Monitoring all channels');
    process.env.TARGET_CHANNEL_URL = '';
  }
}

// Add this new function to fetch historical messages
async function fetchHistoricalMessages(channelId) {
  const channel = await client.channels.fetch(channelId);
  if (!channel || !channel.isTextBased()) {
    log('ERROR', `Invalid channel or not a text channel: ${channelId}`);
    return;
  }

  let lastMessageId = null;
  let messagesFound = 0;

  while (true) {
    try {
      // Fetch messages before the last message we've seen
      const options = { limit: MESSAGES_PER_FETCH };
      if (lastMessageId) options.before = lastMessageId;
      
      const messages = await channel.messages.fetch(options);
      if (messages.size === 0) break; // No more messages to fetch
      
      // Process each message
      messages.forEach(message => {
        const messageData = storeMessage(message);
        if (messageData) messagesFound++;
      });
      
      // Update the last message ID for next iteration
      lastMessageId = messages.last().id;
      
      log('FETCH', `Loaded ${messagesFound} messages so far from ${channel.name}`);
      
      // Save periodically
      throttledSave();
      
      // Add delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, FETCH_DELAY));
      
    } catch (error) {
      log('ERROR', `Failed to fetch messages: ${error.message}`);
      break;
    }
  }

  log('COMPLETE', `Finished loading ${messagesFound} historical messages from ${channel.name}`);
}

module.exports = {
  messageStore,
  searchMessages,
  getChannelMessages,
  getUserMessages,
  setTargetChannel // Export the new function
};