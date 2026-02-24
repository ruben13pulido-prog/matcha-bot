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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Matcha Support is online as ${client.user.tag}`);
});


// ================= SUPPORT PANEL =================
client.on('messageCreate', async (message) => {

  if (message.content === "!supportpanel") {

    const embed = new EmbedBuilder()
      .setTitle("🍵 Matcha Support Center")
      .setDescription(
`Need some help? We're here for you!

Please carefully review the following information before submitting a support ticket. 

Only create a ticket if you intend to fully cooperate throughout the support process. Remain polite and professional when communicating with the Support Team — we are here to help you.

Once you select a category and open a ticket, a member of our team will respond as soon as possible. Please be prepared to provide information and evidence.

      )
      .setColor("#b7f2c2")
      .setFooter({ text: "Matcha Support • We’re here to help 💚" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('general')
        .setLabel('🌸 General Support')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('discord')
        .setLabel('💬 Discord Support')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('lr')
        .setLabel('🧁 Report LR')
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId('mrhr')
        .setLabel('🧁 Report MR/HR')
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId('corporate')
        .setLabel('🌿 Corporate')
        .setStyle(ButtonStyle.Success)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('appeal')
        .setLabel('📄 Appeals')
        .setStyle(ButtonStyle.Success)
    );

    await message.channel.send({
      embeds: [embed],
      components: [row, row2]
    });
  }
});


// ================= TICKET CREATION =================
client.on("interactionCreate", async (interaction) => {

  if (!interaction.isButton()) return;

  const category = interaction.customId;
  const user = interaction.user;
  const guild = interaction.guild;

  const channelName = `ticket-${user.username}`.toLowerCase();

  const ticketChannel = await guild.channels.create({
    name: channelName,
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
    .setDescription(
`Hello ${user},

You opened a **${category.toUpperCase()}** ticket.

Please provide:
• Full explanation
• Evidence/screenshots
• Relevant usernames

A staff member will assist you shortly.`
    )
    .setColor("#b7f2c2");

  await ticketChannel.send({
    content: `${user}`,
    embeds: [ticketEmbed]
  });

  await interaction.reply({
    content: `✅ Your ticket has been created: ${ticketChannel}`,
    ephemeral: true
  });
});


// ================= LOGIN =================
client.login(process.env.TOKEN);
