import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import connectComponent from '../../helpers/connect-component';

import mailServices from '../../constants/services';

import { requestCreateWorkspace } from '../../senders';

const styles = theme => ({
  root: {
    height: '100vh',
    width: '100vw',
    padding: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  serviceFlex: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingTop: theme.spacing.unit * 3,
    maxWidth: 96 * 4.5,
  },
  serviceIcon: {
    height: 96,
    width: 96,
    borderRadius: 4,
    marginBottom: '0.2em',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  serviceIconImg: {
    height: 96,
    width: 96,
    borderRadius: 4,
  },
});

const AddWorkspace = ({
  classes,
}) => (
  <div className={classes.root}>
    <Typography variant="h6" align="center">
      Add An Account
    </Typography>
    <div className={classes.serviceFlex}>
      {Object.keys(mailServices).map(id => (
        <div className={classes.serviceContainer}>
          <Paper className={classes.serviceIcon} onClick={() => requestCreateWorkspace(id)}>
            <img
              alt={mailServices[id].name}
              className={classes.serviceIconImg}
              src={mailServices[id].icon}
            />
          </Paper>
          <Typography variant="body2" align="center">
            {mailServices[id].name}
          </Typography>
        </div>
      ))}
    </div>
  </div>
);

AddWorkspace.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  AddWorkspace,
  null,
  null,
  styles,
);
