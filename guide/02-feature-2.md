# Feature 2: A list that reads them back

[Back to the README](../README.md) · Previous: [Feature 1](01-feature-1.md) · Next: [Feature 3](03-feature-3.md)

## What you will build

Your form saves rows. Now the page will read them back. You will:

1. Ask the database for every row, newest first.
2. Show each row in the list on the page.
3. Update the list as soon as someone signs up, without reloading the page.

**Done when:** the page lists every entry, newest first, and a new sign-up shows in the list without reloading the page.

Time: about 30 minutes. Finish [Feature 1](01-feature-1.md) first.

## Step 1: Open script.js for editing

1. In GitHub, open your repository. Click **script.js**.
2. Click the pencil icon (**Edit this file**) at the top right.

## Step 2: Replace the Feature 2 block

1. Find the block that starts with `// ===== FEATURE 2: show the list =====` and ends with `// ===== END OF FEATURE 2 =====`.
2. Select that whole block, from the first line to the last line. Delete it.
3. In the same place, paste this code:

```js
// ===== FEATURE 2: show the list =====
async function loadList() {
  const address = SUPABASE_URL + "/rest/v1/signups?select=name,created_at&order=created_at.desc,id.desc";
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
    when.textContent = "Joined " + niceTime(row.created_at);
    item.appendChild(who);
    item.appendChild(when);
    list.appendChild(item);
  }
}
// ===== END OF FEATURE 2 =====
```

### What does this code do?

- This time `fetch` has no `method`. That means "read", not "add".
- `select=name,created_at` asks only for the name and the time. The page does not show emails.
- `order=created_at.desc` means newest first. `desc` is short for "descending": from the biggest (latest) time to the smallest. If two rows have the same time, `id.desc` puts the later row first.
- `list.replaceChildren()` empties the list. Then the loop adds one line (`li`) for each row.
- We use `textContent`, not `innerHTML`. `textContent` shows the text exactly as typed. If someone types code as their "name", it shows as plain text and does not run.

## Step 3: Update the list after each sign-up

The page already loads the list once when it opens. (Look at the very bottom of script.js. It calls `loadList()`.) Now it must also load the list again after each new sign-up.

1. Still in **script.js**, find these two lines. They are in the part that starts with `// ----- What happens when someone presses "Sign up" -----`:

   ```js
       showMessage("You are on the board.", "ok");
       form.reset();
   ```

2. Click at the end of the `form.reset();` line. Press Enter to make a new line.
3. Type this on the new line:

   ```js
       loadList();
   ```

   Now that part looks like this:

   ```js
     if (result.ok) {
       showMessage("You are on the board.", "ok");
       form.reset();
       loadList();
     } else {
   ```

## Step 4: Commit

1. Click the green **Commit changes...** button.
2. In **Commit message**, type: `Show the list newest first and refresh it after each sign-up`
3. Click **Commit changes**.
4. Click the **Actions** tab. Wait for the newest line to get a green tick.

## Check that it is done

1. Open your live site. Reload the page once.
2. The list should show the name you added in Feature 1.
3. In Supabase, open **Table Editor** > **signups**. Count the rows. The page should show the same number of names. That is "every entry".
4. Now add a new **made-up** person, for example `Ravi Madeup` and `ravi@example.com`. Press **Sign up**.
5. Do **not** reload. The new name should appear at the **top** of the list straight away.
6. Add one more. It should go to the top, above Ravi. That is "newest first".

**Done when:** the page lists every entry, newest first, and a new sign-up shows in the list without reloading the page.

> **Trap: real names and emails.** Your list is public. And your row rules let anyone read the whole table with the public key, emails too, even though the page does not show them. So use made-up names and emails only.

> **Trap: leaving the row rules off.** The list works because of one rule: "Anyone can read the board". If the list stays empty but the rows are in Table Editor, the read rule is missing. Run setup.sql again. Do not fix it by turning RLS off.

## If it does not work

| You see | What to do |
|---|---|
| The list still says "The list is not built yet" | Your change is not live yet. Wait for the green tick in **Actions**. Reload. |
| "Could not load the list" | Run setup.sql again in the SQL Editor. It adds the read rule. |
| The list is right, but a new name only shows after a reload | Step 3 is missing. Check that `loadList();` is under `form.reset();`. |
| The oldest name is at the top | Check the address has `order=created_at.desc`. |

Previous: [Feature 1](01-feature-1.md) · Next: [Feature 3: A rule that blocks duplicates](03-feature-3.md)
