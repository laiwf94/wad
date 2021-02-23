import styled from 'styled-components';
import Card, { StyledCard } from './card';

const StyledCardGrid = styled.div`
	display: grid;
	column-gap: 1em;
	row-gap: 1em;
  margin: 1em;

	@media (min-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(4, 1fr);
	}

	${StyledCard} {
		background-color: #285428;
	}

	${StyledCard}:nth-child(3n) {
		background-color: #282f54;
	}
`;

const CardGrid = ({ num = 0, contents, children }) => {
	const rendereBoxes = () => {
		const boxes = [];
		if (contents) {
				boxes.push([...contents]);
		} else if (num > 0){
			// generate empty card
			for (let i = 0; i < num; i++) {
				boxes.push(<Card key={i} />);
			}
		} else {
      return children;
    }

		return boxes;
	};

	return <StyledCardGrid>{rendereBoxes()}</StyledCardGrid>;
};

export default CardGrid;
