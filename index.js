require('dotenv').config();

const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder,
  PermissionsBitField,
  ChannelType
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`✅ Matcha Support is online as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'panel') {

      const embed = new EmbedBuilder()
        .setColor('#ffb7c5')
        .setTitle('🛟 Matcha Support')
        .setDescription('Select a category below to create a support ticket.');

      const menu = new StringSelectMenuBuilder()
        .setCustomId('ticket_select')
        .setPlaceholder('📂 Select a support category')
        .addOptions(
        { label: 'General Support', value: 'general', emoji: '🌸' },
        { label: 'Discord Support', value: 'discord', emoji: '💬' },
        { label: 'Report a Low Rank', value: 'lr', emoji: '🍰' },
        { label: 'Report MR/HR', value: 'mrhr', emoji: '🧁' },
        { label: 'Bakery Assistance', value: 'bakery', emoji: '⚠️' },
        { label: 'Corporate', value: 'corp', emoji: '🤝' },
        { label: 'Presidential', value: 'pres', emoji: '👑' }
  );
      const row = new ActionRowBuilder().addComponents(menu);

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }

 else if (interaction.isStringSelectMenu()) {
  if (interaction.customId === 'ticket_select') {

    await interaction.deferReply({ ephemeral: true });

    const selected = interaction.values[0];

    const channel = await interaction.guild.channels.create({
      name: `ticket-${selected}-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ['ViewChannel'],
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
        }
      ],
    });

    await channel.send(`🎫 Ticket created by ${interaction.user}`);

    await interaction.editReply({
      content: `✅ Your ticket has been created: ${channel}`
    });
  }
});

client.login(process.env.TOKEN);
