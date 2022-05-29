(() => {
	const timeout = function () {
		return new Promise((resolve, reject) => {
		  reject();
		})
	};

	const showLoadingIndicator = function () {
		document.getElementById('loader').classList.add('loader');
	};

	const hideLoadingIndicator = function () {
		document.getElementById('loader').classList.remove('loader');
	};

	const reset = function () {
		document.getElementById('card-container').innerHTML = '';
	};

	const createCard = function (movie) {
		return `<div class="col-md-3 my-4">
									<div class="card border border-white">
										<img
											src="${movie.Poster}" alt="${movie.Title}" style="height: 100%;">
										<div class="card-body">
											<h5 class="card-title">${movie.Title}</h5>
											<p class="card-text fw-semibold text-muted">${movie.Year}</p>
											<a href="#" class="btn btn-outline-primary showDetails" data-imdbid="${movie.imdbID}" style="width: 100%" data-bs-toggle="modal" data-bs-target="#movieDetail">Details</a>
										</div>
									</div>
								</div>`;
	};

	const getDetails = function (movieDetail) {
		return `
						<div class="modal-header">
								<h3 class="fw-semibold modal-title" id="movieDetailLabel">${movieDetail.Title}</h3>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<div class="container-fuild">
								<div class="row">
									<div class="col-md-4">
										<img
											src="${movieDetail.Poster}"
											alt="${movieDetail.Title}" class="img-fluid">
									</div>
									<div class="col-md-8">
										<ol class="list-group">
											<li class="list-group-item d-flex justify-content-between align-items-start">
												<div class="me-auto">
													<div class="fw-semibold">Released</div>
													<p class="fw-regular text-muted">${movieDetail.Released}</p>
												</div>
											</li>
											<li class="list-group-item d-flex justify-content-between align-items-start">
												<div class="me-auto">
													<div class="fw-semibold">Writer</div>
													<p class="fw-regulara text-muted">${movieDetail.Writer}</p>
												</div>
											</li>
											<li class="list-group-item d-flex justify-content-between align-items-start">
												<div class="me-auto">
													<div class="fw-semibold">Actors</div>
													<p class="fw-regular text-muted">${movieDetail.Actors}</p>
												</div>
											</li>
											<li class="list-group-item d-flex justify-content-between align-items-start">
												<div class="me-auto">
													<div class="fw-semibold">Plot</div>
													<p class="fw-regular text-muted">${movieDetail.Plot}</p>
												</div>
											</li>
											<li class="list-group-item d-flex justify-content-between align-items-start">
												<div class="me-auto">
													<div class="fw-semibold">Awards</div>
													<p class="fw-regular text-muted">${movieDetail.Awards}</p>
												</div>
											</li>
										</ol>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Close</button>
						</div>
					`;
	};

	const showContent = function (results) {
		const movies = results.Search;
		let cards = '';
		if (movies !== undefined) {
			for (const movie of movies) {
				if (movie.Poster !== 'N/A') {
					cards += createCard(movie);
					document.getElementById('card-container').innerHTML = cards;
				}
			}
		} else {
			const h5 = document.createElement('h5');
			h5.className = 'text-center fw-semibold';
			h5.innerText = "Movie doesn't exist";

			const p = document.createElement('p');
			p.innerText = "Please input another keyword which approach to movie's name";
			p.className = 'text-center text-muted';

			const cardContainer = document.getElementById('card-container');
			cardContainer.appendChild(h5);
			cardContainer.appendChild(p);
		}

		const showDetails = document.querySelectorAll('.showDetails');

		showDetails.forEach((showDetail) => {
			showDetail.addEventListener('click', function () {
				let id = this.dataset.imdbid;
				fetch(`http://www.omdbapi.com/?apikey=36a96d2e&i=${id}`)
					.then((response) => response.json())
					.then((movieDetail) => {
						document.querySelector('.modal-content').innerHTML = getDetails(movieDetail);
					});
			});
		});
	};

	document.querySelector('.search').addEventListener('click', function () {
		let searchValue = document.querySelector('input.searchValue').value;

		reset();

		(async () => {
			Promise.race([
				fetch('http://www.omdbapi.com/?apikey=36a96d2e&s=' + searchValue)
					.then((response) => response.json())
					.then(showContent)
					.then(hideLoadingIndicator),
				timeout(),
			]).catch(showLoadingIndicator);
		})();
	});
})();
