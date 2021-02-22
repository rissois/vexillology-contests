import {
  node, oneOf, shape, string,
} from 'prop-types';

export const objects = {
  AppBar: {
    children: node.isRequired,
    className: string,
    color: oneOf(['default', 'inherit', 'primary', 'secondary', 'transparent']),
    position: oneOf(['absolute', 'fixed', 'relative', 'static', 'sticky']),
    right: node,
  },
};

export const defaultProps = {
  AppBar: {
    className: undefined,
    color: 'primary',
    position: 'fixed',
    right: null,
  },
};

const types = {
  AppBar: shape({ ...objects.AppBar }),
};

export default types;
