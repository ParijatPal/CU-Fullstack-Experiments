// Sample product data
const products = [
  { name: "Smartphone", category: "electronics" },
  { name: "Laptop", category: "electronics" },
  { name: "Wireless Earbuds", category: "electronics" },
  { name: "T-Shirt", category: "clothing" },
  { name: "Jeans", category: "clothing" },
  { name: "Hoodie", category: "clothing" },
  { name: "Novel", category: "books" },
  { name: "Notebook", category: "books" },
  { name: "Comics", category: "books" },
];

// DOM references
const categorySelect = document.getElementById("category");
const productList = document.getElementById("productList");

// Render products to the grid
function displayProducts(filterCategory = "all") {
  productList.innerHTML = "";

  const filtered = filterCategory === "all"
    ? products
    : products.filter(p => p.category === filterCategory);

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "product";
    empty.innerHTML = `<div class="name">No products found</div>`;
    productList.appendChild(empty);
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "product";
    card.innerHTML = `
      <div class="name">${p.name}</div>
      <div class="tag">${p.category}</div>
    `;
    productList.appendChild(card);
  });
}

// Events
categorySelect.addEventListener("change", () => {
  displayProducts(categorySelect.value);
});

// Initial render
displayProducts("all");
