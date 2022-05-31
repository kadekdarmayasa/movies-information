(() => {
	let page = 1;

	const timeout = function () {
		return new Promise((resolve, reject) => {
			reject();
		});
	};

	const showLoadingIndicator = function () {
		document.getElementById('loader').classList.add('loader');
	};

	const hideLoadingIndicator = function () {
		document.getElementById('loader').classList.remove('loader');
	};

	const reset = function () {
		document.getElementById('card-container').innerHTML = '';
		document.querySelector('.prev-next').innerHTML = '';
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

	const renderDetails = function (movieDetail) {
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

	const updateDetails = function (id) {
		fetch('http://www.omdbapi.com/?apikey=36a96d2e&i=' + id)
			.then((response) => response.json())
			.then((movieDetail) => {
				document.querySelector('.modal-content').innerHTML = renderDetails(movieDetail);
			});
	};

	const responNotFound = function (keyword) {
		page = 1;

		reset();

		Promise.race([
			fetch('http://www.omdbapi.com/?apikey=36a96d2e&s=' + keyword + '&page=' + page)
				.then((response) => ({
					keyword: keyword,
					response: response.json(),
				}))
				.then(renderMovies)
				.then(hideLoadingIndicator),
			timeout(),
		]).catch(showLoadingIndicator);
	};

	const renderMovies = function (results) {
		results.response.then((result) => {
			let movies = result.Search;
			let cards = '';

			if (movies !== undefined) {
				for (const movie of movies) {
					if (movie.Poster !== 'N/A') {
						cards += createCard(movie);
						document.getElementById('card-container').innerHTML = cards;
						let prevNextButton = document.querySelector('.prev-next');

						if (results.pageNumber > 1) {
							prevNextButton.innerHTML = `
									<nav aria-label="Page navigation example">
										<ul class="pagination d-flex justify-content-center"> 
											<li class="page-item me-4">
												<a class="prev btn btn-primary" type="button" data-keyword="${results.keyword}">Previous</a>
											</li>
											<li class="page-item">
												<a class="next btn btn-primary" type="button" data-keyword="${results.keyword}">Next</a>
											</li>
										</ul>
									</nav>`;
						} else {
							prevNextButton.innerHTML = `
								<nav aria-label="Page navigation example">
									<ul class="pagination d-flex justify-content-center">	
										<li class="page-item">
											<a class="next btn btn-primary" type="button" data-keyword="${results.keyword}">Next</a>
										</li>
									</ul>
							</nav>`;
						}
					}
				}
			} else {
				if (results.page) {
					responNotFound(results.keyword);
					return;
				}

				const cardContainer = document.getElementById('card-container');
				cardContainer.innerHTML = `
					<h5 class="text-center fw-semibold not-found-movies">Movie doesn't exist</h5>
					<p class="text-center text-muted">Please input another keyword which approach to movie's name</p>
				`;
			}
		});
	};

	document.addEventListener('click', function (e) {
		if (e.target.classList.contains('showDetails')) {
			let id = e.target.dataset.imdbid;
			updateDetails(id);
		}

		if (e.target.classList.contains('prev')) {
			let searchValue = e.target.dataset.keyword;
			if (page > 1) {
				document.querySelector('.prev').style.display = 'flex';
				--page;
			}
			fetch('http://www.omdbapi.com/?apikey=36a96d2e&s=' + searchValue + '&page=' + page)
				.then((response) => ({
					keyword: searchValue,
					pageNumber: page,
					page: true,
					response: response.json(),
				}))
				.then(renderMovies);
		}

		if (e.target.classList.contains('next')) {
			let searchValue = e.target.dataset.keyword;
			++page;

			reset();

			Promise.race([
				fetch('http://www.omdbapi.com/?apikey=36a96d2e&s=' + searchValue + '&page=' + page)
					.then((response) => ({
						keyword: searchValue,
						pageNumber: page,
						page: true,
						response: response.json(),
					}))
					.then(renderMovies)
					.then(hideLoadingIndicator),
				timeout(),
			]).catch(showLoadingIndicator);
		}
	});

	// Trigger if user press enter
	document.querySelector('.searchValue').addEventListener('keypress', function (event) {
		if (event.key == 'Enter') {
			event.preventDefault();
			document.querySelector('.search').click();
		}
	});

	// Trigger if user click search button
	document.querySelector('.search').addEventListener('click', function () {
		let searchValue = document.querySelector('input.searchValue').value;

		reset();

		Promise.race([
			fetch('http://www.omdbapi.com/?apikey=36a96d2e&s=' + searchValue)
				.then((response) => ({
					keyword: searchValue,
					pageNumber: 1,
					page: false,
					response: response.json(),
				}))
				.then(renderMovies)
				.then(hideLoadingIndicator),
			timeout(),
		]).catch(showLoadingIndicator);
	});
})();
