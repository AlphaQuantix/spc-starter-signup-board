# Feature 1: A form that saves entries

[Back to the README](../README.md) · Next: [Feature 2](02-feature-2.md)

## What you will build

Right now the form does nothing. In this guide you will:

1. Make a free online database (on a site called Supabase).
2. Make a table in it called `signups`.
3. Connect your page to the database.
4. Make the **Sign up** button save a new row.

**Done when:** you type a made-up name and email, press **Sign up**, and a new row appears in your database dashboard.

Time: about 40 minutes. Before you start, finish Steps 1 to 3 in the [README](../README.md). Your site should be live.

## Part A: Make your free database (about 10 minutes)

Only one person in your pair does Part A. Then share the login with your partner, or work side by side.

1. Go to `https://supabase.com` and click **Start your project** (or **Sign in**).
2. Click **Continue with GitHub**. Allow Supabase to use your GitHub account. This is the easiest way to sign up.
3. If Supabase asks you to make an **organization**, give it any name, for example `my-study-pair`. Choose the **Free** plan. Click **Create organization**.
4. Click **New project**. Fill in the form:
   - **Project name:** `signup-board`
   - **Database password:** click **Generate a password**. Copy it into a safe note. You will not need it in your code.
   - **Region:** choose the one closest to you, for example **South Asia (Mumbai)**.
   - If you see security options such as **Enable Data API**, leave them as they are. The Data API must stay on.
5. Click **Create new project**. Wait about two minutes while it sets up.

## Part B: Make the table and the row rules (about 5 minutes)

The file `setup.sql` in your repository has the commands that make the table. You will copy it into Supabase and run it.

1. In GitHub, open your repository. Click the file **setup.sql**.
2. Click the **Copy raw file** button. It is an icon of two squares, at the top right of the file. This copies the whole file.
3. In Supabase, open your project. In the left menu, click **SQL Editor**.
4. Click **+ New query** (or the **+** button). An empty box opens.
5. Click in the box and paste (Ctrl+V, or Cmd+V on a Mac).
6. Click the green **Run** button at the bottom right.
7. Supabase may warn you that the query has "destructive operations". That is the `drop policy` line. It only removes an old copy of a rule before making it again. Click **Run this query**.
8. You should see **Success. No rows returned**.
9. In the left menu, click **Table Editor**. You should see a table called **signups**. It is empty.

### What did setup.sql do?

- It made a table with four columns: `id`, `name`, `email` and `created_at`.
- It turned on **row rules**. Supabase calls them **Row Level Security**, or RLS. With RLS on, nobody can touch a row unless a rule says yes.
- It added two rules. The public may **add** a row. The public may **read** rows. There is no rule to change or delete. So the public cannot do that.

> **Trap: leaving the row rules off.** Without RLS, the table is open in ways you did not choose. Anyone with your public key could change or delete every row. Do not turn RLS off. If Supabase shows a red **RLS disabled** or **Unrestricted** label on your table, run setup.sql again.

## Part C: Find your Project URL and public key (about 5 minutes)

Your page needs two things to reach the database: the **Project URL** and the **public key**.

**The Project URL**

1. In Supabase, click the **Connect** button at the top of your project page. Or click **Project Settings** (the gear at the bottom of the left menu), then **Data API**.
2. Find **Project URL**. It looks like `https://abcdefghijklmnop.supabase.co`.
3. Copy it into a note.

**The public key**

1. Click **Project Settings** (the gear at the bottom of the left menu). Then click **API Keys**.
2. Find the **publishable** key. It starts with `sb_publishable_`. Copy it into your note.
3. If you see no publishable key, open the tab called **Legacy API keys** (or **Legacy anon, service_role API keys**). Copy the key called **anon** **public**. It is a long text that starts with `eyJ`.

### Which key is safe in a public repository?

| Key | Looks like | Safe in your public repo? |
|---|---|---|
| **publishable** | `sb_publishable_...` | **Yes.** It can only do what your row rules allow. |
| **anon** (legacy) | `eyJ...` (marked **anon**, **public**) | **Yes.** Same as publishable. |
| **secret** | `sb_secret_...` | **NO. Never.** |
| **service_role** (legacy) | `eyJ...` (marked **service_role**, **secret**) | **NO. Never.** |

The secret key skips every row rule. With it, a stranger could read, change or delete everything in your database. Your repository is public. Anyone can read it, and bots scan GitHub for secret keys all day.

> **Trap: pasting the secret key instead of the public key.** Check the start of the key before you paste. If it says `sb_secret_`, or the dashboard marks it **secret** or **service_role**, stop. Copy the public one. If you ever commit a secret key by mistake, tell your mentor. In Supabase, make a new secret key and delete the old one. Deleting the line from GitHub is not enough, because GitHub keeps old versions.

The page also checks for you. If it sees a secret key, it shows "Stop: that is the SECRET key".

## Part D: Paste the settings into script.js (about 5 minutes)

1. In GitHub, open your repository. Click **script.js**.
2. Click the pencil icon (**Edit this file**) at the top right.
3. Near the top, find these two lines:

   ```js
   const SUPABASE_URL = "PASTE-YOUR-PROJECT-URL";
   const SUPABASE_PUBLIC_KEY = "PASTE-YOUR-PUBLIC-ANON-KEY";
   ```

4. Replace `PASTE-YOUR-PROJECT-URL` with your Project URL. Replace `PASTE-YOUR-PUBLIC-ANON-KEY` with your **public** key. Keep the quote marks. For example (these are made-up values):

   ```js
   const SUPABASE_URL = "https://abcdefghijklmnop.supabase.co";
   const SUPABASE_PUBLIC_KEY = "sb_publishable_madeUpExample123";
   ```

   Do not put a `/` at the end of the URL.

5. Do not commit yet. Go on to Part E in the same edit.

## Part E: Make the button save a row (about 10 minutes)

You are still editing **script.js**.

1. Scroll down. Find the block that starts with `// ===== FEATURE 1: save a sign-up =====` and ends with `// ===== END OF FEATURE 1 =====`.
2. Select that whole block, from the first line to the last line. Delete it.
3. In the same place, paste this code:

```js
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
```

### What does this code do?

- `fetch` sends a message to your database over the internet.
- `method: "POST"` means "add something new".
- The address ends in `/rest/v1/signups`. That is your `signups` table.
- `databaseHeaders()` sends your public key with the message. The database uses it to check your row rules.
- `JSON.stringify(entry)` turns the name and email into text the database can read.
- If the database says yes, we return `ok: true`. The page then shows "You are on the board."
- If it says no, we show its reason. Feature 3 will make one of those reasons easier to read.

## Part F: Commit

1. Click the green **Commit changes...** button.
2. In **Commit message**, type: `Connect to the database and save sign-ups`
3. Click **Commit changes**.
4. Click the **Actions** tab. Wait for the newest line to get a green tick (about a minute).

## Check that it is done

1. Open your live site (the link from Settings > Pages). Reload the page.
2. The red "not connected yet" message should be gone. The list will still say "The list is not built yet". That is Feature 2.
3. Type a **made-up** name and email. For example, `Asha Testname` and `asha@example.com`.
4. Press **Sign up**. You should see **You are on the board.**
5. In Supabase, click **Table Editor**, then **signups**. You should see a new row with that name and email. If you do not see it, click the refresh button above the table.

**Done when:** typing a made-up name and email and pressing the button adds a new row you can see in the database dashboard.

> **Trap: real names and emails.** Your board is public. Anyone can read what is in it. Use made-up names and emails only. The domain `example.com` is made for this. It never belongs to a real person.

## If it does not work

| You see | What to do |
|---|---|
| "The board is not connected yet" | One setting still starts with `PASTE`. Check both lines in script.js. Wait for the green tick, then reload. |
| "Stop: that is the SECRET key" | You pasted the secret key. Replace it with the public key and commit. Then make a new secret key in Supabase, as the trap box above says. |
| "Could not reach the database" | The Project URL is wrong. It must start with `https://` and end with `.supabase.co`. No `/` at the end. |
| "...Invalid API key" or "...No API key found" | The key is wrong or cut short. Copy it again with the copy button in Supabase. |
| "...violates row-level security policy" or "...permission denied" | The row rules are missing. Run setup.sql again (Part B). |
| "...Could not find the table" | The table is missing. Run setup.sql again (Part B). Check the table is called `signups`. |
| Nothing changes after your commit | Wait for the green tick in **Actions**. Then reload the page. On a phone, close the tab and open it again. |

Next: [Feature 2: A list that reads them back](02-feature-2.md)
