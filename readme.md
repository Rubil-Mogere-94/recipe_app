# 🍳 Recipe Finder - Your Culinary Discovery App  
**Find, save, and explore a world of delicious recipes** — all in one place. Recipe Finder is your smart kitchen companion, powered by [TheMealDB API](https://www.themealdb.com/), designed to make cooking fun, easy, and inspiring.

## 🚀 Live Demo  
[![Vercel](https://img.shields.io/badge/Vercel-Live_Demo-black?style=for-the-badge&logo=vercel)](https://recipe-app-kappa-flax.vercel.app/)  
Try it out live and start your next cooking adventure!

---

## 🌟 What You Can Do

### 🔍 Core Features  
| Feature            | What it Does                                                | Icon       |
|--------------------|-------------------------------------------------------------|------------|
| **Smart Search**   | Quickly find recipes by ingredient, dish name, or cuisine   | 🔎         |
| **Detailed Recipes** | Full instructions, ingredients, and measurements         | 📝         |
| **Favorites**      | Save your favorite meals — even after closing the browser   | ❤️         |
| **Dark/Light Mode** | Toggle between themes with preferences saved automatically | 🌙 / ☀️    |

### 🎁 Discover More  
| Feature              | Icon | Description                                      |
|----------------------|------|--------------------------------------------------|
| **Surprise Me**      | 🎲   | Get a random recipe when you're feeling lucky    |
| **Quick Meals**      | ⚡   | Find recipes ready in under 30 minutes           |
| **Seasonal Picks**   | 🍃   | Enjoy recipes using fresh seasonal ingredients   |
| **Weekly Challenges**| 🏆   | Try themed cooking challenges                    |
| **World Flavors**    | 🌎   | Explore international dishes and cuisines        |

---

## 🛠️ Tech Stack  
- **Frontend:** HTML5, CSS3 (Glassmorphism UI), JavaScript (ES6+)  
- **API:** [TheMealDB](https://www.themealdb.com/)  
- **Storage:** LocalStorage for favorite persistence  
- **Design:** Mobile-first, responsive, dark/light mode support

---

## 🏁 Getting Started

### Requirements  
```bash
- Modern web browser (Chrome, Firefox, Safari, etc.)
- Internet connection (for API access)
````

### Installation

```bash
git clone git@github.com:Rubil-Mogere-94/recipe_app.git
cd recipe_app
```

### How to Use

1. Open `index.html` in your browser
2. Start searching for recipes
3. Save favorites using the ❤️ button
4. Toggle between dark and light mode using the moon/sun icon

---

## 🧭 Navigation Tips

| Action            | Icon/Button | Location           |
| ----------------- | ----------- | ------------------ |
| Go Back           | ←           | Top-left corner    |
| View Favorites    | ❤️          | Home screen        |
| Random Recipe     | 🎲          | Recipe detail view |
| Browse Categories | 🍽️         | Home screen menu   |

---

## 🏷️ What the Icons Mean

| Icon        | Meaning                    |
| ----------- | -------------------------- |
| ⚡           | Quick meal (under 30 mins) |
| 🍃          | Seasonal ingredients       |
| 🏆          | Cooking challenge          |
| 🇮🇹        | Country of origin          |
| ❤️ (filled) | Already in favorites       |

---

## 📱 Responsive by Design

* Mobile-first layout
* Adaptive grid systems
* Touch-friendly controls
* Optimized for all screen sizes

---

## 🌐 API Integration

Example API call using fetch:

```javascript
fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
  .then(res => res.json())
  .then(data => displayResults(data.meals));
```

---

## 📜 License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for more information.

---

## 🙏 Acknowledgments

* [TheMealDB](https://www.themealdb.com/) for recipe data
* Font Awesome for beautiful icons
* Google Fonts (Inter) for clean typography

---

**Bon Appétit!** 👨‍🍳👩‍🍳
Made with ❤️ by food lovers, for food lovers.
