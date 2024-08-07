/**
 * Top entry from each contest
 * Horizontal year scroll, vertical entry scroll
 */

import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import getYear from 'date-fns/getYear';
import parseISO from 'date-fns/parseISO';
import groupBy from 'lodash/groupBy';
import throttle from 'lodash/throttle';
import { useState, useEffect } from 'react';
import { Events, animateScroll } from 'react-scroll';

import useClientWidth from '../../common/useClientWidth';
import { Header, PageContainer } from '../../components';
import useSwrHallOfFame from '../../data/useSwrHallOfFame';
import { VIEW_DEV_BAR } from '../../env';

import HallOfFameCard from './HallOfFameCard';

const tabsHeight = 48;

const useStyles = makeStyles({
  content: {
    paddingTop: tabsHeight,
  },
  tabsContainer: {
    flexGrow: 1,
    left: 0,
    position: 'fixed',
    right: 0,
    zIndex: 1000,
  },
  tabsIndicator: {
    height: 4,
  },
  tabsRoot: {
    justifyContent: 'center',
  },
  tabsScroller: {
    flexGrow: '0',
  },
});

const TOOLBAR_ID = 'hofToolbar';

const getToolbarHeight = () => document.getElementById(TOOLBAR_ID).offsetHeight;

let pauseScollListener = false;

function HallOfFame() {
  const { data: hallOfFame } = useSwrHallOfFame();

  const [selectedYear, setSelectedYear] = useState();
  const [groups, setGroups] = useState({});

  useEffect(() => {
    if (hallOfFame) {
      const entryGroups = groupBy(hallOfFame, ({ date }) => getYear(parseISO(date)));
      setGroups(entryGroups);
      setSelectedYear(Math.max(...Object.keys(entryGroups)).toString());
    }
  }, [hallOfFame]);

  const scrollHandler = throttle(() => {
    if (pauseScollListener) {
      return;
    }

    const year = Array.from(document.querySelectorAll('[id^=hofc]')).find(
      (entry) => entry.getBoundingClientRect().bottom > getToolbarHeight() + tabsHeight,
    ).attributes['data-year'].value;
    if (year !== selectedYear) {
      setSelectedYear(year);
    }
  }, 100);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    Events.scrollEvent.register('begin', () => {
      pauseScollListener = true;
    });
    Events.scrollEvent.register('end', () => {
      pauseScollListener = false;
    });

    return () => {
      document.removeEventListener('scroll', scrollHandler);
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  const theme = useTheme();
  const clientWidth = useClientWidth();

  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const imageWidth = Math.min(clientWidth, theme.breakpoints.values.md)
    - theme.spacing(isSmUp ? 3 : 2) * 2;

  const handleTabsChange = (event, newValue) => {
    setSelectedYear(newValue);
    animateScroll.scrollTo(
      document
        .getElementById(`hofc-${groups[newValue][0].date}`)
        .getBoundingClientRect().top
        + window.scrollY
        - getToolbarHeight()
        - tabsHeight
        - theme.spacing(3) / 2,
      {
        duration: 650,
        delay: 0,
        smooth: 'easeInOutQuad',
      },
    );
  };

  const classes = useStyles();
  return (
    <>
      <Header position="fixed" to="/">
        Hall of Fame
      </Header>
      <Toolbar id={TOOLBAR_ID} />
      {hallOfFame && !!hallOfFame.length && (
        <>
          {VIEW_DEV_BAR && <Toolbar variant="dense" />}
          <Paper className={classes.tabsContainer} square>
            <Tabs
              classes={{
                indicator: classes.tabsIndicator,
                root: classes.tabsRoot,
                scroller: classes.tabsScroller,
              }}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTabsChange}
              value={selectedYear}
              variant="scrollable"
            >
              {Object.keys(groups)
                .sort((a, b) => b - a)
                .map((year) => (
                  <Tab key={year} label={year} value={year} />
                ))}
            </Tabs>
          </Paper>
          <PageContainer className={classes.content} maxWidth="md">
            {hallOfFame.map((entry) => (
              <HallOfFameCard
                key={entry.entryId}
                entry={entry}
                imageDisplayWidth={imageWidth}
              />
            ))}
          </PageContainer>
        </>
      )}
    </>
  );
}

export default HallOfFame;
