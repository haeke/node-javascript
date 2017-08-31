const axios = require('axios');

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
    //remove if it does not match anymore
    searchResults.innerHTML = '';

    axios.get(`/api/v1/search?q=${this.value}`)
          .then(res => {
            if (res.data.length) {
              console.log('there is some information');
              const html = searchResultsHTML(res.data);
              searchResults.innerHTML = html;
            }
          })
          .catch(err => {
            console.error(err);
          });
  });

  //handle keyboard input
  searchInput.on('keyup', (e) => {
    console.log(e.keyCode);
    //skip if user isn't pressing up down or Enter
    if (![38, 40, 13].includes(e.keyCode)) {
      return; //skip
    }
    console.log('do something');
  });
};

export default typeAhead;
