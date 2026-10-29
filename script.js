document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  // STORAGE KEYS
  const STORAGE_PROFILE_KEY = "aerolover_user_profile";
  const STORAGE_PREFS_KEY = "aerolover_user_prefs";
  const STORAGE_PAYMENT_KEY = "aerolover_user_payment";
  const STORAGE_ACCOUNTS_KEY = "aerolover_registered_accounts";
  const STORAGE_REMEMBER_KEY = "aerolover_remember_me";
  const STORAGE_REMEMBER_EMAIL_KEY = "aerolover_remember_email";
  const STORAGE_LOGOUT_EVENT_KEY = "aerolover_logout_event";

  // Dynamic secret passcode fallback
  let SECRET_PASSCODE = localStorage.getItem("aerolover_passcode") || "skyhigh";

  // ==========================================
  // CROSS-TAB SIGN-OUT SYNCHRONIZATION
  // ==========================================
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_LOGOUT_EVENT_KEY) {
      sessionStorage.removeItem("isUnlocked");
      sessionStorage.removeItem("paymentCompleted");
      sessionStorage.removeItem("userEmail");
      window.location.href = "signin.html";
    }
  });

  // ==========================================
  // PERSISTENT "REMEMBER ME" AUTO-LOGIN CHECK
  // ==========================================
  const isRemembered = localStorage.getItem(STORAGE_REMEMBER_KEY) === "true";
  const rememberedEmail = localStorage.getItem(STORAGE_REMEMBER_EMAIL_KEY);

  if (isRemembered && rememberedEmail) {
    sessionStorage.setItem("isUnlocked", "true");
    sessionStorage.setItem("userEmail", rememberedEmail);
  }

  // Developer mode auto-fallback for local testing
  if (
    !sessionStorage.getItem("isUnlocked") &&
    !localStorage.getItem("aerolover_registered_accounts")
  ) {
    sessionStorage.setItem("isUnlocked", "true");
    localStorage.setItem("aerolover_payment_active", "true");
  }

  const isUnlocked = sessionStorage.getItem("isUnlocked") === "true";
  const isPaid = localStorage.getItem("aerolover_payment_active") === "true";

  function getRegisteredAccounts() {
    const data = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing registered accounts:", e);
      return {};
    }
  }

  function saveRegisteredAccounts(accounts) {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  // Helper utility to show/clear field-level error messages
  function showFieldError(inputElement, message) {
    if (!inputElement) return;
    inputElement.classList.add("is-invalid");
    let errorDiv =
      inputElement.parentElement.querySelector(".invalid-feedback");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "invalid-feedback fw-semibold mt-1";
      inputElement.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }

  function clearFieldError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove("is-invalid");
    const errorDiv =
      inputElement.parentElement.querySelector(".invalid-feedback");
    if (errorDiv) {
      errorDiv.style.display = "none";
    }
  }

  // ==========================================
  // 1. ROUTE GUARD (STRICT UNPAID/SIGNED-OUT BLOCKS)
  // ==========================================
  const protectedPages = [
    "dashboard.html",
    "dashboard_settings.html",
    "dashboard_1.html",
    "dashboard_2.html",
    "dashboard_3.html",
    "account.html",
    "plans.html",
  ];

  const paymentRequiredPages = ["exclusive.html"];

  const isProtected = protectedPages.some((page) => currentPath.includes(page));
  const isPaymentProtected = paymentRequiredPages.some((page) =>
    currentPath.includes(page),
  );

  // A. Redirect signed-out / unknown users to sign in
  if ((isProtected || isPaymentProtected) && !isUnlocked) {
    window.location.href = "signin.html";
    return;
  }

  // B. Redirect unpaid users trying to access exclusive page to plans
  if (isPaymentProtected && !isPaid) {
    window.location.href = "plans.html";
    return;
  }

  // ==========================================
  // DYNAMIC NAVBAR USER NAME & AVATAR DISPLAY
  // ==========================================
  function updateNavbarUserName() {
    const navUserName = document.querySelector("#navUserName");
    const navAvatarCircle = document.querySelector("#navAvatarCircle");
    if (!navUserName) return;

    const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        const first = data.firstName ? data.firstName.trim() : "";
        const last = data.lastName ? data.lastName.trim() : "";

        if (first) {
          const fullName = last ? `${first} ${last}` : first;
          navUserName.textContent = fullName;

          const initials = last
            ? `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
            : first.slice(0, 2).toUpperCase();

          if (navAvatarCircle) {
            navAvatarCircle.textContent = initials;
            navAvatarCircle.classList.remove("d-none");
          }
        }
      } catch (e) {
        console.error("Error parsing user profile for navbar:", e);
      }
    } else if (navAvatarCircle) {
      navAvatarCircle.classList.add("d-none");
    }
  }

  updateNavbarUserName();

  // ==========================================
  // 2. ALERT FEEDBACK UTILITY
  // ==========================================
  const alertBox = document.querySelector("#settingsAlert");
  const alertMsg = document.querySelector("#settingsAlertMsg");

  function showAlert(message, isSuccess = true) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = message;
      alertBox.className = `alert ${
        isSuccess ? "alert-success" : "alert-danger"
      } alert-dismissible fade show`;
      alertBox.classList.remove("d-none");
    }
  }

  // Unified Sign Out Function
  function performGlobalSignOut() {
    sessionStorage.removeItem("isUnlocked");
    sessionStorage.removeItem("paymentCompleted");
    sessionStorage.removeItem("userEmail");
    localStorage.removeItem(STORAGE_REMEMBER_KEY);
    localStorage.removeItem(STORAGE_REMEMBER_EMAIL_KEY);

    // Broadcast logout event to close open tabs immediately
    localStorage.setItem(STORAGE_LOGOUT_EVENT_KEY, Date.now().toString());

    window.location.href = "signin.html";
  }

  const logoutBtns = document.querySelectorAll("#logoutBtn, .logout-btn");
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", performGlobalSignOut);
  });

  // ==========================================
  // 3. ACCOUNT SETTINGS: LOCALSTORAGE INTEGRATION
  // ==========================================
  const profileForm = document.querySelector("#profileForm");
  const firstNameInput = document.querySelector("#firstName");
  const lastNameInput = document.querySelector("#lastName");
  const bioInput = document.querySelector("#bio");

  function loadProfileSettings() {
    const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        if (firstNameInput && data.firstName)
          firstNameInput.value = data.firstName;
        if (lastNameInput && data.lastName) lastNameInput.value = data.lastName;
        if (bioInput && data.bio) bioInput.value = data.bio;
      } catch (e) {
        console.error("Error reading profile from localStorage", e);
      }
    }
  }

  if (profileForm) {
    loadProfileSettings();

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstVal = firstNameInput ? firstNameInput.value.trim() : "";
      const lastVal = lastNameInput ? lastNameInput.value.trim() : "";

      if (!firstVal || !lastVal) {
        showAlert("First name and last name are required.", false);
        return;
      }

      let existingEmail = sessionStorage.getItem("userEmail") || "";
      const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.email) existingEmail = parsed.email;
        } catch (err) {
          console.error("Error parsing profile:", err);
        }
      }

      const profileData = {
        firstName: firstVal,
        lastName: lastVal,
        email: existingEmail,
        bio: bioInput ? bioInput.value.trim() : "",
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      updateNavbarUserName();
      showAlert("Profile settings saved successfully!");
    });
  }

  // --- Payment Methods ---
  const paymentForm = document.querySelector("#paymentForm");
  const cardHolderInput = document.querySelector("#cardHolder");
  const cardNumberInput = document.querySelector("#cardNumber");
  const expDateInput = document.querySelector("#expDate");
  const cardDisplayTitle = document.querySelector("#cardDisplayTitle");
  const cardDisplaySubtitle = document.querySelector("#cardDisplaySubtitle");

  function loadSavedPayment() {
    const savedPayment = localStorage.getItem(STORAGE_PAYMENT_KEY);
    if (savedPayment && cardDisplayTitle && cardDisplaySubtitle) {
      try {
        const card = JSON.parse(savedPayment);
        const last4 = card.number.slice(-4) || "4242";
        cardDisplayTitle.textContent = `${card.brand || "Card"} ending in ${last4}`;
        cardDisplaySubtitle.textContent = `Expires ${card.expDate} • Default Payment`;
      } catch (e) {
        console.error("Error loading payment data", e);
      }
    }
  }

  if (paymentForm) {
    loadSavedPayment();

    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawNumber = cardNumberInput
        ? cardNumberInput.value.replace(/\s+/g, "")
        : "";
      const paymentData = {
        holder: cardHolderInput ? cardHolderInput.value.trim() : "",
        number: rawNumber,
        expDate: expDateInput ? expDateInput.value.trim() : "",
        brand: rawNumber.startsWith("4")
          ? "Visa"
          : rawNumber.startsWith("5")
            ? "Mastercard"
            : "Card",
      };

      localStorage.setItem(STORAGE_PAYMENT_KEY, JSON.stringify(paymentData));
      loadSavedPayment();
      showAlert("New payment method saved!");
      paymentForm.reset();
    });
  }

  // --- Preferences ---
  const preferencesForm = document.querySelector("#preferencesForm");
  const prefNewsCheckbox = document.querySelector("#prefNews");
  const prefAlertsCheckbox = document.querySelector("#prefAlerts");
  const prefCategorySelect = document.querySelector("#prefCategory");

  function loadPreferences() {
    const savedPrefs = localStorage.getItem(STORAGE_PREFS_KEY);
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        if (prefNewsCheckbox) prefNewsCheckbox.checked = prefs.dailyDigest;
        if (prefAlertsCheckbox)
          prefAlertsCheckbox.checked = prefs.breakingAlerts;
        if (prefCategorySelect)
          prefCategorySelect.value = prefs.defaultCategory;
      } catch (e) {
        console.error("Error reading preferences", e);
      }
    }
  }

  if (preferencesForm) {
    loadPreferences();

    preferencesForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const prefsData = {
        dailyDigest: prefNewsCheckbox ? prefNewsCheckbox.checked : false,
        breakingAlerts: prefAlertsCheckbox ? prefAlertsCheckbox.checked : false,
        defaultCategory: prefCategorySelect ? prefCategorySelect.value : "all",
      };

      localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefsData));
      showAlert("Site preferences saved!");
    });
  }

  // --- Passcode & Security ---
  const securityForm = document.querySelector("#securityForm");
  const currentPasscodeInput = document.querySelector("#currentPasscode");
  const newPasscodeInput = document.querySelector("#newPasscode");

  if (securityForm) {
    securityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentVal = currentPasscodeInput
        ? currentPasscodeInput.value.trim()
        : "";
      const newVal = newPasscodeInput ? newPasscodeInput.value.trim() : "";

      if (currentVal !== SECRET_PASSCODE) {
        showAlert("Current passcode does not match!", false);
        return;
      }

      if (newVal.length < 4) {
        showAlert("New passcode must be at least 4 characters long.", false);
        return;
      }

      localStorage.setItem("aerolover_passcode", newVal);
      SECRET_PASSCODE = newVal;
      showAlert("Security passcode updated successfully!");
      securityForm.reset();
    });
  }

  // --- Permanent Account Deletion ---
  const deleteAccountBtn = document.querySelector("#deleteAccountBtn");
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {
      const activeUserEmail = sessionStorage.getItem("userEmail");

      const confirmFirst = confirm(
        "Are you sure you want to permanently delete your Aerolover account? This action cannot be undone.",
      );

      if (!confirmFirst) return;

      const confirmSecond = prompt(
        `To confirm deletion, please type your email address (${
          activeUserEmail || "your registered email"
        }):`,
      );

      if (
        confirmSecond &&
        confirmSecond.trim().toLowerCase() ===
          (activeUserEmail || "").toLowerCase()
      ) {
        const accounts = getRegisteredAccounts();
        if (activeUserEmail && accounts[activeUserEmail]) {
          delete accounts[activeUserEmail];
          saveRegisteredAccounts(accounts);
        }

        localStorage.removeItem(STORAGE_PROFILE_KEY);
        localStorage.removeItem(STORAGE_PREFS_KEY);
        localStorage.removeItem(STORAGE_PAYMENT_KEY);
        localStorage.removeItem(STORAGE_REMEMBER_KEY);
        localStorage.removeItem(STORAGE_REMEMBER_EMAIL_KEY);
        localStorage.removeItem("aerolover_payment_active");
        sessionStorage.removeItem("isUnlocked");
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("paymentCompleted");

        // Broadcast sign-out event across all tabs
        localStorage.setItem(STORAGE_LOGOUT_EVENT_KEY, Date.now().toString());

        alert("Your account has been permanently deleted.");
        window.location.href = "signup.html";
      } else if (confirmSecond !== null) {
        alert("Email verification failed. Account deletion canceled.");
      }
    });
  }

  // ==========================================
  // 4. AUTHENTICATION (SIGN UP & SIGN IN MEMORY)
  // ==========================================
  function validatePasswordRules(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long.",
      };
    }
    if (!hasUpperCase) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter.",
      };
    }
    if (!hasLowerCase) {
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter.",
      };
    }
    if (!hasNumber) {
      return {
        isValid: false,
        message: "Password must contain at least one number.",
      };
    }

    return { isValid: true, message: "Password is valid!" };
  }

  // Sign-Up Handler
  const freeSignupForm = document.querySelector("#freeSignupForm");
  if (freeSignupForm) {
    freeSignupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstNameInput = document.querySelector("#signupFirstName");
      const lastNameInput = document.querySelector("#signupLastName");
      const emailInput = document.querySelector("#signupEmail");
      const passwordInput = document.querySelector("#signupPassword");

      const firstName = firstNameInput ? firstNameInput.value.trim() : "";
      const lastName = lastNameInput ? lastNameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      clearFieldError(emailInput);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        return;
      }

      const passValidation = validatePasswordRules(password);
      if (!passValidation.isValid) {
        alert(passValidation.message);
        return;
      }

      const accounts = getRegisteredAccounts();

      if (accounts[email]) {
        showFieldError(
          emailInput,
          "An account with this email already exists. Please sign in.",
        );
        return;
      }

      accounts[email] = {
        firstName,
        lastName,
        password,
        createdAt: new Date().toISOString(),
      };

      saveRegisteredAccounts(accounts);

      const profileData = {
        firstName,
        lastName,
        email,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("isUnlocked", "true");

      updateNavbarUserName();
      alert("Account created successfully! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    });
  }

  // Sign-In Handler with "Remember Me" Memory Support
  const freeSigninForm = document.querySelector("#freeSigninForm");
  if (freeSigninForm) {
    freeSigninForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.querySelector("#signinEmail");
      const passwordInput = document.querySelector("#signinPassword");
      const rememberCheckbox = document.querySelector("#rememberMe");

      const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";
      const shouldRemember = rememberCheckbox
        ? rememberCheckbox.checked
        : false;

      clearFieldError(emailInput);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        return;
      }

      if (!password) {
        alert("Please enter your password.");
        return;
      }

      const accounts = getRegisteredAccounts();
      const userAccount = accounts[email];

      if (!userAccount) {
        showFieldError(
          emailInput,
          "No account found with this email address. Please sign up.",
        );
        return;
      }

      if (userAccount.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
      }

      const profileData = {
        firstName: userAccount.firstName || email.split("@")[0],
        lastName: userAccount.lastName || "",
        email: email,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("isUnlocked", "true");

      if (shouldRemember) {
        localStorage.setItem(STORAGE_REMEMBER_KEY, "true");
        localStorage.setItem(STORAGE_REMEMBER_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(STORAGE_REMEMBER_KEY);
        localStorage.removeItem(STORAGE_REMEMBER_EMAIL_KEY);
      }

      updateNavbarUserName();
      window.location.href = "dashboard.html";
    });
  }

  // Checkout & Verification Flow
  const checkoutForm = document.querySelector("#checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.querySelector("#checkoutEmail");
      const email = emailInput ? emailInput.value.trim() : "";
      const payBtn = document.querySelector("#payButton");

      if (payBtn) {
        payBtn.disabled = true;
        payBtn.textContent = "Processing Payment...";
      }

      setTimeout(() => {
        sessionStorage.setItem("paymentCompleted", "true");
        sessionStorage.setItem("userEmail", email);
        window.location.href = "verify.html";
      }, 1500);
    });
  }

  if (currentPath.includes("verify.html")) {
    const isPaymentCompleted =
      sessionStorage.getItem("paymentCompleted") === "true";
    const verifyingState = document.querySelector("#verifyingState");
    const failedState = document.querySelector("#failedState");

    setTimeout(() => {
      if (isPaymentCompleted) {
        sessionStorage.setItem("isUnlocked", "true");
        localStorage.setItem("aerolover_payment_active", "true"); // Unlocks exclusive.html
        sessionStorage.removeItem("paymentCompleted");
        window.location.href = "exclusive.html";
      } else {
        if (verifyingState) verifyingState.classList.add("d-none");
        if (failedState) failedState.classList.remove("d-none");
      }
    }, 2000);
  }

  // ==========================================
  // 5. INTERNAL SEARCH & ROUTING SYSTEM
  // ==========================================
  const searchForm = document.querySelector("#searchForm");
  const searchInput = document.querySelector("#searchInput");

  const searchRoutes = [
    {
      keywords: [
        "airline",
        "airlines",
        "fleet",
        "fleets",
        "aircraft",
        "carrier",
        "flights",
      ],
      target: "airlines.html",
    },
    {
      keywords: [
        "airport",
        "airports",
        "terminal",
        "terminals",
        "runway",
        "gate",
        "lounge",
      ],
      target: "airports.html",
    },
    {
      keywords: [
        "news",
        "headline",
        "headlines",
        "article",
        "breaking",
        "story",
        "updates",
      ],
      target: "news.html",
    },
    {
      keywords: [
        "sustainability",
        "sustainable",
        "green",
        "carbon",
        "eco",
        "emissions",
      ],
      target: "sustainability.html",
    },
    {
      keywords: [
        "technology",
        "tech",
        "saf",
        "avionics",
        "fuel",
        "hydrogen",
        "innovation",
      ],
      target: "technology.html",
    },
    {
      keywords: ["contact", "message", "support", "email", "reach", "help"],
      target: "contact.html",
    },
    {
      keywords: ["dashboard", "settings", "profile", "account"],
      target: "dashboard.html",
    },
    {
      keywords: ["exclusive", "vip", "premium"],
      target: "exclusive.html",
    },
    {
      keywords: ["plan", "plans", "pricing", "upgrade", "subscription"],
      target: "plans.html",
    },
    {
      keywords: ["signin", "sign in", "login", "log in"],
      target: "signin.html",
    },
    {
      keywords: ["signup", "sign up", "register", "join"],
      target: "signup.html",
    },
  ];

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();

      if (!query) return;

      const matchedRoute = searchRoutes.find((route) =>
        route.keywords.some((keyword) => query.includes(keyword)),
      );

      if (matchedRoute) {
        window.location.href = matchedRoute.target;
      } else {
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          "_blank",
        );
      }
    });
  }

  // ==========================================
  // 6. CONTACT FORM HANDLER WITH STRICT EXECUTION HALT
  // ==========================================
  const contactForm = document.querySelector("#contactForm");
  const contactAlertBox = document.querySelector("#contactAlert");
  const contactAlertMsg = document.querySelector("#contactAlertMsg");
  const submitMsgBtn = document.querySelector("#submitMsgBtn");

  if (contactForm) {
    const contactEmailInput = document.querySelector("#contactEmail");

    // Clear error message in real-time as user types
    if (contactEmailInput) {
      contactEmailInput.addEventListener("input", () => {
        clearFieldError(contactEmailInput);
      });
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailValue = contactEmailInput
        ? contactEmailInput.value.trim()
        : "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      clearFieldError(contactEmailInput);

      // STRICT VALIDATION: STOP PROCESS IMMEDIATELY IF INVALID
      if (!emailValue || !emailRegex.test(emailValue)) {
        showFieldError(
          contactEmailInput,
          "Please enter a valid email address (e.g., user@domain.com).",
        );
        if (contactAlertBox) {
          contactAlertBox.classList.add("d-none");
        }
        return; // HALT EXECUTION HERE - DO NOT SEND
      }

      // Proceed only if email is valid
      if (submitMsgBtn) {
        submitMsgBtn.disabled = true;
        submitMsgBtn.textContent = "Sending...";
      }

      setTimeout(() => {
        if (submitMsgBtn) {
          submitMsgBtn.disabled = false;
          submitMsgBtn.textContent = "Send Message ✈️";
        }

        if (contactAlertBox && contactAlertMsg) {
          contactAlertMsg.textContent =
            "Thank you! Your message has been sent directly to the Aerolover team.";
          contactAlertBox.className =
            "alert alert-success alert-dismissible fade show mb-4";
          contactAlertBox.classList.remove("d-none");
        }

        contactForm.reset();
      }, 1200);
    });
  }
});
