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
  const STORAGE_RESET_TOKENS_KEY = "aerolover_password_reset_tokens";

  // Dynamic secret passcode fallback
  let SECRET_PASSCODE = localStorage.getItem("aerolover_passcode") || "skyhigh";

  // ==========================================
  // INITIALIZE DEFAULT ACCOUNT (IF NONE EXISTS)
  // ==========================================
  function initializeDefaultAccount() {
    const existingAccounts = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!existingAccounts) {
      const defaultAccount = {
        "demo@aerolover.com": {
          firstName: "Demo",
          lastName: "User",
          password: "Password123",
          createdAt: new Date().toISOString(),
        },
      };
      localStorage.setItem(
        STORAGE_ACCOUNTS_KEY,
        JSON.stringify(defaultAccount),
      );

      const defaultProfile = {
        firstName: "Demo",
        lastName: "User",
        email: "demo@aerolover.com",
        bio: "Aviation Enthusiast",
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(defaultProfile));
    }
  }

  initializeDefaultAccount();

  // ==========================================
  // ADMIN DIRECT PASSWORD RESET & OPTION B
  // ==========================================
  window.adminResetPassword = function (email, newPassword) {
    const targetEmail = (email || "").trim().toLowerCase();
    const accountsData = localStorage.getItem(STORAGE_ACCOUNTS_KEY);

    if (!accountsData) {
      console.error("No registered accounts found in LocalStorage.");
      return false;
    }

    try {
      const accounts = JSON.parse(accountsData);

      if (!accounts[targetEmail]) {
        console.warn(`Account '${targetEmail}' does not exist.`);
        return false;
      }

      const passValidation = validatePasswordRules(newPassword);
      if (!passValidation.isValid) {
        console.error(`Password validation failed: ${passValidation.message}`);
        return false;
      }

      // Direct password update
      accounts[targetEmail].password = newPassword;
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));

      console.log(
        `✅ Success! Password for '${targetEmail}' has been updated to '${newPassword}'.`,
      );
      return true;
    } catch (err) {
      console.error("Error during admin password reset:", err);
      return false;
    }
  };

  // Option B UI Listener: One-click testing bypass button
  const quickResetBtn = document.querySelector("#adminQuickResetBtn");
  if (quickResetBtn) {
    quickResetBtn.addEventListener("click", () => {
      const success = window.adminResetPassword(
        "demo@aerolover.com",
        "Password123",
      );
      if (success) {
        alert("Admin Override: Password directly reset to 'Password123'!");
      }
    });
  }

  // ==========================================
  // CROSS-TAB SIGN-OUT SYNCHRONIZATION
  // ==========================================
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_LOGOUT_EVENT_KEY) {
      sessionStorage.removeItem("isUnlocked");
      sessionStorage.removeItem("paymentCompleted");
      sessionStorage.removeItem("userEmail");

      if (
        !currentPath.endsWith("signin.html") &&
        !currentPath.endsWith("signup.html")
      ) {
        window.location.href = "signin.html";
      }
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

  // ==========================================
  // 1. ROUTE GUARD (STRICT UNPAID/SIGNED-OUT BLOCKS)
  // ==========================================
  const protectedPages = [
    "dashboard.html",
    "dashboard_settings.html",
    "dashboard_1.html",
    "dashboard_2.html",
    "dashboard_3.html",
    "dashboard2.html",
    "account.html",
    "checkout.html",
  ];

  const paymentRequiredPages = ["exclusive.html"];

  const isProtected = protectedPages.some((page) => currentPath.endsWith(page));
  const isPaymentProtected = paymentRequiredPages.some((page) =>
    currentPath.endsWith(page),
  );

  if ((isProtected || isPaymentProtected) && !isUnlocked) {
    window.location.href = "signin.html";
    return;
  }

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

  function performGlobalSignOut() {
    sessionStorage.removeItem("isUnlocked");
    sessionStorage.removeItem("paymentCompleted");
    sessionStorage.removeItem("userEmail");
    localStorage.removeItem(STORAGE_REMEMBER_KEY);
    localStorage.removeItem(STORAGE_REMEMBER_EMAIL_KEY);

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

  // Sign-In Handler
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

  // ==========================================
  // DIRECT INBOX PROVIDER ROUTER & PASSWORD RESET
  // ==========================================
  function getInboxUrlForEmail(email) {
    const domain = email.split("@")[1] || "";
    switch (domain.toLowerCase()) {
      case "gmail.com":
      case "googlemail.com":
        return "https://mail.google.com";
      case "outlook.com":
      case "hotmail.com":
      case "live.com":
      case "msn.com":
        return "https://outlook.live.com";
      case "yahoo.com":
      case "ymail.com":
        return "https://mail.yahoo.com";
      case "icloud.com":
      case "me.com":
        return "https://www.icloud.com/mail";
      case "proton.me":
      case "protonmail.com":
        return "https://mail.proton.me";
      default:
        return `https://${domain}`;
    }
  }

  // Forgot Password Request Handler
  const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.querySelector("#forgotEmail");
      const sendResetBtn = document.querySelector("#sendResetBtn");
      const alertBox = document.querySelector("#forgotPasswordAlert");
      const email = emailInput ? emailInput.value.trim().toLowerCase() : "";

      clearFieldError(emailInput);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        return;
      }

      const accounts = getRegisteredAccounts();
      if (!accounts[email]) {
        showFieldError(
          emailInput,
          "No registered account found with this email address.",
        );
        return;
      }

      if (sendResetBtn) {
        sendResetBtn.disabled = true;
        sendResetBtn.textContent = "Sending Request...";
      }

      const token =
        Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      const tokens = JSON.parse(
        localStorage.getItem(STORAGE_RESET_TOKENS_KEY) || "{}",
      );
      tokens[token] = { email, expires: Date.now() + 3600000 };
      localStorage.setItem(STORAGE_RESET_TOKENS_KEY, JSON.stringify(tokens));

      setTimeout(() => {
        const inboxUrl = getInboxUrlForEmail(email);

        if (alertBox) {
          alertBox.className = "alert alert-success mt-3 shadow-sm";
          alertBox.innerHTML = `
            <div class="d-flex align-items-center mb-2">
              <span class="fs-4 me-2">📩</span>
              <div>
                <strong>Reset Link Sent to ${email}!</strong>
              </div>
            </div>
            <p class="small text-muted mb-3">
              We have sent a password reset link to your email. Please open your inbox to access the link and set a new password.
            </p>
            <div class="d-grid gap-2">
              <a href="${inboxUrl}" target="_blank" class="btn btn-sm btn-success rounded-pill fw-bold">
                Open Email Inbox (${email.split("@")[1]}) ↗
              </a>
            </div>
          `;
          alertBox.classList.remove("d-none");
        }

        if (sendResetBtn) {
          sendResetBtn.disabled = false;
          sendResetBtn.textContent = "Resend Request";
        }
      }, 800);
    });
  }

  // Reset Password Execution Handler
  const resetPasswordForm = document.querySelector("#resetPasswordForm");
  if (resetPasswordForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const alertBox = document.querySelector("#resetPasswordAlert");

    const tokens = JSON.parse(
      localStorage.getItem(STORAGE_RESET_TOKENS_KEY) || "{}",
    );
    const tokenData = tokens[token];

    if (!token || !tokenData || Date.now() > tokenData.expires) {
      if (alertBox) {
        alertBox.className = "alert alert-danger";
        alertBox.textContent =
          "This password reset link is invalid or has expired. Please request a new one.";
        alertBox.classList.remove("d-none");
      }
      resetPasswordForm.style.display = "none";
    }

    resetPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newPassInput = document.querySelector("#newPassword");
      const confirmPassInput = document.querySelector("#confirmNewPassword");
      const saveBtn = document.querySelector("#saveNewPasswordBtn");

      const newPass = newPassInput ? newPassInput.value.trim() : "";
      const confirmPass = confirmPassInput ? confirmPassInput.value.trim() : "";

      clearFieldError(newPassInput);
      clearFieldError(confirmPassInput);

      const passValidation = validatePasswordRules(newPass);
      if (!passValidation.isValid) {
        showFieldError(newPassInput, passValidation.message);
        return;
      }

      if (newPass !== confirmPass) {
        showFieldError(confirmPassInput, "Passwords do not match.");
        return;
      }

      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Updating Password...";
      }

      setTimeout(() => {
        const accounts = getRegisteredAccounts();
        if (accounts[tokenData.email]) {
          accounts[tokenData.email].password = newPass;
          saveRegisteredAccounts(accounts);
        }

        delete tokens[token];
        localStorage.setItem(STORAGE_RESET_TOKENS_KEY, JSON.stringify(tokens));

        if (alertBox) {
          alertBox.className = "alert alert-success";
          alertBox.textContent =
            "Password updated successfully! Redirecting to sign in...";
          alertBox.classList.remove("d-none");
        }

        setTimeout(() => {
          window.location.href = "signin.html";
        }, 1500);
      }, 1000);
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

  if (currentPath.endsWith("verify.html")) {
    const isPaymentCompleted =
      sessionStorage.getItem("paymentCompleted") === "true";
    const verifyingState = document.querySelector("#verifyingState");
    const failedState = document.querySelector("#failedState");

    setTimeout(() => {
      if (isPaymentCompleted) {
        sessionStorage.setItem("isUnlocked", "true");
        localStorage.setItem("aerolover_payment_active", "true");
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
      target: "latestnews.html",
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
      keywords: [
        "airspace",
        "atc",
        "traffic management",
        "navigation",
        "sky",
        "altitude",
      ],
      target: "airspace.html",
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
  // 6. CONTACT FORM HANDLER
  // ==========================================
  const contactForm = document.querySelector("#contactForm");
  const contactAlertBox = document.querySelector("#contactAlert");
  const contactAlertMsg = document.querySelector("#contactAlertMsg");
  const submitMsgBtn = document.querySelector("#submitMsgBtn");

  if (contactForm) {
    const contactEmailInput = document.querySelector("#contactEmail");

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

      if (!emailValue || !emailRegex.test(emailValue)) {
        showFieldError(
          contactEmailInput,
          "Please enter a valid email address (e.g., user@domain.com).",
        );
        if (contactAlertBox) {
          contactAlertBox.classList.add("d-none");
        }
        return;
      }

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

  // ==========================================
  // 7. AIRLINES DIRECTORY FILTERING & PAGINATION
  // ==========================================
  const airlineSearchInput = document.getElementById("filterSearch");
  const airlineRegionSelect = document.getElementById("filterRegion");
  const allianceSelect = document.getElementById("filterAlliance");
  const typeCheckboxes = document.querySelectorAll(".filter-type");
  const resetBtn = document.getElementById("resetFiltersBtn");
  const airlineCards = Array.from(
    document.querySelectorAll(".airline-card-item"),
  );
  const airlineCountDisplay = document.getElementById("airlineCount");
  const airlineNoResults = document.getElementById("noResults");
  const loadMoreAirlinesBtn =
    document.getElementById("loadMoreAirlinesBtn") ||
    document.getElementById("loadMoreBtn");

  if (airlineCards.length > 0) {
    const AIRLINES_PER_PAGE = 6;
    let visibleAirlineLimit = AIRLINES_PER_PAGE;

    function updateAirlinesDisplay() {
      const searchTerm = airlineSearchInput
        ? airlineSearchInput.value.toLowerCase().trim()
        : "";
      const selectedRegion = airlineRegionSelect
        ? airlineRegionSelect.value
        : "all";
      const selectedAlliance = allianceSelect ? allianceSelect.value : "all";
      const selectedTypes = Array.from(typeCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      const matchingCards = airlineCards.filter((card) => {
        const name = card.dataset.name ? card.dataset.name.toLowerCase() : "";
        const region = card.dataset.region || "";
        const alliance = card.dataset.alliance || "";
        const type = card.dataset.type || "";

        const matchesSearch = !searchTerm || name.includes(searchTerm);
        const matchesRegion =
          selectedRegion === "all" || region === selectedRegion;
        const matchesAlliance =
          selectedAlliance === "all" || alliance === selectedAlliance;
        const matchesType =
          selectedTypes.length === 0 || selectedTypes.includes(type);

        return matchesSearch && matchesRegion && matchesAlliance && matchesType;
      });

      airlineCards.forEach((card) => card.classList.add("d-none"));

      const cardsToDisplay = matchingCards.slice(0, visibleAirlineLimit);
      cardsToDisplay.forEach((card) => card.classList.remove("d-none"));

      if (airlineCountDisplay) {
        airlineCountDisplay.textContent = `Showing ${cardsToDisplay.length} of ${matchingCards.length} airline${matchingCards.length === 1 ? "" : "s"}`;
      }

      if (airlineNoResults) {
        if (matchingCards.length === 0) {
          airlineNoResults.classList.remove("d-none");
        } else {
          airlineNoResults.classList.add("d-none");
        }
      }

      if (loadMoreAirlinesBtn) {
        if (
          visibleAirlineLimit >= matchingCards.length ||
          matchingCards.length === 0
        ) {
          loadMoreAirlinesBtn.classList.add("d-none");
        } else {
          loadMoreAirlinesBtn.classList.remove("d-none");
        }
      }
    }

    function handleAirlineFilterChange() {
      visibleAirlineLimit = AIRLINES_PER_PAGE;
      updateAirlinesDisplay();
    }

    if (loadMoreAirlinesBtn) {
      loadMoreAirlinesBtn.addEventListener("click", () => {
        visibleAirlineLimit += AIRLINES_PER_PAGE;
        updateAirlinesDisplay();
      });
    }

    if (airlineSearchInput)
      airlineSearchInput.addEventListener("input", handleAirlineFilterChange);
    if (airlineRegionSelect)
      airlineRegionSelect.addEventListener("change", handleAirlineFilterChange);
    if (allianceSelect)
      allianceSelect.addEventListener("change", handleAirlineFilterChange);
    typeCheckboxes.forEach((cb) =>
      cb.addEventListener("change", handleAirlineFilterChange),
    );

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (airlineSearchInput) airlineSearchInput.value = "";
        if (airlineRegionSelect) airlineRegionSelect.value = "all";
        if (allianceSelect) allianceSelect.value = "all";
        typeCheckboxes.forEach((cb) => (cb.checked = true));
        handleAirlineFilterChange();
      });
    }

    updateAirlinesDisplay();
  }

  // ==========================================
  // 8. AIRPORTS DIRECTORY FILTERING & PAGINATION
  // ==========================================
  const airportWrappers = Array.from(
    document.querySelectorAll(".airport-card-wrapper"),
  );
  const loadMoreAirportsBtn = document.getElementById("loadMoreAirportsBtn");
  const airportSearchInput = document.getElementById("airportFilterInput");
  const airportRegionSelect = document.getElementById("regionFilterSelect");
  const airportNoResults = document.getElementById("noResultsMsg");
  const airportCount = document.getElementById("airportCount");

  if (airportWrappers.length > 0) {
    const AIRPORTS_PER_LOAD = 3;
    let currentVisibleAirports = AIRPORTS_PER_LOAD;

    function updateAirportsDisplay() {
      const searchTerm = airportSearchInput
        ? airportSearchInput.value.toLowerCase().trim()
        : "";
      const selectedRegion = airportRegionSelect
        ? airportRegionSelect.value
        : "all";

      const matchingAirports = airportWrappers.filter((card) => {
        const title = card.getAttribute("data-title")?.toLowerCase() || "";
        const region = card.getAttribute("data-region") || "";

        const matchesSearch = !searchTerm || title.includes(searchTerm);
        const matchesRegion =
          selectedRegion === "all" || region === selectedRegion;

        return matchesSearch && matchesRegion;
      });

      airportWrappers.forEach((card) => card.classList.add("d-none"));

      const visibleBatch = matchingAirports.slice(0, currentVisibleAirports);
      visibleBatch.forEach((card) => card.classList.remove("d-none"));

      if (airportCount) {
        airportCount.textContent = `Showing ${visibleBatch.length} of ${matchingAirports.length} airport${matchingAirports.length === 1 ? "" : "s"}`;
      }

      if (airportNoResults) {
        if (matchingAirports.length === 0) {
          airportNoResults.classList.remove("d-none");
        } else {
          airportNoResults.classList.add("d-none");
        }
      }

      if (loadMoreAirportsBtn) {
        if (
          currentVisibleAirports >= matchingAirports.length ||
          matchingAirports.length === 0
        ) {
          loadMoreAirportsBtn.parentElement.classList.add("d-none");
        } else {
          loadMoreAirportsBtn.parentElement.classList.remove("d-none");
        }
      }
    }

    if (loadMoreAirportsBtn) {
      loadMoreAirportsBtn.addEventListener("click", () => {
        currentVisibleAirports += AIRPORTS_PER_LOAD;
        updateAirportsDisplay();
      });
    }

    if (airportSearchInput) {
      airportSearchInput.addEventListener("input", () => {
        currentVisibleAirports = AIRPORTS_PER_LOAD;
        updateAirportsDisplay();
      });
    }

    if (airportRegionSelect) {
      airportRegionSelect.addEventListener("change", () => {
        currentVisibleAirports = AIRPORTS_PER_LOAD;
        updateAirportsDisplay();
      });
    }

    updateAirportsDisplay();
  }

  // ==========================================
  // 9. TIMELINE FILTER LOGIC
  // ==========================================
  const filterBtns = document.querySelectorAll("#timelineFilterGroup button");
  const newsItems = document.querySelectorAll(".news-item-wrapper");
  const noNewsAlert = document.querySelector("#noNewsAlert");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => {
          b.classList.remove("btn-primary", "active");
          b.classList.add("btn-outline-primary");
        });

        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-primary", "active");

        const selectedTimeline = btn.getAttribute("data-timeline");
        let visibleCount = 0;

        newsItems.forEach((item) => {
          const itemTimeline = item.getAttribute("data-timeline");

          if (selectedTimeline === "all" || itemTimeline === selectedTimeline) {
            item.classList.remove("d-none");
            visibleCount++;
          } else {
            item.classList.add("d-none");
          }
        });

        if (noNewsAlert) {
          if (visibleCount === 0) {
            noNewsAlert.classList.remove("d-none");
          } else {
            noNewsAlert.classList.add("d-none");
          }
        }
      });
    });
  }
});
