
// axios.get('http://localhost:4000/api/randomPokemon').then((res => {
//   console.log(res)
// }))


const pokeButton = document.getElementById('get-pokemon');
const pokeball = document.getElementById('pokeball');
const BASE_URL = 'http://localhost:4000/api'

const renderPokemon = ({ data }) => {
  data.forEach((pokemon) => {
    const pokemonContainer = document.createElement('div');
    pokemonContainer.className = 'pokemon-container';
    pokemonContainer.id = pokemon.id;
    const pokemonImg = document.createElement('img');
    const pokemonLabel = document.createElement('label');
    pokemonLabel.addEventListener('dblclick', () => editPokemon(pokemon.id))
    pokemonImg.addEventListener('click', () => battlePokemon(pokemon))
    pokemonLabel.textContent = pokemon.name;
    pokemonImg.src = pokemon.sprites.front_default;
    pokemonContainer.append(pokemonImg, pokemonLabel);
    pokeball.appendChild(pokemonContainer);
  })
}

const fireEdit = (id, input) => {
  console.log(id, input)
  const body = { id, newName: input.value };
  axios.put(`${BASE_URL}/pokemon`, body).then((res) => {
    pokeball.innerHTML = '';
    renderPokemon(res)
  })
}

const editPokemon = (id) => {
  const pokemonContainer = document.getElementById(id);
  const div = document.createElement('div')
  const input = document.createElement('input')
  const button = document.createElement('button')
  button.addEventListener('click', () => fireEdit(id, input))
  button.textContent = 'submit name!'
  div.append(input, button);
  pokemonContainer.appendChild(div);
}
let contenders = [];

const battlePokemon = (pokemon) => {
  contenders.push(pokemon)
  if(contenders.length === 1) return;
  const [ contender1, contender2 ] = contenders;
  const pokemon1BattleRoll = Math.random() * contender1.base_experience;
  const pokemon2BattleRoll = Math.random() * contender2.base_experience;
  if(pokemon1BattleRoll > pokemon2BattleRoll){
    alert(`${contender2.name} has fainted`)
    deletePokemon(contender2.id)
  } else {
    alert(`${contender1.name} has fainted`)
    deletePokemon(contender1.id)
  }
  contenders = [];
}

function deletePokemon(id){
  axios.delete(`${BASE_URL}/pokemon/${id}`).then((res) => {
    pokeball.innerHTML = '';
    renderPokemon(res)
  })
}


pokeButton.addEventListener('click', () => {
  axios.get(`${BASE_URL}/all-pokemon`).then(renderPokemon)
})

