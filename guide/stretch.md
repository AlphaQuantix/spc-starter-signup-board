# Stretch: Add a course column

[Back to the README](../README.md) · Previous: [Feature 3](03-feature-3.md)

Only start this after Features 1, 2 and 3 all work.

## What you will build

Each person will pick their course from a drop-down. The database gets a new `course` column. The list shows each person's course. As a small extra, the list heading will show how many people have signed up.

**Done when:** the form has a course drop-down, the table has a course column, and the list shows each person's course.

Time: about 40 minutes. You will change three files: setup.sql, index.html and script.js.

## Step 1: Add the column to the database

1. In GitHub, open **setup.sql**. Click the pencil icon.
2. Go to the very end of the file, below the Feature 3 rule. Make a new empty line. Paste this:

```sql
-- 6. STRETCH: a course for each person.
alter table public.signups
  add column if not exists course text
  check (course in ('BBA', 'B.Com', 'BCA', 'BSc Psychology', 'Other'));

-- Tell the Data API to notice the new column straight away.
notify pgrst, 'reload schema';
```

3. Commit with the message: `Add a course column to the database`.
4. Click **Copy raw file**. In Supabase, open **SQL Editor** > **+ New query**. Paste and click **Run**. Look for **Success**.
5. In Supabase, open **Table Editor** > **signups**. You should see a new column called **course**. Old rows have `NULL` there. That means "empty".

The `check` part is a rule too. The database only accepts these five courses. Anything else is refused.

## Step 2: Add the drop-down to the form

1. In GitHub, open **index.html**. Click the pencil icon.
2. Find the email box. It is this line:

   ```html
           <input id="email-input" type="email" maxlength="200" autocomplete="off" placeholder="asha@example.com" required>
   ```

3. Click at the end of that line. Press Enter twice. Paste this:

```html
        <label for="course-input">Course</label>
        <select id="course-input" required>
          <option value="">Choose your course</option>
          <option>BBA</option>
          <option>B.Com</option>
          <option>BCA</option>
          <option>BSc Psychology</option>
          <option>Other</option>
        </select>
```

4. Commit with the message: `Add a course drop-down to the form`.

The words in the drop-down must match the words in the database rule exactly. `B.Com` with a dot, `BSc Psychology` with a space.

## Step 3: Send the course and show it

All of these changes are in **script.js**. Open it and click the pencil icon. Make all four changes, then commit once.

**Change A: find the drop-down.** Find this line near the top:

```js
const emailInput = document.getElementById("email-input");
```

Make a new line under it. Paste:

```js
const courseInput = document.getElementById("course-input");
```

**Change B: send the course.** In the part that starts with `// ----- What happens when someone presses "Sign up" -----`, find these four lines:

```js
  const entry = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim()
  };
```

Select those four lines and delete them. In the same place, paste:

```js
  const entry = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value
  };

  if (entry.course === "") {
    showMessage("Please choose a course.", "error");
    return;
  }
```

**Change C: ask for the course.** In the Feature 2 block, find `select=name,created_at`. Change it to `select=name,course,created_at`. Now the line looks like this:

```js
  const address = SUPABASE_URL + "/rest/v1/signups?select=name,course,created_at&order=created_at.desc,id.desc";
```

**Change D: show the course.** In the Feature 2 block, find this line:

```js
    when.textContent = "Joined " + niceTime(row.created_at);
```

Replace it with:

```js
    when.textContent = (row.course || "No course given") + " · Joined " + niceTime(row.created_at);
```

Old rows have no course. For them the list says "No course given".

Commit with the message: `Send each person's course and show it in the list`. Wait for the green tick in **Actions**.

## Check that it is done

1. Open your live site and reload.
2. The form has a **Course** drop-down.
3. Sign up a **made-up** person with a course, for example `Kiran Notreal`, `kiran@example.com`, **BCA**.
4. The new line at the top of the list shows **BCA**.
5. In Supabase, **Table Editor** > **signups** shows `BCA` in the **course** column for Kiran.

**Done when:** the form has a course drop-down, the table has a course column, and the list shows each person's course.

## Extra: show how many people have signed up

This is one more line. It changes the list heading from "On the board" to, for example, "On the board (4)".

1. Open **script.js**. Click the pencil icon.
2. In the Feature 2 block, find this line:

   ```js
     list.replaceChildren(); // empty the list first
   ```

3. Make a new line under it. Paste:

```js
  document.getElementById("list-title").textContent = "On the board (" + rows.length + ")";
```

4. Commit with the message: `Show how many people have signed up`.
5. Reload your site. The number in the heading should match the number of rows in **Table Editor**. Sign up one more made-up person. The number goes up by one without a reload.

> **Trap: real names and emails.** A course plus a name makes a person easier to find. Keep every name and email made up.

## If it does not work

| You see | What to do |
|---|---|
| "...Could not find the 'course' column" | Step 1 did not run in Supabase. Run setup.sql again. Wait one minute and try again. |
| "...violates check constraint" | The drop-down words do not match the database rule. Check the spelling in index.html. |
| The drop-down is there but the list shows "No course given" for new people | Change C or Change B is missing in script.js. |

Previous: [Feature 3](03-feature-3.md) · [Back to the README](../README.md)
