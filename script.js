/*
  Sign-up Board
  -------------
  This file makes the page work. You will fill in three parts:
    FEATURE 1 - save a sign-up      (guide/01-feature-1.md)
    FEATURE 2 - show the list       (guide/02-feature-2.md)
    FEATURE 3 - explain a refusal   (guide/03-feature-3.md)
  Change only the parts the guide tells you to change.
*/

// ===== YOUR SETTINGS =====
// Paste your Project URL and your PUBLIC key between the quotes.
// The public key is called "publishable" (starts with sb_publishable_)
// or "anon" (a long text that starts with eyJ).
// NEVER paste the secret key (sb_secret_...) or the service_role key here.
const SUPABASE_URL = "PASTE-YOUR-PROJECT-URL";
const SUPABASE_PUBLIC_KEY = "PASTE-YOUR-PUBLIC-ANON-KEY";
// ===== END OF YOUR SETTINGS =====


// ----- Ready-made helpers. You do not need to change these. -----

const form = document.getElementById("signup-form");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const submitButton = document.getElementById("submit-button");
const messageBox = document.getElementById("message");
const list = document.getElementById("entry-list");

// Shows a short message under the form. kind is "ok" or "error".
function showMessage(text, kind) {
  messageBox.textContent = text;
  messageBox.className = "message " + (kind || "");
}

// Returns true if a key looks like a SECRET key. Secret keys must never be on a public page.
function looksSecret(key) {
  if (key.startsWith("sb_secret_")) {
    return true;
  }
  if (key.startsWith("eyJ")) {
    try {
      const middle = key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return atob(middle).includes("service_role");
    } catch (error) {
      return false;
    }
  }
  return false;
}

// Returns a problem with the settings, or "" if they look fine.
function settingsProblem() {
  if (SUPABASE_URL.startsWith("PASTE") || SUPABASE_PUBLIC_KEY.startsWith("PASTE")) {
    return "The board is not connected yet. Paste your Project URL and public key into script.js.";
  }
  if (looksSecret(SUPABASE_PUBLIC_KEY)) {
    return "Stop: that is the SECRET key. Remove it from script.js and paste the public key instead.";
  }
  return "";
}

// The headers every request to the database needs.
function databaseHeaders() {
  return {
    "apikey": SUPABASE_PUBLIC_KEY,
    "Authorization": "Bearer " + SUPABASE_PUBLIC_KEY,
    "Content-Type": "application/json"
  };
}

// Turns a database time into an easy date, in India time.
function niceTime(text) {
  return new Date(text).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  });
}


// ===== FEATURE 1: save a sign-up =====
async function saveSignup(entry) {
  return { ok: false, text: "Saving is not built yet. Follow guide/01-feature-1.md." };
}
// ===== END OF FEATURE 1 =====


// ===== FEATURE 2: show the list =====
async function loadList() {
  // Not built yet. Follow guide/02-feature-2.md.
}
// ===== END OF FEATURE 2 =====


// ===== FEATURE 3: explain a refusal =====
function explainRefusal(status, body) {
  return "Sorry, that did not save. The database said: " + (body.message || "error " + status);
}
// ===== END OF FEATURE 3 =====


// ----- What happens when someone presses "Sign up" -----
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // stop the page from reloading

  const problem = settingsProblem();
  if (problem) {
    showMessage(problem, "error");
    return;
  }

  const entry = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim()
  };

  if (entry.name === "" || !entry.email.includes("@")) {
    showMessage("Please type a name and an email with an @ in it.", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("Saving...", "");
  const result = await saveSignup(entry);
  submitButton.disabled = false;

  if (result.ok) {
    showMessage("You are on the board.", "ok");
    form.reset();
  } else {
    showMessage(result.text, "error");
  }
});


// ----- What happens when the page opens -----
const startProblem = settingsProblem();
if (startProblem) {
  showMessage(startProblem, "error");
} else {
  loadList();
}
