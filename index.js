require('dotenv').config();

const { 
  Client, 
  GatewayIntentBits, 
  ChannelType, 
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});


// PANEL COMMAND
client.on('messageCreate', async message => {
  if (message.content === '!panel') {

    const button = new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('🎟 Create Ticket')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      content: 'Click below to create a support ticket!',
      components: [row]
    });
  }
});


// BUTTON CLICK HANDLER
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'create_ticket') {

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ],
        }
      ],
    });

    await interaction.reply({
      content: `Your ticket has been created: ${channel}`,
      ephemeral: true
    });

    channel.send(`Welcome ${interaction.user}, please describe your issue.`);
  }
});

client.login(process.env.TOKEN);
