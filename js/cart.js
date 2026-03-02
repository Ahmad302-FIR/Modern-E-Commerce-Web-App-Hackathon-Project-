// Cart Management
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.init();
  }

  init() {
    this.updateBadge();
    this.setupEventListeners();
    this.renderCart();
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart")) {
        const productId = parseInt(e.target.dataset.id);
        this.addToCart(productId);
      }

      if (e.target.classList.contains("remove-from-cart")) {
        const productId = parseInt(e.target.dataset.id);
        this.removeFromCart(productId);
      }

      if (e.target.classList.contains("quantity-increase")) {
        const productId = parseInt(e.target.dataset.id);
        this.updateQuantity(productId, 1);
      }

      if (e.target.classList.contains("quantity-decrease")) {
        const productId = parseInt(e.target.dataset.id);
        this.updateQuantity(productId, -1);
      }
    });
  }

  addToCart(productId) {
    if (!authManager.isAuthenticated()) {
      if (confirm("Please login to add items to cart")) {
        window.location.href = "login.html";
      }
      return;
    }

    const product = productManager.getProductById(productId);
    if (!product) return;

    const existingItem = this.cart.find((item) => item.id === productId);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
      } else {
        alert("Cannot add more than available stock!");
        return;
      }
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        stock: product.stock,
      });
    }

    this.saveCart();
    this.updateButtonState(productId, "Added ✓");
    alert("Product added to cart!");
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
    this.renderCart();
  }

  updateQuantity(productId, change) {
    const item = this.cart.find((item) => item.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    if (newQuantity <= item.stock) {
      item.quantity = newQuantity;
      this.saveCart();
      this.renderCart();
    } else {
      alert("Cannot exceed available stock!");
    }
  }

  updateButtonState(productId, text) {
    const buttons = document.querySelectorAll(
      `.add-to-cart[data-id="${productId}"]`,
    );
    buttons.forEach((button) => {
      button.textContent = text;
    });
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.updateBadge();
  }

  updateBadge() {
    const badge = document.getElementById("cartBadge");
    if (badge) {
      const totalItems = this.cart.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      badge.textContent = totalItems;
    }
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  isInCart(productId) {
    return this.cart.some((item) => item.id === productId);
  }

  renderCart() {
    const cartContainer = document.getElementById("cartItems");
    if (!cartContainer) return;

    if (this.cart.length === 0) {
      cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      document.getElementById("cartTotal").textContent = "Total: ₹0";
      return;
    }

    cartContainer.innerHTML = this.cart
      .map(
        (item) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="product-price">₹${item.price}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn quantity-decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn quantity-increase" data-id="${item.id}">+</button>
                        <button class="btn btn-secondary remove-from-cart" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    ₹${item.price * item.quantity}
                </div>
            </div>
        `,
      )
      .join("");

    document.getElementById("cartTotal").textContent =
      `Total: ₹${this.getTotal()}`;
  }
}

// Initialize cart manager
const cartManager = new CartManager();
window.cartManager = cartManager;
