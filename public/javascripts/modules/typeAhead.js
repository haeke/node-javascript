const axios = require('axios');

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
            console.log(res.data);
          })
  });
};

export default typeAhead;
