import './styles/style.css';
import type { Gif } from './models/gif.interface';

const MEDIA_URL = 'https://i.giphy.com';

const gifs: Gif[] = [
  {
    id: 'cat-01',
    title: 'Gato programando',
    url: `${MEDIA_URL}/3oKIPnAiaMCws8nOsE.gif`,
    username: 'gifinder',
    tags: ['gato', 'programación', 'computadora'],
    rating: 'g',
  },
  {
    id: 'celebration-01',
    title: 'Celebración del equipo',
    url: `${MEDIA_URL}/l0AM0x23UvG868F8C.gif`,
    tags: ['equipo', 'éxito', 'celebración'],
    rating: 'g',
  },
  {
    id: 'coding-01',
    title: 'Código en progreso',
    url: `${MEDIA_URL}/26tn33aiTi1jkl6H6.gif`,
    username: 'developer',
    tags: ['código', 'desarrollo', 'teclado'],
    rating: 'pg',
  },
  {
    id: 'idea-01',
    title: 'Nueva idea',
    url: `${MEDIA_URL}/3o7TKsjRrfIPjeiVyM.gif`,
    tags: ['idea', 'creatividad', 'solución'],
    rating: 'g',
  },
];

// Paso 6. Verificar el arreglo
gifs.forEach((gif, index) => {
  console.log(`${index + 1}. ${gif.title}`);
});

// Paso 7. Crear la estructura visible en el DOM
const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('No se encontró el elemento #app.');
}

app.innerHTML = `
<main class="app-shell">
  <header class="hero">
    <p class="eyebrow">EC1 — Fundamentos de TypeScript</p>
    <h1>GIFinder</h1>
    <p>Explora una colección local de GIFs.</p>
  </header>

  <form id="search-form" class="search-form">
    <label for="search-input">
      Buscar por título, autor o etiqueta
    </label>
    <div class="search-row">
      <input id="search-input" name="query"
             type="search" placeholder="Ejemplo: gato"
             autocomplete="off" />
      <button type="submit">Buscar</button>
    </div>
  </form>

  <p id="search-status" class="status" aria-live="polite"></p>

  <section id="gif-gallery" class="gallery" aria-label="Resultados"></section>
</main>
`;

// Paso 8. Seleccionar los elementos con el operador '!' para garantizar que existen
const form = document.querySelector<HTMLFormElement>('#search-form')!;
const input = document.querySelector<HTMLInputElement>('#search-input')!;
const gallery = document.querySelector<HTMLElement>('#gif-gallery')!;
const status = document.querySelector<HTMLParagraphElement>('#search-status')!;

// Paso 9. Normalizar el texto
function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('es-MX');
}

// Paso 10. Comprobar si un GIF coincide
function matchesQuery(gif: Gif, query: string): boolean {
  const searchableText = [
    gif.title,
    gif.username ?? '',
    ...gif.tags,
  ].join('');

  return normalizeText(searchableText).includes(query);
}

// Paso 11. Filtrar la colección
function searchGifs(collection: Gif[], value: string): Gif[] {
  const query = normalizeText(value);
  if (!query) {
    return [...collection];
  }
  return collection.filter((gif) => matchesQuery(gif, query));
}

// Paso 12. Transformar un objeto en tarjeta HTML (con solución a bloqueo)
function createGifCard(gif: Gif): string {
  const {
    title,
    url,
    username = 'Autor no disponible',
    tags,
    rating,
  } = gif;

  return `
    <article class="gif-card">
      <img src="${url}" alt="${title}" loading="lazy" referrerpolicy="no-referrer" />
      <div class="gif-card__content">
        <h2>${title}</h2>
        <p>${username} • Clasificación: ${rating.toUpperCase()}</p>
        <p class="tags">
          ${tags.map((tag) => `#${tag}`).join(' ')}
        </p>
      </div>
    </article>
  `;
}

// Paso 13. Renderizar la colección
function renderGifs(collection: Gif[]): void {
  const total = collection.length;
  const label = total === 1 ? 'resultado' : 'resultados';
  status.textContent = `${total} ${label}`;

  if (total === 0) {
    gallery.innerHTML = `
      <p class="empty-state">
        No se encontraron GIFs. Prueba con otra palabra.
      </p>
    `;
    return;
  }

  gallery.innerHTML = collection.map(createGifCard).join('');
}

// Paso 14. Conectar el formulario y eventos
form.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault();
  const results = searchGifs(gifs, input.value);
  renderGifs(results);
});

input.addEventListener('input', () => {
  if (input.value.trim() === '') {
    renderGifs(gifs);
  }
});

// Paso 15. Mostrar la galería inicial
renderGifs(gifs);