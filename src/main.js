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

const gameDescriptions = {
  "Hollow Knight":
    "Explore a mysterious underground kingdom filled with forgotten secrets, dangerous creatures and challenging enemies in this beautiful action-adventure game.",

  "Stardew Valley":
    "Build your own farm, grow crops, raise animals, explore caves and become part of a welcoming countryside community.",

  "Celeste":
    "Help Madeline climb a dangerous mountain while overcoming challenging obstacles in this emotional and exciting platforming adventure.",

  "Hades":
    "Battle your way out of the Underworld in this action-packed roguelike game inspired by Greek mythology.",

  "Portal 2":
    "Solve creative puzzles using a portal gun while exploring a mysterious testing facility filled with unexpected challenges.",

  "Terraria":
    "Dig, build, explore and fight your way through a massive 2D sandbox adventure where you create your own experience.",

  "Disco Elysium":
    "Play as a detective investigating a murder while making decisions that shape your character and the story.",

  "Cuphead":
    "Take on challenging boss battles in a classic cartoon-inspired run-and-gun adventure."
};

function getGamesOnSale(games) {
  return games.filter(game => game.salePrice < game.normalPrice);
}

function calculateDiscountPercentage(game) {
  if (game.normalPrice <= 0) {
    return 0;
  }

  const discount = game.normalPrice - game.salePrice;

  return Math.round((discount / game.normalPrice) * 100);
}

function findCheapestGame(games) {
  if (games.length === 0) {
    return null;
  }

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
let currentSort = "default";

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
        Sample game deals are displayed in South African rand (ZAR).
      </p>
    </section>

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

      <select id="sortSelect" class="sort-select" aria-label="Sort games">
        <option value="default">Default Order</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="az">Alphabetical: A to Z</option>
        <option value="za">Alphabetical: Z to A</option>
      </select>

    </section>

    <p id="resultCount" class="result-count"></p>

    <p id="loadingMessage" class="loading-message"></p>

    <p id="errorMessage" class="error-message"></p>

    <section class="game-grid" id="gameGrid"></section>

    <section id="gameDetails" class="game-details-page" hidden></section>

  </main>

  <footer>
    <p>PC Game Deals &copy; 2026 | Find your next favourite game.</p>
    <p class="api-credit">
      Live game deals powered by CheapShark API.
    </p>
  </footer>

`;

const searchInput = document.querySelector('#searchInput');
const saleFilterButton = document.querySelector('#saleFilterButton');
const sortSelect = document.querySelector('#sortSelect');
const gameGrid = document.querySelector('#gameGrid');
const resultCount = document.querySelector('#resultCount');
const gameDetails = document.querySelector('#gameDetails');

function formatPrice(price) {
  const symbol = currentCurrency === "ZAR" ? "R" : "$";

  return `${symbol}${Number(price).toFixed(2)}`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return characters[character];
  });
}

function displayGameCards(games) {

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

    const gameKey = escapeHTML(game.dealID || game.id);
    const gameTitle = escapeHTML(game.title);
    const storeName = escapeHTML(game.store);

    const dealLink = game.dealID
      ? `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(game.dealID)}`
      : "";

    return `

      <article
        class="game-card clickable-card"
        data-game-key="${gameKey}"
        tabindex="0"
        role="button"
        aria-label="View details for ${gameTitle}"
      >

        <div class="game-image">

          <img
            src="${escapeHTML(game.image || '')}"
            alt="${gameTitle} cover"
            class="game-cover"
          />

          ${isOnSale
            ? `<span class="sale-tag">ON SALE</span>`
            : ''
          }

        </div>

        <div class="game-info">

          <p class="store">${storeName}</p>

          <h3>${gameTitle}</h3>

          <div class="price-container">

            ${isOnSale
              ? `<span class="normal-price">
                  ${formatPrice(game.normalPrice)}
                </span>`
              : ''
            }

            <span class="sale-price">
              ${formatPrice(game.salePrice)}
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

  gameGrid.querySelectorAll('.game-cover').forEach(image => {
    image.addEventListener('error', () => {
      image.style.display = 'none';
    });
  });

}

function updateDisplayedGames() {

  const searchTerm = searchInput.value;

  let filteredGames = [...currentDeals];

  if (searchTerm.trim() !== '') {
    filteredGames = searchGames(filteredGames, searchTerm);
  }

  if (showOnlyOnSale) {
    filteredGames = getGamesOnSale(filteredGames);
  }

  if (currentSort === "price-low") {
    filteredGames.sort((a, b) => a.salePrice - b.salePrice);
  } else if (currentSort === "price-high") {
    filteredGames.sort((a, b) => b.salePrice - a.salePrice);
  } else if (currentSort === "az") {
    filteredGames.sort((a, b) => a.title.localeCompare(b.title));
  } else if (currentSort === "za") {
    filteredGames.sort((a, b) => b.title.localeCompare(a.title));
  }

  displayGameCards(filteredGames);
}

function showGameDetails(game) {

  const isOnSale = game.salePrice < game.normalPrice;

  const description = gameDescriptions[game.title] ||
    "A description for this game is not currently available. Explore the game and discover what it has to offer.";

  const dealLink = game.dealID
    ? `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(game.dealID)}`
    : "";

  gameGrid.hidden = true;
  resultCount.hidden = true;
  gameDetails.hidden = false;

  gameDetails.innerHTML = `

    <button
      id="backButton"
      class="back-button"
      type="button"
    >
      ← Back to Games
    </button>

    <div class="details-card">

      <div class="details-image-container">

        <img
          src="${escapeHTML(game.image || '')}"
          alt="${escapeHTML(game.title)}"
          class="details-image"
        />

      </div>

      <div class="details-content">

        <p class="details-store">
          ${escapeHTML(game.store)}
        </p>

        <h2>${escapeHTML(game.title)}</h2>

        ${isOnSale
          ? `<span class="details-sale-tag">ON SALE</span>`
          : ''
        }

        <h3>About This Game</h3>

        <p class="details-description">
          ${description}
        </p>

        <div class="details-prices">

          <span class="details-sale-price">
            ${formatPrice(game.salePrice)}
          </span>

          ${isOnSale
            ? `<span class="details-normal-price">
                ${formatPrice(game.normalPrice)}
              </span>`
            : ''
          }

        </div>

        ${isOnSale
          ? `<p class="details-discount">
              You save ${calculateDiscountPercentage(game)}% on this game!
            </p>`
          : `<p class="details-regular">
              This game is currently at its regular price.
            </p>`
        }

        ${game.dealRating
          ? `<p class="details-rating">
              Deal Rating: ${Number(game.dealRating).toFixed(1)} / 10
            </p>`
          : ''
        }

        ${dealLink
          ? `<a
              href="${dealLink}"
              target="_blank"
              rel="noopener noreferrer"
              class="details-deal-link"
            >
              View Deal →
            </a>`
          : ''
        }

      </div>

    </div>

  `;

  const detailsImage = gameDetails.querySelector('.details-image');

  detailsImage.addEventListener('error', () => {
    detailsImage.style.display = 'none';
  });

  gameDetails.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

}

function returnToGames() {

  gameDetails.hidden = true;
  gameGrid.hidden = false;
  resultCount.hidden = false;

  updateDisplayedGames();
}

gameGrid.addEventListener('click', event => {
  if (event.target.closest('a, button')) {
    return;
  }

  const selectedCard = event.target.closest('.game-card');

  if (!selectedCard) {
    return;
  }

  const selectedGame = currentDeals.find(game =>
    String(game.dealID || game.id) === selectedCard.dataset.gameKey
  );

  if (selectedGame) {
    showGameDetails(selectedGame);
  }

});

gameGrid.addEventListener('keydown', event => {

  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  if (event.target.closest('a, button')) {
    return;
  }

  const selectedCard = event.target.closest('.game-card');

  if (!selectedCard) {
    return;
  }

  event.preventDefault();

  const selectedGame = currentDeals.find(game =>
    String(game.dealID || game.id) === selectedCard.dataset.gameKey
  );

  if (selectedGame) {
    showGameDetails(selectedGame);
  }

});

gameDetails.addEventListener('click', event => {

  if (event.target.closest('#backButton')) {
    returnToGames();
  }

});

searchInput.addEventListener('input', updateDisplayedGames);

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

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  updateDisplayedGames();
});

async function fetchLiveDeals() {

  const loadingMessage = document.querySelector('#loadingMessage');
  const errorMessage = document.querySelector('#errorMessage');

  loadingMessage.textContent = 'Loading live game deals...';
  errorMessage.textContent = '';

  gameDetails.hidden = true;
  gameGrid.hidden = false;
  resultCount.hidden = false;

  gameGrid.innerHTML = '';

  try {

    const [dealsResponse, storesResponse] = await Promise.all([

      fetch(`${API_URL}/deals?onSale=1&pageSize=20&sortBy=DealRating`),

      fetch(`${API_URL}/stores`)

    ]);

    if (!dealsResponse.ok || !storesResponse.ok) {
      throw new Error('Unable to retrieve data from CheapShark.');
    }

    const [dealsData, storesData] = await Promise.all([

      dealsResponse.json(),

      storesResponse.json()

    ]);

    const storeNames = {};

    storesData.forEach(store => {
      storeNames[store.storeID] = store.storeName;
    });

    const liveGames = dealsData.map(deal => {

      return {

        id: deal.gameID,

        title: deal.title,

        normalPrice: Number(deal.normalPrice),

        salePrice: Number(deal.salePrice),

        store: storeNames[deal.storeID] || 'Unknown Store',

        image: deal.thumb,

        dealID: deal.dealID,

        dealRating: Number(deal.dealRating)

      };

    });

    currentDeals = liveGames;
    currentCurrency = "USD";

    loadingMessage.textContent = '';

    document.querySelector('#sourceDescription').textContent =
      'Showing real-time discounted game deals from CheapShark. Prices are in US dollars (USD).';

    updateDisplayedGames();

    if (liveGames.length === 0) {
      errorMessage.textContent =
        'No live deals were returned. Please try again later.';
    }

  } catch (error) {

    console.error('CheapShark API Error:', error);

    loadingMessage.textContent = '';

    errorMessage.textContent =
      'Unable to load live deals. Please check your connection and try again.';

    gameGrid.innerHTML = '';

  }

}

const sampleButton = document.querySelector('#sampleButton');
const liveButton = document.querySelector('#liveButton');

sampleButton.addEventListener('click', () => {

  isLiveMode = false;

  currentDeals = sampleDeals;
  currentCurrency = "ZAR";
  showOnlyOnSale = false;

  searchInput.value = '';

  currentSort = "default";
  sortSelect.value = "default";

  saleFilterButton.classList.remove('active');
  saleFilterButton.textContent = '🏷️ Show Only On Sale';

  saleFilterButton.setAttribute('aria-pressed', 'false');

  sampleButton.classList.add('active');
  liveButton.classList.remove('active');

  gameDetails.hidden = true;
  gameGrid.hidden = false;
  resultCount.hidden = false;

  document.querySelector('#sourceDescription').textContent =
    'Sample game deals are displayed in South African rand (ZAR).';

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

  currentSort = "default";
  sortSelect.value = "default";

  saleFilterButton.classList.remove('active');
  saleFilterButton.textContent = '🏷️ Show Only On Sale';

  saleFilterButton.setAttribute('aria-pressed', 'false');

  document.querySelector('#sourceDescription').textContent =
    'Connecting to CheapShark...';

  await fetchLiveDeals();

});

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
