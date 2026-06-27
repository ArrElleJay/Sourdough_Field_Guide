# The Sourdough Field Guide

Static site files for GitHub + Netlify.

## Files

- `index.html` controls the page structure.
- `styles.css` controls the layout, colors, print styling, and responsive behavior.
- `script.js` controls the calculator, recipe display, printing, and interaction.
- `recipes.js` contains the recipe text and ingredient data.
- `assets/` contains logo images.

## Editing recipes

Most routine recipe edits should happen in `recipes.js`.

Each recipe has this structure:

```js
{
  title: "Recipe title",
  meta: "Servings | bake temp | timing",
  ingredients: [["amount", "ingredient"]],
  steps: ["Full instruction step"],
  card: ["Short recipe card step"],
  notes: "Recipe note"
}
```

Change the text inside the quotes. Keep the commas, brackets, and quotes intact.

After editing in GitHub, click **Commit changes**. Netlify will redeploy the site automatically once the repo is connected.
