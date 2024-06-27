# Tally

Collect ideas, keep a tally of how many times they come up, then use them to
make decisions.

## Architecture

Raycast app frontend
* search as you type for similar existing items
* create a new item
* add +1 to an existing item
* show top-tally items
* add item comment

Hono Node.js backend API
* search
* add item
* increment tally
* fetch items, sorted by tally (asc, desc)

Management Webapp - Next.js App Router
* CRUD on tokens
* CRUD on items
* View item history
* View token history

Neon database
Deployed serverless
