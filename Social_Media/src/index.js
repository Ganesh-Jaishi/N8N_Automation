const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch"); // works with v2
 // Add this

const BOT_TOKEN = "MTQ2NzQ1MTQ2MDE4OTk0NjA5Mw.GLf0qE.aEzSAx6QkmdkYfW6iE8q9meFsb5fdkcggTlHLI";
const CHANNEL_ID = "1467444862956605503";
const N8N_WEBHOOK = "https://ganesh11.app.n8n.cloud/webhook/discord-post-trigger";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (reaction.partial) await reaction.fetch();

    if (reaction.emoji.name !== "✅") return;
    const message = reaction.message;
    if (message.channel.id !== CHANNEL_ID) return;
    if (message.attachments.size === 0) return;
    const image = message.attachments.first();

    const payload = {
      text: message.content,
      image: image.url,
      author: message.author.username,
      messageId: message.id,
      channelId: message.channel.id,
    };

    const response = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("HTTP Status from n8n:", response.status);
    console.log("Response text from n8n:", await response.text());

  } catch (error) {
    console.error("Error handling reaction:", error);
  }
});

client.login(BOT_TOKEN);


