require('dotenv').config();

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

const fs = require("fs");

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
});

const STAFF_ROLE = "PASTE_STAFF_ROLE_ID";
const TICKET_CATEGORY = "🍵 Matcha Tickets";
const LOG_CATEGORY = "📁 Matcha Logs";

const activeTickets = new Set();

client.once("ready", () => {
console.log(`✅ Matcha Support Online: ${client.user.tag}`);
});


// ================= SUPPORT PANEL =================
client.on("messageCreate", async message => {

if (message.content !== "!supportpanel") return;

const embed1 = new EmbedBuilder()
.setTitle("🍵 Matcha Support")
.setDescription(`
Need some help? We're here!

Please only submit tickets if you intend to fully cooperate with staff.
Once you select a category and create a ticket, a member of our support team will assist you shortly.

Only create a ticket if you intend to fully cooperate throughout the support process. Remain polite and professional when communicating with the Support Team — we are here to help you.
Once you select a category and open a ticket, a member of our team will respond as soon as possible. Please be prepared to provide information and evidence.
Abuse of tickets may result in punishment.`

`)
.setThumbnail(client.user.displayAvatarURL())
.setColor("#b7f2c2");

const embed2 = new EmbedBuilder()
.setTitle("Support Categories")
.setDescription(`
🌸 **General Support**
Questions relating to Matcha information.

💬 **Discord Support**
Issues regarding server violations.

🧁 **Report an LR**
Report Low Rank staff.

🧁 **Report MR/HR**
HR-only visible reports.

⚠️ **Bakery Assistance**
Low: trolling/spam
Middle: impersonation/exploits
High: hacked/server down

🌿 **Corporate**
Partnership & affiliation inquiries.

📄 **Appeals**
Punishment appeals.
`)
.setColor("#b7f2c2");

const row1 = new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId("general").setLabel("General").setStyle(ButtonStyle.Primary),
new ButtonBuilder().setCustomId("discord").setLabel("Discord").setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId("lr").setLabel("Report LR").setStyle(ButtonStyle.Danger),
new ButtonBuilder().setCustomId("mrhr").setLabel("Report MR/HR").setStyle(ButtonStyle.Danger),
);

const row2 = new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId("corporate").setLabel("Corporate").setStyle(ButtonStyle.Success),
new ButtonBuilder().setCustomId("appeal").setLabel("Appeals").setStyle(ButtonStyle.Success)
);

await message.channel.send({
embeds: [embed1, embed2],
components: [row1, row2]
});

});


// ================= TICKET SYSTEM =================
client.on("interactionCreate", async interaction => {

if (!interaction.isButton()) return;

const guild = interaction.guild;
const user = interaction.user;

if (activeTickets.has(user.id))
return interaction.reply({
content:"❌ You already have an open ticket.",
ephemeral:true
});

activeTickets.add(user.id);

const category =
guild.channels.cache.find(
c => c.name === TICKET_CATEGORY
);

const channel = await guild.channels.create({
name:`ticket-${user.username}`,
type:ChannelType.GuildText,
parent:category,
permissionOverwrites:[
{
id:guild.id,
deny:[PermissionsBitField.Flags.ViewChannel]
},
{
id:user.id,
allow:[
PermissionsBitField.Flags.ViewChannel,
PermissionsBitField.Flags.SendMessages
]
},
{
id:STAFF_ROLE,
allow:[
PermissionsBitField.Flags.ViewChannel,
PermissionsBitField.Flags.SendMessages
]
}
]
});

const ticketEmbed = new EmbedBuilder()
.setTitle("🎫 Matcha Ticket")
.setDescription(`
Hello ${user}

Ticket Type:
**${interaction.customId.toUpperCase()}**

Please provide:
• Full explanation
• Evidence
• Usernames
`)
.setColor("#b7f2c2");

const controls = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("claim")
.setLabel("Claim")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("close")
.setLabel("Close")
.setStyle(ButtonStyle.Danger)
);

await channel.send({
content:`${user} <@&${STAFF_ROLE}>`,
embeds:[ticketEmbed],
components:[controls]
});

await interaction.reply({
content:`✅ Ticket created: ${channel}`,
ephemeral:true
});

});


// ================= CLAIM + CLOSE =================
client.on("interactionCreate", async interaction => {

if (!interaction.isButton()) return;

if (interaction.customId === "claim") {

await interaction.reply(
`✅ Ticket claimed by ${interaction.user}`
);

}

if (interaction.customId === "close") {

const messages =
await interaction.channel.messages.fetch({limit:100});

let transcript =
messages.reverse().map(m =>
`${m.author.tag}: ${m.content}`
).join("\n");

fs.writeFileSync(
`transcript-${interaction.channel.id}.txt`,
transcript
);

const logCategory =
interaction.guild.channels.cache.find(
c => c.name === LOG_CATEGORY
);

const logChannel =
await interaction.guild.channels.create({
name:`log-${interaction.channel.name}`,
type:ChannelType.GuildText,
parent:logCategory
});

await logChannel.send({
content:"📄 Ticket Transcript",
files:[`transcript-${interaction.channel.id}.txt`]
});

activeTickets.delete(
interaction.channel.topic
);

await interaction.channel.delete();

}

});


// ================= LOGIN =================
client.login(process.env.TOKEN);
