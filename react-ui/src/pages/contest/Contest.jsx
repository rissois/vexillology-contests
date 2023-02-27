import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import EmojiEventsOutlinedIcon from '@material-ui/icons/EmojiEventsOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import ThumbsUpDownOutlinedIcon from '@material-ui/icons/ThumbsUpDownOutlined';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { forceCheck } from 'react-lazyload';
import { useLocation, useParams } from 'react-router-dom';
import { animateScroll } from 'react-scroll';

import {
  useClientWidth,
  useScrollState,
  useSettingsState,
  useSwrData,
  useComponentsState,
} from '../../common';
import {
  ArrowBackButton,
  Average,
  CustomIconButton,
  CustomRadio,
  ExternalLink,
  FiveStar,
  FmpIcon,
  HtmlWrapper,
  PageWithDrawer,
  RedditLogInDialog,
  RedditUserAttribution,
  VotingCountdown,
  VotingSlider,
} from '../../components';

import CardImageLink from './CardImageLink';
import Subheader from './Subheader';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const CATEGORY_MENU_PROPS = {
  PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 } },
};
const FILTER_CATEGORIES_LABEL_ID = 'filter-categories-label';

const LABEL_COLORS = [
  { backgroundColor: 'rgb(231, 231, 231)', color: 'rgb(70, 70, 70)' },
  { backgroundColor: 'rgb(182, 207, 245)', color: 'rgb(13, 52, 114)' },
  { backgroundColor: 'rgb(152, 215, 228)', color: 'rgb(13, 59, 68)' },
  { backgroundColor: 'rgb(227, 215, 255)', color: 'rgb(61, 24, 142)' },
  { backgroundColor: 'rgb(251, 211, 224)', color: 'rgb(113, 26, 54)' },
  { backgroundColor: 'rgb(242, 178, 168)', color: 'rgb(138, 28, 10)' },

  { backgroundColor: 'rgb(194, 194, 194)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(73, 134, 231)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(45, 162, 187)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(185, 154, 255)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(246, 145, 178)', color: 'rgb(153, 74, 100)' },
  { backgroundColor: 'rgb(251, 76, 47)', color: 'rgb(255, 255, 255)' },

  { backgroundColor: 'rgb(255, 200, 175)', color: 'rgb(122, 46, 11)' },
  { backgroundColor: 'rgb(255, 222, 181)', color: 'rgb(122, 71, 6)' },
  { backgroundColor: 'rgb(251, 233, 131)', color: 'rgb(89, 76, 5)' },
  { backgroundColor: 'rgb(253, 237, 193)', color: 'rgb(104, 78, 7)' },
  { backgroundColor: 'rgb(179, 239, 211)', color: 'rgb(11, 79, 48)' },
  { backgroundColor: 'rgb(162, 220, 193)', color: 'rgb(4, 80, 46)' },

  { backgroundColor: 'rgb(255, 117, 55)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(255, 173, 70)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(235, 219, 222)', color: 'rgb(102, 46, 55)' },
  { backgroundColor: 'rgb(204, 166, 172)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(66, 214, 146)', color: 'rgb(9, 66, 40)' },
  { backgroundColor: 'rgb(22, 167, 101)', color: 'rgb(255, 255, 255)' },

  { backgroundColor: 'rgb(7, 130, 197)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(7, 130, 197)', color: 'rgb(247, 151, 28)' },
  { backgroundColor: 'rgb(25, 25, 112)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(17, 44, 62)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(13, 17, 23)', color: 'rgb(201, 209, 217)' },
  { backgroundColor: 'rgb(34, 99, 190)', color: 'rgb(255, 255, 255)' },

  { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(67, 67, 67)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(102, 102, 102)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(153, 153, 153)', color: 'rgb(255, 255, 255)' },
  { backgroundColor: 'rgb(204, 204, 204)', color: 'rgb(0, 0, 0)' },
  { backgroundColor: 'rgb(239, 239, 239)', color: 'rgb(0, 0, 0)' },
  { backgroundColor: 'rgb(243, 243, 243)', color: 'rgb(0, 0, 0)' },
  { backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(0, 0, 0)' },

  { backgroundColor: 'rgb(251, 76, 47)', color: 'rgb(130, 33, 17)' },
  { backgroundColor: 'rgb(255, 173, 71)', color: 'rgb(164, 106, 33)' },
  { backgroundColor: 'rgb(250, 209, 101)', color: 'rgb(170, 136, 49)' },
  { backgroundColor: 'rgb(22, 167, 102)', color: 'rgb(7, 98, 57)' },
  { backgroundColor: 'rgb(67, 214, 146)', color: 'rgb(26, 118, 77)' },
  { backgroundColor: 'rgb(74, 134, 232)', color: 'rgb(28, 69, 135)' },
  { backgroundColor: 'rgb(164, 121, 226)', color: 'rgb(65, 35, 109)' },
  { backgroundColor: 'rgb(246, 145, 179)', color: 'rgb(131, 51, 76)' },

  { backgroundColor: 'rgb(246, 197, 190)', color: 'rgb(130, 33, 17)' },
  { backgroundColor: 'rgb(255, 230, 199)', color: 'rgb(164, 106, 33)' },
  { backgroundColor: 'rgb(254, 241, 209)', color: 'rgb(170, 136, 49)' },
  { backgroundColor: 'rgb(185, 228, 208)', color: 'rgb(7, 98, 57)' },
  { backgroundColor: 'rgb(198, 243, 222)', color: 'rgb(26, 118, 77)' },
  { backgroundColor: 'rgb(201, 218, 248)', color: 'rgb(28, 69, 135)' },
  { backgroundColor: 'rgb(228, 215, 245)', color: 'rgb(65, 35, 109)' },
  { backgroundColor: 'rgb(252, 222, 232)', color: 'rgb(131, 51, 76)' },

  { backgroundColor: 'rgb(239, 160, 147)', color: 'rgb(130, 33, 17)' },
  { backgroundColor: 'rgb(255, 214, 162)', color: 'rgb(164, 106, 33)' },
  { backgroundColor: 'rgb(252, 232, 179)', color: 'rgb(170, 136, 49)' },
  { backgroundColor: 'rgb(137, 211, 178)', color: 'rgb(7, 98, 57)' },
  { backgroundColor: 'rgb(160, 234, 201)', color: 'rgb(26, 118, 77)' },
  { backgroundColor: 'rgb(164, 194, 244)', color: 'rgb(28, 69, 135)' },
  { backgroundColor: 'rgb(208, 188, 241)', color: 'rgb(65, 35, 109)' },
  { backgroundColor: 'rgb(251, 200, 217)', color: 'rgb(131, 51, 76)' },

  { backgroundColor: 'rgb(230, 101, 80)', color: 'rgb(130, 33, 17)' },
  { backgroundColor: 'rgb(255, 188, 107)', color: 'rgb(164, 106, 33)' },
  { backgroundColor: 'rgb(252, 218, 131)', color: 'rgb(170, 136, 49)' },
  { backgroundColor: 'rgb(68, 185, 132)', color: 'rgb(7, 98, 57)' },
  { backgroundColor: 'rgb(104, 223, 169)', color: 'rgb(26, 118, 77)' },
  { backgroundColor: 'rgb(109, 158, 235)', color: 'rgb(28, 69, 135)' },
  { backgroundColor: 'rgb(182, 148, 232)', color: 'rgb(65, 35, 109)' },
  { backgroundColor: 'rgb(247, 167, 192)', color: 'rgb(131, 51, 76)' },

  { backgroundColor: 'rgb(204, 58, 33)', color: 'rgb(246, 197, 190)' },
  { backgroundColor: 'rgb(234, 160, 65)', color: 'rgb(255, 230, 199)' },
  { backgroundColor: 'rgb(242, 201, 96)', color: 'rgb(254, 241, 209)' },
  { backgroundColor: 'rgb(20, 158, 96)', color: 'rgb(185, 228, 208)' },
  { backgroundColor: 'rgb(61, 199, 137)', color: 'rgb(198, 243, 222)' },
  { backgroundColor: 'rgb(60, 120, 216)', color: 'rgb(201, 218, 248)' },
  { backgroundColor: 'rgb(142, 99, 206)', color: 'rgb(228, 215, 245)' },
  { backgroundColor: 'rgb(224, 119, 152)', color: 'rgb(252, 222, 232)' },

  { backgroundColor: 'rgb(172, 43, 22)', color: 'rgb(246, 197, 190)' },
  { backgroundColor: 'rgb(207, 137, 51)', color: 'rgb(255, 230, 199)' },
  { backgroundColor: 'rgb(213, 174, 73)', color: 'rgb(254, 241, 209)' },
  { backgroundColor: 'rgb(11, 128, 75)', color: 'rgb(185, 228, 208)' },
  { backgroundColor: 'rgb(42, 156, 104)', color: 'rgb(198, 243, 222)' },
  { backgroundColor: 'rgb(40, 91, 172)', color: 'rgb(201, 218, 248)' },
  { backgroundColor: 'rgb(101, 62, 155)', color: 'rgb(228, 215, 245)' },
  { backgroundColor: 'rgb(182, 87, 117)', color: 'rgb(252, 222, 232)' },

  { backgroundColor: 'rgb(130, 33, 17)', color: 'rgb(246, 197, 190)' },
  { backgroundColor: 'rgb(164, 106, 33)', color: 'rgb(255, 230, 199)' },
  { backgroundColor: 'rgb(170, 136, 49)', color: 'rgb(254, 241, 209)' },
  { backgroundColor: 'rgb(7, 98, 57)', color: 'rgb(185, 228, 208)' },
  { backgroundColor: 'rgb(26, 118, 77)', color: 'rgb(198, 243, 222)' },
  { backgroundColor: 'rgb(28, 69, 135)', color: 'rgb(201, 218, 248)' },
  { backgroundColor: 'rgb(65, 35, 109)', color: 'rgb(228, 215, 245)' },
  { backgroundColor: 'rgb(131, 51, 76)', color: 'rgb(252, 222, 232)' },
];

const scrollInstantlyTo = (scrollY) => {
  animateScroll.scrollTo(scrollY, { duration: 0, delay: 0 });
};

const useStyles = makeStyles((theme) => {
  const styles = {
    categories: {
      alignItems: 'center',
      columnGap: 8,
      display: 'flex',
      marginBottom: 16,
      maxWidth: 600,
      minHeight: 50,
      minWidth: 120,
    },
    categoryChip: {
      margin: 2,
    },
    categoryLabel: {
      borderRadius: 4,
      display: 'inline',
      padding: '0 4px',
    },
    disabledVoting: {
      cursor: 'wait',
    },
    divider: {
      height: 2,
      marginBottom: 16,
    },
    entriesLoading: {
      visibility: 'hidden',
    },
    entry: {
      backgroundColor: theme.palette.grey[100],
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    entryHeading: {
      columnGap: 4,
      display: 'flex',
      minHeight: 60,
      padding: 8,
    },
    entryImageContainer: {
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
    },
    entryInfo: {
      display: 'flex',
      flexGrow: 1,
      paddingTop: 4,
    },
    entryRatings: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      textAlign: 'end',
    },
    heading: {
      margin: '24px auto',
    },
    icon: {
      color: theme.palette.grey[700],
    },
    listSubheader: {
      color: theme.palette.grey[900],
      fontSize: '.6875rem',
      fontWeight: 500,
      letterSpacing: '.8px',
      lineHeight: 1,
      margin: '16px 0',
      textTransform: 'uppercase',
    },
    myRating: {
      color: theme.palette.grey[600],
      display: 'flex',
      fontStyle: 'italic',
      justifyContent: 'right',
    },
    numberSymbol: {
      marginRight: 4,
    },
    selectedCategory: {
      fontWeight: theme.typography.fontWeightMedium,
    },
    sponsorBanner: {
      alignItems: 'center',
      backgroundColor: theme.palette.flagMakerPrint.main,
      color: theme.palette.common.white,
      columnGap: 8,
      display: 'flex',
      justifyContent: 'center',
      padding: 8,
      '&:hover': {
        textDecoration: 'none',
      },
    },
    sponsorIcon: {
      fill: theme.palette.common.white,
      width: 24,
    },
    votingSlider: {
      marginTop: 16,
    },
    winnerCard: {
      marginTop: 4,
      marginBottom: 16,
    },
    winnerContent: {
      flexGrow: 1,
      paddingTop: 4,
    },
    winnerHeading: {
      columnGap: 8,
      display: 'flex',
    },
  };
  LABEL_COLORS.forEach((label, index) => {
    styles[`label${index}`] = label;
  });
  return styles;
});

const imageWidths = {
  default: {
    lg: 400,
    md: 448,
    sm: 552,
  },
  compact: {
    lg: 302,
    md: 299,
    sm: 272,
  },
  full: {
    lg: 1280,
    md: 960,
    sm: 600,
  },
};

let scrollingIntervalId;

function Contest() {
  const { contestId } = useParams();
  const [scroll, setScroll] = useScrollState();
  const [contest, updateCache] = useSwrData(`/contests/${contestId}`, !!scroll.entryId);

  const { state = {} } = useLocation();
  const [isLoaded, setLoaded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(state?.selectedCategories ?? []);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [votingExpired, setVotingExpired] = useState(false);
  const [{ votingDisabled }, setComponentsState] = useComponentsState();

  const updateScroll = () => {
    setScroll({
      y: window.scrollY,
    });
  };

  useEffect(() => {
    if (!contest.name) {
      return;
    }

    const { entryId, y } = scroll;
    const { innerWidth, requestId, scrollY } = state || {};
    if (!entryId && !scrollY) {
      setLoaded(true);
      return;
    }

    if (!isLoaded && !scrollingIntervalId) {
      scrollingIntervalId = setInterval(() => {
        if (scrollY) {
          if (window.innerWidth === innerWidth) {
            scrollInstantlyTo(scrollY);
          }
        } else {
          const entryEl = document.getElementById(entryId);
          if (!entryEl) {
            return;
          }

          let scrollTop = y;

          const headerHeight = document.getElementsByTagName('header')[0].offsetHeight;
          const { bottom, top } = entryEl.getBoundingClientRect();
          const windowTop = scrollTop + headerHeight;
          const windowBottom = scrollTop + window.innerHeight;
          if (
            scrollTop === undefined
            || (bottom < windowTop && top < windowTop)
            || (bottom > windowBottom && top > windowBottom)
            || requestId !== contest.requestId
          ) {
            scrollTop = top - headerHeight - 8;
          }

          scrollInstantlyTo(scrollTop);
        }
        setLoaded(true);
        setScroll({});
        window.history.replaceState({}, document.title);
        window.history.pushState({ usr: { selectedCategories } }, document.title);
        clearInterval(scrollingIntervalId);
        scrollingIntervalId = null;
      }, 50);
    }
  }, [state, contest]);

  useEffect(() => {
    forceCheck();
    window.history.pushState(
      { usr: { ...window.history.state.usr, selectedCategories } },
      document.title,
    );
  }, [selectedCategories]);

  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value.sort());
  };

  const resetSelectedCategories = () => {
    setSelectedCategories([]);
  };

  const [{ density = 'default' }, updateSettings] = useSettingsState();

  const handleDensityChange = (event) => {
    updateSettings('density', event.target.value);
  };

  const toggleSettingsOpen = () => {
    setSettingsOpen(!isSettingsOpen);
  };

  const backLink = (state || {}).back || '/contests';

  const handleVotingExpired = () => {
    updateCache(null);
    setVotingExpired(true);
  };

  const handleReload = () => {
    setLoaded(false);
    scrollInstantlyTo(0);
    window.location.reload();
  };

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  let key;
  if (isLgUp) {
    key = 'lg';
  } else if (isMdUp) {
    key = 'md';
  } else if (isSmUp) {
    key = 'sm';
  }

  const clientWidth = useClientWidth();
  const defaultContainerWidth = clientWidth - 32;

  let gridDisplayWidth = defaultContainerWidth;
  let winnerDisplayWidth = defaultContainerWidth;
  if (key) {
    gridDisplayWidth = imageWidths[density][key];
    winnerDisplayWidth = imageWidths.full[key] - 48;
  }

  const classes = useStyles();

  const getGridVariables = (fullWidth) => {
    const xs = 12;
    let sm = 12;
    let md = 6;
    let lg = 4;

    if (fullWidth) {
      md = 12;
      lg = 12;
    } else if (density === 'compact') {
      sm = 6;
      md = 4;
      lg = 3;
    }

    return {
      xs,
      sm,
      md,
      lg,
    };
  };

  const headingVariant = isSmUp ? 'h3' : 'h5';

  const votingUnavailable = votingDisabled || votingExpired;

  const {
    categories,
    date,
    entries,
    isContestMode,
    localVoting,
    name,
    subtext,
    validRedditId,
    voteEnd,
    winners,
    winnersThreadId,
  } = contest;
  const voteEndDate = new Date(voteEnd);

  const getLabelStyle = (category) => classes[`label${categories.indexOf(category) % LABEL_COLORS.length}`];
  return (
    <PageWithDrawer
      handleClose={() => {
        setSettingsOpen(false);
      }}
      isOpen={isSettingsOpen}
      appBar={{
        className: classes.icon,
        color: 'default',
        right: (
          <>
            {!localVoting && validRedditId && (
              <CustomIconButton
                href={`https://redd.it/${contestId}`}
                ariaLabel="Open voting thread"
                Icon={ThumbsUpDownOutlinedIcon}
              />
            )}
            {winnersThreadId && (
              <CustomIconButton
                href={`https://redd.it/${winnersThreadId}`}
                ariaLabel="Open winners thread"
                Icon={EmojiEventsOutlinedIcon}
              />
            )}
            <CustomIconButton
              ariaLabel="View settings"
              onClick={toggleSettingsOpen}
              Icon={SettingsOutlinedIcon}
            />
          </>
        ),
        children: (
          <>
            <ArrowBackButton state={{ date }} to={backLink} />
            {isContestMode && (
              <Box display="inline-flex" paddingLeft={1.5}>
                <VotingCountdown
                  handleExpiry={handleVotingExpired}
                  handleReload={handleReload}
                  voteEndDate={voteEndDate}
                />
              </Box>
            )}
          </>
        ),
      }}
      drawer={{
        heading: 'Settings',
        children: (
          <FormControl component="fieldset">
            <List
              dense
              subheader={<ListSubheader className={classes.listSubheader}>Density</ListSubheader>}
            >
              <RadioGroup
                aria-label="density"
                name="density"
                value={density}
                onChange={handleDensityChange}
              >
                <ListItem>
                  <FormControlLabel
                    value="default"
                    control={<CustomRadio color="primary" />}
                    label="Default"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    value="compact"
                    control={<CustomRadio color="primary" />}
                    label="Compact"
                  />
                </ListItem>
              </RadioGroup>
            </List>
          </FormControl>
        ),
      }}
    >
      <ExternalLink
        className={classes.sponsorBanner}
        href="https://flagmaker-print.com/"
        target="_blank"
      >
        <FmpIcon className={classes.sponsorIcon} />
        <Typography component="span" variant="subtitle2">
          Powered by Flagmaker & Print ~ Design and Print your own flags!
        </Typography>
      </ExternalLink>
      {name && (
        <Container className={clsx({ [classes.entriesLoading]: !isLoaded })} fixed>
          <Typography className={classes.heading} variant={headingVariant} component="h1">
            {name}
          </Typography>
          {isContestMode && subtext && (
            <Box marginBottom={3}>
              <Typography component="div" variant="subtitle1">
                <HtmlWrapper html={subtext} />
              </Typography>
            </Box>
          )}
          {categories?.length > 0 && (
            <div className={classes.categories}>
              <Typography id={FILTER_CATEGORIES_LABEL_ID} variant="caption">
                Filter categories:
              </Typography>
              <Select
                input={<Input />}
                labelId={FILTER_CATEGORIES_LABEL_ID}
                MenuProps={CATEGORY_MENU_PROPS}
                multiple
                onChange={handleCategoryChange}
                renderValue={(selected) => (
                  <Box display="flex" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        className={clsx(classes.categoryChip, getLabelStyle(value))}
                        key={value}
                        label={value}
                      />
                    ))}
                  </Box>
                )}
                value={selectedCategories}
              >
                {categories.map((category, index) => (
                  <MenuItem
                    className={clsx({
                      [classes.selectedCategory]: selectedCategories.includes(category),
                    })}
                    key={category}
                    value={category}
                  >
                    <div
                      className={clsx(
                        classes.categoryLabel,
                        classes[`label${index % LABEL_COLORS.length}`],
                      )}
                    >
                      {category}
                    </div>
                  </MenuItem>
                ))}
              </Select>
              <Button
                disabled={!selectedCategories.length}
                size="small"
                onClick={resetSelectedCategories}
              >
                Reset
              </Button>
            </div>
          )}
          {winners && winners.length > 0 && (
            <>
              <Subheader>Top 20</Subheader>
              {winners.map(({
                height, id, imgurLink, name: entryName, rank, user, width,
              }) => (
                <React.Fragment key={id}>
                  <div id={id} className={classes.winnerHeading}>
                    <Typography variant={headingVariant}>
                      <span className={classes.numberSymbol}>#</span>
                      {rank}
                    </Typography>
                    <div className={classes.winnerContent}>
                      <Typography variant="subtitle2">{entryName}</Typography>
                      <Typography variant="caption">
                        <RedditUserAttribution user={user} />
                      </Typography>
                    </div>
                  </div>
                  <Card className={classes.winnerCard} elevation={2}>
                    <CardImageLink
                      displayWidth={winnerDisplayWidth}
                      height={height}
                      id={id}
                      image={imgurLink}
                      onClick={updateScroll}
                      width={width}
                    />
                  </Card>
                </React.Fragment>
              ))}
              <Divider className={classes.divider} />
              <Subheader>All other entries</Subheader>
            </>
          )}
          {entries && (
            <Grid container spacing={density === 'compact' ? 1 : 2}>
              {entries
                .filter(
                  // eslint-disable-next-line max-len
                  ({ category }) => !selectedCategories.length || selectedCategories.includes(category),
                )
                .map(
                  ({
                    average,
                    category,
                    categoryRank,
                    id,
                    imgurId,
                    imgurLink,
                    height,
                    name: entryName,
                    rank,
                    rating,
                    user,
                    width,
                  }) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <Grid key={id} item {...getGridVariables(rank === '1')}>
                      <Card id={id} className={classes.entry}>
                        <CardContent className={classes.entryHeading}>
                          {rank && (
                            <Typography component="div" variant="h6">
                              <span className={classes.numberSymbol}>#</span>
                              {rank}
                            </Typography>
                          )}
                          <div className={classes.entryInfo}>
                            <div>
                              <Typography component="div" variant="subtitle2">
                                {entryName}
                              </Typography>
                              {user && (
                                <Typography variant="caption">
                                  <RedditUserAttribution user={user} />
                                </Typography>
                              )}
                            </div>
                            {(!isContestMode || category) && (
                              <div className={classes.entryRatings}>
                                {category && (
                                  <div>
                                    <div
                                      className={clsx(
                                        classes.categoryLabel,
                                        getLabelStyle(category),
                                      )}
                                    >
                                      <Typography variant="caption">
                                        {categoryRank && (
                                          <span>
                                            #
                                            {categoryRank}
                                            &nbsp;
                                          </span>
                                        )}
                                        {category}
                                      </Typography>
                                    </div>
                                  </div>
                                )}
                                {!isContestMode && (
                                  <>
                                    <Average average={average} fullText={rank === '1'} />
                                    {rating > -1 && (
                                      <Typography className={classes.myRating} variant="caption">
                                        {rank === '1' && <span>My&nbsp;rating:&nbsp;</span>}
                                        <FiveStar rating={rating} />
                                      </Typography>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <div className={classes.entryImageContainer}>
                          <CardImageLink
                            displayWidth={rank === '1' ? winnerDisplayWidth : gridDisplayWidth}
                            height={height}
                            id={id}
                            image={imgurLink}
                            onClick={updateScroll}
                            width={width}
                          />
                        </div>
                        {isContestMode && (
                          <CardActions
                            className={clsx(classes.votingSlider, {
                              [classes.disabledVoting]: votingDisabled,
                            })}
                          >
                            <VotingSlider
                              disabled={votingUnavailable}
                              entryId={imgurId}
                              rating={rating}
                              setComponentsState={setComponentsState}
                            />
                          </CardActions>
                        )}
                      </Card>
                    </Grid>
                  ),
                )}
            </Grid>
          )}
        </Container>
      )}
      <RedditLogInDialog />
    </PageWithDrawer>
  );
}

export default Contest;
