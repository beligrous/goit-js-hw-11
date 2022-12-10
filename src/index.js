import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { onFetch, request, page } from './api';

export const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

export let query = '';
export let data = [];

refs.form.addEventListener('submit', onSearchButton);

function onSearchButton(e) {
  e.preventDefault();
  data = [];
  refs.gallery.innerHTML = '';
  query = e.target.elements.searchQuery.value;
  page = 1;
  request(data);
}

export function render() {
  const markup = data.map(template).join('');
  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: '250',
  });
}

function onImageClick(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  lightbox();
}

export function template({
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
