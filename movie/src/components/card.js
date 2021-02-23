import styled from 'styled-components';

export const StyledCard = styled.div`
  width: 100%;
  min-height: 100px;
  max-height: 100%;
`;

const Card = ({ children, style }) => {
	return <StyledCard style={style}>{children}</StyledCard>;
};

export default Card;
