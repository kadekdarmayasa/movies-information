function getMovies(url) {
	return new Promise((resolve, reject) => {
		const ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState === 4) {
				if (ajax.status === 200) {
					resolve(this.response);
				} else {
					reject(this.response);
				}
			}
		};
		ajax.open('get', url);
		ajax.send();
	});
}

getMovies('http://www.omdbapi.com/?apikey=36a96d2e&s=avengers').then((results) => {
	let movies = JSON.parse(results).Search;
	let cards = '';
	for (const movie of movies) {
		if (movie.Poster !== 'N/A') {
			cards += `<div class="col-md-3 my-4">
	      <div class="card border border-white">
	        <img
	          src="${movie.Poster}" alt="${movie.Title}" style="height: 100%;">
	        <div class="card-body">
	          <h5 class="card-title">${movie.Title}</h5>
	          <p class="card-text fw-semibold text-muted">${movie.Year}</p>
	          <a href="#" class="btn btn-primary" style="width: 100%">Details</a>
	        </div>
	      </div>
	    </div>`;
		}
	}
	document.getElementById('card-container').innerHTML = cards;
});
