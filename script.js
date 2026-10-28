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
  // 1. ROUTE GUARD (CHECKOUT PROTECTION)
  // ==========================================
  if (
    (currentPath.includes("dashboard.html") ||
      currentPath.includes("account.html")) &&
    !isUnlocked
  ) {
    window.location.href = "signin.html";
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

      const navUserName = document.querySelector("#navUserName");
      const navAvatarCircle = document.querySelector("#navAvatarCircle");
      if (navUserName) navUserName.textContent = "Account";
      if (navAvatarCircle) navAvatarCircle.classList.add("d-none");

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
  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("isUnlocked");
      sessionStorage.removeItem("paymentCompleted");
      window.location.href = "signin.html";
    });
  }

  // Free / Non-Subscribed Sign In Handler (signin.html)
  const freeSigninForm = document.querySelector("#freeSigninForm");
  if (freeSigninForm) {
    freeSigninForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.querySelector("#signinEmail");
      const email = emailInput ? emailInput.value.trim() : "";

      const profileData = {
        email: email,
        firstName: email.split("@")[0],
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      sessionStorage.setItem("userEmail", email);

      updateNavbarUserName();
      window.location.href = "checkout.html";
    });
  }

  // Free Sign-Up Handler (signup.html)
  const freeSignupForm = document.querySelector("#freeSignupForm");
  if (freeSignupForm) {
    freeSignupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstName = document.querySelector("#signupFirstName").value.trim();
      const lastName = document.querySelector("#signupLastName").value.trim();
      const email = document.querySelector("#signupEmail").value.trim();

      const profileData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      sessionStorage.setItem("userEmail", email);

      updateNavbarUserName();
      window.location.href = "signin.html";
    });
  }

  // ==========================================
  // 5. FORGOT & RESET PASSWORD FLOW
  // ==========================================
  const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.querySelector("#resetEmail");
      const email = emailInput ? emailInput.value.trim() : "";
      const sendResetBtn = document.querySelector("#sendResetBtn");
      const resetAlert = document.querySelector("#resetAlert");

      if (sendResetBtn) {
        sendResetBtn.disabled = true;
        sendResetBtn.textContent = "Sending Email...";
      }

      setTimeout(() => {
        if (resetAlert) resetAlert.classList.remove("d-none");
        if (sendResetBtn) {
          sendResetBtn.disabled = false;
          sendResetBtn.textContent = "Send Reset Link";
        }
        forgotPasswordForm.reset();
      }, 1200);
    });
  }

  const newPasswordForm = document.querySelector("#newPasswordForm");
  if (newPasswordForm) {
    newPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newPasswordAlert = document.querySelector("#newPasswordAlert");
      if (newPasswordAlert) newPasswordAlert.classList.remove("d-none");

      setTimeout(() => {
        window.location.href = "signin.html";
      }, 1500);
    });
  }

  // ==========================================
  // 6. STANDALONE CHECKOUT & VERIFICATION FLOW
  // ==========================================
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
    const isPaid = sessionStorage.getItem("paymentCompleted") === "true";
    const verifyingState = document.querySelector("#verifyingState");
    const failedState = document.querySelector("#failedState");

    setTimeout(() => {
      if (isPaid) {
        sessionStorage.setItem("isUnlocked", "true");
        sessionStorage.removeItem("paymentCompleted");
        window.location.href = "dashboard.html";
      } else {
        if (verifyingState) verifyingState.classList.add("d-none");
        if (failedState) failedState.classList.remove("d-none");
      }
    }, 2000);
  }
});
