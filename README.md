# TriCycle Paradise – Luxury Tricycle Dealership

TriCycle Paradise is a luxury-themed tricycle dealership website built as a small full‑stack project using **Node.js**, **Express**, simple in‑memory user storage (no external SQL database), and a modern dark UI. It’s designed to feel like a premium ecommerce experience with interactive deals, a developer challenge, and smooth scroll interactions.

> Note: The current implementation keeps users in memory on the server process (no SQL or file‑based persistence). It’s ideal for demos and coursework, not for production use. [web:100]

---

## Features

### Frontend

- **Multi-page layout**

  - Home (hero + collections + highlights + CTA)
  - Shop / Products (responsive product grid)
  - Developer Deals page with interactive “How do you center a div?” challenge
  - About page with interactive timeline story module
  - Gallery, Contact, Register, Login pages with a consistent luxury dark theme. [web:96][web:97]

- **Visual design**

  - Fullscreen image “video‑style” heroes with gradient overlays.
  - Luxury card designs with soft glows and hover effects.
  - Scroll‑reveal animations for cards and content sections using Intersection Observer. [web:60][web:90]

- **Interactive components**
  - Developer challenge that validates multiple correct CSS centering techniques.
  - Clickable timeline on the About page that swaps story cards.
  - Contact form with client‑side handling (demo alert).

### Backend

- **Stack**

  - **Node.js** runtime.
  - **Express** web framework for routing and static file serving.
  - **Express-session** for login state.
  - **bcrypt** for password hashing.
  - **In‑memory user storage** (JavaScript array) for registration/login.

- **Auth**
  - User registration: username, email, password.
  - Password hashing with bcrypt before storage.
  - Login: session‑based auth with a simple `/api/user` endpoint to check status.
  - Logout: session destroy route.

> This pattern (Express + bcrypt + session) is commonly used in teaching and small prototypes before adding a database layer. [web:96]

---

## Project Structure

```text
tricycle-dealership/
├── server.js              # Express server, auth routes, static file serving
├── package.json
└── public/
    ├── index.html         # Home (hero + sections)
    ├── products.html      # Shop page
    ├── special-offer.html # Deals / developer challenge
    ├── about.html         # Interactive story timeline
    ├── gallery.html
    ├── contact.html
    ├── register.html
    ├── login.html
    ├── css/
    │   └── style.css      # Shared luxury dark theme styles
    └── js/
        └── main.js        # Auth status, scroll reveal, timeline logic
```

## Run Instructions (VS Code)

### Requirements

- **Node.js (LTS recommended)**
- **VS Code**

### Steps

1. **Download/clone** this repository to your computer.
2. Open **VS Code**.
3. Go to **File → Open Folder...** and select the project folder (the folder that contains `package.json`).
4. Open the VS Code terminal: **View → Terminal**.
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the server (try this first):
   ```bash
   npm start
   ```
   If `npm start` fails (example: “missing script: start”), run:
   ```bash
   node server.js
   ```
7. Open your browser and visit:
   - `http://localhost:3000`

> If the terminal prints a different port (example: `3001`), use that port instead.
