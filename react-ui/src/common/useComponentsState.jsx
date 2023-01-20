import createPersistedState from 'use-persisted-state';

const usePersistedSettings = createPersistedState('votingComponents');

const DEFAULT_STATE = {
  redditLogInDialogOpen: false,
  votingDisabled: false,
  votingSnackbarOpenTimestamp: null,
  votingSnackbarSeverity: null,
};

const useComponentsState = () => {
  const [state, setState] = usePersistedSettings(DEFAULT_STATE);

  const updateState = (newStates) => {
    if (!newStates) {
      setState(DEFAULT_STATE);
      return;
    }

    setState({ ...state, ...newStates });
  };

  return [state, updateState];
};

export default useComponentsState;
