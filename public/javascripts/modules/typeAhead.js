const axios = require('axios');
const dompurify = require('dompurify');

//map over each store and return html
function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
      `;
  }).join(''); //provide a string rather than an array
}

function typeAhead(search) {
  if (!search) {
    return;
  }

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  //addeventlistener to track what is being typed into the input
  searchInput.on('input', function () {
    if (!this.value) {
      //no value remove searchresults
      searchResults.style.display = 'none';
      return; //stop listener
    }

    //show the search result
    searchResults.style.display = 'block';

    axios.get(`/api/v1/search?q=${this.value}`)
          .then(res => {
            if (res.data.length) {
              searchReults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
              return;
            }
            //nothing came back - display messages
            searchResults.innerHTML =  dompurify.sanitize(`<div class="search__results">No results found for ${this.value} found </div>`);
          })
          .catch(err => {
            console.error(err);
          });
  });

  //handle keyboard input
  searchInput.on('keyup', (e) => {
    //skip if user isn't pressing up down or Enter
    if (![38, 40, 13].includes(e.keyCode)) {
      return; //skip
    }

    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;

    if (e.keyCode == 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.nextElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }
    //remove active class from current
    if (current) {
      current.classList.remove(activeClass);
    }

    next.classList.add(activeClass);
  });
};

export default typeAhead;
