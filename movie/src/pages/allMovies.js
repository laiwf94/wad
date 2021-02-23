import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import CardGrid from '../components/cardGrid';
import { isNil, isNumber } from 'lodash';

export const StyledMovie = styled.div`
	background: url(${(props) => props.poster});
	min-height: 400px;
	height: 100%;

	position: relative;

	p,
	h2 {
		color: white;
		margin: 0.5em;
	}

	p {
		margin: 1.5em;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		display: -webkit-box;
		overflow: hidden;
	}
`;

export const GreyCover = styled.div`
	background: rgba(0, 0, 0, 0.8);
	height: 100%;
	width: 100%;
	position: absolute;
	display: grid;
	grid-template-rows: 1fr 3fr 1fr;
`;

const AllMovies = ({ sort }) => {
	const [contents, setContents] = useState(null);
	const movies = useSelector((state) => state.movie.data);
	const status = useSelector((state) => state.movie.status);

	const renderMovies = useCallback(() => {
		const s = sort.split(' ');
		const sortItem = s[0];
		const order = s[1];

		const sortedMovies = [...movies].sort((m1, m2) => {
			if (isNil(m1[sortItem]) || isNil(m2[sortItem])) {
				return 0;
			}
			if (isNumber(m1[sortItem]) && isNumber(m2[sortItem])) {
				return order === 'asc' ? m1[sortItem] - m2[sortItem] : m2[sortItem] - m1[sortItem];
			}
			return order === 'asc' ? m1[sortItem].localeCompare(m2[sortItem]) : m2[sortItem].localeCompare(m1[sortItem]);
		});

		const cardContents = [];
		for (const d of sortedMovies) {
			cardContents.push(<MovieCard title={d.title} poster={d.poster} overview={d.overview} price={d.price} key={d.id + '_' + d.title} />);
		}
		setContents(cardContents);
	}, [movies, sort]);

	useEffect(() => {
		if (status === 'success') renderMovies();
	}, [movies, renderMovies, sort, status]);

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

export default AllMovies;
