/**
 * Record and display user's vote
 */

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { deleteData, putData } from '../api';
import {
  useAuthState, useComponentsState, useSnackbarState, useSwrMutation, useVoting,
} from '../common';
import snackbarTypes from '../common/snackbarTypes';

const MIN_SCORE = 0;
const MAX_SCORE = 5;
const VOTES_URL = '/votes';

const ThemedSlider = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    margin: '0 8px',
  },
  active: {},
  mark: {
    color: theme.palette.primary.main,
    height: 8,
    marginTop: -3,
    width: 2,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
  markLabel: {
    color: theme.palette.grey[800],
  },
  thumb: {
    color: theme.palette.primary.main,
    '&:focus, &:hover, &$active': {
      boxShadow: '0px 0px 0px 8px rgba(255, 69, 0, 0.16)',
    },
  },
  valueLabel: {
    fontSize: '0.875rem',
    top: -22,
    '& *': {
      background: 'transparent',
      color: theme.palette.text.primary,
    },
  },
}))(Slider);

const useStyles = makeStyles((theme) => ({
  clearVoteButton: {
    flexShrink: 0,
    marginLeft: theme.spacing(1),
  },
  disabled: {
    color: theme.palette.grey[600],
    '& .MuiSlider-mark': {
      color: theme.palette.grey[600],
    },
    '& .MuiSlider-thumb': {
      color: theme.palette.grey[600],
    },
    '& .MuiSlider-valueLabel': {
      color: theme.palette.grey[600],
      left: -12,
    },
  },
  unrated: {
    color: theme.palette.grey[600],
    '& .MuiSlider-mark': {
      color: theme.palette.grey[600],
    },
    '& .MuiSlider-thumb': {
      visibility: 'hidden',
    },
  },
}));

const updateEntries = (entries, { entryId, rating }) => entries.reduce((acc, cur) => {
  const id = cur.imgurId ?? cur.id;
  if (id !== entryId) {
    acc.push(cur);
  } else {
    acc.push({ ...cur, rating });
  }
  return acc;
}, []);

function VotingSlider({
  entryId, rating,
}) {
  const setComponentsState = useComponentsState()[1];
  const { disableVoting, votingUnavailable: disabled } = useVoting();
  const [{ isLoggedIn }] = useAuthState();
  const { contestId } = useParams();
  const ratingRef = useRef(rating);
  const [isInteractive, setInteractive] = useState(false);

  const contestUrl = `/contests/${contestId}`;
  // useSwrContest???
  const { isMutating: isMutatingPut, trigger: triggerPut } = useSwrMutation(
    contestUrl,
    putData,
    VOTES_URL,
  );
  const { isMutating: isMutatingDelete, trigger: triggerDelete } = useSwrMutation(
    contestUrl,
    deleteData,
    VOTES_URL,
  );

  const updateSnackbarState = useSnackbarState();

  const classes = useStyles();

  useEffect(() => {
    ratingRef.current = rating;
  }, [rating]);

  useEffect(() => {
    if (isInteractive) {
      disableVoting(isMutatingDelete || isMutatingPut);
    }
  }, [isInteractive, isMutatingDelete, isMutatingPut]);

  const showError = () => {
    updateSnackbarState(snackbarTypes.VOTING_ERROR);
  };

  const triggerOptions = (input) => ({
    optimisticData: (current) => ({ ...current, entries: updateEntries(current.entries, input) }),
    revalidate: false,
    populateCache: (response, contest) => {
      if (!response) {
        showError();
        return contest;
      }

      const newEntries = updateEntries(contest.entries, input);
      const newData = { ...contest, entries: newEntries };
      updateSnackbarState(snackbarTypes.VOTING_SUCCESS);
      return newData;
    },
    onError: () => {
      showError();
    },
  });

  const handleSliderChange = async (event, newValue) => {
    if (!isLoggedIn) {
      setComponentsState({ redditLogInDialogOpen: true });
      return;
    }

    if (newValue === ratingRef.current) {
      return;
    }

    setInteractive(true);

    const voteInput = { contestId, entryId, rating: newValue };
    triggerPut(voteInput, triggerOptions(voteInput));
  };

  const clearRating = () => {
    setInteractive(true);

    const input = { contestId, entryId };
    triggerDelete(input, triggerOptions(input));
  };

  const isUnrated = !rating && rating !== 0;

  return (
    <>
      <ThemedSlider
        className={clsx({ [classes.disabled]: disabled, [classes.unrated]: isUnrated })}
        aria-label="Vote on flag"
        disabled={disabled}
        marks
        min={MIN_SCORE}
        max={MAX_SCORE}
        step={1}
        onChange={handleSliderChange}
        value={rating}
        valueLabelDisplay="on"
      />
      <Button
        className={classes.clearVoteButton}
        color="primary"
        disabled={disabled || isUnrated}
        size="small"
        onClick={clearRating}
      >
        Clear Vote
      </Button>
    </>
  );
}

VotingSlider.propTypes = {
  entryId: PropTypes.string.isRequired,
  rating: PropTypes.number,
};

VotingSlider.defaultProps = {
  rating: null,
};

export default VotingSlider;
