import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PropTypes from 'prop-types';

const STAR_SIZE = 16;

const useStyles = makeStyles({
  border: {
    color: grey[600],
    fontSize: STAR_SIZE,
  },
  container: {
    flexShrink: 0,
  },
  filled: {
    color: '#ff4500',
    fontSize: STAR_SIZE,
  },
});

function FiveStar({ rating }) {
  const classes = useStyles();

  const filledIcon = <StarIcon className={classes.filled} fontSize="small" />;
  const borderIcon = <StarBorderIcon className={classes.border} fontSize="small" />;
  return (
    <span className={classes.container}>
      {[...Array(5).keys()].map((i) => (
        <span key={i}>{i < rating ? filledIcon : borderIcon}</span>
      ))}
    </span>
  );
}

FiveStar.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default FiveStar;
