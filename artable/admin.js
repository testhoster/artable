// In a real application, authentication should be handled server-side
// This is a simplified example for demonstration purposes only

// Keep track of locally added products
const addedProducts = [];

// Handle admin login
document.getElementById('login-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const password = document.getElementById('admin-password').value;
  const loginMsg = document.getElementById('login-msg');
  
  // WARNING: This is not secure! In a real application,
  // authentication should be handled on the server
  if (password === 'admin123') {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loginMsg.textContent = '';
  } else {
    loginMsg.textContent = 'Incorrect password';
  }
});

// Handle product form submission
document.getElementById('admin-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value.trim();
  const creator = document.getElementById('creator').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const imgUrl = document.getElementById('img').value.trim();
  const category = document.getElementById('product-category').value;
  const tagsString = document.getElementById('tags').value.trim();
  const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  
  // Validate form
  if (!name || !creator || isNaN(price) || price <= 0 || !imgUrl || !category || tags.length === 0) {
    document.getElementById('admin-msg').textContent = 'Please fill all fields correctly';
    return;
  }
  
  // Create new product
  const newProduct = {
    id: Date.now(), // Generate a unique ID
    name,
    creator,
    price,
    img: imgUrl,
    category,
    tags
  };
  
  // Add to local products array
  addedProducts.push(newProduct);
  
  // Add to preview list
  addProductToPreview(newProduct);
  
  // Show success message
  document.getElementById('admin-msg').textContent = 'Product added (preview only)';
  
  // Reset form
  this.reset();
  
  // Clear message after 3 seconds
  setTimeout(() => {
    document.getElementById('admin-msg').textContent = '';
  }, 3000);
});

// Add product to preview section
function addProductToPreview(product) {
  const previewList = document.getElementById('preview-list');
  if (!previewList) return;
  
  const li = document.createElement('li');
  
  // Create tags HTML
  const tagsHTML = product.tags.map(tag => 
    `<span class="tag">${tag}</span>`
  ).join(' ');
  
  li.innerHTML = `
    <img src="${product.img}" alt="${product.name}" width="120">
    <h3>${product.name}</h3>
    <p><strong>By:</strong> ${product.creator}</p>
    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <div class="product-tags">${tagsHTML}</div>
  `;
  
  previewList.appendChild(li);
}

// Return to store button
document.getElementById('back-to-store')?.addEventListener('click', function() {
  window.location.href = 'index.html';
});