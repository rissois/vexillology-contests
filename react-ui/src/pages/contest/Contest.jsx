import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { useEffect, useState } from 'react';
import {
  Link as RouterLink, useLocation, useParams, useRouteMatch,
} from 'react-router-dom';
import { animateScroll } from 'react-scroll';
import createPersistedState from 'use-persisted-state';

import { useSwrData } from '../../common';
import {
  AppBarIconButton,
  ArrowBackButton,
  CustomRadio,
  CustomSwitch,
  LazyLoadCardImage,
  PageWithDrawer,
} from '../../components';

const useScrollState = createPersistedState('scroll');
const useSettingsState = createPersistedState('settings');

const useStyles = makeStyles({
  heading: {
    margin: '24px auto',
  },
  icon: {
    color: '#5f6368',
  },
  listItemText: {
    color: '#3c4043',
  },
  listSubheader: {
    color: '#202124',
    fontSize: '.6875rem',
    fontWeight: 500,
    letterSpacing: '.8px',
    lineHeight: 1,
    margin: '16px 0',
    textTransform: 'uppercase',
  },
  entryName: {
    color: 'black',
  },
  switch: {
    color: '#4285f4',
  },
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
};

const Contest = () => {
  const { contestId } = useParams();
  const contest = useSwrData(`/contests/${contestId}`) || {};

  const { state = {} } = useLocation();

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const [scroll, setScroll] = useScrollState({});

  useEffect(() => {
    const entryEl = document.getElementById(state.entry);
    const { height, width, y } = scroll;
    if (entryEl && y) {
      if (height !== window.innerHeight || width !== window.innerWidth) {
        return;
      }

      animateScroll.scrollTo(y, { duration: 0, delay: 0 });
    }
  }, [state, contest]);

  const [settings, setSettings] = useSettingsState({ isHideTitles: false, density: 'default' });
  const { density = 'default', isHideTitles } = settings;

  const updateSettings = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const toggleHideTitles = () => {
    updateSettings('isHideTitles', !isHideTitles);
  };

  const handleDensityChange = (event) => {
    updateSettings('density', event.target.value);
  };

  const toggleSettingsOpen = () => {
    setSettingsOpen(!isSettingsOpen);
  };

  const backLink = state.back || '/contests';

  const theme = useTheme();
  const match = useRouteMatch();

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

  const displayWidth = key
    ? imageWidths[density][key]
    : document.getElementsByTagName('html')[0].clientWidth - 32;

  const classes = useStyles();

  const getGridVariables = () => {
    let spacing = 2;
    const xs = 12;
    let sm = 12;
    let md = 6;
    let lg = 4;
    if (density === 'compact') {
      spacing = 1;
      sm = 6;
      md = 4;
      lg = 3;
    }
    return {
      spacing,
      xs,
      sm,
      md,
      lg,
    };
  };
  const {
    spacing, xs, sm, md, lg,
  } = getGridVariables();

  const { name, entries } = contest;
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
          <AppBarIconButton
            ariaLabel="View settings"
            onClick={toggleSettingsOpen}
            Icon={SettingsOutlinedIcon}
          />
        ),
        children: <ArrowBackButton to={backLink} />,
      }}
      drawer={{
        heading: 'Settings',
        children: (
          <>
            <List
              subheader={<ListSubheader className={classes.listSubheader}>Display</ListSubheader>}
            >
              <ListItem>
                <ListItemText
                  className={classes.listItemText}
                  id="switch-list-label-hide-titles"
                  primary="Hide Titles"
                />
                <ListItemSecondaryAction>
                  <CustomSwitch
                    edge="end"
                    onChange={toggleHideTitles}
                    checked={isHideTitles}
                    inputProps={{ 'aria-labelledby': 'switch-list-label-hide-titles' }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Divider />
            <FormControl component="fieldset">
              <List
                dense
                subheader={(
                  <ListSubheader>
                    <FormLabel className={classes.listSubheader}>Density</FormLabel>
                  </ListSubheader>
                )}
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
          </>
        ),
      }}
    >
      {name && (
        <Container fixed>
          <Typography className={classes.heading} variant={isSmUp ? 'h3' : 'h5'} component="h1">
            {name}
          </Typography>
          {entries && (
            <Grid container spacing={spacing}>
              {entries.map(({
                id, imgurLink, height, name: entryName, width,
              }) => (
                <Grid key={id} item xs={xs} sm={sm} md={md} lg={lg}>
                  <Card id={id}>
                    <RouterLink
                      onClick={() => {
                        setScroll({
                          height: window.innerHeight,
                          width: window.innerWidth,
                          y: window.scrollY,
                        });
                      }}
                      to={{ pathname: `${match.url}/entry/${id}`, state: { isFromContest: true } }}
                      style={{ textDecoration: 'none' }}
                    >
                      <CardActionArea>
                        <LazyLoadCardImage
                          displayWidth={displayWidth}
                          height={height}
                          image={imgurLink}
                          width={width}
                        />
                        {!isHideTitles && (
                        <CardContent>
                          <Typography className={classes.entryName} variant="caption">
                            {entryName}
                          </Typography>
                        </CardContent>
                        )}
                      </CardActionArea>
                    </RouterLink>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      )}
    </PageWithDrawer>
  );
};

export default Contest;
