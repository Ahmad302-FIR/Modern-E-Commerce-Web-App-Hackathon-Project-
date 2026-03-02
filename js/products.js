// Product Management
class ProductManager {
  constructor() {
    this.products = [
      {
        id: 1,
        name: "Smart Watch",
        price: 5000,
        category: "Electronics",
        rating: 4.5,
        stock: 10,
        image:
          "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
        description: "Advanced smartwatch with health tracking features",
      },
      {
        id: 2,
        name: "Running Shoes",
        price: 3500,
        category: "Shoes",
        rating: 4.2,
        stock: 8,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        description: "Comfortable running shoes for athletes",
      },
      {
        id: 3,
        name: "Wireless Headphones",
        price: 2999,
        category: "Electronics",
        rating: 4.7,
        stock: 15,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Noise-cancelling wireless headphones",
      },
      {
        id: 4,
        name: "Backpack",
        price: 1299,
        category: "Accessories",
        rating: 4.3,
        stock: 20,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        description: "Durable waterproof backpack",
      },
      {
        id: 5,
        name: "Sunglasses",
        price: 1999,
        category: "Accessories",
        rating: 4.4,
        stock: 12,
        image:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
        description: "UV protection polarized sunglasses",
      },
      {
        id: 6,
        name: "T-Shirt",
        price: 799,
        category: "Clothing",
        rating: 4.1,
        stock: 25,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        description: "100% cotton comfortable t-shirt",
      },
      {
        id: 7,
        name: "Jeans",
        price: 2499,
        category: "Clothing",
        rating: 4.6,
        stock: 18,
        image:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
        description: "Slim fit denim jeans",
      },
      {
        id: 8,
        name: "Coffee Maker",
        price: 3999,
        category: "Home",
        rating: 4.8,
        stock: 7,
        image:
          "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500",
        description: "Automatic coffee brewing machine",
      },
    ];

    this.currentPage = 1;
    this.itemsPerPage = 6;
    this.filteredProducts = [...this.products];
    this.init();
  }

  init() {
    this.renderCategories();
    this.setupEventListeners();
    this.renderProducts();
    this.setupProductDetail();
  }

  setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterProducts());
    }

    if (categoryFilter) {
      categoryFilter.addEventListener("change", () => this.filterProducts());
    }

    if (sortFilter) {
      sortFilter.addEventListener("change", () => this.filterProducts());
    }
  }

  renderCategories() {
    const categories = [
      "all",
      ...new Set(this.products.map((p) => p.category)),
    ];
    const categorySelect = document.getElementById("categoryFilter");

    if (categorySelect) {
      categorySelect.innerHTML = categories
        .map(
          (cat) =>
            `<option value="${cat}">${cat === "all" ? "All Categories" : cat}</option>`,
        )
        .join("");
    }
  }

  filterProducts() {
    const searchTerm =
      document.getElementById("searchInput")?.value.toLowerCase() || "";
    const category = document.getElementById("categoryFilter")?.value || "all";
    const sort = document.getElementById("sortFilter")?.value || "default";

    // Filter by search and category
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    if (sort === "price-low") {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      this.filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    this.currentPage = 1;
    this.renderProducts();
  }

  renderProducts() {
    const productsGrid = document.getElementById("productsGrid");
    if (!productsGrid) return;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const paginatedProducts = this.filteredProducts.slice(start, end);

    productsGrid.innerHTML = paginatedProducts
      .map((product) => this.createProductCard(product))
      .join("");
    this.renderPagination();

    // Add event listeners to product cards
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn")) {
          window.location.href = `product-detail.html?id=${card.dataset.id}`;
        }
      });
    });
  }

  createProductCard(product) {
    const cartManager = window.cartManager;
    const wishlistManager = window.wishlistManager;

    const isInCart = cartManager?.isInCart(product.id);
    const isInWishlist = wishlistManager?.isInWishlist(product.id);

    return `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">₹${product.price}</p>
                    <div class="product-rating">
                        ${this.getStarRating(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <p class="product-stock">${product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
                            ${isInCart ? "Added ✓" : "Add to Cart"}
                        </button>
                        <button class="btn btn-secondary add-to-wishlist" data-id="${product.id}">
                            <i class="fas fa-heart" style="color: ${isInWishlist ? "#ff6b6b" : "inherit"}"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = "";

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }

    return stars;
  }

  renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    const totalPages = Math.ceil(
      this.filteredProducts.length / this.itemsPerPage,
    );

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = `
            <button class="page-btn" ${this.currentPage === 1 ? "disabled" : ""} onclick="productManager.changePage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="page-numbers">
        `;

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
                <button class="page-btn ${i === this.currentPage ? "active" : ""}" onclick="productManager.changePage(${i})">
                    ${i}
                </button>
            `;
    }

    paginationHTML += `
            </div>
            <button class="page-btn" ${this.currentPage === totalPages ? "disabled" : ""} onclick="productManager.changePage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

    pagination.innerHTML = paginationHTML;
  }

  changePage(page) {
    this.currentPage = page;
    this.renderProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  setupProductDetail() {
    if (window.location.pathname.includes("product-detail.html")) {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = parseInt(urlParams.get("id"));
      const product = this.products.find((p) => p.id === productId);

      if (product) {
        this.renderProductDetail(product);
      }
    }
  }

  renderProductDetail(product) {
    const container = document.getElementById("productDetail");
    if (!container) return;

    const cartManager = window.cartManager;
    const wishlistManager = window.wishlistManager;

    const isInCart = cartManager?.isInCart(product.id);
    const isInWishlist = wishlistManager?.isInWishlist(product.id);

    container.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="product-price">₹${product.price}</p>
                    <div class="product-rating">
                        ${this.getStarRating(product.rating)}
                        <span>(${product.rating} stars)</span>
                    </div>
                    <p class="product-category">Category: ${product.category}</p>
                    <p class="product-description">${product.description}</p>
                    <p class="product-stock">${product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
                            ${isInCart ? "Added to Cart ✓" : "Add to Cart"}
                        </button>
                        <button class="btn btn-secondary add-to-wishlist" data-id="${product.id}">
                            <i class="fas fa-heart" style="color: ${isInWishlist ? "#ff6b6b" : "inherit"}"></i>
                            ${isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  getProductById(id) {
    return this.products.find((p) => p.id === id);
  }
}

// Initialize product manager
const productManager = new ProductManager();
window.productManager = productManager;
