/**
 * Voting and winners
 */

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import { forceCheck } from 'react-lazyload';
import {
  Outlet, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { animateScroll } from 'react-scroll';

import {
  useCache,
  useScrollState,
  useSwrData,
} from '../../common';
import {
  EntryDescriptionDrawer,
  HtmlWrapper,
  PageContainer,
  PageWithDrawer,
  RedditLogInDialog,
} from '../../components';

import ContestAppBarMain from './ContestAppBarMain';
import ContestAppBarRight from './ContestAppBarRight';
import ContestCategorySelector from './ContestCategorySelector';
import ContestGrid from './ContestGrid';
import ContestSettings from './ContestSettings';
import ContestSponsor from './ContestSponsor';
import ContestUnderReview from './ContestUnderReview';
import ContestWinners from './ContestWinners';
import useContestSizing from './useContestSizing';

const scrollInstantlyTo = (scrollY, options = {}) => {
  const defaultOptions = { duration: 0, delay: 0 };
  animateScroll.scrollTo(scrollY, { ...defaultOptions, ...options });
};

const useStyles = makeStyles((theme) => ({
  entriesLoading: {
    visibility: 'hidden',
  },
  heading: {
    margin: '24px auto',
  },
  icon: {
    color: theme.palette.grey[700],
  },
}));

function Contest() {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const [scroll, setScroll] = useScrollState();
  const classes = useStyles();

  const apiPath = `/contests/${contestId}`;
  const { data: contest, isValidating, mutate } = useSwrData(apiPath, false);
  const updateCache = useCache(apiPath)[1];

  if (contest?.submissionWindowOpen) {
    navigate('/submission', { replace: true });
  }

  const location = useLocation();
  const { state, pathname } = location;

  const [isLoaded, setLoaded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(state?.selectedCategories ?? []);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [experimentId, setExperimentId] = useState(null);
  const [votingExpired, setVotingExpired] = useState(false);

  // Scroll to top when unmounted
  // For site-wide solution see https://reactrouter.com/en/main/components/scroll-restoration
  useEffect(() => () => {
    scrollInstantlyTo(0);
  }, []);

  // Check for elements in viewport when isLoaded changes
  useEffect(() => {
    forceCheck();
  }, [isLoaded]);

  // ??? WHAT ELSE CAN BE REMOVED HERE?
  useEffect(() => {
    // instead of isLoaded, I think we can just use contest.name
    if (!contest.name) {
      return;
    }

    // this code was moved to a separate useEffect
    // if (contest.votingWindowOpen === false) {
    //   updateCache(null);
    //   setLoaded(true);
    //   return;
    // }

    // Does replaceState and pushState matter?
    const { entryId } = scroll;
    const { scrollY } = state || {};
    if (!entryId && !scrollY) {
      return;
    }

    if (!isLoaded) {
      setScroll({});
      window.history.replaceState({}, document.title);
      window.history.pushState({ usr: { selectedCategories } }, document.title);
    }
  }, [state, contest]);

  // forceCheck elements in viewport when selectedCategories changes
  useEffect(() => {
    forceCheck();
    window.history.pushState(
      { usr: { ...window.history.state?.usr, selectedCategories } },
      document.title,
    );
  }, [selectedCategories]);

  const handleVotingExpired = useCallback(() => {
    updateCache(null);
    setVotingExpired(true);
  }, []);

  const handleReload = useCallback(() => {
    setLoaded(false);
    scrollInstantlyTo(0);
    window.location.reload();
  }, []);

  const toggleDrawerOpen = useCallback((isOpen) => {
    setExperimentId(null);
    setIsDrawerOpen(isOpen);
  }, []);

  const closeDrawer = useCallback(() => {
    toggleDrawerOpen(false);
  }, []);

  const setExperimentDrawer = useCallback((entryId) => {
    setExperimentId(entryId);
    setIsDrawerOpen(!!entryId);
  }, []);

  const scrollToEntry = useCallback((entryId) => {
    const entryEl = document.getElementById(entryId);
    if (!entryEl) {
      return;
    }

    let currentScroll = window.scrollY;

    const headerHeight = document.getElementsByTagName('header')[0].offsetHeight;
    const { bottom: entryBottom, top: entryTop } = entryEl.getBoundingClientRect();
    const windowTop = currentScroll + headerHeight;
    const windowBottom = currentScroll + window.innerHeight;

    // If no current scroll position or entry outside of window
    // Scroll so entryTop is 8 below header
    if ((entryBottom < windowTop && entryTop < windowTop)
      || (entryBottom > windowBottom && entryTop > windowBottom)
    ) {
      currentScroll = entryTop - headerHeight - 8;
    }

    scrollInstantlyTo(currentScroll);
  }, []);

  const [prevPathName, setPrevPathName] = useState(null);
  // scroll to entry when closing modal (direct link or arrow keying)
  useEffect(() => {
    if (!pathname.includes('entry') && prevPathName?.includes('entry')) {
      const pathArray = prevPathName.split('/');
      const entryIndex = pathArray.indexOf('entry');
      scrollToEntry(pathArray[entryIndex + 1]);
    }
    setPrevPathName(pathname);
  }, [pathname]);

  // scroll to stored scrollY position when login completed (see useRedditLogIn)
  // ??? overscrolls ???
  useEffect(() => {
    if (!contest.name) {
      return;
    }
    const { scrollY, innerWidth } = state;
    if (scrollY && window.innerWidth === innerWidth) {
      scrollInstantlyTo(scrollY);
    }
  }, [state.scrollY, contest.name]);

  useEffect(() => {
    // Clear the cache if the voting window is still closed, to force it to be fetched again on next visit.
    if (contest.votingWindowOpen === false) {
      updateCache(null);
      setLoaded(true);
    }
  }, [contest.votingWindowOpen]);

  const { headingVariant } = useContestSizing();

  const {
    categories,
    isContestMode,
    name,
    subtext,
    votingWindowOpen,
    winners,
  } = contest;

  return (
    <PageWithDrawer
      handleClose={closeDrawer}
      isOpen={isDrawerOpen}
      appBar={{
        className: classes.icon,
        color: 'default',
        right: <ContestAppBarRight {...{ toggleDrawerOpen }} />,
        children: <ContestAppBarMain {...{ handleVotingExpired, handleReload }} />,
      }}
      drawer={experimentId ? { heading: 'Info', children: <EntryDescriptionDrawer entryId={experimentId} /> } : { heading: 'Settings', children: <ContestSettings /> }}
    >
      <ContestSponsor />
      {name && (
        <PageContainer className={clsx({ [classes.entriesLoading]: !isLoaded })} fixed>
          <Typography className={classes.heading} variant={headingVariant} component="h1">
            {name}
          </Typography>
          {votingWindowOpen === false && <ContestUnderReview {...{ isValidating, mutate }} />}
          {isContestMode && subtext && (
            <Box marginBottom={3}>
              <Typography component="div" variant="subtitle1">
                <HtmlWrapper html={subtext} />
              </Typography>
            </Box>
          )}
          <ContestCategorySelector {...{ categories, selectedCategories, setSelectedCategories }} />
          <ContestWinners {...{ winners }} />
          <ContestGrid
            {...{
              selectedCategories,
              setExperimentDrawer,
              votingExpired,
            }}
          />
        </PageContainer>
      )}
      <RedditLogInDialog />
      <Outlet />
    </PageWithDrawer>
  );
}

export default Contest;
