import PropTypes from 'prop-types';
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import connectComponent from '../../../helpers/connect-component';

import { requestOpenInBrowser } from '../../../senders';

const styles = (theme) => ({
  card: {
    width: 160,
    height: 150,
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: theme.spacing(1),
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: theme.palette.text.primary,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  icon: {
    fontSize: '72px',
  },
  desc: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 1,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
});

const SubmitAppCard = ({ classes }) => (
  <Grid item>
    <Paper
      className={classes.card}
      elevation={1}
      onClick={() => requestOpenInBrowser('https://github.com/quanglam2807/webcatalog/issues/new?template=app.md&title=app%3A+')}
    >
      <AddCircleIcon className={classes.icon} />
      <Typography variant="subtitle2" className={classes.desc}>
        Submit New App
      </Typography>
    </Paper>
  </Grid>
);

SubmitAppCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  SubmitAppCard,
  null,
  null,
  styles,
);
