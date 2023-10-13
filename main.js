let currentPokemonId = 1;

function loadPokemon(offset) {
  const newPokemonId = currentPokemonId + offset;

  if (newPokemonId < 1) {
    alert('Cannot go below Pokemon ID 1');
    return;
  }

  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${newPokemonId}/`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      currentPokemonId = newPokemonId;

      document.getElementById('pokemon-name').textContent = data.name;
      document.getElementById('pokemon-image').src = data.sprites.front_default;
      document.getElementById('typesBox').textContent = `Types: ${data.types.map(type => type.type.name).join(', ')}`;
      showInfo();
    })
    .catch(error => {
      console.error('Error fetching Pokemon:', error);
    });
}


function showInfo() {
  const infoBox = document.getElementById('infoBox');
  const typesContainer = document.getElementById('typesBox');
  const infoText = document.getElementById('infoText');
  const infoBtn = document.getElementById('infoBtn');
  const movesBtn = document.getElementById('movesBtn');

  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${currentPokemonId}/`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const stats = getInfoForCurrentPokemon(data);

      infoBox.innerHTML = `
      height: ${stats.height}m<br>
      weight: ${stats.weight}kg<br>
      hp: ${stats.hp}<br>
      attack: ${stats.attack}<br>
      defense: ${stats.defense}<br>
      special attack: ${stats.specialAttack}<br>
      special defense: ${stats.specialDefense}<br>
      speed: ${stats.speed}
      `;

      typesContainer.innerHTML = '';
      stats.types.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.textContent = `${type}`;
        typeElement.className = 'type-box';
        typeElement.style.backgroundColor = getColorForType(type);
        typesContainer.appendChild(typeElement);
      });
      typesContainer.style.display = 'flex';

      infoText.style.display = 'block';
      infoBox.style.display = 'block';

      infoBtn.classList.add('active');
      movesBtn.classList.remove('active');
    })
    .catch(error => {
      console.error('Error fetching Pokemon:', error);
    });
}

function showMoves() {
  const infoBox = document.getElementById('infoBox');
  const movesText = document.getElementById('movesText');
  const infoBtn = document.getElementById('infoBtn');
  const movesBtn = document.getElementById('movesBtn');

  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${currentPokemonId}/`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const moves = data.moves.map(move => move.move.name);
      
      infoBox.innerHTML = `
        ${moves.join('<br>')}
      `;

      infoBox.style.display = 'block';

      movesText.style.display = 'block';
      infoText.style.display = 'none';

      movesBtn.classList.add('active');
      infoBtn.classList.remove('active');
    })
    .catch(error => {
      console.error('Error fetching Pokemon moves:', error);
    });
}


function getInfoForCurrentPokemon(data) {
  const stats = data.stats.reduce((acc, stat) => {
    acc[stat.stat.name] = stat.base_stat;
    return acc;
  }, {});

  return {
    height: data.height,
    weight: data.weight,
    hp: stats.hp,
    attack: stats.attack,
    defense: stats.defense,
    specialAttack: stats["special-attack"],
    specialDefense: stats["special-defense"],
    speed: stats.speed,
    types: data.types.map(type => type.type.name)
  };
}

function getColorForType(type) {
  const typeColors = {
    normal: '#a8a77a',
    fire: '#ee8130',
    water: '#6390f0',
    electric: '#f7d02c',
    grass: '#78C850',
    ice: '#96d9d6',
    fighting: '#c22e28',
    poison: '#A040A0',
    ground: '#e2bf65',
    flying: '#a98ff3',
    psychic: '#f95587',
    bug: '#a6b91a',
    rock: '#b6a136',
    ghost: '#735797',
    dragon: '#6f35fc',
    dark: '#705746',
    steel: '#b7b7ce',
    fairy: '#d685ad'
  };
  return typeColors[type] || '#CCCCCC';
}

loadPokemon(0);
