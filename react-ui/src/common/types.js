import {
  bool, node, oneOf, oneOfType, shape, string,
} from 'prop-types';

export const objects = {
  AppBar: {
    children: node.isRequired,
    className: string,
    color: oneOf(['default', 'inherit', 'primary', 'secondary', 'transparent']),
    disableGutters: bool,
    isElevationScroll: bool,
    position: oneOf(['absolute', 'fixed', 'relative', 'static', 'sticky']),
    right: node,
  },
};

export const defaultProps = {
  AppBar: {
    className: undefined,
    color: 'primary',
    disableGutters: false,
    isElevationScroll: false,
    position: 'fixed',
    right: null,
  },
};

const types = {
  AppBar: shape({ ...objects.AppBar }),
  to: oneOfType([
    shape({
      pathname: string,
      state: shape({}),
    }),
    string,
  ]),
};

export default types;
