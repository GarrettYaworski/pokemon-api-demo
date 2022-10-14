const express = require('express')
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors())
app.use(express.json())

let pokemonArr = []
axios.get('https://pokeapi.co/api/v2/pokemon').then(({ data: { results } }) => {
  results.forEach((pokemon) => {
    axios.get(pokemon.url).then(({ data }) => {
       pokemonArr.push(data);
    })
  })
})

app.get('/api/RandomPokemon', (req, res) => {
  const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)]
  res.status(200).send(randomPokemon)
});

app.get('/api/all-pokemon', (req, res) => {
  res.status(200).send(pokemonArr);
});

app.delete('/api/pokemon/:id', (req, res) => {
  const { id } = req.params;
  pokemonArr = pokemonArr.filter((pokemon) => pokemon.id !== +id);
  res.status(200).send(pokemonArr);
})

app.put('/api/pokemon', (req, res) => {
  const { id, newName } = req.body;
  const pokemonToEdit = pokemonArr.findIndex((pokemon) => pokemon.id === id);
  pokemonArr[pokemonToEdit].name = newName;
  res.status(200).send(pokemonArr);
})


app.listen(4000, () => console.log('listening on 4000'))