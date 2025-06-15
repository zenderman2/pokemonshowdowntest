const { getBattle } = require('../cache');

module.exports = {
  data: {
    name: "runtwo",
    description: "Run a simulated Pokémon battle.",
  },

  run: async ({ interaction, client }) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const battleStream = getBattle(0);
    if (!battleStream) {
        return interaction.reply({ content: 'Battle not found.', ephemeral: true });
    }
    
    // Send the move to the battle stream
     battleStream.write(`>p2 move 1`);
     battleStream.write(`>p1 move 4`);
     battleStream.write(`>p1 move 1`);

      await interaction.editReply({ content: 'Battle started and moves executed.' });
    } catch (e) {
      console.error(e);
      await interaction.editReply({ content: 'There was an error running the battle.' });
    }
  },
};
