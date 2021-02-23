import { useCallback, useEffect, useState } from 'react';
import { cheapestMovie } from '../apis/movie';
import CardGrid from '../components/cardGrid';
import { GreyCover, StyledMovie } from './allMovies';

const CheapestMovie = ({ sort }) => {
	const [contents, setContents] = useState(null);

	const fetchMovies = useCallback(() => {
		cheapestMovie()
			.then((data) => {
				if (data.length === 0) {
					throw new Error('No available Movie');
				}
				const movies = [];
				for (const d of data) {
					movies.push(<MovieCard title={d.title} poster={d.poster} overview={d.overview} price={d.price} key={d.id + '_' + d.title} />);
				}
				setContents(movies);
			})
			.catch((err) => {
				setContents(null);
			});
	}, []);

	useEffect(() => {
		fetchMovies();
	}, [fetchMovies]);

	const MovieCard = ({ title, poster, overview, price }) => {
		return (
			<StyledMovie poster={poster}>
				<GreyCover>
					<h2>{title}</h2>
					<p>{overview}</p>
					<p>${price}</p>
				</GreyCover>
			</StyledMovie>
		);
	};

	return <CardGrid contents={contents}>No Movie Available</CardGrid>;
};

export default CheapestMovie;
