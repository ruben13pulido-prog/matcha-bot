require('dotenv').config();

const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log("Web server is running");
});

const {
Client,
GatewayIntentBits,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
ChannelType,
PermissionsBitField
} = require('discord.js');

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
});


// ================= READY =================
client.once('ready', () => {
console.log(`✅ Matcha Support Online as ${client.user.tag}`);
});


// ================= SUPPORT PANEL =================
client.on('messageCreate', async (message) => {

if (message.content !== "!supportpanel") return;

const embed = new EmbedBuilder()
.setTitle("<:Mcupcake:1475669775865876583> Matcha Support")
.setDescription(`
Need some help? We're here!

Please read the following information before submitting a support ticket. 

Only create tickets if you intend to cooperate fully with staff. 

Remain respectful while communicating with the Matcha Support Team.

Once you select a category and create a ticket, a staff member will assist you shortly. 

Please be prepared to provide information and evidence. 

Abuse of tickets may result in punishment.
`)
.setColor("#b7f2c2");


const categories = new EmbedBuilder()
.setTitle("Support Categories")
.setDescription(`
We have several different support ticket categories to choose from.

🌸 **General Support**
Questions relating to Matcha information and knowledge.

💬 **Discord Support**
Report rule violations or Discord-related issues.

<:Mcupcake:1475669775865876583> **Report an LR**
Submit reports against Low Rank staff members. This category is used to make a report against a (MatchaApprentice-Chef).

<:Mcupcake:1475669775865876583> **Report MR/HR**
Submit reports against Middle/High Rank staff members. This category is used to make a report against a Middle Rank or High Rank (Intern-HeadOfOperations)
MR/HR reports can be seen by the Human Resource Department.

⚠️ **Bakery Assistance**
Low Response: trolling, spam, harassment
Middle Response: impersonation, exploits, raids
High Response: hacked accounts, bakery server down, raids

<:Mcupcake:1475669775865876583> **Corporate**
Alliance & partnership inquiries.

📄 **Appeals**
Appeal punishments or moderation actions.
`)
.setColor("#b7f2c2");


const row1 = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("general")
.setLabel("General Support")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("discord")
.setLabel("Discord Support")
.setStyle(ButtonStyle.Secondary),

new ButtonBuilder()
.setCustomId("lr")
.setLabel("Report LR")
.setStyle(ButtonStyle.Danger),

new ButtonBuilder()
.setCustomId("mrhr")
.setLabel("Report MR/HR")
.setStyle(ButtonStyle.Danger),

new ButtonBuilder()
.setCustomId("corporate")
.setLabel("Corporate")
.setStyle(ButtonStyle.Success)
);

const row2 = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("appeal")
.setLabel("Appeals")
.setStyle(ButtonStyle.Success)
);

await message.channel.send({
embeds: [embed, categories],
components: [row1, row2]
});

});


// ================= TICKET CREATION =================
client.on("interactionCreate", async interaction => {

if (!interaction.isButton()) return;

const user = interaction.user;
const guild = interaction.guild;
const category = interaction.customId;

const existing = guild.channels.cache.find(
name: `ticket-${user.id}`
);

if (existing)
return interaction.reply({
content: "❌ You already have an open ticket.",
ephemeral: true
});

const ticketChannel = await guild.channels.create({
name: `ticket-${user.username}`,
type: ChannelType.GuildText,
permissionOverwrites: [
{
id: guild.id,
deny: [PermissionsBitField.Flags.ViewChannel]
},
{
id: user.id,
allow: [
PermissionsBitField.Flags.ViewChannel,
PermissionsBitField.Flags.SendMessages
]
}
]
});

const ticketEmbed = new EmbedBuilder()
.setTitle("🎫 Support Ticket Created")
.setDescription(`
Hello ${user},

You opened a **${category.toUpperCase()}** ticket.

Please provide:
• Full explanation
• Evidence/screenshots
• Relevant usernames

A staff member will assist you shortly.
`)
.setColor("#b7f2c2");

const controls = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("claim")
.setLabel("Claim")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("close")
.setLabel("Close Ticket")
.setStyle(ButtonStyle.Danger)
);

await ticketChannel.send({
content: `${user}`,
embeds: [ticketEmbed],
components: [controls]
});

await interaction.reply({
content: `✅ Ticket created: ${ticketChannel}`,
ephemeral: true
});

});


// ================= CLOSE / CLAIM =================
client.on("interactionCreate", async interaction => {

if (!interaction.isButton()) return;

if (interaction.customId === "close") {
await interaction.reply("🔒 Closing ticket...");
setTimeout(() => interaction.channel.delete(), 3000);
}

if (interaction.customId === "claim") {
await interaction.reply(`✅ Ticket claimed by ${interaction.user}`);
}

});


// ================= LOGIN =================
client.login(process.env.TOKEN);
