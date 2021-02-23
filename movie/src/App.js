import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Nav from './components/nav';
import AllMovies from './pages/allMovies';
import Boxes from './pages/boxes';
import CheapestMovie from './pages/cheapestMovie';
import { fetchMovies } from './store/movie';

function App() {
	const [sort, setSort] = useState('price asc');
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchMovies());
	}, [dispatch]);

	return (
		<>
			<Nav setSort={setSort} />
			<Switch>
				<Route path='/' exact>
					<Boxes />
				</Route>
				<Route path='/all'>
					<AllMovies sort={sort} />
				</Route>
				<Route path='/cheapest'>
					<CheapestMovie />
				</Route>
			</Switch>
		</>
	);
}

export default App;
