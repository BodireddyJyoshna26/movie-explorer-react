import { useEffect, useMemo, useState } from "react";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Drama",
  "Horror",
  "Science Fiction",
  "Thriller"
];

const DEMO_MOVIES = [
  {
    id: 1,
    title: "Starlight Odyssey",
    overview: "A fearless crew crosses an unknown galaxy to find a lost world before a cosmic storm arrives.",
    release_date: "2025-03-14",
    vote_average: 8.4,
    vote_count: 2841,
    genre_ids: [878, 12],
    genres: ["Science Fiction", "Adventure"],
    runtime: 126,
    backdrop_path: null,
    poster_path: null
  },
  {
    id: 2,
    title: "The Last Detective",
    overview: "A veteran detective gets one final case when a string of impossible clues points to a hidden conspiracy.",
    release_date: "2024-11-08",
    vote_average: 8.1,
    vote_count: 1732,
    genre_ids: [80, 53],
    genres: ["Thriller", "Drama"],
    runtime: 118,
    poster_path: null
  },
  {
    id: 3,
    title: "Pixel Pals",
    overview: "Two unlikely friends discover a magical arcade and must work together to save their hometown.",
    release_date: "2024-07-19",
    vote_average: 7.7,
    vote_count: 921,
    genre_ids: [16, 35, 12],
    genres: ["Animation", "Comedy", "Adventure"],
    runtime: 96,
    poster_path: null
  },
  {
    id: 4,
    title: "Midnight Signal",
    overview: "A radio host receives a mysterious broadcast that predicts events before they happen.",
    release_date: "2023-10-27",
    vote_average: 7.4,
    vote_count: 1204,
    genre_ids: [27, 53],
    genres: ["Horror", "Thriller"],
    runtime: 104,
    poster_path: null
  },
  {
    id: 5,
    title: "Letters From Home",
    overview: "A young writer returns to her hometown and rediscovers an unfinished family story.",
    release_date: "2025-01-24",
    vote_average: 8.0,
    vote_count: 843,
    genre_ids: [18],
    genres: ["Drama"],
    runtime: 109,
    poster_path: null
  },
  {
    id: 6,
    title: "Velocity",
    overview: "A street racer enters an international competition where every turn has a personal cost.",
    release_date: "2024-09-06",
    vote_average: 7.9,
    vote_count: 2108,
    genre_ids: [28, 53],
    genres: ["Action", "Thriller"],
    runtime: 112,
    poster_path: null
  },
  {
    id: 7,
    title: "Ocean Guardians",
    overview: "A team of young marine scientists races to protect a reef from an approaching disaster.",
    release_date: "2023-06-16",
    vote_average: 8.2,
    vote_count: 1301,
    genre_ids: [12, 18],
    genres: ["Adventure", "Drama"],
    runtime: 121,
    poster_path: null
  },
  {
    id: 8,
    title: "Laughing Matter",
    overview: "A struggling comedian gets an unexpected opportunity that changes the course of her career.",
    release_date: "2025-05-02",
    vote_average: 7.6,
    vote_count: 699,
    genre_ids: [35],
    genres: ["Comedy"],
    runtime: 101,
    poster_path: null
  }
];

function getPoster(movie) {
  if (movie.poster_path) return `${TMDB_IMAGE}${movie.poster_path}`;
  const title = encodeURIComponent(movie.title);
  return `https://placehold.co/500x750/121a2a/eaf2ff?text=${title}`;
}

function formatYear(date) {
  return date ? new Date(date).getFullYear() : "N/A";
}

function formatRating(value) {
  return typeof value === "number" ? value.toFixed(1) : "N/A";
}

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("tmdb_token") || "");
  const [keyInput, setKeyInput] = useState(() => localStorage.getItem("tmdb_token") || "");
  const [movies, setMovies] = useState(DEMO_MOVIES);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLive, setIsLive] = useState(Boolean(apiKey));

  const filteredMovies = useMemo(() => {
    if (genre === "All") return movies;
    return movies.filter((movie) =>
      (movie.genres || []).some((item) => item.toLowerCase() === genre.toLowerCase())
    );
  }, [movies, genre]);

  useEffect(() => {
    if (!apiKey) {
      setMovies(DEMO_MOVIES);
      setIsLive(false);
    }
  }, [apiKey]);

  async function fetchMovies(searchTerm = "") {
    setLoading(true);
    setError("");

    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      const term = searchTerm.trim().toLowerCase();
      const demoResults = term
        ? DEMO_MOVIES.filter((movie) =>
            `${movie.title} ${movie.overview}`.toLowerCase().includes(term)
          )
        : DEMO_MOVIES;

      setMovies(demoResults);
      setIsLive(false);
      setLoading(false);
      return;
    }

    try {
      const endpoint = searchTerm.trim()
        ? `${TMDB_BASE}/search/movie?query=${encodeURIComponent(searchTerm.trim())}&include_adult=false&language=en-US&page=1`
        : `${TMDB_BASE}/trending/movie/week?language=en-US`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("TMDB rejected the API token. Check your token and try again.");
      }

      const data = await response.json();

      const normalized = (data.results || []).map((movie) => ({
        ...movie,
        genres: genreNames(movie.genre_ids)
      }));

      setMovies(normalized);
      setIsLive(true);
    } catch (err) {
      setError(err.message || "Could not load movies.");
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }

  function genreNames(ids = []) {
    const map = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      18: "Drama",
      27: "Horror",
      878: "Science Fiction",
      53: "Thriller"
    };
    return ids.map((id) => map[id]).filter(Boolean);
  }

  async function handleSearch(event) {
    event.preventDefault();
    setGenre("All");
    await fetchMovies(query);
  }

  function saveApiKey() {
    const value = keyInput.trim();
    if (!value) {
      localStorage.removeItem("tmdb_token");
      setApiKey("");
      setError("");
      setMovies(DEMO_MOVIES);
      return;
    }
    localStorage.setItem("tmdb_token", value);
    setApiKey(value);
    setError("");
    fetchMovies(query);
  }

  function useDemoMode() {
    localStorage.removeItem("tmdb_token");
    setApiKey("");
    setKeyInput("");
    setMovies(DEMO_MOVIES);
    setIsLive(false);
    setError("");
    setQuery("");
    setGenre("All");
  }

  return (
    <div className="app">
      <header className="hero">
        <nav className="nav container">
          <div className="brand">
            <div className="brand-mark">▶</div>
            <div>
              <span className="eyebrow">MODULE 4 • REACT.JS</span>
              <strong>Movie Explorer</strong>
            </div>
          </div>
          <div className={`mode-pill ${isLive ? "live" : ""}`}>
            <span></span>
            {isLive ? "Live API" : "Demo Mode"}
          </div>
        </nav>

        <div className="hero-content container">
          <p className="eyebrow">DISCOVER • SEARCH • EXPLORE</p>
          <h1>Find your next<br /><span>favorite movie.</span></h1>
          <p className="hero-copy">
            Search movies, compare ratings, filter by category, and open detailed movie information.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie..."
              aria-label="Search movies"
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <main className="container main-content">
        <section className="api-panel">
          <div>
            <strong>API Settings</strong>
            <p>
              Optional: add a TMDB API Read Access Token for live movie data.
              The project also works in demo mode without a key.
            </p>
          </div>
          <div className="api-actions">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste TMDB API Read Access Token"
              aria-label="TMDB API token"
            />
            <button className="secondary-btn" onClick={saveApiKey}>Save & Use Live API</button>
            <button className="text-btn" onClick={useDemoMode}>Demo Mode</button>
          </div>
        </section>

        <section className="toolbar">
          <div>
            <p className="eyebrow">BROWSE</p>
            <h2>{query ? `Results for “${query}”` : "Popular picks"}</h2>
          </div>
          <div className="genre-filter">
            {GENRES.map((item) => (
              <button
                key={item}
                className={genre === item ? "active" : ""}
                onClick={() => setGenre(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="alert" role="alert">
            <span>⚠️</span>
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <h3>Finding movies...</h3>
            <p>Fetching the latest results.</p>
          </div>
        ) : filteredMovies.length ? (
          <section className="movie-grid" aria-live="polite">
            {filteredMovies.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <button className="poster-button" onClick={() => setSelectedMovie(movie)}>
                  <img src={getPoster(movie)} alt={`${movie.title} poster`} />
                  <span className="rating-badge">★ {formatRating(movie.vote_average)}</span>
                </button>
                <div className="movie-info">
                  <div className="movie-meta">
                    <span>{formatYear(movie.release_date)}</span>
                    <span>•</span>
                    <span>{movie.genres?.[0] || "Movie"}</span>
                  </div>
                  <h3>{movie.title}</h3>
                  <button className="details-link" onClick={() => setSelectedMovie(movie)}>
                    View Details →
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="empty-state">
            <div>🎬</div>
            <h3>No movies found</h3>
            <p>Try another search term or select a different category.</p>
          </div>
        )}
      </main>

      {selectedMovie && (
        <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMovie(null)} aria-label="Close">×</button>
            <div className="modal-layout">
              <img src={getPoster(selectedMovie)} alt={`${selectedMovie.title} poster`} />
              <div className="modal-content">
                <p className="eyebrow">MOVIE DETAILS</p>
                <h2>{selectedMovie.title}</h2>
                <div className="detail-row">
                  <span>★ {formatRating(selectedMovie.vote_average)}</span>
                  <span>{formatYear(selectedMovie.release_date)}</span>
                  {selectedMovie.runtime && <span>{selectedMovie.runtime} min</span>}
                </div>
                <p className="overview">
                  {selectedMovie.overview || "No overview is available for this movie."}
                </p>
                <div className="tag-list">
                  {(selectedMovie.genres || []).map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>React Movie Explorer • Module 4 Take-Home Assignment</p>
      </footer>
    </div>
  );
}

export default App;
