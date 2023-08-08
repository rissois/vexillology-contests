/**
 * Entry-point into the website. Contains theme and routing info.
 * Modal: https://v5.reactrouter.com/web/example/modal-gallery
 * Are entryIds unique?
 */

import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter, Navigate, Route, Routes, useLocation, Link,
} from 'react-router-dom';
import { SWRConfig } from 'swr';

import { getData } from './api';
import { AppHelmet, CustomSnackbar } from './components';
import {
  AuthorizeCallback,
  Contest,
  Contests,
  EntryModal,
  HallOfFame,
  Home,
  ReviewSubmissions,
  Settings,
  Submission,
} from './pages';

import './App.css';

const theme = createTheme({
  palette: {
    flagMakerPrint: {
      main: '#ea433e',
    },
    primary: {
      dark: '#c10000',
      light: '#ff7c4c',
      main: '#fc471e',
    },
    secondary: {
      dark: '#3868c8',
      light: '#a8c5ff',
      main: '#7295fc',
    },
  },
});

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SWRConfig
          value={{
            fetcher: (arr) => getData(...arr),
            revalidateOnMount: true,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }}
        >
          <div className="app">
            <BrowserRouter>
              <AppHelmet />
              <ModalSwitch />
            </BrowserRouter>
            <CustomSnackbar />
          </div>
        </SWRConfig>
      </ThemeProvider>
    </>
  );
}

function ModalSwitch() {
  const location = useLocation();

  const background = location.state && location.state.background;

  return (
    <div>
      <Routes location={background || location}>
        <Route exact path="/" element={<Navigate replace to="home" />} />
        <Route exact path="/authorizeCallback" element={<AuthorizeCallback />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/contests" element={<Contests />} />
        <Route exact path="/contests/:contestId" element={<Contest />} />
        <Route exact path="/mod/review" element={<ReviewSubmissions />} />
        <Route exact path="/submission" element={<Submission />} />
        <Route
          exact
          path="/submit"
          element={<Navigate replace state={{ defaultTab: 1 }} to="/submission" />}
        />
        <Route exact path="/hallOfFame" element={<HallOfFame />} />
        <Route exact path="/profile/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {background && (
        <Routes>
          <Route exact path="/contests/:contestId/entry/:entryId" element={<EntryModal />} />
        </Routes>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>404 not found</h1>
      <p>Please go back or</p>
      <Link to="/">Return Home</Link>
    </div>
  );
}

export default App;
