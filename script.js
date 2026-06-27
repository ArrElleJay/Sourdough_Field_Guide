const ratios = [
  { level: "Super Sour", ratio: "1:1:1", starter: 1, flour: 1, water: 1, peak: "3 to 5 hours", flavor: "Tangy, sharp, acidic" },
  { level: "Mid Sour", ratio: "1:2:2", starter: 1, flour: 2, water: 2, peak: "4 to 6 hours", flavor: "Tangy but balanced" },
  { level: "Kinda Sour", ratio: "1:3:3", starter: 1, flour: 3, water: 3, peak: "6 to 8 hours", flavor: "Mild, yogurty" },
  { level: "Barely Sour", ratio: "1:5:5", starter: 1, flour: 5, water: 5, peak: "8 to 11 hours", flavor: "Very mild, almost sweet" },
  { level: "Not Sour", ratio: "1:10:10", starter: 1, flour: 10, water: 10, peak: "12 to 16 hours", flavor: "Sweet, milky, no sourness" }
];

const recipes = window.SFG_RECIPES || [];

const troubles = [
  ["Starter is not peaking", "Check temperature first. If the room is cool, it may simply need more time. If it is sluggish for days, use a smaller feed like 1:1:1 for a few cycles before asking it to do marathon work."],
  ["Bread is too sour", "Use a higher feed ratio, shorten the time between peak and mixing, and avoid long warm fermentation. A 1:5:5 or 1:10:10 feed will usually taste milder than 1:1:1."],
  ["Bread is not sour enough", "Use a lower feed ratio, mix closer to or just after peak, and consider a longer cold proof. Do not change everything at once unless you enjoy not knowing what fixed it."],
  ["Dough is too sticky", "Wet hands before folding. Avoid dumping in flour unless the dough is truly unmanageable. High hydration, warm dough, and weak flour all increase stickiness."],
  ["Dense loaf", "Most likely under-fermented, underproofed, or shaped without enough tension. Use the dough, not the clock, as the source of truth."],
  ["Dry chewy bagels", "Increase water for rye, cocoa, or whole grain formulas. Shorten boil time if the crust is too tough. Do not over-knead high-gluten dough."],
  ["Hard crust", "Use steam during the covered bake. A few ice cubes in the Dutch oven can help keep the crust thinner and improve oven spring."],
  ["Add-ins changed everything", "They do that. Sugars and fruit can speed fermentation. Cinnamon, garlic, fat, and eggs can slow it down. Cocoa, rye, seeds, and whole grains absorb more water."],
];

function roundGram(value) { return `${Math.round(value)}g`; }
function selectedRatio() { return ratios.find(r => r.level === document.getElementById('sournessLevel').value) || ratios[2]; }
function updateCalculator() {
  const needed = Number(document.getElementById('starterNeeded').value) || 0;
  const leftover = Number(document.getElementById('leftoverAmount').value) || 0;
  const total = needed + leftover;
  const r = selectedRatio();
  const parts = r.starter + r.flour + r.water;
  const seed = total / parts;
  const flour = seed * r.flour;
  const water = seed * r.water;
  const actual = Math.round(seed) + Math.round(flour) + Math.round(water);
  document.getElementById('seedStarter').textContent = roundGram(seed);
  document.getElementById('feedFlour').textContent = roundGram(flour);
  document.getElementById('feedWater').textContent = roundGram(water);
  document.getElementById('totalMade').textContent = `${actual}g`;
  document.getElementById('ratioLabel').textContent = `${r.level}: ${r.ratio}`;
  document.getElementById('peakWindow').textContent = `Peak estimate: ${r.peak}`;
}
function buildCalculator() {
  const select = document.getElementById('sournessLevel');
  ratios.forEach(r => {
    const option = document.createElement('option');
    option.value = r.level; option.textContent = `${r.level} (${r.ratio})`;
    if (r.level === 'Kinda Sour') option.selected = true;
    select.appendChild(option);
  });
  ['starterNeeded','leftoverAmount','sournessLevel'].forEach(id => document.getElementById(id).addEventListener('input', updateCalculator));
  updateCalculator();
}
function buildRatioTable(){
  const tbody = document.getElementById('ratioTable');
  ratios.forEach(r => { tbody.insertAdjacentHTML('beforeend', `<tr><td>${r.level}</td><td>${r.ratio}</td><td>${r.peak}</td><td>${r.flavor}</td></tr>`); });
}
function ingredientTable(items){ return `<table class="ingredient-table"><thead><tr><th>Amount</th><th>Ingredient</th></tr></thead><tbody>${items.map(i=>`<tr><td>${i[0]}</td><td>${i[1]}</td></tr>`).join('')}</tbody></table>`; }
function renderRecipe(index){
  const r = recipes[index];
  document.querySelectorAll('.recipe-button').forEach((b,i)=>b.classList.toggle('active', i===index));
  document.getElementById('recipeDetail').innerHTML = `
    <h2>${r.title}</h2>
    <p class="recipe-meta">${r.meta}</p>
    <div class="recipe-actions">
      <button class="ghost-button" type="button" id="toggleCard">Show recipe card version</button>
      <button class="ghost-button" type="button" onclick="window.print()">Print recipe</button>
    </div>
    <div class="recipe-sections">
      <section>${ingredientTable(r.ingredients)}</section>
      <section class="full-only"><h3>Instructions</h3><ol class="steps">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol></section>
      <section class="card-only"><h3>Recipe card version</h3><ol class="steps">${r.card.map(s=>`<li>${s}</li>`).join('')}</ol></section>
      <section class="notes"><strong>Notes:</strong> ${r.notes}</section>
    </div>`;
  document.body.classList.remove('recipe-card-mode');
  document.getElementById('toggleCard').addEventListener('click', () => {
    document.body.classList.toggle('recipe-card-mode');
    document.getElementById('toggleCard').textContent = document.body.classList.contains('recipe-card-mode') ? 'Show full version' : 'Show recipe card version';
  });
}
function buildRecipes(){
  const list = document.getElementById('recipeList');
  recipes.forEach((r,i)=>{
    const btn = document.createElement('button');
    btn.className = 'recipe-button'; btn.type = 'button'; btn.textContent = r.title;
    btn.addEventListener('click',()=>renderRecipe(i));
    list.appendChild(btn);
  });
  renderRecipe(0);
}
function buildTroubleshooting(){
  const list = document.getElementById('troubleshootingList');
  troubles.forEach(([title,body])=>{
    const item = document.createElement('article'); item.className='trouble-item';
    item.innerHTML = `<button type="button">${title}</button><div>${body}</div>`;
    item.querySelector('button').addEventListener('click',()=>item.classList.toggle('open'));
    list.appendChild(item);
  });
}
function setupNav(){
  const toggle=document.querySelector('.nav-toggle'); const nav=document.querySelector('.site-nav');
  toggle.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); toggle.setAttribute('aria-expanded',open); });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false');}));
}

document.addEventListener('DOMContentLoaded',()=>{ setupNav(); buildCalculator(); buildRatioTable(); buildRecipes(); buildTroubleshooting(); });
