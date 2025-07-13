let recipes = [];

// Load and parse CSV on page load using PapaParse
window.onload = () => {
  Papa.parse("drinks.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      // Convert ingredients string to array
      recipes = results.data.map(drink => ({
        name: drink.name,
        ingredients: drink.ingredients.split(',').map(i => i.trim().toLowerCase()),
        instructions: drink.instructions
      }));
    }
  });
};

function suggestDrink() {
  const input = document.getElementById("ingredientsInput").value.toLowerCase();
  const userIngredients = input.split(',').map(i => i.trim()).filter(i => i);

  if (userIngredients.length === 0) {
    alert("Please enter some ingredients!");
    return;
  }

  const matches = [];

  recipes.forEach(recipe => {
    const matchCount = recipe.ingredients.filter(i => userIngredients.includes(i)).length;
    if (matchCount > 0) {
      const matchPercent = matchCount / recipe.ingredients.length;
      matches.push({
        name: recipe.name,
        instructions: recipe.instructions,
        matchPercent,
        matchCount
      });
    }
  });

  matches.sort((a, b) => b.matchPercent - a.matchPercent);

  displayMatches(matches);
}

function displayMatches(matches) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (matches.length === 0) {
    resultDiv.innerText = "No matching drinks found. Try adding more ingredients!";
    return;
  }

  matches.forEach(drink => {
    const drinkDiv = document.createElement("div");
    drinkDiv.classList.add("drink");

    const name = document.createElement("h3");
    name.innerText = drink.name;
    name.style.cursor = "pointer";

    const instructions = document.createElement("p");
    instructions.innerText = drink.instructions;
    instructions.style.display = "none";
    instructions.style.marginLeft = "15px";

    name.addEventListener("click", () => {
      instructions.style.display = instructions.style.display === "none" ? "block" : "none";
    });

    drinkDiv.appendChild(name);

    // Show match percentage
    const matchInfo = document.createElement("small");
    matchInfo.innerText = `Match: ${(drink.matchPercent * 100).toFixed(0)}%`;
    matchInfo.style.display = "block";
    matchInfo.style.marginBottom = "10px";
    drinkDiv.appendChild(matchInfo);

    drinkDiv.appendChild(instructions);

    resultDiv.appendChild(drinkDiv);
  });

  resultDiv.style.display = "block";
}
