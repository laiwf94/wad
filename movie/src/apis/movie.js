export const fetchMovies = () => {
	const { REACT_APP_API_BASE_URL, REACT_APP_API_MOVIES_PATH, REACT_APP_API_TOKEN } = process.env;
	return fetch(`${REACT_APP_API_BASE_URL}${REACT_APP_API_MOVIES_PATH}?token=${REACT_APP_API_TOKEN}`).then(async (data) => {
		let movies = [];
		if (data.ok) {
			movies.push(...(await data.json()));
		}
		return movies;
	});
};

export const cheapestMovie = () => {
	const { REACT_APP_API_BASE_URL, REACT_APP_API_MOVIES_PATH, REACT_APP_API_TOKEN } = process.env;
	return fetch(`${REACT_APP_API_BASE_URL}${REACT_APP_API_MOVIES_PATH}?token=${REACT_APP_API_TOKEN}&sort=price&order=asc&page=1&size=1`).then(async (data) => {
		let movies = [];
		if (data.ok) {
			movies.push(...(await data.json()));
		}
		return movies;
	});
};
