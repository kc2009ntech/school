document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const isUnlocked = sessionStorage.getItem("isUnlocked") === "true";

  // Dynamic secret passcode fallback
  let SECRET_PASSCODE = localStorage.getItem("aerolover_passcode") || "skyhigh";

  // STORAGE KEYS
  const STORAGE_PROFILE_KEY = "aerolover_user_profile";
  const STORAGE_PREFS_KEY = "aerolover_user_prefs";
  const STORAGE_PAYMENT_KEY = "aerolover_user_payment";

  // ==========================================
  // DYNAMIC NAVBAR USER NAME DISPLAY
  // ==========================================
  function updateNavbarUserName() {
    const navUserName = document.querySelector("#navUserName");
    if (!navUserName) return;

    const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        if (data.firstName) {
          const fullName = data.lastName
            ? `${data.firstName} ${data.lastName}`
            : data.firstName;
          navUserName.textContent = fullName;
        }
      } catch (e) {
        console.error("Error parsing user profile for navbar:", e);
      }
    }
  }

  // Initial call on page load
  updateNavbarUserName();

  // ==========================================
  // 1. ROUTE GUARD
  // ==========================================
  if (
    (currentPath.includes("dashboard.html") ||
      currentPath.includes("account.html")) &&
    !isUnlocked
  ) {
    window.location.href = "unlock.html";
    return;
  }

  // ==========================================
  // 2. ALERT FEEDBACK UTILITY
  // ==========================================
  const alertBox = document.querySelector("#settingsAlert");
  const alertMsg = document.querySelector("#settingsAlertMsg");

  function showAlert(message, isSuccess = true) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = message;
      alertBox.className = `alert ${isSuccess ? "alert-success" : "alert-danger"} alert-dismissible fade show`;
      alertBox.classList.remove("d-none");
    }
  }

  // ==========================================
  // 3. ACCOUNT SETTINGS: LOCALSTORAGE INTEGRATION
  // ==========================================

  // --- A. Profile Information ---
  const profileForm = document.querySelector("#profileForm");
  const firstNameInput = document.querySelector("#firstName");
  const lastNameInput = document.querySelector("#lastName");
  const emailInput = document.querySelector("#email");
  const bioInput = document.querySelector("#bio");
  const resetProfileBtn = document.querySelector("#resetProfileBtn");

  function loadProfileSettings() {
    const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        if (firstNameInput && data.firstName)
          firstNameInput.value = data.firstName;
        if (lastNameInput && data.lastName) lastNameInput.value = data.lastName;
        if (emailInput && data.email) emailInput.value = data.email;
        if (bioInput && data.bio) bioInput.value = data.bio;
      } catch (e) {
        console.error("Error reading profile from localStorage", e);
      }
    } else {
      // Default fallback values
      if (firstNameInput) firstNameInput.value = "Captain";
      if (lastNameInput) lastNameInput.value = "Aviator";
      if (emailInput) emailInput.value = "captain@aerolover.com";
    }
  }

  if (profileForm) {
    loadProfileSettings();

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const profileData = {
        firstName: firstNameInput ? firstNameInput.value.trim() : "",
        lastName: lastNameInput ? lastNameInput.value.trim() : "",
        email: emailInput ? emailInput.value.trim() : "",
        bio: bioInput ? bioInput.value.trim() : "",
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));

      // Update navbar text immediately without page refresh
      updateNavbarUserName();

      showAlert("Profile settings saved successfully!");
    });
  }

  if (resetProfileBtn) {
    resetProfileBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      if (firstNameInput) firstNameInput.value = "";
      if (lastNameInput) lastNameInput.value = "";
      if (emailInput) emailInput.value = "";
      if (bioInput) bioInput.value = "";

      // Reset navbar name to default
      const navUserName = document.querySelector("#navUserName");
      if (navUserName) navUserName.textContent = "Account";

      showAlert("Saved profile cleared from localStorage.", false);
    });
  }

  // --- B. Payment Methods ---
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

  // --- C. Preferences ---
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

  // --- D. Passcode & Security ---
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

  // ==========================================
  // 4. AUTHENTICATION & SIGN OUT LOGIC
  // ==========================================
  const passwordForm = document.querySelector("#passwordForm");
  const passcodeInput = document.querySelector("#passcode");
  const errorMessage = document.querySelector("#errorMessage");
  const logoutBtn = document.querySelector("#logoutBtn");

  if (passwordForm) {
    if (isUnlocked) {
      window.location.href = "dashboard.html";
      return;
    }

    passwordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const enteredPasscode = passcodeInput ? passcodeInput.value.trim() : "";

      if (enteredPasscode === SECRET_PASSCODE) {
        sessionStorage.setItem("isUnlocked", "true");
        if (errorMessage) errorMessage.classList.add("d-none");
        window.location.href = "dashboard.html";
      } else {
        if (errorMessage) errorMessage.classList.remove("d-none");
        if (passcodeInput) {
          passcodeInput.value = "";
          passcodeInput.focus();
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("isUnlocked");
      window.location.href = "unlock.html";
    });
  }

  // ==========================================
  // 5. SIMULATED PAYMENT FOR UNLOCK.HTML
  // ==========================================
  const signupPaymentForm = document.querySelector("#signupPaymentForm");
  if (signupPaymentForm) {
    signupPaymentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const emailInput = document.querySelector("#userEmail");
      const email = emailInput ? emailInput.value.trim() : "";
      const submitBtn = signupPaymentForm.querySelector(
        "button[type='submit']",
      );

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing Payment...";
      }

      setTimeout(() => {
        sessionStorage.setItem("isUnlocked", "true");
        sessionStorage.setItem("userEmail", email);
        window.location.href = "dashboard.html";
      }, 1500);
    });
  }
});
