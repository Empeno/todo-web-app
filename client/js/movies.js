const apiBaseUrl = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'https://localhost:7001'
  : 'https://todo-app-api-d04ohl.azurewebsites.net';

const uri = `${apiBaseUrl}/api/movies`;
let movies = [];

function getMovies() {
  fetch(uri)
    .then(response => response.json())
    .then(data => {
      movies = data;
      renderMovies();
    })
    .catch(error => console.error('Unable to get movies.', error));
}

function openAddForm() {
  document.getElementById('movieFormLabel').innerHTML = '<i class="bi bi-film me-2"></i>Add movie';
  document.getElementById('movie-id').value = '';
  document.getElementById('movie-title').value = '';
  document.getElementById('movie-year').value = '';
  document.getElementById('movie-genre').value = '';
  document.getElementById('movie-certification').value = '';
  document.getElementById('movie-image').value = '';
  document.getElementById('movie-myrating').value = 5;
  document.getElementById('myrating-val').textContent = '5.0';
  document.getElementById('movie-officialrating').value = '';
  document.getElementById('movie-description').value = '';
}

function displayEditForm(id) {
  const movie = movies.find(m => m.id === id);
  if (!movie) return;

  document.getElementById('movieFormLabel').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit movie';
  document.getElementById('movie-id').value = movie.id;
  document.getElementById('movie-title').value = movie.title ?? '';
  document.getElementById('movie-year').value = movie.releaseYear ?? '';
  document.getElementById('movie-genre').value = movie.genre ?? '';
  document.getElementById('movie-certification').value = movie.certification ?? '';
  document.getElementById('movie-image').value = movie.imageUrl ?? '';
  document.getElementById('movie-myrating').value = movie.myRating ?? 5;
  document.getElementById('myrating-val').textContent = (movie.myRating ?? 5).toFixed(1);
  document.getElementById('movie-officialrating').value = movie.officialRating ?? '';
  document.getElementById('movie-description').value = movie.description ?? '';

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('movieForm'));
  modal.show();
}

function readForm() {
  const idValue = document.getElementById('movie-id').value;
  const yearValue = document.getElementById('movie-year').value;
  const officialValue = document.getElementById('movie-officialrating').value;

  return {
    id: idValue ? parseInt(idValue, 10) : 0,
    title: document.getElementById('movie-title').value.trim(),
    description: document.getElementById('movie-description').value.trim(),
    genre: document.getElementById('movie-genre').value.trim(),
    imageUrl: document.getElementById('movie-image').value.trim(),
    certification: document.getElementById('movie-certification').value.trim(),
    releaseYear: yearValue ? parseInt(yearValue, 10) : null,
    myRating: parseFloat(document.getElementById('movie-myrating').value),
    officialRating: officialValue ? parseFloat(officialValue) : null
  };
}

function saveMovie() {
  const movie = readForm();
  const isEdit = movie.id && movie.id > 0;

  const request = isEdit
    ? fetch(`${uri}/${movie.id}`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(movie)
      })
    : fetch(uri, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(movie)
      });

  request
    .then(() => {
      bootstrap.Modal.getOrCreateInstance(document.getElementById('movieForm')).hide();
      getMovies();
    })
    .catch(error => console.error('Unable to save movie.', error));

  return false;
}

function deleteMovie(id) {
  fetch(`${uri}/${id}`, { method: 'DELETE' })
    .then(() => getMovies())
    .catch(error => console.error('Unable to delete movie.', error));
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}

function starRating(rating) {
  const value = rating ?? 0;
  const fullStars = Math.floor(value / 2);
  const halfStar = (value / 2) - fullStars >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      html += '<i class="bi bi-star-fill"></i>';
    } else if (i === fullStars && halfStar) {
      html += '<i class="bi bi-star-half"></i>';
    } else {
      html += '<i class="bi bi-star"></i>';
    }
  }
  return html;
}

function renderMovies() {
  const container = document.getElementById('movies');
  const emptyState = document.getElementById('empty-state');
  const term = (document.getElementById('search')?.value ?? '').toLowerCase();

  const filtered = movies.filter(m =>
    (m.title ?? '').toLowerCase().includes(term) ||
    (m.genre ?? '').toLowerCase().includes(term));

  document.getElementById('movie-count').textContent = filtered.length;
  container.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('d-none');
    return;
  }
  emptyState.classList.add('d-none');

  filtered.forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-lg-4 col-xl-3';

    const poster = movie.imageUrl
      ? `<img src="${escapeHtml(movie.imageUrl)}" alt="${escapeHtml(movie.title)}" class="movie-poster" loading="lazy"
             onerror="this.parentNode.classList.add('no-image'); this.remove();">`
      : '';

    const genreBadge = movie.genre
      ? `<span class="badge genre-badge">${escapeHtml(movie.genre)}</span>` : '';
    const certBadge = movie.certification
      ? `<span class="badge cert-badge">${escapeHtml(movie.certification)}</span>` : '';
    const year = movie.releaseYear ? `<span class="movie-year">${escapeHtml(String(movie.releaseYear))}</span>` : '';
    const official = (movie.officialRating !== null && movie.officialRating !== undefined)
      ? `<span class="official-rating"><i class="bi bi-globe2"></i> ${movie.officialRating.toFixed(1)}</span>` : '';

    col.innerHTML = `
      <div class="movie-card">
        <div class="poster-wrap">
          ${poster}
          <div class="poster-fallback"><i class="bi bi-film"></i></div>
          <div class="poster-overlay">
            <button class="btn btn-sm btn-light" onclick="displayEditForm(${movie.id})" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteMovie(${movie.id})" title="Delete"><i class="bi bi-trash"></i></button>
          </div>
          <div class="poster-badges">${certBadge}${year}</div>
        </div>
        <div class="movie-info">
          <h3 class="movie-title" title="${escapeHtml(movie.title)}">${escapeHtml(movie.title)}</h3>
          <div class="movie-meta">${genreBadge}${official}</div>
          <div class="my-rating" title="My rating: ${(movie.myRating ?? 0).toFixed(1)} / 10">
            ${starRating(movie.myRating)}
            <span class="rating-num">${(movie.myRating ?? 0).toFixed(1)}</span>
          </div>
          <p class="movie-desc">${escapeHtml(movie.description)}</p>
        </div>
      </div>`;

    container.appendChild(col);
  });
}
