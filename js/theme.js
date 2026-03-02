// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.init();
  }

  init() {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      this.updateIcon(true);
    }

    // Add event listener
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    this.updateIcon(isDark);
  }

  updateIcon(isDark) {
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector("i");
      if (icon) {
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      }
    }
  }
}

// Initialize theme
const themeManager = new ThemeManager();
