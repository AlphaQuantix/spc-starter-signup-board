# Feature 3: A rule that blocks duplicates

[Back to the README](../README.md) · Previous: [Feature 2](02-feature-2.md) · Next: [Stretch](stretch.md)

## What you will build

Right now the same email can sign up again and again. Try it: add `asha@example.com` a second time. It works. And `ASHA@example.com` works too.

In this guide you will add a rule **in the database** that says: one sign-up per email, and capital letters do not count as different. Then you will make the page explain the refusal in plain words.

**Done when:** the same email cannot be added twice, even in capital letters, and the page shows the plain message that it is already on the board.

Time: about 30 minutes. Finish [Feature 2](02-feature-2.md) first.

### Why in the database, not in the page?

Your page is not the only way in. Anyone with your public key can send rows straight to the database, without your page. A check in the page can be skipped. A rule in the database cannot. So the real rule goes in the database. The page only explains it.

## Step 1: Add the rule to setup.sql

1. In GitHub, open your repository. Click **setup.sql**.
2. Click the pencil icon (**Edit this file**).
3. At the bottom, find this line:

   ```sql
   -- 5. FEATURE 3 goes here (guide/03-feature-3.md).
   ```

4. Select that whole line and delete it. In the same place, paste this:

```sql
-- 5. FEATURE 3: one sign-up per email, even in capital letters.
--    lower(email) turns ASHA@Example.com into asha@example.com before comparing.
create unique index if not exists signups_email_once
  on public.signups (lower(email));
```

5. Click **Commit changes...**. Commit message: `Add a database rule: one sign-up per email`. Click **Commit changes**.

### What does this do?

- An **index** is like the index at the back of a book. It helps the database find things fast.
- A **unique** index also says: no two rows may have the same value here.
- `lower(email)` makes every email small letters first. So `ASHA@example.com` and `asha@example.com` count as the same.

## Step 2: Run the rule in Supabase

Changing the file on GitHub does not change the database. You must run it.

1. In setup.sql on GitHub, click the **Copy raw file** button (two squares, top right).
2. In Supabase, click **SQL Editor**, then **+ New query**.
3. Paste. Click **Run**. If Supabase warns about "destructive operations", click **Run this query**. The file is safe to run again.
4. You should see **Success. No rows returned**.

**If you see "could not create unique index"**: your table already has the same email twice (maybe you tried it above). The rule cannot start while there are copies.

1. In Supabase, click **Table Editor** > **signups**.
2. Find the extra copies. Tick the box at the left of each extra row.
3. Click **Delete** at the top. Keep one row for each email.
4. Go back to the SQL Editor and click **Run** again.

## Step 3: Make the page explain the refusal

When the database refuses a duplicate, it sends back the code `23505`. That code means "this value must be unique, and it is already there". Right now the page shows the database's own words, which are hard to read. You will change that.

1. In GitHub, open **script.js**. Click the pencil icon.
2. Find the block that starts with `// ===== FEATURE 3: explain a refusal =====` and ends with `// ===== END OF FEATURE 3 =====`.
3. Select that whole block and delete it. In the same place, paste this:

```js
// ===== FEATURE 3: explain a refusal =====
function explainRefusal(status, body) {
  // 23505 is the database code for "this must be unique, and it is already there".
  if (body.code === "23505") {
    return "That email is already on the board.";
  }
  return "Sorry, that did not save. The database said: " + (body.message || "error " + status);
}
// ===== END OF FEATURE 3 =====
```

4. Click **Commit changes...**. Commit message: `Show a plain message when an email is already on the board`. Click **Commit changes**.
5. Click the **Actions** tab. Wait for the green tick.

## Check that it is done

1. Open your live site. Reload the page.
2. Sign up a **made-up** person, for example `Meera Fakename` and `meera@example.com`. It should work.
3. Sign up again with the **same** email: `meera@example.com`. The page should say **That email is already on the board.**
4. Try it with capital letters: `MEERA@Example.com`. The page should say the same thing.
5. In Supabase, open **Table Editor** > **signups**. There should be only **one** row for Meera.

**Done when:** the same email cannot be added twice, even in capital letters, and the page shows the plain message that it is already on the board.

> **Trap: leaving the row rules off.** Your rules now do two jobs. Row Level Security says *who* may add and read rows. The unique index says *which* rows are allowed at all. Both live in the database, so nobody can skip them by going around your page.

## If it does not work

| You see | What to do |
|---|---|
| The duplicate still saves | The rule is not in the database yet. Do Step 2 again and look for "Success". |
| "could not create unique index" | Delete the extra copies first (see Step 2). |
| A long message with "duplicate key value" | The database refused it, which is right. But Step 3 is not live yet. Wait for the green tick and reload. |

Previous: [Feature 2](02-feature-2.md) · Next: [Stretch: Add a course column](stretch.md)
