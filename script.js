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
const SUPABASE_URL = "https://owppvtsmrcpbptzfrvlm.supabase.co";
const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93cHB2dHNtcmNwYnB0emZydmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MzY1MjUsImV4cCI6MjExMDUxMjUyNX0.Xit1-o4hFwETXKwTPa7KwGgrnqmvcCM2kbfJUP68ZWk";
// ===== END OF YOUR SETTINGS =====


// ----- Ready-made helpers. You do not need to change these. -----

const form = document.getElementById("signup-form");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const courseInput = document.getElementById("course-input");
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
  const address = SUPABASE_URL + "/rest/v1/signups";
  try {
    const response = await fetch(address, {
      method: "POST",
      headers: databaseHeaders(),
      body: JSON.stringify(entry)
    });
    if (response.ok) {
      return { ok: true };
    }
    const body = await response.json().catch(function () { return {}; });
    return { ok: false, text: explainRefusal(response.status, body) };
  } catch (error) {
    return { ok: false, text: "Could not reach the database. Check the Project URL in script.js." };
  }
}
// ===== END OF FEATURE 1 =====


// ===== FEATURE 2: show the list =====
async function loadList() {
  const address = SUPABASE_URL + "/rest/v1/signups?select=name,course,created_at&order=created_at.desc,id.desc";
  let rows;
  try {
    const response = await fetch(address, { headers: databaseHeaders() });
    if (!response.ok) {
      showMessage("Could not load the list. Run setup.sql again to check the row rules.", "error");
      return;
    }
    rows = await response.json();
  } catch (error) {
    showMessage("Could not reach the database. Check the Project URL in script.js.", "error");
    return;
  }

  list.replaceChildren(); // empty the list first
  document.getElementById("list-title").textContent = "On the board (" + rows.length + ")";

  if (rows.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No one yet. Be the first!";
    list.appendChild(empty);
    return;
  }

  for (const row of rows) {
    const item = document.createElement("li");
    const who = document.createElement("strong");
    who.textContent = row.name;
    const when = document.createElement("span");
    when.className = "when";
    when.textContent = (row.course || "No course given") + " · Joined " + niceTime(row.created_at);
    item.appendChild(who);
    item.appendChild(when);
    list.appendChild(item);
  }
}
// ===== END OF FEATURE 2 =====


// ===== FEATURE 3: explain a refusal =====
function explainRefusal(status, body) {
  // 23505 is the database code for "this must be unique, and it is already there".
  if (body.code === "23505") {
    return "That email is already on the board.";
  }
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
    email: emailInput.value.trim(),
    course: courseInput.value
  };

  if (entry.course === "") {
    showMessage("Please choose a course.", "error");
    return;
  }

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
    loadList();
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
