//Essential Variables
const authKey = "api_key=71a779af498e132c966342b153bbc9e7";
const baseUrl = "https://api.themoviedb.org/3/";
const imgBaseUrl = "https://image.tmdb.org/t/p/w500";
const discovery = "discover/movie?sort_by=popularity.desc&";
const discoveryEl = document.getElementById("discovery");
const upcoming = "movie/upcoming?";
const trending = "trending/movie/week?";
const nowPlaying = "movie/now_playing?";
const button = document.getElementById("button");
const search = document.getElementById("searcher");
const searchUrl = "search/movie?";
const baseDiscover = "discover/movie?";
const genreList = "genre/movie/list?";
const mainArea = document.getElementById("mainArea");
const genreSearchBase = "&sort_by=popularity.desc&page=1&with_genres=";
const genreEl = document.getElementById("genreList");
const hiddenGenreEl = document.getElementById("genreHidden");
const header = document.getElementById("header");
const containerContain = document.createElement("section");
containerContain.classList.add("specificMovieSec");
document.getElementById("genreHidden").appendChild(containerContain);
home();
//functions

async function home() {
  document.getElementById("genreHidden").innerHTML = "";
  await getMovies(baseUrl + trending + authKey, "Trending", "mainArea", "rows");
  await getMovies(
    baseUrl + upcoming + authKey,
    "Upcoming ",
    "mainArea",
    "rows"
  );
  await getMovies(
    baseUrl + nowPlaying + authKey,
    "Now Playing",
    "mainArea",
    "rows"
  );
  await getMoviesGenre(baseUrl + genreList + authKey);
}
async function getMoviesGenre(url) {
  try {
    const request = fetch(url);
    const response = await request;
    const data = await response.json();
    for (i = 0; i < data.genres.length; i++) {
      getMovies(
        `${baseUrl}${baseDiscover}${authKey}${genreSearchBase}${data.genres[i].id}`,
        data.genres[i].name,
        "mainArea",
        "rows"
      );
    }
  } catch (error) {
    console.log(error);
  }
}
async function getMovieSpecific(url, section, parent, classes) {
  try {
    const request = fetch(url);
    const response = await request;
    const data = await response.json();
    console.log(data);
    showMovieSpecific(data.results, section, parent, classes);
  } catch (error) {
    console.log(error);
  }
}
async function getMovies(url, section, parent, classes) {
  try {
    const request = fetch(url);
    const response = await request;
    const data = await response.json();
    showMovies(data.results, section, parent, classes);
  } catch (error) {
    console.log(error);
  }
}
function showMovies(data, section, parent, classes) {
  const moviesSection = document.createElement("section");
  moviesSection.classList.add("main-sections");
  const sectionName = document.createElement("h1");
  const rowsDiv = document.createElement("div");
  rowsDiv.classList.add(classes);
  sectionName.innerText = section;
  document.getElementById(parent).appendChild(moviesSection);
  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieContainer = document.createElement("container");
    movieContainer.classList.add("movies-container");
    movieContainer.innerHTML = `
   <a target="_blank" href="https://www.themoviedb.org/movie/${id} ">
     <div class="movieCard">
       <img src="${imgBaseUrl + poster_path}" alt="${title}" />
       <div>
         <p class="title-movie">${title}</p>
         <p class="rating-movie">${vote_average}</p>
       </div>
       <p class="description-movie">
         ${overview}
       </p>
     </div>
   </a>`;
    rowsDiv.appendChild(movieContainer);
  });
  moviesSection.appendChild(sectionName);
  moviesSection.appendChild(rowsDiv);
}
function showMovieSpecific(data, section, parent) {
  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieContainer = document.createElement("container");
    movieContainer.classList.add("movies-container");
    movieContainer.innerHTML = `
   <a target="_blank" href="https://www.themoviedb.org/movie/${id} ">
     <div class="movieCard">
       <img src="${imgBaseUrl + poster_path}" alt="${title}" />
       <div>
         <p class="title-movie">${title}</p>
         <p class="rating-movie">${vote_average}</p>
       </div>
       <p class="description-movie">
         ${overview}
       </p>
     </div>
   </a>`;
    containerContain.appendChild(movieContainer);
  });
}
// Event Listeners

search.addEventListener("keydown", function(e) {
  const searchTerm = search.value;
  if (e.key === "Enter") {
    if (searchTerm) {
      hiddenGenreEl.innerHTML = "";
      console.log(
        `${baseUrl}${searchUrl}${authKey}&query=${searchTerm}&page=${i}`
      );
      mainArea.classList.add("hidden");
      const sectionName = document.createElement("h1");
      sectionName.classList.add("genreNames");
      document.getElementById("movieSelection").classList.remove("show");
      sectionName.innerText = `results from: ${searchTerm}`;
      hiddenGenreEl.appendChild(sectionName);
      document.getElementById("genreHidden").classList.remove("hidden");
      containerContain.innerHTML = "";
      for (i = 1; i <= 10; i++) {
        getMovieSpecific(
          `${baseUrl}${searchUrl}${authKey}&query=${searchTerm}&page=${i}`,
          "",
          "genreHidden",
          "grid"
        );
        document.getElementById("genreHidden").appendChild(containerContain);
      }
    } else {
      document.getElementById("mainArea").classList.remove("hidden");
      document.getElementById("genreHidden").classList.add("hidden");
      document.getElementById("movieSelection").classList.remove("show");
      mainArea.innerHTML = "";
      home();
    }

    search.value = "";
  }
});
genreEl.addEventListener("click", function(e, value) {
  hiddenGenreEl.innerHTML = "";
  mainArea.classList.add("hidden");
  document.getElementById("movieSelection").classList.remove("show");
  const sectionName = document.createElement("h1");
  sectionName.classList.add("genreNames");
  sectionName.innerText = `${e.target.innerText}`;
  hiddenGenreEl.appendChild(sectionName);
  document.getElementById("genreHidden").classList.remove("hidden");
  console.log(e.target.id);
  containerContain.innerHTML = "";
  for (i = 1; i <= 10; i++) {
    getMovieSpecific(
      `${baseUrl}${baseDiscover}${authKey}&sort_by=popularity.desc&page=${i}&with_genres=${e.target.id}`,
      e.target.innerText,
      "genreHidden",
      "grid"
    );
    document.getElementById("genreHidden").appendChild(containerContain);
  }
});
window.addEventListener("scroll", function(e) {
  const width = window.innerWidth;
  if (width > 901) {
    if (scrollY > 150) {
      header.classList.add("opacity");
      this.document.getElementById("genreList").classList.add("opacity");
      this.document.getElementById("genreLogo").classList.add("opacity");
    } else if (scrollY < 150) {
      header.classList.remove("opacity");
      this.document.getElementById("genreList").classList.remove("opacity");
      this.document.getElementById("genreLogo").classList.remove("opacity");
    }
  }
});
document.getElementById("titleName").addEventListener("click", function(e) {
  console.log(e.target);
  document.getElementById("mainArea").classList.remove("hidden");
  document.getElementById("hiddenClass").classList.add("hidden");
  document.getElementById("genreHidden").classList.add("hidden");
  document.getElementById("movieSelection").classList.remove("show");
  mainArea.innerHTML = "";
  home();
});
document.getElementById("popular").addEventListener("click", function(e) {
  hiddenGenreEl.innerHTML = "";
  mainArea.classList.add("hidden");
  const sectionName = document.createElement("h1");
  sectionName.classList.add("genreNames");
  document.getElementById("movieSelection").classList.remove("show");
  sectionName.innerText = `${e.target.innerText}`;
  hiddenGenreEl.appendChild(sectionName);
  document.getElementById("genreHidden").classList.remove("hidden");
  console.log(e.target.id);
  console.log(`${baseUrl}movie/popular?${authKey}&page=${i}`);
  containerContain.innerHTML = "";
  for (i = 1; i <= 10; i++) {
    getMovieSpecific(
      `${baseUrl}movie/popular?${authKey}&page=${i}`,
      e.target.innerText,
      "genreHidden",
      "grid"
    );
  }
  document.getElementById("genreHidden").appendChild(containerContain);
});
document.getElementById("topRated").addEventListener("click", function(e) {
  hiddenGenreEl.innerHTML = "";
  mainArea.classList.add("hidden");
  document.getElementById("movieSelection").classList.remove("show");
  const sectionName = document.createElement("h1");
  sectionName.classList.add("genreNames");
  sectionName.innerText = `${e.target.innerText}`;
  hiddenGenreEl.appendChild(sectionName);
  document.getElementById("genreHidden").classList.remove("hidden");
  containerContain.innerHTML = "";
  for (i = 1; i <= 10; i++) {
    getMovieSpecific(
      `${baseUrl}movie/top_rated?${authKey}&page=${i}`,
      e.target.innerText,
      "genreHidden",
      "grid"
    );
  }
  document.getElementById("genreHidden").appendChild(containerContain);
});
document.getElementById("nowPlaying").addEventListener("click", function(e) {
  hiddenGenreEl.innerHTML = "";
  mainArea.classList.add("hidden");
  const sectionName = document.createElement("h1");
  sectionName.classList.add("genreNames");
  document.getElementById("movieSelection").classList.remove("show");
  sectionName.innerText = `${e.target.innerText}`;
  hiddenGenreEl.appendChild(sectionName);
  document.getElementById("genreHidden").classList.remove("hidden");
  console.log(e.target.id);
  console.log(`${baseUrl}movie/popular?${authKey}&page=${i}`);
  containerContain.innerHTML = "";
  for (i = 1; i <= 10; i++) {
    getMovieSpecific(
      `${baseUrl}movie/now_playing?${authKey}&page=${i}`,
      e.target.innerText,
      "genreHidden",
      "grid"
    );
  }
  document.getElementById("genreHidden").appendChild(containerContain);
});
document.getElementById("navimg").addEventListener("click", function() {
  document.getElementById("movieSelection").classList.toggle("show");
  console.log("click");
});
document.getElementById("genreLogo").addEventListener("click", function() {
  document.getElementById("genreList").classList.toggle("displayer");
});
