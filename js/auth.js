// Authentication Management
class AuthManager {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    this.users = JSON.parse(localStorage.getItem("users")) || [];
    this.init();
  }

  init() {
    this.updateUI();
    this.setupEventListeners();
    this.protectRoutes();
  }

  setupEventListeners() {
    // Signup form
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.signup();
      });
    }

    // Login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.login();
      });
    }

    // Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }
  }

  signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if user exists
    if (this.users.find((u) => u.email === email)) {
      alert("User already exists!");
      return;
    }

    // Create new user
    const newUser = { name, email, password };
    this.users.push(newUser);
    localStorage.setItem("users", JSON.stringify(this.users));

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  }

  login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Find user
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      this.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "index.html";
    } else {
      alert("Invalid credentials!");
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }

  updateUI() {
    const userNameSpan = document.getElementById("userName");
    const logoutBtn = document.getElementById("logoutBtn");

    if (this.currentUser && userNameSpan) {
      userNameSpan.textContent = `Hi, ${this.currentUser.name}`;
      if (logoutBtn) logoutBtn.style.display = "block";
    } else {
      if (userNameSpan) userNameSpan.textContent = "";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

  protectRoutes() {
    const protectedPages = ["cart.html", "wishlist.html"];
    const currentPage = window.location.pathname.split("/").pop();

    if (protectedPages.includes(currentPage) && !this.currentUser) {
      window.location.href = "login.html";
    }
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
}

// Initialize auth
const authManager = new AuthManager();
