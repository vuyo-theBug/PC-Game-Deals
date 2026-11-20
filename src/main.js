

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

// Find all games currently on sale
function getGamesOnSale(games) {
  return games.filter(game => game.salePrice < game.normalPrice);
}

// Calculate the discount percentage
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
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// ==========================================
// 3. PART B - DISPLAY GAMES ON THE PAGE
// ==========================================

// Get the HTML element where games will be displayed
const app = document.querySelector('#app');

// Display the games
function displayGames(games) {

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
        <p>Explore our collection of PC games and find your next favourite.</p>
      </section>

      <section class="game-grid">

        ${games.map(game => {

          // Check whether the game is discounted
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

        }).join('')}

      </section>

    </main>

    <footer>
      <p>PC Game Deals &copy; 2026 | Find your next favourite game.</p>
    </footer>
  `;
}

// Display all eight games
displayGames(gameDeals);

// ==========================================
// 4. TEST PART A FUNCTIONS
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
