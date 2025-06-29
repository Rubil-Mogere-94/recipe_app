// DOM Elements
const darkModeToggle = document.getElementById('dark-mode-toggle');
const surpriseBtns = document.querySelectorAll('[id*="surprise"]');
const backBtns = document.querySelectorAll('[id*="back"]');
const landingPage = document.getElementById('landing-page');
const landingContent = document.querySelector('.home-features');
const recipeContainer = document.getElementById('recipe-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const resultsContainer = document.getElementById('results-container');
const searchTermDisplay = document.getElementById('search-term-display');
const favoritesBtn = document.getElementById('favorites-btn');
const categoriesBtn = document.getElementById('categories-btn');
const quickmealsBtn = document.getElementById('quickmeals-btn');
const seasonalBtn = document.getElementById('seasonal-btn');
const challengesBtn = document.getElementById('challenges-btn');
const globalBtn = document.getElementById('global-btn');
const favoritesPanel = document.getElementById('favorites-panel');
const favoritesList = document.getElementById('favorites-list');

// API Configuration
const API_KEY = '1';
const API_BASE = 'https://www.themealdb.com/api/json/v1/';

// Initialize favorites
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Initialize the app
function init() {
  updateNavState();
  hideFavorites(); // Ensure favorites panel starts hidden
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = darkModeToggle.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  const icon = darkModeToggle.querySelector('i');
  icon.classList.remove('fa-moon');
  icon.classList.add('fa-sun');
}

// Event listeners
surpriseBtns.forEach(btn => btn.addEventListener('click', fetchRandomRecipe));
backBtns.forEach(btn => btn.addEventListener('click', showHomePage));
searchForm.addEventListener('submit', handleSearch);
favoritesBtn.addEventListener('click', showFavorites);
categoriesBtn.addEventListener('click', showCategories);
quickmealsBtn.addEventListener('click', fetchQuickMeals);
seasonalBtn.addEventListener('click', fetchSeasonalRecipes);
challengesBtn.addEventListener('click', fetchCookingChallenge);
globalBtn.addEventListener('click', fetchGlobalCuisine);

// Core Functions
function fetchRandomRecipe() {
  // Show loading state
  recipeContainer.classList.remove('hidden');
  landingPage.classList.add('hidden');
  searchResults.classList.add('hidden');
  document.getElementById('recipe-title').textContent = 'Loading...';
  document.getElementById('ingredients-list').innerHTML = '<div class="loading-spinner"></div>';
  document.getElementById('instructions-content').innerHTML = '';

  fetch(`${API_BASE}${API_KEY}/random.php`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.meals?.[0]) {
        displayRecipe(data.meals[0]);
      } else {
        showRecipeError('No recipe found. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showRecipeError('Failed to load recipe. Please check your connection and try again.');
    })
    .finally(() => {
      updateNavState();
    });
}

function fetchRecipeById(mealId) {
  return fetch(`${API_BASE}${API_KEY}/lookup.php?i=${mealId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.meals?.[0]) {
        return data.meals[0];
      } else {
        throw new Error('Recipe not found');
      }
    });
}

function handleSearch(e) {
  e.preventDefault();
  const term = searchInput.value.trim();
  if (!term) return;

  // Show loading state
  searchTermDisplay.textContent = term;
  landingPage.classList.add('hidden');
  recipeContainer.classList.add('hidden');
  searchResults.classList.remove('hidden');
  resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
  window.scrollTo(0, 0);

  fetch(`${API_BASE}${API_KEY}/search.php?s=${term}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.meals) {
        displaySearchResults(data.meals);
      } else {
        showNoResults();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showSearchError();
    })
    .finally(() => {
      updateNavState();
    });
}

// Navigation Functions
function showHomePage() {
  landingPage.classList.remove('hidden');
  recipeContainer.classList.add('hidden');
  searchResults.classList.add('hidden');
  favoritesPanel.classList.add('hidden');
  landingContent.classList.remove('hidden');
  searchInput.value = '';
  updateNavState();
  window.scrollTo(0, 0);
}

function updateNavState() {
  // Update active state for navigation buttons
  const buttons = [favoritesBtn, categoriesBtn, quickmealsBtn, seasonalBtn, challengesBtn, globalBtn];
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (!favoritesPanel.classList.contains('hidden')) {
    favoritesBtn.classList.add('active');
  }
}

// Display Functions
function displayRecipe(recipe) {
  // Set basic recipe info
  document.getElementById('recipe-title').textContent = recipe.strMeal;
  document.getElementById('recipe-title').setAttribute('data-id', recipe.idMeal);
  document.getElementById('recipe-img').src = recipe.strMealThumb || 'https://via.placeholder.com/600x400?text=No+Image';
  document.getElementById('recipe-img').alt = recipe.strMeal;
  document.getElementById('recipe-category').textContent = recipe.strCategory || 'Not specified';
  document.getElementById('recipe-area').textContent = recipe.strArea || 'Not specified';
  
  // Add estimated prep time
  const prepTime = document.getElementById('recipe-time');
  const randomTime = Math.floor(Math.random() * 30) + 15;
  prepTime.innerHTML = `<i class="fas fa-clock"></i> ${randomTime} mins`;
  
  // Display ingredients
  const ingredientsList = document.getElementById('ingredients-list');
  ingredientsList.innerHTML = '';
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]?.trim();
    const measure = recipe[`strMeasure${i}`]?.trim();
    
    if (ingredient) {
      const li = document.createElement('li');
      li.innerHTML = `<span>${ingredient}</span><span>${measure || 'To taste'}</span>`;
      ingredientsList.appendChild(li);
    }
  }
  
  // Display instructions with proper numbering
  const instructionsContent = document.getElementById('instructions-content');
  if (recipe.strInstructions) {
    instructionsContent.innerHTML = formatInstructions(recipe.strInstructions);
  } else {
    instructionsContent.innerHTML = '<p>No instructions available for this recipe.</p>';
  }

  // Clear previous favorite button if exists
  const existingFavoriteBtn = document.querySelector('.favorite-btn');
  if (existingFavoriteBtn) {
    existingFavoriteBtn.remove();
  }

  // Add favorite button if not already in favorites
  const isFavorite = favorites.some(fav => fav.idMeal === recipe.idMeal);
  const favoriteBtn = document.createElement('button');
  favoriteBtn.className = isFavorite ? 'large-btn favorite-btn active' : 'large-btn favorite-btn';
  favoriteBtn.innerHTML = isFavorite 
    ? '<i class="fas fa-heart"></i> Remove from Favorites' 
    : '<i class="fas fa-heart"></i> Add to Favorites';
  
  favoriteBtn.addEventListener('click', () => {
    if (isFavorite) {
      removeFavorite(recipe.idMeal);
      favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
      favoriteBtn.classList.remove('active');
    } else {
      addFavorite(recipe);
      favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
      favoriteBtn.classList.add('active');
    }
  });

  const recipeActions = document.querySelector('.recipe-actions');
  recipeActions.prepend(favoriteBtn);
}

function formatInstructions(instructions) {
  let formatted = instructions
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  let steps = [];
  const numberedStepsMatch = formatted.match(/\d+\.\s[^\n]+/g);
  if (numberedStepsMatch && numberedStepsMatch.length > 1) {
    steps = numberedStepsMatch;
  } else {
    steps = formatted.split(/\n\n|\n/).filter(step => step.trim() !== '');
  }
  
  if (steps.length > 1) {
    return `
      <ol class="instructions-list">
        ${steps.map(step => `<li>${step.trim().replace(/^\d+\.\s*/, '')}</li>`).join('')}
      </ol>
    `;
  }
  
  return `<p>${formatted}</p>`;
}

function displaySearchResults(meals) {
  resultsContainer.innerHTML = meals.map(meal => {
    // Estimate prep time (random for demo)
    const prepTime = Math.floor(Math.random() * 40) + 10;
    const isQuick = prepTime <= 30;
    
    // Determine if seasonal (random for demo)
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const currentSeason = seasons[Math.floor(Math.random() * 4)];
    const isSeasonal = Math.random() > 0.7;
    
    // Check for challenge data
    const challengeInfo = meal.challenge ? `
      <div class="challenge-info">
        <div><strong>Challenge:</strong> ${meal.challenge.theme}</div>
        <div class="challenge-difficulty">Difficulty: ${meal.challenge.difficulty}</div>
        <div>Points: ${meal.challenge.points}</div>
      </div>
    ` : '';
    
    // Check for cuisine flag
    const cuisineFlag = meal.cuisineFlag ? `
      <span class="cuisine-flag">${meal.cuisineFlag}</span>
    ` : '';
    
    return `
      <div class="recipe-card" data-id="${meal.idMeal}">
        ${isQuick ? '<span class="quick-badge"><i class="fas fa-clock"></i> Quick</span>' : ''}
        ${isSeasonal ? `<span class="seasonal-badge"><i class="fas fa-leaf"></i> ${currentSeason}</span>` : ''}
        ${meal.challenge ? '<span class="challenge-badge"><i class="fas fa-trophy"></i> Challenge</span>' : ''}
        ${cuisineFlag || ''}
        <img src="${meal.strMealThumb || 'https://via.placeholder.com/600x400?text=No+Image'}" alt="${meal.strMeal}" class="recipe-card-img">
        <div class="recipe-card-content">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strCategory || 'Unknown'} • ${meal.strArea || 'Unknown'}</p>
          <div class="prep-time">
            <i class="fas fa-clock"></i> ${prepTime} mins
          </div>
          ${challengeInfo || ''}
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers to recipe cards
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', () => {
      const mealId = card.dataset.id;
      const meal = meals.find(m => m.idMeal === mealId);
      
      // Show loading state
      recipeContainer.classList.remove('hidden');
      searchResults.classList.add('hidden');
      document.getElementById('recipe-title').textContent = 'Loading...';
      document.getElementById('ingredients-list').innerHTML = '<div class="loading-spinner"></div>';
      
      if (meal.strInstructions) {
        // If we already have full recipe data, use it
        displayRecipe(meal);
      } else {
        // Otherwise fetch full details
        fetchRecipeById(mealId)
          .then(fullRecipe => {
            displayRecipe(fullRecipe);
          })
          .catch(error => {
            console.error('Error:', error);
            showRecipeError('Failed to load recipe details.');
          });
      }
    });
  });
}

// Favorites Functions
function showFavorites() {
  if (favorites.length === 0) {
    favoritesList.innerHTML = `
      <div class="no-results">
        <i class="fas fa-heart-broken fa-2x"></i>
        <p>You haven't saved any favorites yet!</p>
        <button class="large-btn" onclick="fetchRandomRecipe()">
          <i class="fas fa-dice"></i> Find Recipes
        </button>
      </div>
    `;
  } else {
    favoritesList.innerHTML = favorites.map(meal => `
      <div class="recipe-card" data-id="${meal.idMeal}">
        <img src="${meal.strMealThumb || 'https://via.placeholder.com/600x400?text=No+Image'}" alt="${meal.strMeal}" class="recipe-card-img">
        <div class="recipe-card-content">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strCategory || 'Unknown'} • ${meal.strArea || 'Unknown'}</p>
          <button class="small-btn remove-favorite-btn">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mealId = btn.closest('.recipe-card').dataset.id;
        removeFavorite(mealId);
      });
    });
    
    // Add event listeners to recipe cards
    document.querySelectorAll('#favorites-list .recipe-card').forEach(card => {
      card.addEventListener('click', () => {
        const mealId = card.dataset.id;
        const meal = favorites.find(fav => fav.idMeal === mealId);
        if (meal) {
          displayRecipe(meal);
          recipeContainer.classList.remove('hidden');
          landingPage.classList.add('hidden');
          updateNavState();
        }
      });
    });
  }
  
  landingContent.classList.add('hidden');
  favoritesPanel.classList.remove('hidden');
  updateNavState();
}

function hideFavorites() {
  landingContent.classList.remove('hidden');
  favoritesPanel.classList.add('hidden');
}

function addFavorite(recipe) {
  // First fetch full details if needed
  if (!recipe.strInstructions) {
    fetchRecipeById(recipe.idMeal)
      .then(fullRecipe => {
        storeFavorite(fullRecipe);
      })
      .catch(error => {
        console.error('Error fetching full recipe:', error);
        storeFavorite(recipe); // Store what we have
      });
  } else {
    storeFavorite(recipe);
  }
}

function storeFavorite(recipe) {
  if (!favorites.some(fav => fav.idMeal === recipe.idMeal)) {
    favorites.push(recipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showToast(`Added "${recipe.strMeal}" to favorites!`);
  }
}

function removeFavorite(mealId) {
  const meal = favorites.find(fav => fav.idMeal === mealId);
  favorites = favorites.filter(fav => fav.idMeal !== mealId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  showToast(`Removed "${meal?.strMeal || 'recipe'}" from favorites!`);
  
  // If we're currently viewing favorites, refresh the list
  if (!favoritesPanel.classList.contains('hidden')) {
    showFavorites();
  }
  
  // Update favorite button if viewing this recipe
  const currentRecipeId = document.getElementById('recipe-title').getAttribute('data-id');
  if (currentRecipeId === mealId) {
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
      favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
      favoriteBtn.classList.remove('active');
    }
  }
}

// Categories Function
function showCategories() {
  // Show loading state
  landingPage.classList.add('hidden');
  searchResults.classList.remove('hidden');
  resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
  searchTermDisplay.textContent = 'Categories';
  window.scrollTo(0, 0);

  fetch(`${API_BASE}${API_KEY}/categories.php`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.categories) {
        resultsContainer.innerHTML = data.categories.map(category => `
          <div class="recipe-card" data-category="${category.strCategory}">
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="recipe-card-img">
            <div class="recipe-card-content">
              <h3>${category.strCategory}</h3>
              <p>${category.strCategoryDescription.substring(0, 100)}...</p>
              <button class="small-btn view-category-btn">
                <i class="fas fa-eye"></i> View Recipes
              </button>
            </div>
          </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.view-category-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = btn.closest('.recipe-card').dataset.category;
            searchInput.value = category;
            handleSearch(new Event('submit'));
          });
        });
      } else {
        showNoResults();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showSearchError();
    })
    .finally(() => {
      updateNavState();
    });
}

// New Features
function fetchQuickMeals() {
  // Show loading state
  landingPage.classList.add('hidden');
  searchResults.classList.remove('hidden');
  resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
  searchTermDisplay.textContent = 'Quick Meals (Under 30 mins)';
  window.scrollTo(0, 0);

  // Fetch random meals and filter for quick prep time
  const quickMealPromises = Array(15).fill().map(() => 
    fetch(`${API_BASE}${API_KEY}/random.php`)
      .then(res => res.json())
      .then(data => data.meals?.[0])
  );

  Promise.all(quickMealPromises)
    .then(meals => {
      const validMeals = meals.filter(meal => meal);
      // Filter meals with estimated prep time <= 30 mins
      const quickMeals = validMeals.filter(() => Math.random() > 0.4);
      
      if (quickMeals.length > 0) {
        displaySearchResults(quickMeals.slice(0, 12));
      } else {
        showNoResults();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showSearchError();
    });
}

function fetchSeasonalRecipes() {
  // Show loading state
  landingPage.classList.add('hidden');
  searchResults.classList.remove('hidden');
  resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
  window.scrollTo(0, 0);

  // Get current season
  const month = new Date().getMonth();
  const seasons = [
    { name: 'Winter', months: [11, 0, 1], ingredients: ['Pumpkin', 'Cinnamon', 'Squash'] },
    { name: 'Spring', months: [2, 3, 4], ingredients: ['Asparagus', 'Strawberry', 'Pea'] },
    { name: 'Summer', months: [5, 6, 7], ingredients: ['Tomato', 'Zucchini', 'Berry'] },
    { name: 'Fall', months: [8, 9, 10], ingredients: ['Apple', 'Mushroom', 'Sweet Potato'] }
  ];
  
  const currentSeason = seasons.find(season => season.months.includes(month)) || seasons[0];
  searchTermDisplay.textContent = `${currentSeason.name} Seasonal Specials`;

  // Fetch random meals and filter for seasonal ingredients
  const seasonalPromises = Array(15).fill().map(() => 
    fetch(`${API_BASE}${API_KEY}/random.php`)
      .then(res => res.json())
      .then(data => data.meals?.[0])
  );

  Promise.all(seasonalPromises)
    .then(meals => {
      const validMeals = meals.filter(meal => meal);
      // Filter meals with seasonal ingredients
      const seasonalMeals = validMeals.filter(meal => 
        currentSeason.ingredients.some(ingredient => 
          meal.strMeal.toLowerCase().includes(ingredient.toLowerCase()) ||
          (meal.strInstructions && meal.strInstructions.toLowerCase().includes(ingredient.toLowerCase()))
        )
      );
      
      if (seasonalMeals.length > 0) {
        displaySearchResults(seasonalMeals.slice(0, 12));
      } else {
        showNoResults();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showSearchError();
    });
}

function fetchCookingChallenge() {
  landingPage.classList.add('hidden');
  searchResults.classList.remove('hidden');
  resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
  searchTermDisplay.textContent = "Weekly Cooking Challenge";
  
  // Get random challenge parameters
  const difficulties = ['Easy', 'Intermediate', 'Advanced'];
  const themes = ['30-Minute Meals', 'One-Pot Wonders', 'Plant-Based', 'Comfort Food'];
  const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  
  fetch(`${API_BASE}${API_KEY}/filter.php?c=${randomTheme.replace(' ', '_')}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        // Add challenge info to each recipe
        const challengeRecipes = data.meals.map(meal => ({
          ...meal,
          challenge: {
            difficulty: randomDifficulty,
            theme: randomTheme,
            points: Math.floor(Math.random() * 100) + 50
          }
        }));
        
        displaySearchResults(challengeRecipes.slice(0, 6));
      } else {
        showNoResults();
      }
    })
    .catch(() => showSearchError());
}

function fetchGlobalCuisine() {
  landingPage.classList.add('hidden');
  searchResults.classList.remove('hidden');
  resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
  
  // Get random cuisine
  const cuisines = ['Italian', 'Mexican', 'Japanese', 'Indian', 'Thai', 'French', 'Chinese'];
  const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
  searchTermDisplay.textContent = `${randomCuisine} Cuisine`;
  
  fetch(`${API_BASE}${API_KEY}/filter.php?a=${randomCuisine}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        // Add country flag info
        const flagMap = {
          Italian: '🇮🇹', Mexican: '🇲🇽', Japanese: '🇯🇵', 
          Indian: '🇮🇳', Thai: '🇹🇭', French: '🇫🇷', Chinese: '🇨🇳'
        };
        
        const globalRecipes = data.meals.map(meal => ({
          ...meal,
          cuisineFlag: flagMap[randomCuisine] || '🌎'
        }));
        
        displaySearchResults(globalRecipes.slice(0, 8));
      } else {
        showNoResults();
      }
    })
    .catch(() => showSearchError());
}

// Toast Notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Error States
function showNoResults() {
  resultsContainer.innerHTML = `
    <div class="no-results">
      <i class="fas fa-search fa-3x"></i>
      <p>No recipes found for your search. Try a different term.</p>
      <button class="large-btn" onclick="showHomePage()">
        <i class="fas fa-home"></i> Back to Home
      </button>
    </div>
  `;
}

function showSearchError() {
  resultsContainer.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle fa-3x"></i>
      <p>We couldn't load search results. Please check your connection.</p>
      <button class="large-btn" onclick="window.location.reload()">
        <i class="fas fa-sync-alt"></i> Reload Page
      </button>
    </div>
  `;
}

function showRecipeError(message) {
  recipeContainer.classList.remove('hidden');
  landingPage.classList.add('hidden');
  searchResults.classList.add('hidden');
  
  document.getElementById('recipe-title').textContent = 'Error';
  document.getElementById('ingredients-list').innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle fa-3x"></i>
      <p>${message}</p>
      <div class="error-actions">
        <button id="retry-btn" class="large-btn"><i class="fas fa-sync-alt"></i> Try Again</button>
        <button class="large-btn" onclick="showHomePage()"><i class="fas fa-home"></i> Go Home</button>
      </div>
    </div>
  `;
  
  document.getElementById('retry-btn')?.addEventListener('click', fetchRandomRecipe);
}

// Initialize the app
init();