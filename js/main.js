// Main Application Entry Point
class App {
  constructor() {
    this.init();
  }

  init() {
    this.setupSlider();
    this.setupHamburgerMenu();
    this.updateUI();
  }

  setupSlider() {
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    const slideCount = slides.length;

    // Auto slide
    let slideInterval = setInterval(() => this.nextSlide(), 3000);

    // Next slide
    const nextSlide = () => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slideCount;
      slides[currentSlide].classList.add("active");
    };

    // Previous slide
    const prevSlide = () => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      slides[currentSlide].classList.add("active");
    };

    // Event listeners
    nextBtn.addEventListener("click", () => {
      nextSlide();
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 3000);
    });

    prevBtn.addEventListener("click", () => {
      prevSlide();
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 3000);
    });

    // Store functions for access
    this.nextSlide = nextSlide;
    this.prevSlide = prevSlide;
  }

  setupHamburgerMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    }
  }

  updateUI() {
    // Update cart and wishlist badges
    if (window.cartManager) {
      cartManager.updateBadge();
    }
    if (window.wishlistManager) {
      wishlistManager.updateBadge();
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
