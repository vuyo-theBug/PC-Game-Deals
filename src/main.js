
import './style.css';


const sampleDeals = [
  {
    id: 1,
    title: "Hollow Knight",
    normalPrice: 14.99,
    salePrice: 7.49,
    store: "Steam",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg"
  },
  {
    id: 2,
    title: "Stardew Valley",
    normalPrice: 13.99,
    salePrice: 13.99,
    store: "GOG",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg"
  },
  {
    id: 3,
    title: "Celeste",
    normalPrice: 19.99,
    salePrice: 4.99,
    store: "Steam",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/504230/header.jpg"
  },
  {
    id: 4,
    title: "Hades",
    normalPrice: 24.99,
    salePrice: 12.49,
    store: "Epic Games",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg"
  },
  {
    id: 5,
    title: "Portal 2",
    normalPrice: 9.99,
    salePrice: 0.99,
    store: "Steam",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/header.jpg"
  },
  {
    id: 6,
    title: "Terraria",
    normalPrice: 9.99,
    salePrice: 9.99,
    store: "GOG",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg"
  },
  {
    id: 7,
    title: "Disco Elysium",
    normalPrice: 39.99,
    salePrice: 9.99,
    store: "GOG",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/632470/header.jpg"
  },
  {
    id: 8,
    title: "Cuphead",
    normalPrice: 19.99,
    salePrice: 14.99,
    store: "Steam",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/268910/header.jpg"
  }
];

function getGamesOnSale(games) {
  return games.filter(game => game.salePrice < game.normalPrice);
}

function calculateDiscountPercentage(game) {
  const discount = game.normalPrice - game.salePrice;

  return Math.round((discount / game.normalPrice) * 100);
}


function findCheapestGame(games) {
  return games.reduce((cheapest, game) => {
    return game.salePrice < cheapest.salePrice ? game : cheapest;
  });
}

function searchGames(games, searchTerm) {
  return games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );
}

let currentDeals = sampleDeals;

let isLiveMode = false;

let showOnlyOnSale = false;

let currentCurrency = "ZAR";

// CheapShark API address
const API_URL = "https://www.cheapshark.com/api/1.0";

const app = document.querySelector('#app');

app.innerHTML = `

  <header class="header">

    <div class="header-content">
      <h1>🎮 PC Game Deals</h1>
      <p>Discover amazing games at unbeatable prices.</p>
    </div>

  </header>

  <main class="container">

    <section class="welcome">

      <h2>Latest Game Deals</h2>

      <p>
        Explore our collection of PC games and find your next favourite.
      </p>

    </section>

    <!-- DATA SOURCE CONTROLS -->

    <section class="data-source">

      <h3>Choose Deal Source</h3>

      <div class="source-buttons">

        <button
          id="sampleButton"
          class="source-button active"
          type="button"
        >
          Sample Deals (ZAR)
        </button>

        <button
          id="liveButton"
          class="source-button"
          type="button"
        >
          Live CheapShark Deals (USD)
        </button>

      </div>

      <p id="sourceDescription">
        CheapShark Deals are in Dollars($).
      </p>

    </section>

    <!-- SEARCH AND FILTER -->

    <section class="deal-controls">

      <div class="search-box">

        <span class="search-icon">🔍</span>

        <input
          type="text"
          id="searchInput"
          placeholder="Search for a game..."
          aria-label="Search games by title"
        />

      </div>

      <button
        id="saleFilterButton"
        class="filter-button"
        type="button"
        aria-pressed="false"
      >
        🏷️ Show Only On Sale
      </button>

    </section>

    <p id="resultCount" class="result-count"></p>

    <p id="loadingMessage" class="loading-message"></p>

    <p id="errorMessage" class="error-message"></p>

    <section class="game-grid" id="gameGrid"></section>

  </main>

  <footer>
    <p>PC Game Deals &copy; 2026 | Find your next favourite game.</p>
    <p class="api-credit">
      Live game deals powered by CheapShark API.
    </p>
  </footer>

`;

function displayGameCards(games) {

  const gameGrid = document.querySelector('#gameGrid');

  const resultCount = document.querySelector('#resultCount');

  // Update the number of displayed games
  resultCount.textContent = `Showing ${games.length} game(s)`;

  if (games.length === 0) {

    gameGrid.innerHTML = `
      <div class="no-results">
        <h3>No games found</h3>
        <p>Try another game title or change your filter.</p>
      </div>
    `;

    return;
  }

  gameGrid.innerHTML = games.map(game => {

    const isOnSale = game.salePrice < game.normalPrice;

    const currencySymbol = currentCurrency === "ZAR" ? "R" : "$";

    const dealLink = game.dealID
      ? `https://www.cheapshark.com/redirect?dealID=${game.dealID}`
      : "";

    return `

      <article class="game-card">

        <div class="game-image">

          <img
            src="${game.image || ''}"
            alt="${game.title} cover"
            class="game-cover"
            onerror="this.style.display='none'"
          />

          ${isOnSale
            ? `<span class="sale-tag">ON SALE</span>`
            : ''
          }

        </div>

        <div class="game-info">

          <p class="store">${game.store}</p>

          <h3>${game.title}</h3>

          <div class="price-container">

            ${isOnSale
              ? `<span class="normal-price">
                  ${currencySymbol}${game.normalPrice.toFixed(2)}
                </span>`
              : ''
            }

            <span class="sale-price">
              ${currencySymbol}${game.salePrice.toFixed(2)}
            </span>

          </div>

          ${isOnSale
            ? `<p class="discount">
                ${calculateDiscountPercentage(game)}% OFF
              </p>`
            : `<p class="regular-label">Regular Price</p>`
          }

          ${dealLink
            ? `<a
                class="deal-link"
                href="${dealLink}"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Deal →
              </a>`
            : ''
          }

        </div>

      </article>

    `;

  }).join('');

}

const searchInput = document.querySelector('#searchInput');

const saleFilterButton = document.querySelector('#saleFilterButton');

function updateDisplayedGames() {

  const searchTerm = searchInput.value;

  let filteredGames = currentDeals;

  // Apply live search
  if (searchTerm.trim() !== '') {
    filteredGames = searchGames(filteredGames, searchTerm);
  }

  // Apply on-sale filter
  if (showOnlyOnSale) {
    filteredGames = getGamesOnSale(filteredGames);
  }

  // Display filtered results
  displayGameCards(filteredGames);
}

// Listen for changes in the search box
searchInput.addEventListener('input', updateDisplayedGames);

// Activate or deactivate the sale filter
saleFilterButton.addEventListener('click', () => {

  showOnlyOnSale = !showOnlyOnSale;

  saleFilterButton.classList.toggle('active', showOnlyOnSale);

  saleFilterButton.textContent = showOnlyOnSale
    ? '✓ Showing Only On Sale'
    : '🏷️ Show Only On Sale';

  saleFilterButton.setAttribute(
    'aria-pressed',
    String(showOnlyOnSale)
  );

  updateDisplayedGames();

});

// CHEAPSHARK API INTEGRATION

async function fetchLiveDeals() {

  const loadingMessage = document.querySelector('#loadingMessage');

  const errorMessage = document.querySelector('#errorMessage');

  const gameGrid = document.querySelector('#gameGrid');

  loadingMessage.textContent = 'Loading live game deals...';

  errorMessage.textContent = '';

  gameGrid.innerHTML = '';

  try {

    // Request live deals and store information together
    const [dealsResponse, storesResponse] = await Promise.all([

      fetch(`${API_URL}/deals?onSale=1&pageSize=20&sortBy=DealRating`),

      fetch(`${API_URL}/stores`)

    ]);

    if (!dealsResponse.ok || !storesResponse.ok) {
      throw new Error('Unable to retrieve data from CheapShark.');
    }

    // Convert API responses into JavaScript data
    const [dealsData, storesData] = await Promise.all([

      dealsResponse.json(),

      storesResponse.json()

    ]);

    // Create a list of store IDs and store names
    const storeNames = {};

    storesData.forEach(store => {

      storeNames[store.storeID] = store.storeName;

    });

    // Convert API sorce data into our application's game format
    const liveGames = dealsData.map(deal => {

      return {

        id: deal.gameID,

        title: deal.title,

        normalPrice: Number(deal.normalPrice),

        salePrice: Number(deal.salePrice),

        store: storeNames[deal.storeID] || 'Unknown Store',

        image: deal.thumb,

        dealID: deal.dealID

      };

    });

    currentDeals = liveGames;

    currentCurrency = "USD";

    loadingMessage.textContent = '';

    document.querySelector('#sourceDescription').textContent =
      'Showing real-time discounted game deals from CheapShark. Prices are in US dollars (USD).';

    updateDisplayedGames();

    if (liveGames.length === 0) {
      errorMessage.textContent = 'No live deals were returned. Please try again later.';
    }

  } catch (error) {

    console.error('CheapShark API Error:', error);

    loadingMessage.textContent = '';

    errorMessage.textContent =
      'Unable to load live deals. Please check your connection and try again.';

    gameGrid.innerHTML = '';

  }

}


// SWITCH BETWEEN DATA SOURCES
const sampleButton = document.querySelector('#sampleButton');

const liveButton = document.querySelector('#liveButton');

sampleButton.addEventListener('click', () => {

  isLiveMode = false;

  currentDeals = sampleDeals;

  currentCurrency = "ZAR";

  showOnlyOnSale = false;

  searchInput.value = '';

  saleFilterButton.classList.remove('active');

  saleFilterButton.textContent = '🏷️ Show Only On Sale';

  saleFilterButton.setAttribute('aria-pressed', 'false');

  sampleButton.classList.add('active');

  liveButton.classList.remove('active');

  document.querySelector('#sourceDescription').textContent =
    'Showing the original assessment game data in South African Rand.';

  document.querySelector('#errorMessage').textContent = '';

  document.querySelector('#loadingMessage').textContent = '';

  updateDisplayedGames();

});

liveButton.addEventListener('click', async () => {

  isLiveMode = true;

  sampleButton.classList.remove('active');

  liveButton.classList.add('active');

  showOnlyOnSale = false;

  searchInput.value = '';

  saleFilterButton.classList.remove('active');

  saleFilterButton.textContent = '🏷️ Show Only On Sale';

  saleFilterButton.setAttribute('aria-pressed', 'false');

  document.querySelector('#sourceDescription').textContent =
    'Connecting to CheapShark...';

  await fetchLiveDeals();

});


//  INITIAL PAGE LOAD
updateDisplayedGames();

console.log("Games on sale:", getGamesOnSale(sampleDeals));

console.log("Cheapest game:", findCheapestGame(sampleDeals));

console.log(
  "Celeste discount:",
  calculateDiscountPercentage(sampleDeals[2]) + "%"
);

console.log(
  "Search results:",
  searchGames(sampleDeals, "HOLLOW")
);
