const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  ChannelType, 
  PermissionsBitField 
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = "YOUR_BOT_TOKEN";
const EMOJI = ":Mcupcake:";

client.once("ready", async () => {
  console.log(`${client.user.tag} is online`);

  const channel = await client.channels.fetch("PANEL_CHANNEL_ID");

  const embed = new EmbedBuilder()
    .setColor("#a6e3a1")
    .setTitle(`${EMOJI} Matcha Bakery Support`)
    .setDescription(
`${EMOJI} **Welcome to Matcha Bakery Support!**

Please select a category below to open a ticket.

We are happy to assist you with:
• Orders
• Applications
• Partnerships
• General Help`
    )
    .setFooter({ text: "Matcha Bakery © Support System" });

  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket_menu")
    .setPlaceholder("Select Ticket Category")
    .addOptions([
      {
        label: "Order Support",
        description: "Help with orders",
        value: "order",
        emoji: "🍵"
      },
      {
        label: "Staff Application",
        description: "Apply for Matcha Bakery",
        value: "application",
        emoji: "🧁"
      },
      {
        label: "Partnership",
        description: "Business partnerships",
        value: "partner",
        emoji: "🤝"
      },
      {
        label: "General Support",
        description: "Other help",
        value: "general",
        emoji: "❓"
      }
    ]);

  const row = new ActionRowBuilder().addComponents(menu);

  await channel.send({
    embeds: [embed],
    components: [row]
  });
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "ticket_menu") return;

  const category = interaction.values[0];

  const ticketChannel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages
        ]
      }
    ]
  });

  const ticketEmbed = new EmbedBuilder()
    .setColor("#a6e3a1")
    .setTitle(`${EMOJI} Matcha Ticket Created`)
    .setDescription(
`${EMOJI} Hello ${interaction.user},

Thank you for contacting **Matcha Bakery**!
Our staff will assist you shortly.

**Category:** ${category}`
    );

  await ticketChannel.send({
    content: `${interaction.user}`,
    embeds: [ticketEmbed]
  });

  await interaction.reply({
    content: `✅ Ticket created: ${ticketChannel}`,
    ephemeral: true
  });
});

client.login(TOKEN);
