import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
export const MealAPI = {
  searchMealsByName: async (query: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals:", error);
      return [];
    }
  },
  getMealById: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error fetching meal by ID:", error);
      return null;
    }
  },
  getRandomMeal: async () => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error fetching random meal:", error);
      return null;
    }
  },
  getRandomMeals: async (count = 6) => {
    try {
      const mealPromises = Array.from({ length: count }, () =>
        MealAPI.getRandomMeal(),
      );
      const meals = await Promise.all(mealPromises);
      return meals.filter((meal) => meal !== null);
    } catch (error) {
      console.error("Error fetching random meals:", error);
      return [];
    }
  },
  getMealsByCategory: async (category: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals by category:", error);
      return [];
    }
  },
  filterByIngredient: async (ingredient: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`,
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering meals by ingredient:", error);
      return [];
    }
  },
  filterByCategory: async (category: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering meals by category:", error);
      return [];
    }
  },
  transformMealData: (meal: any) => {
    if (!meal) return null;

    // extract ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        const measureText = measure ? measure.trim() : "";
        ingredients.push(
          measureText
            ? `${measureText}${ingredient.trim()}`
            : ingredient.trim(),
        );
      }
    }

    //extract instructions and split into steps
    const instructions = meal.strInstructions
      ? meal.strInstructions
          .split("\r\n")
          .filter((step: string) => step.trim() !== "")
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      descrition: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from TheMealDB",
      image: meal.strMealThumb,
      cookTime: "30 mins",
      servings: "4",
      category: meal.strCategory || "Main Course",
      area: meal.strArea || "Unknown",
      ingredients,
      instructions,
      originalData: meal,
    };
  },
};
