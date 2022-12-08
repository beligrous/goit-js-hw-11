import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
Notiflix.Notify.init({});
import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '31877726-de77d5eff1f0b572f2213dfa6';
let query = '';
let page = 0;
const perPage = 40;
let data = [];

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchButton);

function onSearchButton(e) {
  e.preventDefault();

  query = e.target.elements.searchQuery.value;
  refs.loadMoreBtn.classList.remove('visually-hidden');

  page += 1;

  // if (query !== e.target.elements.searchQuery.value) {
  //   refs.gallery.innerHTML = '';
  // }

  onFetch().then(respdata => {
    if (respdata.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    respdata.hits.map(item => data.push(item));
    render(data);

    refs.loadMoreBtn.addEventListener('click', () => {
      page += 1;
      console.log(page * perPage, respdata.totalHits);
      if (Number(page * perPage) > Number(respdata.totalHits)) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loadMoreBtn.classList.add('visually-hidden');
      }
      onFetch().then(respdata => {
        respdata.hits.map(item => data.push(item));
        render(data);
      });
    });
  });
}

function render() {
  const markup = data.map(template).join('');
  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: '250',
  });
}

async function onFetch() {
  const res = await axios
    .get(
      `${URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&savesearch=true&page=${page}&per_page=${perPage}`
    )
    .then(res => res.data);

  return res;
}

function onImageClick(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  lightbox();
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
