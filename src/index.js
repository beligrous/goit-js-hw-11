import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
Notiflix.Notify.init({});
import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '31877726-de77d5eff1f0b572f2213dfa6';
let query = '';
let data = [];

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearchButton);

function onSearchButton(e) {
  e.preventDefault();

  query = e.target.elements.searchQuery.value;

  console.log(query, e.target.elements.searchQuery.value);

  if (query !== e.target.elements.searchQuery.value) {
    refs.gallery.innerHTML = '';
  }

  onFetch().then(respdata => {
    if (respdata.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    respdata.hits.map(item => data.push(item));
    render(data);

    // const markup = data.map(i => render(i)).join('');
    // refs.gallery.insertAdjacentHTML('beforeend', markup);

    refs.gallery.addEventListener('click', onImageClick);
  });
}

function render() {
  refs.gallery.innerHTML = '';
  const markup = data.map(template).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

async function onFetch() {
  const res = await axios
    .get(
      `${URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&savesearch=true`
    )
    .then(res => res.data);

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

function template({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
  largeImageURL,
}) {
  return `<a href=${largeImageURL}><div class="photo-card">
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
}
