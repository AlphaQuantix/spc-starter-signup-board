# Sign-up Board

A sign-up board that saves entries in a real online database and shows them back, newest first.

This is the starter for project kit **PRJ-DB-01** of the SPC Research Programme project track.
You will build three features, one at a time. Each feature has its own guide. You do not need the command line. You can do everything in your web browser.

**Use made-up names and emails only.** Your board is public. Anyone can read it.

## What you will build

| Step | Guide | Done when |
|---|---|---|
| Feature 1 | [A form that saves entries](guide/01-feature-1.md) | Typing a made-up name and email and pressing the button adds a new row you can see in the database dashboard. |
| Feature 2 | [A list that reads them back](guide/02-feature-2.md) | The page lists every entry, newest first, and a new sign-up shows in the list without reloading the page. |
| Feature 3 | [A rule that blocks duplicates](guide/03-feature-3.md) | The same email cannot be added twice, even in capital letters, and the page shows the plain message that it is already on the board. |
| Stretch | [Add a course column](guide/stretch.md) | The form has a course drop-down, the table has a course column, and the list shows each person's course. |

Each feature should take a pair of you less than 45 minutes.

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | The page: a form and a list. |
| `style.css` | How the page looks. It already works on a phone. |
| `script.js` | The code that talks to the database. You will fill in three parts. |
| `setup.sql` | The commands that make your database table and its row rules. |
| `guide/` | The four step guides. |
| `.nojekyll` | An empty file. It tells GitHub Pages to serve the files as they are. Do not delete it. |

## Step 1: Make your own copy

Only one person in your pair does this step.

1. Sign in to GitHub. If you do not have an account, go to github.com and click **Sign up**.
2. Open this repository on GitHub.
3. Click the green **Use this template** button near the top right. Then click **Create a new repository**.
4. Under **Owner**, pick your own account.
5. Under **Repository name**, type `signup-board`.
6. Choose **Public**. GitHub Pages is free only for public repositories.
7. Click **Create repository**. You now have your own copy.

## Step 2: Add your partner

1. In your new repository, click **Settings** (the gear tab at the top).
2. In the left menu, click **Collaborators**. GitHub may ask for your password.
3. Click **Add people**. Type your partner's GitHub username. Click the add button.
4. Your partner gets an email. They must click **Accept invitation**.

Now you can both change the files.

## Step 3: Put the site live with GitHub Pages

1. In your repository, click **Settings**.
2. In the left menu, click **Pages**.
3. Under **Build and deployment**, find **Source**. Choose **Deploy from a branch**.
4. Under **Branch**, choose **main**. In the folder box next to it, choose **/ (root)**. Click **Save**.
5. Wait one or two minutes. Then reload the Settings > Pages screen.
6. You will see "Your site is live at" and a link. It looks like `https://your-username.github.io/signup-board/`. Open it.

The page will say "The board is not connected yet." That is correct. Feature 1 connects it.

Every time you commit a change, GitHub updates the site. This takes about a minute. To watch it, click the **Actions** tab. When the newest line has a green tick, reload your site.

## Step 4: Build the features

Start with [Feature 1](guide/01-feature-1.md). Do the guides in order.

## How to commit (save) a change on GitHub

You will do this many times. Here is how.

1. Open a file in your repository. Click the pencil icon (**Edit this file**) at the top right of the file.
2. Make your change.
3. Click the green **Commit changes...** button at the top right.
4. In **Commit message**, write what you changed in a few words. Start with a verb. For example: `Save sign-ups to the database`.
5. Leave **Commit directly to the main branch** chosen. Click **Commit changes**.

A good commit message says *what* the change does. "Update script.js" is a weak message. "Show the list newest first" is a good one.

## Keys: which one is safe?

Your database gives you two kinds of key.

- The **public key** is called **publishable** (it starts with `sb_publishable_`) or **anon** (a long text that starts with `eyJ`). It is **safe** to put in this public repository. It can only do what your row rules allow.
- The **secret key** is called **secret** (it starts with `sb_secret_`) or **service_role**. It can do anything to your database. It skips every row rule. **Never** put it in this repository, in a chat, or in a screenshot.

Guide 1 shows you where to find each one.

## Readings

- [Stack Overflow Developer Survey 2025: Technology](https://survey.stackoverflow.co/2025/technology)
- [Row Level Security (Supabase docs)](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Understanding API keys (Supabase docs)](https://supabase.com/docs/guides/api/api-keys)

## Licence

MIT. See [LICENSE](LICENSE).
