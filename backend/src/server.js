import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { eq, and } from "drizzle-orm";

const PORT = ENV.PORT || 5001;
const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipeId || !title || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json({
      message: "Favorite added successfully",
      favorite: newFavorite[0],
    });
  } catch (error) {
    console.log("Error adding favorite:", error);
    res.status(500).json({ error: error });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    const newFavorite = await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, recipeId),
        ),
      );

    res.status(201).json({
      message: "Favorite deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting favorite:", error);
    res.status(500).json({ error: error });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const newFavorite = await db
      .select()
      .from(favoritesTable)
      .where(and(eq(favoritesTable.userId, userId)));

    res.status(201).json({
      favorites: newFavorite,
    });
  } catch (error) {
    console.log("Error retrieving favorites:", error);
    res.status(500).json({ error: error });
  }
});
