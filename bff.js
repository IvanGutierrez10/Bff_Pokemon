const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
let currentUrl = baseUrl;
let pokemonData = [];

app.get('/pokemon', async (req, res) => {
  try {
    const response = await axios.get(currentUrl);
    currentUrl = response.data.next;

    const pokemonPromises = response.data.results.map(async (pokemon) => {
      const pokemonResponse = await axios.get(pokemon.url);
      return pokemonResponse.data;
    });

    pokemonData = [...pokemonData, ...(await Promise.all(pokemonPromises))];
    pokemonData.sort((a, b) => a.id > b.id ? 1 : -1);

    res.json(pokemonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching pokemon data' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});