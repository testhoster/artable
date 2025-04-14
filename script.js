// Product data
const products = [
  {
    id: 1,
    name: "Colorful Soul - Art Album",
    price: 25,
     img: "images/art1.jpg",

    creator: "Riya",
    category: "Art",
    tags: ["album", "colorful", "painting"],
    rating: 4.7,
    stock: 12
  },
  {
    id: 2,
    name: "Handmade Clay Pot",
    price: 15,
    img: "images/art2.jpg",
    creator: "Amit",
    category: "Clay",
    tags: ["clay", "pottery", "handmade"],
    rating: 4.2,
    stock: 8
  },
  {
    id: 3,
    name: "Peaceful Minds - Digital Painting",
    price: 30,
    img: "images/art3.png",
    creator: "Sara",
    category: "Art",
    tags: ["digital", "painting", "peaceful"],
    rating: 4.9,
    stock: 5
  },
  {
    id: 4,
    name: "Jazz Vibes - Music Album",
    price: 20,
    img: "images/art4.jpg",
    creator: "Dev",
    category: "Music",
    tags: ["music", "jazz", "album"],
    rating: 4.5,
    stock: 15
  },
  {
    id: 5,
    name: "Nature Poetry Book",
    price: 18,
    img: "images/art5.webp",
    creator: "Anu",
    category: "Books",
    tags: ["book", "poetry", "nature"],
    rating: 4.3,
    stock: 20
  }
];

// Cart functionality
const cart = [];
let cartTotal = 0;

// User preferences
const userPrefs = {
  darkMode: localStorage.getItem('darkMode') === 'true' || false,
  currency: localStorage.getItem('currency') || 'USD',
  lastVisited: []
};

// Currency conversion rates (simplified)
const currencyRates = {
  'USD': 1,
  'EUR': 0.92,
  'GBP': 0.78,
  'INR': 83.5
};

// Currency symbols
const currencySymbols = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹'
};

// Convert price to selected currency
function convertPrice(priceUSD) {
  const rate = currencyRates[userPrefs.currency];
  return (priceUSD * rate).toFixed(2);
}

// Get currency symbol
function getCurrencySymbol() {
  return currencySymbols[userPrefs.currency];
}

// Display products based on filters
function displayProducts(filter = "", category = "", sort = "default") {
  const productSection = document.getElementById('products');
  if (!productSection) return;
  
  productSection.innerHTML = "";
  
  let filteredProducts = products.filter(product => {
    const matchesFilter = product.tags.some(tag => 
      tag.toLowerCase().includes(filter.toLowerCase())
    ) || 
    product.name.toLowerCase().includes(filter.toLowerCase()) ||
    product.creator.toLowerCase().includes(filter.toLowerCase());
    
    const matchesCategory = category === "" || product.category === category;
    
    return matchesFilter && matchesCategory;
  });
  
  // Sorting functionality
  switch(sort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  
  if (filteredProducts.length === 0) {
    productSection.innerHTML = '<p class="no-results">No products found matching your search.</p>';
    return;
  }
  
  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Create tags HTML
    const tagsHTML = product.tags.map(tag => 
      `<span class="tag" onclick="tagSearch('${tag}')">${tag}</span>`
    ).join('');
    
    // Create rating stars
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="star full">★</span>';
    }
    if (hasHalfStar) {
      starsHTML += '<span class="star half">★</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<span class="star empty">☆</span>';
    }
    
    // Stock indicator
    const stockClass = product.stock < 5 ? 'low-stock' : '';
    const stockText = product.stock < 5 ? `Only ${product.stock} left!` : `In stock (${product.stock})`;
    
    card.innerHTML = `
      <div class="card-image">
        <img src="${product.img}" alt="${product.name}">
        <div class="quick-view" onclick="showQuickView(${product.id})">Quick View</div>
      </div>
      <h3>${product.name}</h3>
      <div class="rating">${starsHTML} <span class="rating-value">(${product.rating})</span></div>
      <p><strong>By:</strong> ${product.creator}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <div class="product-tags">${tagsHTML}</div>
      <p><strong>Price:</strong> ${getCurrencySymbol()}${convertPrice(product.price)}</p>
      <p class="stock ${stockClass}">${stockText}</p>
      <div class="card-actions">
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">♡</button>
      </div>
    `;
    
    productSection.appendChild(card);
  });
}

// Quick view functionality
function showQuickView(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  // Track last visited products
  if (!userPrefs.lastVisited.includes(id)) {
    userPrefs.lastVisited.unshift(id);
    if (userPrefs.lastVisited.length > 5) {
      userPrefs.lastVisited.pop();
    }
    localStorage.setItem('lastVisited', JSON.stringify(userPrefs.lastVisited));
  }
  
  const modal = document.createElement('div');
  modal.className = 'quick-view-modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" onclick="this.parentElement.parentElement.remove()">×</span>
      <div class="modal-body">
        <div class="modal-image">
          <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="modal-details">
          <h2>${product.name}</h2>
          <p class="modal-creator">By ${product.creator}</p>
          <div class="modal-price">${getCurrencySymbol()}${convertPrice(product.price)}</div>
          <p>${generateProductDescription(product)}</p>
          <div class="quantity-selector">
            <button onclick="decrementQuantity('quick-view-qty')">-</button>
            <input type="number" id="quick-view-qty" value="1" min="1" max="${product.stock}">
            <button onclick="incrementQuantity('quick-view-qty', ${product.stock})">+</button>
          </div>
          <button class="add-to-cart-btn" onclick="addToCartWithQuantity(${product.id}, document.getElementById('quick-view-qty').value)">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Prevent scrolling of background
  document.body.style.overflow = 'hidden';
  
  // Allow closing by clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  });
}

// Generate a product description
function generateProductDescription(product) {
  // You could have actual descriptions in your database
  // This is just a placeholder generator
  const descriptions = {
    "Art": "A beautiful piece showcasing the artist's unique perspective and technique.",
    "Clay": "Hand-crafted with attention to detail and fine craftsmanship.",
    "Music": "A collection of original compositions that will move your soul.",
    "Books": "Words that paint pictures in your mind and touch your heart."
  };
  
  return descriptions[product.category] || "A wonderful product made with care and creativity.";
}

// Add quantity controls
function incrementQuantity(inputId, max) {
  const input = document.getElementById(inputId);
  const currentValue = parseInt(input.value);
  if (currentValue < max) {
    input.value = currentValue + 1;
  }
}

function decrementQuantity(inputId) {
  const input = document.getElementById(inputId);
  const currentValue = parseInt(input.value);
  if (currentValue > 1) {
    input.value = currentValue - 1;
  }
}

// Add to cart with quantity
function addToCartWithQuantity(id, quantity) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  const numQuantity = parseInt(quantity);
  if (isNaN(numQuantity) || numQuantity < 1) return;
  
  // Find if product already in cart
  const cartIndex = cart.findIndex(item => item.productId === id);
  
  if (cartIndex >= 0) {
    // Update quantity if already in cart
    cart[cartIndex].quantity += numQuantity;
  } else {
    // Add new item to cart
    cart.push({
      productId: id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: numQuantity
    });
  }
  
  updateCart();
  
  // Show feedback message
  showToast(`${product.name} (${numQuantity}) added to cart!`);
  
  // Close modal if it exists
  const modal = document.querySelector('.quick-view-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Add animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Basic add to cart (single quantity)
function addToCart(id) {
  addToCartWithQuantity(id, 1);
}

// Tag search functionality
function tagSearch(tag) {
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.value = tag;
    const category = document.getElementById('category-filter')?.value || "";
    displayProducts(tag, category);
  }
}

// Wishlist functionality
const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

function toggleWishlist(id) {
  const index = wishlist.indexOf(id);
  
  if (index >= 0) {
    // Remove from wishlist
    wishlist.splice(index, 1);
    showToast('Removed from wishlist');
  } else {
    // Add to wishlist
    wishlist.push(id);
    showToast('Added to wishlist');
  }
  
  // Update wishlist in local storage
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
  // Update wishlist button state
  updateWishlistButtons();
}

function updateWishlistButtons() {
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    const id = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
    if (wishlist.includes(id)) {
      btn.classList.add('active');
      btn.innerHTML = '♥';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '♡';
    }
  });
}

// Show wishlist
function showWishlist() {
  const productSection = document.getElementById('products');
  if (!productSection) return;
  
  productSection.innerHTML = "<h2>Your Wishlist</h2>";
  
  if (wishlist.length === 0) {
    productSection.innerHTML += '<p class="no-results">Your wishlist is empty</p>';
    return;
  }
  
  const wishlistProducts = products.filter(product => wishlist.includes(product.id));
  
  wishlistProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Create tags HTML
    const tagsHTML = product.tags.map(tag => 
      `<span class="tag" onclick="tagSearch('${tag}')">${tag}</span>`
    ).join('');
    
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p><strong>By:</strong> ${product.creator}</p>
      <p><strong>Price:</strong> ${getCurrencySymbol()}${convertPrice(product.price)}</p>
      <div class="product-tags">${tagsHTML}</div>
      <div class="card-actions">
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button class="wishlist-btn active" onclick="toggleWishlist(${product.id})">♥</button>
      </div>
    `;
    
    productSection.appendChild(card);
  });
}

// Update cart display and total
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const cartCount = document.getElementById('cart-count');
  
  if (!cartItems || !cartTotalElement) return;
  
  cartItems.innerHTML = "";
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<li>Your cart is empty</li>';
    cartTotalElement.textContent = `Total: ${getCurrencySymbol()}0.00`;
    checkoutBtn.disabled = true;
    cartCount.textContent = '0';
    return;
  }
  
  let total = 0;
  let itemCount = 0;
  
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemCount += item.quantity;
    
    li.innerHTML = `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <div class="cart-item-quantity">
            <button onclick="updateCartItemQuantity(${index}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartItemQuantity(${index}, ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          <span>${getCurrencySymbol()}${convertPrice(itemTotal)}</span>
          <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
        </div>
      </div>
    `;
    
    cartItems.appendChild(li);
  });
  
  cartTotalElement.textContent = `Total: ${getCurrencySymbol()}${convertPrice(total)}`;
  checkoutBtn.disabled = false;
  cartCount.textContent = itemCount.toString();
  
  // Enable cart saving
  saveCart();
}

// Update cart item quantity
function updateCartItemQuantity(index, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(index);
    return;
  }
  
  if (index >= 0 && index < cart.length) {
    cart[index].quantity = newQuantity;
    updateCart();
  }
}

// Remove item from cart
function removeFromCart(index) {
  const removed = cart.splice(index, 1);
  updateCart();
  
  if (removed.length > 0) {
    showToast(`${removed[0].name} removed from cart`);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart.length = 0; // Clear the cart
    const loadedCart = JSON.parse(savedCart);
    loadedCart.forEach(item => cart.push(item));
    updateCart();
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  userPrefs.darkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', userPrefs.darkMode);
}

// Change currency
function changeCurrency(currency) {
  if (currencyRates[currency]) {
    userPrefs.currency = currency;
    localStorage.setItem('currency', currency);
    
    // Update displayed products
    const filter = document.getElementById('search')?.value || "";
    const category = document.getElementById('category-filter')?.value || "";
    displayProducts(filter, category);
    
    // Update cart
    updateCart();
    
    showToast(`Currency changed to ${currency}`);
  }
}

// Show recently viewed products
function showRecentlyViewed() {
  const recentSection = document.getElementById('recently-viewed');
  if (!recentSection) return;
  
  recentSection.innerHTML = "";
  
  if (!userPrefs.lastVisited || userPrefs.lastVisited.length === 0) {
    recentSection.style.display = 'none';
    return;
  }
  
  recentSection.style.display = 'block';
  recentSection.innerHTML = "<h2>Recently Viewed</h2><div class='recent-items'></div>";
  const recentItems = recentSection.querySelector('.recent-items');
  
  userPrefs.lastVisited.forEach(id => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const card = document.createElement('div');
    card.className = 'recent-item';
    
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" onclick="showQuickView(${product.id})">
      <h4>${product.name}</h4>
      <p>${getCurrencySymbol()}${convertPrice(product.price)}</p>
    `;
    
    recentItems.appendChild(card);
  });
}

// Checkout functionality
function checkout() {
  if (cart.length === 0) return;
  
  const modal = document.createElement('div');
  modal.className = 'checkout-modal';
  
  let cartItemsHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    cartItemsHTML += `
      <div class="checkout-item">
        <span>${item.name} × ${item.quantity}</span>
        <span>${getCurrencySymbol()}${convertPrice(itemTotal)}</span>
      </div>
    `;
  });
  
  modal.innerHTML = `
    <div class="modal-content checkout">
      <span class="close-modal" onclick="this.parentElement.parentElement.remove()">×</span>
      <h2>Checkout</h2>
      
      <div class="checkout-steps">
        <div class="step active" data-step="cart">1. Review Cart</div>
        <div class="step" data-step="shipping">2. Shipping</div>
        <div class="step" data-step="payment">3. Payment</div>
        <div class="step" data-step="confirmation">4. Confirmation</div>
      </div>
      
      <div class="checkout-step-content active" id="step-cart">
        <div class="checkout-items">
          ${cartItemsHTML}
        </div>
        <div class="checkout-total">
          <span>Total:</span>
          <span>${getCurrencySymbol()}${convertPrice(total)}</span>
        </div>
        <button onclick="showCheckoutStep('shipping')">Continue to Shipping</button>
      </div>
      
      <div class="checkout-step-content" id="step-shipping">
        <h3>Shipping Information</h3>
        <form id="shipping-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input type="text" id="address" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="city">City</label>
              <input type="text" id="city" required>
            </div>
            <div class="form-group">
              <label for="zip">ZIP Code</label>
              <input type="text" id="zip" required>
            </div>
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <select id="country" required>
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="IN">India</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" onclick="showCheckoutStep('cart')">Back</button>
            <button type="button" onclick="validateShippingAndContinue()">Continue to Payment</button>
          </div>
        </form>
      </div>
      
      <div class="checkout-step-content" id="step-payment">
        <h3>Payment Information</h3>
        <form id="payment-form">
          <div class="form-group">
            <label for="card-number">Card Number</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="expiry">Expiry Date</label>
              <input type="text" id="expiry" placeholder="MM/YY" required>
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" placeholder="123" required>
            </div>
          </div>
          <div class="form-group">
            <label for="card-name">Name on Card</label>
            <input type="text" id="card-name" required>
          </div>
          <div class="form-actions">
            <button type="button" onclick="showCheckoutStep('shipping')">Back</button>
            <button type="button" onclick="validatePaymentAndContinue()">Complete Order</button>
          </div>
        </form>
      </div>
      
      <div class="checkout-step-content" id="step-confirmation">
        <div class="confirmation-message">
          <h3>Order Confirmed!</h3>
          <p>Your order has been placed successfully.</p>
          <p>Order #: <strong>${generateOrderNumber()}</strong></p>
          <p>You will receive a confirmation email shortly.</p>
          <button onclick="completeCheckout()">Continue Shopping</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

// Generate random order number
function generateOrderNumber() {
  return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
}

// Show checkout step
function showCheckoutStep(step) {
  const steps = document.querySelectorAll('.checkout-steps .step');
  const contents = document.querySelectorAll('.checkout-step-content');
  
  // Remove active class from all steps and contents
  steps.forEach(s => s.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));
  
  // Add active class to current step and content
  document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
  document.getElementById(`step-${step}`).classList.add('active');
}

// Validate shipping form
function validateShippingAndContinue() {
  const form = document.getElementById('shipping-form');
  if (form.checkValidity()) {
    showCheckoutStep('payment');
  } else {
    form.reportValidity();
  }
}

// Validate payment form
function validatePaymentAndContinue() {
  const form = document.getElementById('payment-form');
  if (form.checkValidity()) {
    showCheckoutStep('confirmation');
  } else {
    form.reportValidity();
  }
}

// Complete checkout process
function completeCheckout() {
  // Clear cart
  cart.length = 0;
  saveCart();
  updateCart();
  
  // Close modal
  const modal = document.querySelector('.checkout-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
  
  // Show success message
  showToast('Order completed successfully!');
}

// Handle contact form submission
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const msgStatus = document.getElementById("msg-status");
  
  msgStatus.textContent = "Sending message...";
  
  // Simulate sending message to server
  setTimeout(() => {
    msgStatus.textContent = "Message sent! Thank you.";
    this.reset();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      msgStatus.textContent = "";
    }, 5000);
  }, 1000);
});

// Initialize functionality
document.addEventListener('DOMContentLoaded', function() {
  // Apply dark mode if enabled
  if (userPrefs.darkMode) {
    document.body.classList.add('dark-mode');
  }
  
  // Load saved cart
  loadCart();
  
  // Load last visited products
  try {
    userPrefs.lastVisited = JSON.parse(localStorage.getItem('lastVisited') || '[]');
    showRecentlyViewed();
  } catch (e) {
    console.error('Failed to load recently viewed products', e);
    userPrefs.lastVisited = [];
  }
  
  // Initial display of products
  displayProducts();
  
  // Set up search input listener
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      const category = document.getElementById('category-filter')?.value || "";
      const sort = document.getElementById('sort-options')?.value || "default";
      displayProducts(this.value, category, sort);
    });
  }
  
  // Set up category filter listener
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener("change", function() {
      const filter = document.getElementById('search')?.value || "";
      const sort = document.getElementById('sort-options')?.value || "default";
      displayProducts(filter, this.value, sort);
    });
  }
  
  // Set up sort options listener
  const sortOptions = document.getElementById('sort-options');
  if (sortOptions) {
    sortOptions.addEventListener("change", function() {
      const filter = document.getElementById('search')?.value || "";
      const category = document.getElementById('category-filter')?.value || "";
      displayProducts(filter, category, this.value);
    });
  }
  
  // Update wishlist button states
  updateWishlistButtons();
  
  // Add currency switcher to page
  const currencySwitcher = document.createElement('div');
  currencySwitcher.className = 'currency-switcher';
  currencySwitcher.innerHTML = `
    <select id="currency-select">
      <option value="USD" ${userPrefs.currency === 'USD' ? 'selected' : ''}>$ USD</option>
      <option value="EUR" ${userPrefs.currency === 'EUR' ? 'selected' : ''}>€ EUR</option>
      <option value="GBP" ${userPrefs.currency === 'GBP' ? 'selected' : ''}>£ GBP</option>
      <option value="INR" ${userPrefs.currency === 'INR' ? 'selected' : ''}>₹ INR</option>
    </select>
  `;
  
  const headerSection = document.querySelector('header');
  if (headerSection) {
    headerSection.appendChild(currencySwitcher);
  }
  
  // Add currency change listener
  document.getElementById('currency-select')?.addEventListener('change', function() {
    changeCurrency(this.value);
  });
  
  // Add dark mode toggle
  const darkModeToggle = document.createElement('button');
  darkModeToggle.className = 'dark-mode-toggle';
  darkModeToggle.innerHTML = userPrefs.darkMode ? '☀️' : '🌙';
  darkModeToggle.setAttribute('title', userPrefs.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  darkModeToggle.onclick = function() {
    toggleDarkMode();
  this.innerHTML = userPrefs.darkMode ? '☀️' : '🌙';
    this.setAttribute('title', userPrefs.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  };
  
  if (headerSection) {
    headerSection.appendChild(darkModeToggle);
  }
  
  // Add cart indicator with count
  const cartButton = document.querySelector('.cart-toggle');
  if (cartButton) {
    const cartCount = document.createElement('span');
    cartCount.id = 'cart-count';
    cartCount.className = 'cart-count';
    cartCount.textContent = '0';
    cartButton.appendChild(cartCount);
  }
  
  // Add wishlist button to navigation
  const nav = document.querySelector('nav ul');
  if (nav) {
    const wishlistItem = document.createElement('li');
    wishlistItem.innerHTML = '<a href="#" onclick="showWishlist(); return false;">Wishlist</a>';
    nav.appendChild(wishlistItem);
  }
  
  // Add product comparison feature
  setupComparisonFeature();
});

// Product comparison functionality
const compareList = [];

function setupComparisonFeature() {
  // Add compare buttons to products
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const productId = parseInt(card.querySelector('button').getAttribute('onclick').match(/\d+/)[0]);
    
    const compareBtn = document.createElement('button');
    compareBtn.className = 'compare-btn';
    compareBtn.textContent = 'Compare';
    compareBtn.onclick = function() {
      toggleProductComparison(productId);
    };
    
    const cardActions = card.querySelector('.card-actions');
    if (cardActions) {
      cardActions.appendChild(compareBtn);
    }
  });
  
  // Add comparison bar to page
  const compareBar = document.createElement('div');
  compareBar.className = 'compare-bar';
  compareBar.innerHTML = `
    <div class="compare-bar-content">
      <div class="compare-title">Compare Products (<span id="compare-count">0</span>)</div>
      <div id="compare-items" class="compare-items"></div>
      <div class="compare-actions">
        <button id="compare-button" disabled onclick="showComparison()">Compare</button>
        <button onclick="clearCompareList()">Clear All</button>
      </div>
    </div>
    <button class="compare-toggle" onclick="toggleCompareBar()">Compare</button>
  `;
  
  document.body.appendChild(compareBar);
}

// Toggle product in comparison list
function toggleProductComparison(id) {
  const index = compareList.indexOf(id);
  const product = products.find(p => p.id === id);
  
  if (!product) return;
  
  if (index >= 0) {
    // Remove from comparison
    compareList.splice(index, 1);
    showToast(`${product.name} removed from comparison`);
  } else {
    // Add to comparison (limit to 4 items)
    if (compareList.length >= 4) {
      showToast('You can compare up to 4 products at a time', 'error');
      return;
    }
    
    compareList.push(id);
    showToast(`${product.name} added to comparison`);
  }
  
  updateCompareBar();
}

// Update compare bar with selected products
function updateCompareBar() {
  const compareItems = document.getElementById('compare-items');
  const compareCount = document.getElementById('compare-count');
  const compareButton = document.getElementById('compare-button');
  
  if (!compareItems || !compareCount || !compareButton) return;
  
  compareItems.innerHTML = '';
  compareCount.textContent = compareList.length;
  
  if (compareList.length < 2) {
    compareButton.disabled = true;
  } else {
    compareButton.disabled = false;
  }
  
  compareList.forEach(id => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const item = document.createElement('div');
    item.className = 'compare-item';
    item.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <span>${product.name}</span>
      <button onclick="toggleProductComparison(${product.id})">×</button>
    `;
    
    compareItems.appendChild(item);
  });
  
  // Show compare bar if items exist
  const compareBar = document.querySelector('.compare-bar');
  if (compareBar) {
    if (compareList.length > 0) {
      compareBar.classList.add('active');
    } else {
      compareBar.classList.remove('active');
    }
  }
}

// Toggle compare bar visibility
function toggleCompareBar() {
  const compareBar = document.querySelector('.compare-bar');
  if (compareBar) {
    compareBar.classList.toggle('active');
  }
}

// Clear comparison list
function clearCompareList() {
  compareList.length = 0;
  updateCompareBar();
  showToast('Comparison list cleared');
}

// Show product comparison
function showComparison() {
  if (compareList.length < 2) return;
  
  const modal = document.createElement('div');
  modal.className = 'comparison-modal';
  
  let compareProductsHTML = '';
  
  // Get properties to compare
  const properties = ['price', 'category', 'rating', 'stock'];
  
  // Generate comparison table
  let tableHTML = `
    <table class="comparison-table">
      <tr>
        <th>Product</th>
        ${compareList.map(id => {
          const product = products.find(p => p.id === id);
          return `<th>
            <img src="${product.img}" alt="${product.name}">
            <div>${product.name}</div>
          </th>`;
        }).join('')}
      </tr>
  `;
  
  // Add rows for each property
  properties.forEach(prop => {
    let propName = prop.charAt(0).toUpperCase() + prop.slice(1);
    
    tableHTML += `
      <tr>
        <td>${propName}</td>
        ${compareList.map(id => {
          const product = products.find(p => p.id === id);
          let value = product[prop];
          
          // Format specific properties
          if (prop === 'price') {
            value = `${getCurrencySymbol()}${convertPrice(value)}`;
          } else if (prop === 'rating') {
            // Create rating stars
            const fullStars = Math.floor(value);
            const hasHalfStar = value % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
            let starsHTML = '';
            for (let i = 0; i < fullStars; i++) {
              starsHTML += '<span class="star full">★</span>';
            }
            if (hasHalfStar) {
              starsHTML += '<span class="star half">★</span>';
            }
            for (let i = 0; i < emptyStars; i++) {
              starsHTML += '<span class="star empty">☆</span>';
            }
            
            value = `${starsHTML} (${value})`;
          }
          
          return `<td>${value}</td>`;
        }).join('')}
      </tr>
    `;
  });
  
  // Add tags row
  tableHTML += `
    <tr>
      <td>Tags</td>
      ${compareList.map(id => {
        const product = products.find(p => p.id === id);
        const tagsHTML = product.tags.map(tag => 
          `<span class="tag">${tag}</span>`
        ).join('');
        
        return `<td>${tagsHTML}</td>`;
      }).join('')}
    </tr>
  `;
  
  // Add actions row
  tableHTML += `
    <tr>
      <td>Actions</td>
      ${compareList.map(id => {
        return `<td>
          <button onclick="addToCart(${id})">Add to Cart</button>
        </td>`;
      }).join('')}
    </tr>
  `;
  
  tableHTML += '</table>';
  
  modal.innerHTML = `
    <div class="modal-content comparison">
      <span class="close-modal" onclick="this.parentElement.parentElement.remove()">×</span>
      <h2>Product Comparison</h2>
      ${tableHTML}
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Allow closing by clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  });
}

// Add product recommendations based on cart
function showRecommendations() {
  if (cart.length === 0) return;
  
  const recommendSection = document.getElementById('recommendations');
  if (!recommendSection) return;
  
  // Extract product IDs from cart
  const cartProductIds = cart.map(item => item.productId);
  
  // Extract tags from cart products
  let cartTags = [];
  cartProductIds.forEach(id => {
    const product = products.find(p => p.id === id);
    if (product && product.tags) {
      cartTags = [...cartTags, ...product.tags];
    }
  });
  
  // Count tag frequency
  const tagCounts = {};
  cartTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  // Sort tags by frequency
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
  
  // Get top 3 tags
  const topTags = sortedTags.slice(0, 3);
  
  // Find products with matching tags, excluding products already in cart
  const recommendedProducts = products.filter(product => {
    if (cartProductIds.includes(product.id)) return false;
    
    return product.tags.some(tag => topTags.includes(tag));
  }).slice(0, 4); // Limit to 4 recommendations
  
  if (recommendedProducts.length === 0) {
    recommendSection.style.display = 'none';
    return;
  }
  
  recommendSection.style.display = 'block';
  recommendSection.innerHTML = "<h2>Recommended For You</h2><div class='recommendation-items'></div>";
  const recItems = recommendSection.querySelector('.recommendation-items');
  
  recommendedProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'recommendation-item';
    
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" onclick="showQuickView(${product.id})">
      <h4>${product.name}</h4>
      <p>${getCurrencySymbol()}${convertPrice(product.price)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    
    recItems.appendChild(card);
  });
}

// Add CSS for all new features
function addStylesheet() {
  const style = document.createElement('style');
  style.textContent = `
    /* Dark mode styles */
    body.dark-mode {
      background-color: #121212;
      color: #f1f1f1;
    }
    
    body.dark-mode .product-card,
    body.dark-mode .modal-content,
    body.dark-mode .cart {
      background-color: #1e1e1e;
      color: #f1f1f1;
      border-color: #333;
    }
    
    body.dark-mode input,
    body.dark-mode select,
    body.dark-mode button {
      background-color: #333;
      color: #f1f1f1;
      border-color: #555;
    }
    
    body.dark-mode button:hover {
      background-color: #444;
    }
    
    /* Dark mode toggle */
    .dark-mode-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 100;
    }
    
    /* Currency switcher */
    .currency-switcher {
      position: absolute;
      top: 20px;
      right: 70px;
    }
    
    /* Product card enhancements */
    .product-card {
      position: relative;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }
    
    .card-image {
      position: relative;
      overflow: hidden;
    }
    
    .quick-view {
      position: absolute;
      bottom: -40px;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.7);
      color: white;
      text-align: center;
      padding: 10px;
      cursor: pointer;
      transition: bottom 0.3s;
    }
    
    .card-image:hover .quick-view {
      bottom: 0;
    }
    
    .rating {
      margin: 5px 0;
    }
    
    .star {
      color: gold;
    }
    
    .star.empty {
      color: #ccc;
    }
    
    .stock {
      font-size: 0.9em;
      margin-top: 5px;
    }
    
    .low-stock {
      color: #ff4d4d;
      font-weight: bold;
    }
    
    .card-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    
    .wishlist-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .wishlist-btn.active {
      color: #ff4d4d;
    }
    
    .compare-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255,255,255,0.8);
      color: #333;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 0.8em;
    }
    
    .tag {
      display: inline-block;
      background: #e0e0e0;
      color: #333;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      margin-right: 5px;
      margin-bottom: 5px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .tag:hover {
      background: #d0d0d0;
    }
    
    body.dark-mode .tag {
      background: #444;
      color: #f1f1f1;
    }
    
    body.dark-mode .tag:hover {
      background: #555;
    }
    
    /* Quick view modal */
    .quick-view-modal,
    .checkout-modal,
    .comparison-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      max-width: 900px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }
    
    .close-modal {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      color: #999;
    }
    
    .close-modal:hover {
      color: #333;
    }
    
    .modal-body {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .modal-image {
      flex: 1;
      min-width: 300px;
    }
    
    .modal-image img {
      width: 100%;
      height: auto;
      border-radius: 5px;
    }
    
    .modal-details {
      flex: 1;
      min-width: 300px;
    }
    
    .modal-creator {
      color: #777;
      margin-bottom: 10px;
    }
    
    .modal-price {
      font-size: 1.5em;
      font-weight: bold;
      color: #4CAF50;
      margin-bottom: 15px;
    }
    
    .quantity-selector {
      display: flex;
      align-items: center;
      margin: 20px 0;
    }
    
    .quantity-selector button {
      width: 30px;
      height: 30px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .quantity-selector input {
      width: 50px;
      height: 30px;
      text-align: center;
      margin: 0 5px;
    }
    
    .add-to-cart-btn {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
    }
    
    .add-to-cart-btn:hover {
      background: #45a049;
    }
    
    /* Toast notifications */
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
    }
    
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .toast.error {
      background: #ff4d4d;
    }
    
    /* Enhanced cart */
    .cart {
      position: fixed;
      right: -300px;
      top: 0;
      width: 300px;
      height: 100%;
      background: #fff;
      box-shadow: -5px 0 15px rgba(0,0,0,0.1);
      transition: right 0.3s;
      z-index: 900;
    }
    
    .cart.open {
      right: 0;
    }
    
    .cart-toggle {
      position: relative;
    }
    
    .cart-count {
      position: absolute;
      top: -10px;
      right: -10px;
      background: #ff4d4d;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8em;
    }
    
    .cart-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    
    .cart-item-img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 10px;
    }
    
    .cart-item-details {
      flex: 1;
    }
    
    .cart-item-name {
      display: block;
      margin-bottom: 5px;
    }
    
    .cart-item-quantity {
      display: flex;
      align-items: center;
      font-size: 0.9em;
    }
    
    .cart-item-quantity button {
      width: 20px;
      height: 20px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0 5px;
    }
    
    .cart-item-price {
      text-align: right;
      position: relative;
      padding-right: 25px;
    }
    
    .remove-btn {
      position: absolute;
      top: -5px;
      right: 0;
      background: none;
      border: none;
      font-size: 18px;
      color: #ff4d4d;
      cursor: pointer;
    }
    
    /* Checkout styles */
    .checkout-steps {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      margin-bottom: 20px;
      position: relative;
    }
    
    .checkout-steps::before {
      content: '';
      position: absolute;
      top: 30px;
      left: 0;
      right: 0;
      height: 2px;
      background: #e0e0e0;
      z-index: 1;
    }
    
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
      color: #999;
      cursor: pointer;
    }
    
    .step::before {
      content: '';
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #e0e0e0;
      margin-bottom: 5px;
    }
    
    .step.active {
      color: #4CAF50;
    }
    
    .step.active::before {
      background: #4CAF50;
    }
    
    .checkout-step-content {
      display: none;
    }
    
    .checkout-step-content.active {
      display: block;
    }
    
    .checkout-items {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    
    .checkout-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    
    .checkout-total {
      display: flex;
      justify-content: space-between;
      font-size: 1.2em;
      font-weight: bold;
      padding: 15px 0;
      border-top: 2px solid #eee;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .form-row {
      display: flex;
      gap: 15px;
    }
    
    .form-row .form-group {
      flex: 1;
    }
    
    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    
    .confirmation-message {
      text-align: center;
      padding: 30px 0;
    }
    
    .confirmation-message h3 {
      color: #4CAF50;
      margin-bottom: 15px;
    }
    
    /* Compare products feature */
    .compare-bar {
      position: fixed;
      bottom: -100px;
      left: 0;
      right: 0;
      background: #fff;
      padding: 15px;
      box-shadow: 0 -5px 15px rgba(0,0,0,0.1);
      transition: bottom 0.3s;
      z-index: 800;
    }
    
    .compare-bar.active {
      bottom: 0;
    }
    
    .compare-bar-content {
      display: flex;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .compare-title {
      margin-right: 20px;
      white-space: nowrap;
    }
    
    .compare-items {
      display: flex;
      flex: 1;
      overflow-x: auto;
      padding: 10px 0;
    }
    
    .compare-item {
      display: flex;
      align-items: center;
      margin-right: 15px;
      padding: 5px;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    
    .compare-item img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      margin-right: 10px;
    }
    
    .compare-actions {
      margin-left: 20px;
    }
    
    .compare-toggle {
      position: absolute;
      top: -40px;
      right: 20px;
      background: #fff;
      padding: 8px 15px;
      border-radius: 4px 4px 0 0;
      box-shadow: 0 -3px 10px rgba(0,0,0,0.1);
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .comparison-table th,
    .comparison-table td {
      padding: 10px;
      text-align: center;
      border: 1px solid #eee;
    }
    
    .comparison-table th img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      margin-bottom: 10px;
    }
    
    /* Recently viewed section */
    #recently-viewed,
    #recommendations {
      margin-top: 30px;
    }
    
    .recent-items,
    .recommendation-items {
      display: flex;
      overflow-x: auto;
      gap: 15px;
      padding: 10px 0;
    }
    
    .recent-item,
    .recommendation-item {
      min-width: 150px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 5px;
      cursor: pointer;
      transition: transform 0.3s;
    }
    
    .recent-item:hover,
    .recommendation-item:hover {
      transform: translateY(-5px);
    }
    
    .recent-item img,
    .recommendation-item img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    .recent-item h4,
    .recommendation-item h4 {
      margin: 5px 0;
      font-size: 0.9em;
    }
    
    .recent-item p,
    .recommendation-item p {
      color: #4CAF50;
      font-weight: bold;
    }
    
    /* Sort options */
    .filter-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .search-filters {
      display: flex;
      gap: 10px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .modal-body,
      .filter-controls,
      .search-filters {
        flex-direction: column;
      }
      
      .compare-bar-content {
        flex-direction: column;
      }
      
      .compare-title,
      .compare-actions {
        margin: 10px 0;
      }
      
      .compare-toggle {
        right: 10px;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Call stylesheet function
addStylesheet();

// Check for cart updates from other tabs
window.addEventListener('storage', function(e) {
  if (e.key === 'cart') {
    loadCart();
  }
});

// Show recommendations whenever cart is updated
document.addEventListener('cartUpdated', function() {
  showRecommendations();
});

// Create a custom event for cart updates
function triggerCartUpdated() {
  const event = new CustomEvent('cartUpdated');
  document.dispatchEvent(event);
}

// Update original updateCart function to trigger the event
const originalUpdateCart = updateCart;
updateCart = function() {
  originalUpdateCart();
  triggerCartUpdated();
};

// Create a section for recently viewed products
function createRecentlyViewedSection() {
  const mainContent = document.querySelector('main') || document.body;
  
  const recentSection = document.createElement('section');
  recentSection.id = 'recently-viewed';
  recentSection.style.display = 'none'; // Hide initially until products are viewed
  
  mainContent.appendChild(recentSection);
}

// Create recommendations section
function createRecommendationsSection() {
  const mainContent = document.querySelector('main') || document.body;
  
  const recommendSection = document.createElement('section');
  recommendSection.id = 'recommendations';
  recommendSection.style.display = 'none'; // Hide initially
  
  mainContent.appendChild(recommendSection);
}

// Call these functions after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createRecentlyViewedSection();
  createRecommendationsSection();
});