// ProductCard Component
function ProductCard({ name, price, image, description }) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${image}" alt="${name}">
    <div class="details">
      <h3>${name}</h3>
      <p>${description}</p>
      <p class="price">₹${price}</p>
      <button>Add to Cart</button>
    </div>
  `;

  // Button action
  card.querySelector("button").addEventListener("click", () => {
    alert(`${name} added to cart 🛒`);
  });

  return card;
}

// ✅ Add your own images here (either local or external URLs)
const products = [
  {
    name: "BMW M3 Model Car",
    price: 1500,
    image: "images/bmw.jpg", // 👈 your local image
    description: "A detailed die-cast BMW M3 collectible model."
  },
  {
    name: "Nike Air Sneakers",
    price: 4999,
    image: "images/shoes.jpg", // 👈 your local image
    description: "Stylish and comfortable everyday sneakers."
  },
  {
    name: "Sony Headphones",
    price: 2999,
    image: "images/headphones.jpg", // 👈 your local image
    description: "Noise-cancelling headphones with premium sound."
  }
];

// Render cards
const container = document.getElementById("product-container");
products.forEach(product => container.appendChild(ProductCard(product)));
