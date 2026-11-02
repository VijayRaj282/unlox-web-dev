const sampleMovies = [
  {
    title: "Inception",
    year: "2010",
    rating: "8.4",
    overview: "A thief enters people's dreams to steal secrets and attempts to plant an idea.",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
  },
  {
    title: "Interstellar",
    year: "2014",
    rating: "8.7",
    overview: "Explorers travel through a wormhole in search of a future for humanity.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    overview: "Batman faces a criminal mastermind who brings chaos to Gotham City.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    title: "Avatar",
    year: "2009",
    rating: "7.9",
    overview: "A former Marine explores an alien world and becomes involved in its conflict.",
    poster: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg"
  },
  {
    title: "Titanic",
    year: "1997",
    rating: "7.9",
    overview: "A romance unfolds aboard the famous ocean liner on its ill-fated voyage.",
    poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"
  }
];

export function initMovieApp() {
  const form = document.querySelector("#movie-form");
  const input = document.querySelector("#movie-input");
  const message = document.querySelector("#movie-message");
  const results = document.querySelector("#movie-results");

  if (!form || !input || !message || !results) return;

  function renderMovies(movies) {
    results.innerHTML = movies.map((movie) => `
      <article class="movie-card">
        <div class="poster-wrap">
          <img
            src="${movie.poster}"
            alt="${movie.title} poster"
            loading="lazy"
            onerror="this.style.display='none'"
          />
        </div>
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <div class="movie-meta">
            <span>${movie.year}</span>
            <span class="rating">★ ${movie.rating}</span>
          </div>
          <p>${movie.overview}</p>
        </div>
      </article>
    `).join("");
  }

  renderMovies(sampleMovies);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = input.value.trim().toLowerCase();

    if (!query) {
      message.textContent = "Please enter a movie name.";
      results.innerHTML = "";
      return;
    }

    const filteredMovies = sampleMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query)
    );

    if (filteredMovies.length === 0) {
      message.textContent =
        "No matching sample movies found. Try Inception, Avatar, Titanic, Interstellar, or Batman.";
      results.innerHTML = "";
      return;
    }

    message.textContent = `Found ${filteredMovies.length} matching movie(s).`;
    renderMovies(filteredMovies);
  });
}