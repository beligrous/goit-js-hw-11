import SimpleLightbox from 'simplelightbox';
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
    // console.log(respdata.hits);
    respdata.hits.map(item => data.push(item));

    const markup = data.map(i => render(i)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  });
}

function render({ webformatURL, tags, likes, views, comments, downloads }) {
  const item = `<div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy" width="640px"  />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
  return item;
}

async function onFetch() {
  const res = await fetch(
    `${URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&savesearch=true`
  ).then(res => res.json());
  return res;
}

console.log(data);
