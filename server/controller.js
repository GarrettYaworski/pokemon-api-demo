const axios = require('axios');
const Sequelize = require('sequelize');

const { CONNECTION_STRING } = process.env;
const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
      ssl: {
          rejectUnauthorized: false
      }
  }
});

const getRandomPokemon = (req, res) => {
  const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)]
  res.status(200).send(randomPokemon)
}

const getAllPokemon = (req, res) => {
  sequelize.query(`SELECT * FROM pokemon ORDER BY pokemon_id`).then((pokemon) => {
    res.status(200).send(pokemon[0]);
  })
}

const  deletePokemon = (req, res) => {
  const { id } = req.params;
  console.log(id)
  sequelize.query(`
    DELETE FROM pokemon WHERE pokemon_id = ${id};
    SELECT * FROM pokemon ORDER BY pokemon_id;
    `).then((pokemon) => {
    res.status(200).send(pokemon[0]);
  })
}

const editPokemonName = (req, res) => {
  const { id, newName } = req.body;
  sequelize.query(`
  UPDATE pokemon SET name = '${newName}' WHERE pokemon_id = ${id};
  SELECT * FROM pokemon ORDER BY pokemon_id;
  `).then((pokemon) => {
    res.status(200).send(pokemon[0]);
  })
}

const seedDB = (req, res) => {
  sequelize.query(`
  DROP TABLE pokemon;

  CREATE TABLE pokemon(
  pokemon_id SERIAL PRIMARY key,
  image VARCHAR(300),
  name VARCHAR(50),
  exp INTEGER
  );`).then(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon').then(({ data: { results } }) => {
    results.forEach((pokemon) => {
      axios.get(pokemon.url).then(({ data }) => {
        const name = data.name 
        const image = data.sprites.front_default
        const exp = data.base_experience
        sequelize.query(`
          INSERT INTO pokemon(image, name, exp)
          VALUES('${image}', '${name}', ${exp})`
        )
      })
    })
  })
  }).finally(() => res.sendStatus(200))
}

module.exports = {
  getAllPokemon,
  getRandomPokemon,
  deletePokemon,
  editPokemonName,
  seedDB
}