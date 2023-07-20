/**
 * ??? When is this displayed?
 * ??? onClick={mutate} vs onClick={() => mutate()}
 */

import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

import {
  SpinnerButton,
} from '../../components';

function ContestEarly({ isValidating, mutate }) {
  return (
    <>
      <Box marginBottom={2}>
        We are working on getting the contest ready! Please check again soon.
      </Box>
      <SpinnerButton
        color="primary"
        disabled={isValidating}
        onClick={mutate}
        submitting={isValidating}
        variant="contained"
      >
        Refresh
      </SpinnerButton>
    </>
  );
}

ContestEarly.propTypes = {
  mutate: PropTypes.func,
  isValidating: PropTypes.bool,
};

ContestEarly.defaultProps = {
  mutate: () => { },
  isValidating: true,
};

export default ContestEarly;
