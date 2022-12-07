import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '31877726-de77d5eff1f0b572f2213dfa6';
let query = 'cat';
let data = [];

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearchButton);

function onSearchButton(e) {
  e.preventDefault();
  query = e.target.elements.searchQuery.value;
  onFetch().then(respdata => {
    console.log(respdata.hits);
    respdata.hits.map(item => data.push(item));

    const markup = data.map(i => render(i)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    refs.gallery.addEventListener('click', onImageClick);
  });
}

function render({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
  largeImageURL,
}) {
  const item = `<a href=${largeImageURL}><div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy"  />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br>${likes}
    </p>
    <p class="info-item">
      <b>Views</b><br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b><br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br>${downloads}
    </p>
  </div>
</div></a>`;
  return item;
}

async function onFetch() {
  const res = await fetch(
    `${URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&savesearch=true`
  ).then(res => res.json());
  return res;
}

function onImageClick(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: '250',
  });
}
