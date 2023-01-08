import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import RedditIcon from '@material-ui/icons/Reddit';
import { useRef } from 'react';

import { getData } from '../api';
import { useAuthState, useComponentsState, useRedditLogIn } from '../common';

const useStyles = makeStyles((theme) => ({
  accountMenu: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing(1),
    padding: theme.spacing(2),
  },
  button: {
    backgroundColor: theme.palette.vexyOrange.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.vexyOrange.main,
    },
  },
  username: {
    fontWeight: 'bold',
  },
}));

function AccountMenu() {
  const anchorRef = useRef(null);
  const classes = useStyles();

  const [{ accountMenuOpen }, setComponentsState] = useComponentsState();
  const setMenuOpen = (menuOpen) => {
    setComponentsState('accountMenuOpen', menuOpen);
  };
  const [{ isLoggedIn, refreshToken, username }, setAuthState] = useAuthState();
  const sendUserToAuthUrl = useRedditLogIn();

  const toggleMenu = () => {
    setMenuOpen(!accountMenuOpen);
  };

  const closeMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setMenuOpen(false);
  };

  const handleButtonClick = async () => {
    setMenuOpen(false);
    if (isLoggedIn) {
      try {
        await getData(`/revokeToken/${refreshToken}`);
      } finally {
        setAuthState({});
      }
    } else {
      sendUserToAuthUrl();
    }
  };

  return (
    <>
      <IconButton
        aria-controls={accountMenuOpen ? 'accountMenu' : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={toggleMenu}
        ref={anchorRef}
      >
        {isLoggedIn ? <AccountCircleIcon /> : <AccountCircleOutlinedIcon />}
      </IconButton>
      <Popper
        anchorEl={anchorRef.current}
        disablePortal
        open={accountMenuOpen}
        role={undefined}
        transition
      >
        {({ TransitionProps }) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={closeMenu}>
                <div className={classes.accountMenu} id="accountMenu">
                  <Typography component="div" variant="subtitle1">
                    {isLoggedIn ? (
                      <>
                        Logged in as
                        {' '}
                        <span className={classes.username}>{username}</span>
                        .
                      </>
                    ) : (
                      'Log in to vote on this contest.'
                    )}
                  </Typography>
                  <Button
                    className={classes.button}
                    startIcon={<RedditIcon />}
                    variant="contained"
                    onClick={handleButtonClick}
                  >
                    Log
                    {' '}
                    {isLoggedIn ? 'Out' : 'In'}
                  </Button>
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default AccountMenu;
