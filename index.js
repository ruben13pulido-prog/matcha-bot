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

// COMMAND TO SEND THE SUPPORT PANEL
client.on('messageCreate', async (message) => {
  if (message.content === "!supportpanel") {

    const embed = new EmbedBuilder()
      .setTitle("🍵 Matcha Support Center")
      .setDescription(
`Need some help? We're here for you!

Please carefully review the following information before submitting a support ticket.

Only create a ticket if you intend to fully cooperate throughout the support process. Remain polite and professional when communicating with the Support Team — we are here to help you.

Once you select a category and open a ticket, a member of our team will respond as soon as possible. Please be prepared to provide information and evidence.`
      )
      .addFields(
        {
          name: "🌸 General Support",
          value: "Used for general questions relating to Matcha information, operations, or knowledge."
        },
        {
          name: "💬 Discord Support",
          value: "Used to report Discord-related issues such as rule violations or misconduct within the server."
        },
        {
          name: "🧁 Report a Low Rank (LR)",
          value: "Submit reports against Low Rank staff members (Trainee – Kitchen Leader)."
        },
        {
          name: "🧁 Report a Middle Rank / High Rank (MR/HR)",
          value: "Submit reports against Middle Rank or High Rank staff members (Staff Assistant – Executive Administration). These reports are confidential."
        },
        {
          name: "⚠️ Bakery Assistance",
          value:
`Low Response: Trolling, spamming, harassment, standing on counters, point cheating.
Middle Response: Impersonation, discrimination, exploiting, threats, raids (3+ people)
High Response: Corporate account compromised, bakery servers down, large raids (15+ people)`
        },
        {
          name: "🌿 Corporate Support",
          value:
`Used to file alliance reports, partnership inquiries, or general affiliation concerns with Matcha.

Please provide your organization name, your role, and a clear explanation of your request.`
        }
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

    await message.channel.send({ embeds: [embed], components: [row] });
    }
});

// BUTTON HANDLER (CREATES TICKETS)
client.on('interactionCreate', async (interaction) => {
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
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
      }
    ]
  });

  const ticketEmbed = new EmbedBuilder()
    .setTitle("🎫 Support Ticket Created")
    .setDescription(
`Hello ${user},

Thank you for opening a **${category}** ticket.
A member of the Matcha Support Team will assist you shortly.

Please provide:
• A detailed explanation of your issue
• Any evidence or screenshots
• Relevant usernames or links

Remain respectful while communicating with staff.`
    )
    .setColor("#b7f2c2");

  await ticketChannel.send({ content: `${user}`, embeds: [ticketEmbed] });

  await interaction.reply({
    content: `✅ Your ticket has been created: ${ticketChannel}`,
    ephemeral: true
  });
});

// LOGIN (PASTE YOUR BOT TOKEN HERE)
client.login(process.env.TOKEN);
