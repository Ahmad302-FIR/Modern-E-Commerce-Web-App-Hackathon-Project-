// Wishlist Management
class WishlistManager {
  constructor() {
    this.wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    this.init();
  }

  init() {
    this.updateBadge();
    this.setupEventListeners();
    this.renderWishlist();
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("add-to-wishlist") ||
        e.target.parentElement?.classList.contains("add-to-wishlist")
      ) {
        const button = e.target.classList.contains("add-to-wishlist")
          ? e.target
          : e.target.parentElement;
        const productId = parseInt(button.dataset.id);
        this.toggleWishlist(productId, button);
      }
    });
  }

  toggleWishlist(productId, button) {
    if (!authManager.isAuthenticated()) {
      if (confirm("Please login to manage wishlist")) {
        window.location.href = "login.html";
      }
      return;
    }

    const index = this.wishlist.indexOf(productId);

    if (index === -1) {
      this.wishlist.push(productId);
      this.updateButtonState(button, true);
      alert("Added to wishlist!");
    } else {
      this.wishlist.splice(index, 1);
      this.updateButtonState(button, false);
      alert("Removed from wishlist!");
    }

    this.saveWishlist();
    this.renderWishlist();
  }

  updateButtonState(button, isAdded) {
    const icon = button.querySelector("i");
    if (icon) {
      icon.style.color = isAdded ? "#ff6b6b" : "inherit";
    }

    if (button.textContent.includes("Wishlist")) {
      button.innerHTML = isAdded
        ? '<i class="fas fa-heart" style="color: #ff6b6b"></i> Remove from Wishlist'
        : '<i class="fas fa-heart"></i> Add to Wishlist';
    }
  }

  saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(this.wishlist));
    this.updateBadge();
  }

  updateBadge() {
    const badge = document.getElementById("wishlistBadge");
    if (badge) {
      badge.textContent = this.wishlist.length;
    }
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  renderWishlist() {
    const wishlistGrid = document.getElementById("wishlistGrid");
    if (!wishlistGrid) return;

    if (this.wishlist.length === 0) {
      wishlistGrid.innerHTML =
        '<p class="empty-wishlist">Your wishlist is empty</p>';
      return;
    }

    const wishlistProducts = this.wishlist
      .map((id) => productManager.getProductById(id))
      .filter((p) => p);

    wishlistGrid.innerHTML = wishlistProducts
      .map((product) => {
        const isInCart = cartManager.isInCart(product.id);

        return `
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">₹${product.price}</p>
                        <div class="product-actions">
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                                ${isInCart ? "Added ✓" : "Add to Cart"}
                            </button>
                            <button class="btn btn-secondary add-to-wishlist" data-id="${product.id}">
                                <i class="fas fa-heart" style="color: #ff6b6b"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }
}

// Initialize wishlist manager
const wishlistManager = new WishlistManager();
window.wishlistManager = wishlistManager;
