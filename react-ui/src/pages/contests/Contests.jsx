import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import format from 'date-fns/format';
import getYear from 'date-fns/getYear';
import parseISO from 'date-fns/parseISO';
import groupBy from 'lodash/groupBy';
import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useSwrData } from '../../common';
import { Header, ListItemLink } from '../../components';

const useStyles = makeStyles((theme) => ({
  list: {
    maxWidth: 512,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Contests = () => {
  const contests = useSwrData('/contests');
  const location = useLocation();

  const [openYear, setOpenYear] = useState(null);
  useEffect(() => {
    if (contests) {
      setOpenYear(getYear(parseISO(contests[0].date)).toString());
    }
  }, [contests]);

  const groups = contests ? groupBy(contests, ({ date }) => getYear(parseISO(date))) : null;

  const toggleYearStatus = (year) => {
    setOpenYear(openYear === year ? null : year);
  };

  const classes = useStyles();
  return (
    <>
      <Header to="/home">Vexillology Contests</Header>
      {!!groups && (
        <div className={classes.list}>
          <List>
            {Object.keys(groups)
              .sort((a, b) => b - a)
              .map((year) => (
                <Fragment key={year}>
                  <ListItem button onClick={() => toggleYearStatus(year)}>
                    <ListItemText>{year}</ListItemText>
                    {openYear === year ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={year === openYear} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {groups[year].map(({
                        date, id, name, yearEnd,
                      }) => (
                        <ListItemLink
                          key={id}
                          className={classes.nested}
                          primary={`${
                            !yearEnd ? `${format(parseISO(date), 'MMM yy')} - ` : ''
                          }${name}`}
                          to={{ pathname: `/contests/${id}`, state: { back: location.pathname } }}
                        />
                      ))}
                    </List>
                  </Collapse>
                </Fragment>
              ))}
          </List>
        </div>
      )}
    </>
  );
};

export default Contests;
