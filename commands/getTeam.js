const {Teams} = require('@pkmn/sim');
const {TeamGenerators} = require('@pkmn/randoms');


module.exports = {
  data: {
    name: "getteam",
    description: "Get a random team.",
  },

  run: async ({ interaction, client }) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      Teams.setGeneratorFactory(TeamGenerators);

      await interaction.editReply({ content: `\`\`\`${Teams.pack(Teams.generate('gen7randombattle'))}\`\`\`` });
    } catch (e) {
      console.error(e);
      await interaction.editReply({ content: 'There was an error running the battle.' });
    }
  },
};
