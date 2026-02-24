require("dotenv").config();

const {
Client,
GatewayIntentBits,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
ChannelType,
PermissionsBitField
} = require("discord.js");

const fs = require("fs");

const client = new Client({
intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
});


// ================= READY =================
client.once("ready",()=>{
console.log(`✅ Matcha Corporate System Online`);
});


// ================= SUPPORT PANEL =================
client.on("messageCreate", async message => {

if(message.author.bot) return;

if(message.content === "!supportpanel"){

const embed = new EmbedBuilder()
.setTitle("🍵 Matcha Support Center")
.setDescription(
`Select a category below to open a support ticket.

Please carefully review the following information before submitting a support ticket. 

Only create a ticket if you intend to fully cooperate throughout the support process. Remain polite and professional when communicating with the Support Team — we are here to help you.

Once you select a category and open a ticket, a member of our team will respond as soon as possible. Please be prepared to provide information and evidence.

Abuse of tickets may result in punishment.`
)
.setColor("#b7f2c2");

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("general")
.setLabel("🌸 General")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("discord")
.setLabel("💬 Discord")
.setStyle(ButtonStyle.Secondary),

new ButtonBuilder()
.setCustomId("lr")
.setLabel("🧁 Report LR")
.setStyle(ButtonStyle.Danger),

new ButtonBuilder()
.setCustomId("mrhr")
.setLabel("🧁 Report MR/HR")
.setStyle(ButtonStyle.Danger),

new ButtonBuilder()
.setCustomId("appeal")
.setLabel("📄 Appeals")
.setStyle(ButtonStyle.Success)
);

await message.channel.send({
embeds:[embed],
components:[row]
});
}
});


// ================= BUTTON SYSTEM =================
client.on("interactionCreate", async interaction=>{

if(!interaction.isButton()) return;

const guild = interaction.guild;
const user = interaction.user;

const staffRole =
guild.roles.cache.find(r=>r.name==="Support Team");

const ticketCategory =
guild.channels.cache.find(
c=>c.name==="🎫 SUPPORT TICKETS"
);

const logChannel =
guild.channels.cache.find(
c=>c.name==="ticket-logs"
);


// ========= CREATE TICKET =========
if(
["general","discord","lr","mrhr","appeal"]
.includes(interaction.customId)
){

// Anti spam
const existing =
guild.channels.cache.find(
c=>c.name===`ticket-${user.id}`
);

if(existing){
return interaction.reply({
content:`⚠️ You already have a ticket: ${existing}`,
ephemeral:true
});
}

const channel = await guild.channels.create({
name:`ticket-${user.id}`,
type:ChannelType.GuildText,
parent:ticketCategory,
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
id:staffRole.id,
allow:[
PermissionsBitField.Flags.ViewChannel,
PermissionsBitField.Flags.SendMessages
]
}
]
});

const controls = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("claim")
.setLabel("✅ Claim")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("close")
.setLabel("🔒 Close")
.setStyle(ButtonStyle.Danger)
);

await channel.send({
content:`${user}`,
embeds:[
new EmbedBuilder()
.setTitle("🎫 Ticket Opened")
.setDescription(
`Category: **${interaction.customId.toUpperCase()}**

Please explain your issue.
Staff will assist shortly.`
)
.setColor("#b7f2c2")
],
components:[controls]
});

interaction.reply({
content:`✅ Ticket created: ${channel}`,
ephemeral:true
});
}


// ========= CLAIM =========
if(interaction.customId==="claim"){

interaction.channel.send(
`✅ ${interaction.user} has claimed this ticket.`
);

interaction.reply({
content:"Ticket claimed.",
ephemeral:true
});
}


// ========= CLOSE =========
if(interaction.customId==="close"){

await interaction.reply({
content:"🔒 Closing ticket...",
ephemeral:true
});

// transcript
const messages =
await interaction.channel.messages.fetch({limit:100});

let transcript = "";

messages.reverse().forEach(m=>{
transcript += `${m.author.tag}: ${m.content}\n`;
});

const file =
`transcript-${interaction.channel.name}.txt`;

fs.writeFileSync(file,transcript);

await logChannel.send({
content:`📁 Ticket Closed by ${interaction.user}`,
files:[file]
});

setTimeout(()=>{
interaction.channel.delete();
},3000);
}

});


// ================= LOGIN =================
client.login(process.env.TOKEN);
