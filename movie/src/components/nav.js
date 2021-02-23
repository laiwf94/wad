import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledNav = styled.nav`
	background-color: black;
	position: absolute;
	width: 100%;
	top: 0px;
	left: 0px;

	ul {
		list-style: none;
	}

	li {
		display: inline-block;
		width: 12em;
		color: white;
		font-weight: bold;
		text-align: center;
	}
`;

const StyledLink = styled(Link)`
	color: ${(prop) => (prop.to === prop.location ? 'red' : 'white')};
	text-decoration: none;
	font-weight: bold;

	&:hover {
		color: red;
	}
`;

const Select = styled.select`
	border-radius: 10px;
	padding: 0.5em;
`;

const exportMovies = () => {
	const { REACT_APP_API_BASE_URL, REACT_APP_API_EXPORT_MOVIES_PATH, REACT_APP_API_TOKEN } = process.env;
	window.open(`${REACT_APP_API_BASE_URL}${REACT_APP_API_EXPORT_MOVIES_PATH}?token=${REACT_APP_API_TOKEN}`);
};

const Nav = ({ setSort }) => {
	let location = useLocation();

	return (
		<StyledNav>
			<ul>
				<li>
					<StyledLink to='/' location={location.pathname}>
						Boxes
					</StyledLink>
				</li>
				<li>
					<StyledLink to='/cheapest' location={location.pathname}>
						Cheapest Movie
					</StyledLink>
				</li>
				<li>
					<StyledLink to='/all' location={location.pathname}>
						All Movies
					</StyledLink>
				</li>
				{location.pathname === '/all' && (
					<li>
						<Select onChange={(data) => setSort(data.target.value)}>
							<option value='price asc'>Price Asc</option>
							<option value='price dsc'>Price Dsc</option>
							<option value='title asc'>Title Asc</option>
							<option value='title dsc'>Title Dsc</option>
							<option value='overview asc'>Overview Asc</option>
							<option value='overview dsc'>Overview Dsc</option>
						</Select>
					</li>
				)}
				<li onClick={() => exportMovies()} style={{cursor: 'pointer'}}>Export Bulk Movies</li>
			</ul>
		</StyledNav>
	);
};

export default Nav;
