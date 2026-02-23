require('dotenv').config();

const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once('ready', () => {
  console.log(`✅ Matcha Support is online as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {

  console.log("Interaction received");

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'panel') {

    console.log("Panel command triggered");

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
        { label: 'Communications', value: 'comms', emoji: '🤝' },
        { label: 'Presidential', value: 'pres', emoji: '👑' }
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
});

client.login(process.env.TOKEN);
