import CardActionArea from '@material-ui/core/CardActionArea';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { LazyLoadCardImage } from '../../components';

function CardImageLink({
  children, displayWidth, height, id, image, onClick, width,
}) {
  const { state = {} } = useLocation();
  return (
    <RouterLink
      onClick={onClick}
      state={{ back: (state || {}).back, isFromContest: true }}
      style={{ textDecoration: 'none' }}
      to={`entry/${id}`}
    >
      <CardActionArea>
        <LazyLoadCardImage
          displayWidth={displayWidth}
          height={height}
          image={image}
          width={width}
        />
        {children}
      </CardActionArea>
    </RouterLink>
  );
}

CardImageLink.propTypes = {
  children: PropTypes.node,
  displayWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  width: PropTypes.number.isRequired,
};

CardImageLink.defaultProps = {
  children: null,
  onClick: () => {},
};

export default CardImageLink;
