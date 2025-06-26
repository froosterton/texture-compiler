const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const DISCORD_TOKEN = 'MTM4MzMxMTIxNTkyMDU0NTg0Mg.GGOfxM.F0tA0T2CVXF2vwpEsgnKXFypvmNQMrLicj8E80'; // <-- Replace with your bot token
const CHANNEL_ID = '1387289648845553796';

let currentStatus = null; // "2", "e", "d", or null

// Discord Bot Setup
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.channel.id !== CHANNEL_ID) return;
  if (["2", "e", "d"].includes(message.content.trim())) {
    currentStatus = message.content.trim();
    console.log(`Status set to: ${currentStatus}`);
  }
});

client.login(DISCORD_TOKEN);

// Express API Setup
const app = express();
app.use(cors());

app.get('/modal-status', (req, res) => {
  res.json({ status: currentStatus });
  // Optionally reset status after sending, if you want one-time triggers:
  // currentStatus = null;
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});