const Sim = require('pokemon-showdown');
const { setBattle } = require('../cache');

module.exports = {
  data: {
    name: "run",
    description: "Run a simulated Pokémon battle.",
  },

  run: async ({ interaction, client }) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const stream = new Sim.BattleStream();

      setBattle(0, stream);

      (async () => {
        for await (const output of stream) {
          const lines = output.trim().split('\n');
      
          for (const line of lines) {
            const parts = line.split('|').slice(1);
            if (parts.length === 0 || parts[0] === '' || parts[0] === 't:' ) continue;
            console.log(parts);
            switch (parts[0]) {
              case 'request': 
                //console.log(JSON.parse(parts[1]));
                break;
              case 'switch':
                const [pokemonName, level, pokeHP] = parts.slice(1, 4);
                if (parseInt(pokeHP.split('/')[0]) <= 100 && parseInt(pokeHP.split('/')[1]) === 100) break;
                if (pokemonName.split('a: ')[0] === "p1") {
                  console.log(`P1: ${pokemonName.split("a: ")[1]}, ${level.split(', ')[1]} and current HP: ${pokeHP.split('/')[0]}, max HP: ${pokeHP.split('/')[1]}`);
                } else {
                  console.log(`P2: ${pokemonName.split("a: ")[1]}, ${level.split(', ')[1]} and current HP: ${pokeHP.split('/')[0]}, max HP: ${pokeHP.split('/')[1]}`);
                }
                break;
              case '-sidestart':
                console.log(`${parts[2].split(': ')[1]} has been set up on ${parts[1].split(": ")[1]}'s team.`);

              case '-damage':
              case '-heal':
                const [pokemon, hp] = parts.slice(1, 3);
                console.log(`HP Change: ${pokemon} is now at ${hp}`);
                break;
      
              case '-immune':
                const [immunePokemon, cause] = parts.slice(1,3);
                console.log(`${immunePokemon} was immune to the move due to ${cause.split(': ')[1]}!`);
                break;
      
              case '-supereffective':
                const effectivePokemon = parts[1];
                console.log(`${effectivePokemon} was hit super effectively!`);
                break;
      
              case 'move':
                const [moveUser, moveName, target] = parts.slice(1, 4);
                console.log(`${moveUser.split(' ')[1]} used ${moveName} on ${target.split(' ')[1]}`);
                break;
      
              default:
                break;
            }
          }
        }
      })();
      


      const p1team = "Azelf|||Levitate|psychic,explosion,fireblast,stealthrock|Jolly|||2,31,31,30,31,31||88|";
      const p2team = "Rapidash|||FlashFire|disable,wildcharge,highhorsepower,flareblitz|Jolly||M|||90|";

      stream.write(`>start {"formatid":"gen7anythinggoes", "ruleset":["!HP Percentage Mod"]}
>player p1 {"name":"Alice","team":"${p1team}"}
>player p2 {"name":"Bob","team":"${p2team}"}`);

      // Properly select the Pokémon (team preview phase)
      stream.write(`>p1 team 1`);
      stream.write(`>p2 team 1`);

      // Execute moves directly without unnecessary switches
      stream.write(`>p1 move 4`);
      stream.write(`>p2 move highhorsepower`);

      

      await interaction.editReply({ content: `Battle started and moves executed.` });
    } catch (e) {
      console.error(e);
      await interaction.editReply({ content: 'There was an error running the battle.' });
    }
  },
};
