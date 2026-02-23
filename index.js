client.on('interactionCreate', async interaction => {

  // Slash command
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
          { label: 'Discord Support', value: 'discord', emoji: '💬' }
        );

      const row = new ActionRowBuilder().addComponents(menu);

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }

  // Select menu handler
  else if (interaction.isStringSelectMenu()) {

    if (interaction.customId === 'ticket_select') {

      console.log(interaction.values);
      const selected = interaction.values[0];

      await interaction.reply({
        content: `You selected: ${selected}`,
        ephemeral: true
      });
    }
  }

});
