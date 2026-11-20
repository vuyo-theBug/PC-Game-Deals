
// Game Deals Data
const gameDeals = [
  { id: 1, title: "Hollow Knight", normalPrice: 14.99, salePrice: 7.49, store: "Steam" },
  { id: 2, title: "Stardew Valley", normalPrice: 13.99, salePrice: 13.99, store: "GOG" },
  { id: 3, title: "Celeste", normalPrice: 19.99, salePrice: 4.99, store: "Steam" },
  { id: 4, title: "Hades", normalPrice: 24.99, salePrice: 12.49, store: "Epic Games" },
  { id: 5, title: "Portal 2", normalPrice: 9.99, salePrice: 0.99, store: "Steam" },
  { id: 6, title: "Terraria", normalPrice: 9.99, salePrice: 9.99, store: "GOG" },
  { id: 7, title: "Disco Elysium", normalPrice: 39.99, salePrice: 9.99, store: "GOG" },
  { id: 8, title: "Cuphead", normalPrice: 19.99, salePrice: 14.99, store: "Steam" }
];

// 1. Find all games that are on sale
function getGamesOnSale(games) {
  return games.filter(game => game.salePrice < game.normalPrice);
}

// 2. Calculate the discount percentage
function calculateDiscountPercentage(game) {
  const discount = game.normalPrice - game.salePrice;

  return Math.round((discount / game.normalPrice) * 100);
}

// 3. Find the cheapest game
function findCheapestGame(games) {
  return games.reduce((cheapest, game) => {
    return game.salePrice < cheapest.salePrice ? game : cheapest;
  });
}

// 4. Search games by title (case-insensitive)
function searchGames(games, searchTerm) {
  return games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Testing our functions
console.log("Games on sale:", getGamesOnSale(gameDeals));

console.log("Cheapest game:", findCheapestGame(gameDeals));

console.log("Celeste discount:",
  calculateDiscountPercentage(gameDeals[2]) + "%"
);

console.log("Search results:", searchGames(gameDeals, "HOLLOW"));

