import { Helmet } from 'react-helmet';

import useSwrData from './useSwrData';

function AppHelmet() {
  const { title = 'Vexillology Contests' } = useSwrData('/init') || {};

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export default AppHelmet;
