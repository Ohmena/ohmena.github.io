const pokemonItem = document.querySelector('[data-pokemon]');
const notFound = document.getElementById('pokemon-not-found');

// botão de página 'anterior' e 'próxima'
const previousPageButton = document.querySelector('[data-button="previous"]');
const nextPageButton = document.querySelector('[data-button="next"]');

let currentPage = 1; // página inicial
const pageSize = 20; // quantidade de pokémon por página

previousPageButton.addEventListener('click', () => {
  currentPage--;
  loadPokemonPage(currentPage, pageSize);
});

nextPageButton.addEventListener('click', () => {
  currentPage++;
  loadPokemonPage(currentPage, pageSize);
});

const loadPokemonPage = (page, pageSize) => {
  // limpar os pokémon existentes antes de carregar a próxima página
  pokemonItem.innerHTML = '';
  // chamar a função pokemonLoop com a página atual e o tamanho de pokemon na página
  pokemonLoop(page, pageSize);
  // desabilitar o botão de voltar na página 1
  previousPageButton.disabled = page === 1;
};

const pokemonLoop = async (page, pageSize) => {
  const start = (page - 1) * pageSize + 1;
  const end = page * pageSize;
  for (let i = start; i <= end; i++) {
    await getPokemonFetch(i);
  }
};

// fetch com mensagem de erro
const getPokemonFetch = async (id) => {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const fetchPokemon = await fetch(url);
    const pokemonResponse = await fetchPokemon.json();
    createPokemon(pokemonResponse);

    notFound.innerHTML = '';
    
  } catch (error) {
    console.log('Não foi possível obter o Pokémon')
    notFound.innerHTML = 'Pokémon não encontrado...';
    notFound.style.display = 'block';
    notFound.style.marginBottom = '30px';
  } 
};

const colors = {
  normal: '#BCBEB4',
  grass: '#8BD54F',
  fire: '#C84130',
  water: '#56AEFF',
  fighting: '#A05845',
  flying: '#7AA4FF',
  poison: '#A35A9C',
  ground: '#E9CC61',
  rock: '#CEBC73',
  bug: '#C2D11F',
  ghost: '#7974D4',
  electric: '#FCE73D',
  psychic: '#F964B4',
  ice: '#96F1FF',
  dragon: '#8977FF',
  dark: '#8D6A56',
  steel: '#C4C3DB',
  fairy: '#FCADFF'
}

const spanColors = {
  normal: '#a5a79e',
  grass: '#71b23b',
  fire: '#d52019',
  water: '#77c3ea',
  fighting: '#bd5d43',
  flying: '#6592f2',
  poison: '#c75bbc',
  ground: '#d1b651',
  rock: '#bcaa63',
  bug: '#aab80f',
  ghost: '#746eed',
  electric: '#ead534',
  psychic: '#FFA3D7',
  ice: '#83e1f4',
  dragon: '#7360ed',
  dark: '#aa704e',
  steel: '#a3a2c1',
  fairy: '#e48fe7'
}

// mudar a cor de fundo da <div> para a cor da tipagem do pokémon
//caso não tenha a tipagem no objeto, retorna uma cor padrão
const getColorByType = (type) => {
  const defaultColor = '#12bcae';
  return colors[type] || defaultColor;
}

const getSpanColor = (color) => {
  return spanColors[color];
}

const createPokemon = (pokemon) => {
  const newDiv = document.createElement('div');
  newDiv.classList.add('pokemon-item', 'animate');

  const backgroundColor = getColorByType(pokemon.types[0].type.name);
  newDiv.style.border = `2px solid ${backgroundColor}`;

  const typeNames = pokemon.types.map((typeObj) => typeObj.type.name);

  const typeSpans = typeNames.map((typeName) => {
    const typeSpan = document.createElement('span');
    typeSpan.innerHTML = typeName;
    typeSpan.classList.add('type-item');
    typeSpan.style.border = `2px solid ${getSpanColor(typeName)}`;
    return typeSpan.outerHTML;
  }).join('');

  const pokemonInnerHTML = `
    <div class="pokemon-img">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
    </div>
    <span class="pokemon-number pokemon-number-color">${pokemon.id}</span>
    <h2 class="pokemon-name-color">${pokemon.name}</h2>
    <div class="type">
      ${typeSpans}
    </div>
  `;

  //pega os status do pokemon de forma dinâmica
  const getStatusSpans = (stats) => {
    return stats.map((stat) => {
      return `<span class="color-stats">${stat.stat.name}: ${stat.base_stat}</span>`;
    }).join('');
  }

  const pokemonStatusInnerHTML = `
    <h2 class="color-title-stat">STATUS</h2>
    ${getStatusSpans(pokemon.stats)}
  `;
  
  //criação do card com os status dos pokemon
  const pokemonStatus = document.createElement('div');
  pokemonStatus.classList.add('pokemon-item', 'animate-card', 'disabled');
  pokemonStatus.innerHTML = pokemonStatusInnerHTML;
  pokemonStatus.style.backgroundColor = backgroundColor;
  pokemonItem.appendChild(pokemonStatus);

  newDiv.innerHTML = pokemonInnerHTML;
  pokemonItem.appendChild(newDiv);  

  newDiv.addEventListener('click', () => {
    newDiv.classList.add('disabled', 'animate-card')
    pokemonStatus.classList.remove('disabled')
  });

  pokemonStatus.addEventListener('click', () => {
    pokemonStatus.classList.add('disabled');
    newDiv.classList.remove('disabled');
  })  
};

/*Barra de pesquisas */
const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', handleNameChange);

function handleNameChange(event) {
  event.preventDefault();

  const searchInput = document.getElementById('search-input');
  const searchTerm = searchInput.value.toLowerCase();
  const pokemonElements = document.querySelectorAll('.pokemon-item');

  if (searchTerm.trim() === '') {
    console.log('adicione um pokemon');
    return;
  }

  pokemonElements.forEach((pokemonElement) => {
    const pokemonNameElement = pokemonElement.querySelector('h2');
    const pokemonNumberElement = pokemonElement.querySelector('.pokemon-number');

     // verificar se os elementos existem antes de acessar suas propriedades
    const pokemonName = pokemonNameElement ? pokemonNameElement.innerHTML.toLowerCase() : '';
    const pokemonNumber = pokemonNumberElement ? pokemonNumberElement.innerHTML : '';

    if (pokemonName.includes(searchTerm) || pokemonNumber === searchTerm) {
      pokemonElement.style.display = 'flex'; // mostrar o pokémon se o termo de pesquisa corresponder
    } else {
      pokemonElement.style.display = 'none'; // ocultar o Pokémon se o termo de pesquisa não corresponder
    }
  });

  searchInput.value = '';
  clearPokemonList();
  getPokemonFetch(searchTerm);
}

//remove o loop acima para que os pokemon não dupliquem a cada submit
const clearPokemonList = () => {
  const pokemonElements = document.querySelectorAll('.pokemon-item');
  pokemonElements.forEach((pokemonElement) => {
    pokemonElement.remove();
  });
};

//botão de 'atualizar' que, ao clicar, carrega a página do site para os pokémon reaparecerem
const btn = document.querySelector('.btn');

btn.addEventListener('click', (event) => {
  event.preventDefault();
  loadPokemonPage(currentPage, pageSize);
})

pokemonLoop();
loadPokemonPage(currentPage, pageSize);