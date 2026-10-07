# Module 4 — Movie Explorer Application

A React.js take-home assignment project that demonstrates:

- Movie search
- Movie details
- Ratings
- Category/genre filters
- Responsive design
- Error handling
- Loading indicators
- React state management
- AI-assisted state-management troubleshooting

## Tech stack

- React 18
- Vite
- JavaScript ES6+
- CSS3
- TMDB API (optional live mode)
- Local demo data (works immediately without an API key)

## Run in VS Code

Open the project folder in VS Code and run:

```bash
npm install
npm run dev
```

Then open the URL shown by Vite, usually:

```text
http://localhost:5173
```

## Live movie API

The app supports **The Movie Database (TMDB)** API.

1. Create a TMDB account and obtain an API Read Access Token.
2. Paste the token into the **API Settings** box in the app.
3. Click **Save API Key & Use Live API**.
4. Search and filter movies using live data.

The token is stored only in the browser's localStorage for this student project.

## Demo mode

If you don't enter an API key, the app automatically uses a built-in movie dataset. This makes it easy to demonstrate the assignment in class without API setup.

## Suggested Git commands

```bash
git init
git add .
git commit -m "feat: build React movie explorer"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Assignment mapping

| Requirement | Implementation |
|---|---|
| Search Movies | Search form with live/demo search |
| View Movie Details | Details modal |
| Display Ratings | Rating badges and score |
| Category Filters | Genre filter buttons/dropdown |
| Responsive Design | Mobile/tablet/desktop CSS |
| Error Handling | API and empty-state messages |
| Loading Indicators | Animated loading state |
| React | Functional components + hooks |
| State Management | useState/useEffect |
| AI activity | State/debugging guidance documented in README |

## AI-assisted activity example

AI can be used to troubleshoot React state issues, explain `useEffect` dependencies, generate test cases, improve error handling, and document the component structure.
