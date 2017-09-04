import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(e) {
  e.preventDefault();
  axios
    .post(this.action)
    .then(res => {
      //target the form with heart in its name value (_storeCard)
      const isHearted = this.heart.classList.toggle('heart__button--hearted');
      //update the heart count in the view
      $('.heart-count').textContent = res.data.hearts.length;
    })
    .catch(console.error);
};

export default ajaxHeart;
