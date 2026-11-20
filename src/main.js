
import './style.css';

// ==========================================
// 1. GAME DEALS DATA
// ==========================================

const gameDeals = [
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

// ==========================================
// 2. PART A - REQUIRED FUNCTIONS
// ==========================================

// Find games currently on sale
function getGamesOnSale(games) {
  return games.filter(game => game.salePrice < game.normalPrice);
}

// Calculate discount percentage
function calculateDiscountPercentage(game) {
  const discount = game.normalPrice - game.salePrice;

  return Math.round((discount / game.normalPrice) * 100);
}

// Find the cheapest game
function findCheapestGame(games) {
  return games.reduce((cheapest, game) => {
    return game.salePrice < cheapest.salePrice ? game : cheapest;
  });
}

// Search games by title (case-insensitive)
function searchGames(games, searchTerm) {
  return games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );
}

// ==========================================
// 3. PART C - FILTER SETTINGS
// ==========================================

// Store the current filter setting
let showOnlyOnSale = false;

// ==========================================
// 4. DISPLAY THE GAME CARDS
// ==========================================

function displayGameCards(games) {

  const gameGrid = document.querySelector('#gameGrid');
  const resultCount = document.querySelector('#resultCount');

  // Update the number of games displayed
  resultCount.textContent = `Showing ${games.length} game(s)`;

  // Show a message if no games match the search
  if (games.length === 0) {
    gameGrid.innerHTML = `
      <div class="no-results">
        <h3>No games found</h3>
        <p>Try another game title or change your filter.</p>
      </div>
    `;

    return;
  }

  // Generate a card for every matching game
  gameGrid.innerHTML = games.map(game => {

    const isOnSale = game.salePrice < game.normalPrice;

    return `
      <article class="game-card">

        <div class="game-image">

          <img
            src="${game.image}"
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
                  R${game.normalPrice.toFixed(2)}
                </span>`
              : ''
            }

            <span class="sale-price">
              R${game.salePrice.toFixed(2)}
            </span>

          </div>

          ${isOnSale
            ? `<p class="discount">
                ${calculateDiscountPercentage(game)}% OFF
              </p>`
            : `<p class="regular-label">Regular Price</p>`
          }

        </div>

      </article>
    `;

  }).join('');
}

// ==========================================
// 5. PART B - CREATE THE PAGE
// ==========================================

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

    <!-- Search and filter controls -->

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

    <!-- Games will be displayed here -->

    <section class="game-grid" id="gameGrid"></section>

  </main>

  <footer>
    <p>PC Game Deals &copy; 2026 | Find your next favourite game.</p>
  </footer>
`;

// ==========================================
// 6. PART C - LIVE SEARCH AND FILTERING
// ==========================================

// Get the search input and filter button
const searchInput = document.querySelector('#searchInput');

const saleFilterButton = document.querySelector('#saleFilterButton');

// Update the displayed games according to the selected filters
function updateDisplayedGames() {

  // Get what the user has typed
  const searchTerm = searchInput.value;

  // Start with all available games
  let filteredGames = gameDeals;

  // Apply the search filter
  if (searchTerm.trim() !== '') {
    filteredGames = searchGames(filteredGames, searchTerm);
  }

  // Apply the on-sale filter
  if (showOnlyOnSale) {
    filteredGames = getGamesOnSale(filteredGames);
  }

  // Display the matching games
  displayGameCards(filteredGames);
}

// Listen for typing in the search box
searchInput.addEventListener('input', updateDisplayedGames);

// Toggle the on-sale filter
saleFilterButton.addEventListener('click', () => {

  // Change the filter setting
  showOnlyOnSale = !showOnlyOnSale;

  // Update the button appearance and text
  saleFilterButton.classList.toggle('active', showOnlyOnSale);

  saleFilterButton.textContent = showOnlyOnSale
    ? '✓ Showing Only On Sale'
    : '🏷️ Show Only On Sale';

  // Refresh the displayed games
  updateDisplayedGames();

});

// ==========================================
// 7. DISPLAY ALL GAMES WHEN PAGE LOADS
// ==========================================

updateDisplayedGames();

// ==========================================
// 8. TEST PART A FUNCTIONS
// ==========================================

console.log("Games on sale:", getGamesOnSale(gameDeals));

console.log("Cheapest game:", findCheapestGame(gameDeals));

console.log(
  "Celeste discount:",
  calculateDiscountPercentage(gameDeals[2]) + "%"
);

console.log(
  "Search results:",
  searchGames(gameDeals, "HOLLOW")
);
