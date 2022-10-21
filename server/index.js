require('dotenv').config();
const express = require('express')
const cors = require('cors');
const { 
  getAllPokemon,
  getRandomPokemon,
  editPokemonName,
  deletePokemon,
  seedDB
} = require('./controller')

const { SERVER_PORT } = process.env;
const app = express();
app.use(cors())
app.use(express.json())

app.post('/api/seed', seedDB)
app.get('/api/RandomPokemon', getRandomPokemon);
app.get('/api/all-pokemon', getAllPokemon);
app.delete('/api/pokemon/:id', deletePokemon)
app.put('/api/pokemon', editPokemonName)


app.listen(SERVER_PORT, () => console.log('listening on 4000'))