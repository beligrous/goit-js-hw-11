import axios from 'axios';
import Notiflix from 'notiflix';
Notiflix.Notify.init({});

import { refs, render, template, query, data } from '.';

const URL = 'https://pixabay.com/api/';
const KEY = '31877726-de77d5eff1f0b572f2213dfa6';

let page = 1;
const perPage = 40;

export async function onFetch() {
  const res = await axios
    .get(
      `${URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&savesearch=true&page=${page}&per_page=${perPage}`
    )
    .then(res => res.data);

  return res;
}

export function request() {
  onFetch().then(respdata => {
    if (respdata.hits.length === 0) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${respdata.totalHits} images.`);
      refs.loadMoreBtn.classList.remove('visually-hidden');
    }
    respdata.hits.map(item => data.push(item));
    render(data);
    onLoadMore(respdata);
  });
}

function onLoadMore(respdata) {
  refs.loadMoreBtn.addEventListener('click', () => {
    if (Number(page * perPage) > Number(respdata.totalHits)) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.classList.add('visually-hidden');
    }
    page += 1;
    onFetch().then(respdata => {
      respdata.hits.map(item => data.push(item));
      render(data);
    });
  });
}
