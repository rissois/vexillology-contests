/* eslint-disable no-console */
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import LazyLoad from 'react-lazyload';
import { Link as RouterLink, useParams, useRouteMatch } from 'react-router-dom';

import { useSwrData } from '../../common';
import { AppBarIconButton, PageWithDrawer } from '../../components';

const useStyles = makeStyles({
  heading: {
    margin: '24px auto',
  },
  icon: {
    color: '#5f6368',
  },
});

const Contest = () => {
  const { contestId } = useParams();
  const contest = useSwrData(`/contests/${contestId}`) || {};

  const theme = useTheme();
  const match = useRouteMatch();

  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  let imageWidth;
  if (isLgUp) {
    imageWidth = 400;
  } else if (isMdUp) {
    imageWidth = 448;
  } else if (isSmUp) {
    imageWidth = 552;
  } else {
    imageWidth = document.getElementsByTagName('html').clientWidth - 32;
  }

  const classes = useStyles();

  const { name, entries } = contest;
  return (
    <PageWithDrawer
      handleClose={() => {}}
      isOpen={false}
      appBar={{
        className: classes.icon,
        color: 'default',
        right: <AppBarIconButton ariaLabel="View settings" Icon={SettingsOutlinedIcon} />,
        children: (
          <IconButton component={RouterLink} to="/contests">
            <ArrowBackIcon />
          </IconButton>
        ),
      }}
      drawer={{}}
    >
      {name && (
        <Container fixed>
          <Typography className={classes.heading} variant={isSmUp ? 'h3' : 'h5'} component="h1">
            {name}
          </Typography>
          {entries && (
            <Grid container spacing={2}>
              {entries.map(({
                id, imgurLink, height, width,
              }) => (
                <Grid key={id} item xs={12} md={6} lg={4}>
                  <Card id={id}>
                    <RouterLink
                      to={{ pathname: `${match.url}/entry/${id}`, state: { isFromContest: true } }}
                    >
                      <CardActionArea>
                        <LazyLoad height={height * (imageWidth / width)} offset={1080} resize>
                          <CardMedia component="img" image={imgurLink} />
                        </LazyLoad>
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
