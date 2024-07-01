/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import PropTypes, { object } from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';

import {
  roundTwoDecimals, createTraces, trimUsername,
} from './functions';
import MARKERS from './markers';

const GROUP = { selected: 0, none: 1 };

/**
 * Compare user activity across each flag
 */
function DeviationFromMean({
  username, votes, userAvg, entryAvg, setUsername,
}) {
  /**
   * Z SCORE FOR EACH USER
   */
  const zScoresByUser = useMemo(() => {
    const allVotesByEntry = votes.reduce((acc, vote) => {
      if (!acc[vote.entryId]) {
        acc[vote.entryId] = [];
      }
      acc[vote.entryId].push(vote.rating);
      return acc;
    }, {});

    // Entry average
    const averagesByEntry = entryAvg.reduce((acc, curr) => ({ ...acc, [curr.entryId]: curr.average }), {});
    // Entry standard deviation
    const deviationByEntry = Object.keys(allVotesByEntry).reduce((acc, entryId) => {
      const differences = allVotesByEntry[entryId].map((rating) => (rating - averagesByEntry[entryId]) ** 2);
      const sd = Math.sqrt(differences.reduce((a, b) => a + b, 0) / differences.length);
      return { ...acc, [entryId]: sd };
    }, {});

    return votes.reduce((acc, vote) => {
      if (!acc[vote.username]) {
        acc[vote.username] = [];
      }
      acc[vote.username].push((vote.rating - averagesByEntry[vote.entryId]) / deviationByEntry[vote.entryId]);
      return acc;
    }, {});
  }, [votes, userAvg, entryAvg]);

  const dataPoints = userAvg.map((ua) => {
    const zScore = zScoresByUser[ua.username].reduce((a, b) => a + b, 0) / zScoresByUser[ua.username].length;
    return {
      x: ua.average,
      y: zScore,
      group: ua.username === username ? GROUP.selected : GROUP.none,
      text: `User: ${trimUsername(ua.username, 20)}<br />Avg: ${roundTwoDecimals(ua.average)}<br />Z-score: ${roundTwoDecimals(zScore)}`,
    };
  });

  const data = createTraces(dataPoints, [
    { name: trimUsername(username), marker: MARKERS.general.selected },
    { name: 'Other users', marker: MARKERS.general.unselected },
  ]);

  const layout = {
    title: 'How positive are users?',
    xaxis: { title: 'User average' },
    yaxis: { title: 'Negativity / positivity (z̄ score)' },
  };

  /**
   * NAVIGATION
   */
  const usernamesByAvg = useMemo(() => userAvg.sort((a, b) => a.average - b.average).map((ua) => ua.username), [userAvg]);

  const handleKeyUp = useCallback(({ key }) => {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      setUsername((prev) => {
        const index = usernamesByAvg.indexOf(prev);
        if (key === 'ArrowLeft') {
          return usernamesByAvg[index - 1] || usernamesByAvg[usernamesByAvg.length - 1];
        }
        return usernamesByAvg[index + 1] || usernamesByAvg[0];
      });
    }
  }, [usernamesByAvg]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  return (
    <Plot
      data={data}
      layout={layout}
      onClick={(e) => setUsername(usernamesByAvg[e.points[0].pointIndex])}
    />
  );
}

export default DeviationFromMean;

DeviationFromMean.propTypes = {
  entryAvg: PropTypes.arrayOf(object).isRequired,
  userAvg: PropTypes.arrayOf(object).isRequired,
  username: PropTypes.string,
  votes: PropTypes.arrayOf(object).isRequired,
  setUsername: PropTypes.func.isRequired,
};

DeviationFromMean.defaultProps = {
  username: '',
};
