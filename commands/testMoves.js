const {Dex, BattleStream} = require('pokemon-showdown');
const fs = require('fs');
const path = require('path');
  

async function testMoves(move) {
  const stream = new BattleStream();
  const logs = [];

  let turns = 0;
  (async () => {
      for await (const output of stream) {
          const lines = output.trim().split('\n');
          for (const line of lines) {
              const parts = line.split('|').slice(1);

              if (
                  parts.length === 0 ||
                  parts[0] === 'request' || parts[0] === 'start'
              ) continue;

              logs.push(line);
          }
      }
  })();

  const team1 = `Bulbasaur|||Overgrow|${move}|Jolly|||2,31,31,30,31,31||10|`;
  const team2 = `Bulbasaur|||Overgrow|tackle,growl,confusion,substitute|Jolly|||2,31,31,30,31,31||10|`;

  stream.write(`>start {"formatid":"gen6anythinggoes"}`);
  stream.write(`>player p1 {"name":"team1","team":"${team1}"}`);
  stream.write(`>player p2 {"name":"team2","team":"${team2}"}`);
  stream.write('>p1 team 123456');
  stream.write('>p2 team 123456');

  const pokemon = stream.battle.p1.active[0];
  pokemon.setBoost({accuracy: 6});

  while (turns < 20) {
      stream.write(`>p1 move 1`);
      stream.write(`>p2 move ${Math.floor(Math.random() * 4) + 1}`);
      turns += 1;
      await new Promise(res => setTimeout(res, 500));
  }

  // Save logs to a .txt file
  const safeMoveName = move.replace(/[^\w\-]/g, '_'); // replace unsafe chars
  const filePath = path.join(__dirname, `logs`, `${safeMoveName}.txt`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, logs.join('\n'), 'utf-8');
  console.log(`Saved log for ${move} to ${filePath}`);
}

module.exports = {
  data: {
    name: "testmoves",
    description: "Get details about all moves inputs.",
  },

  run: async ({ interaction, client }) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const gen1Moves = Dex.moves.all().filter(m => m.gen === 1 && !m.isNonstandard).map(m => m.name);
      await interaction.editReply({ content: `Done.` });
      const lastMove = gen1Moves[gen1Moves.length - 1];
      console.log('Last move is:', lastMove);
      const batchSize = 10;
      for (let i = 0; i < gen1Moves.length; i += batchSize) {
        const batch = gen1Moves.slice(i, i + batchSize);
        await Promise.all(batch.map(move => testMoves(move)));
        await new Promise(res => setTimeout(res, 1000));
      }
      console.log('Finished');
    } catch (e) {
      console.error(e);
      await interaction.editReply({ content: 'There was an error running the battle.' });
    }
  },
};
