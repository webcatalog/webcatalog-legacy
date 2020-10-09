import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import BrushIcon from '@material-ui/icons/Brush';

import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import HelpIcon from '@material-ui/icons/Help';

import connectComponent from '../../../helpers/connect-component';

import { requestOpenInBrowser } from '../../../senders';

import { open as openDialogCreateCustomApp } from '../../../state/dialog-create-custom-app/actions';

import StatedMenu from '../../shared/stated-menu';

const styles = (theme) => ({
  card: {
    width: 168,
    height: 158,
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
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    outline: 'none',
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
    lineHeight: 'normal',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
});

const CreateCustomAppCard = ({ classes, onOpenDialogCreateCustomApp }) => (
  <Grid item>
    <StatedMenu
      id="more-options"
      buttonElement={(
        <Paper
          className={classes.card}
          elevation={0}
          role="link"
          tabIndex="0"
        >
          <BrushIcon className={classes.icon} />
          <Typography variant="subtitle2" className={classes.desc}>
            Create Custom App
          </Typography>
        </Paper>
      )}
    >
      <MenuItem
        dense
        onClick={() => onOpenDialogCreateCustomApp()}
      >
        Create Custom Standard App
      </MenuItem>
      <MenuItem
        dense
        onClick={() => onOpenDialogCreateCustomApp({ urlDisabled: true })}
      >
        Create Custom Multisite App
        <Tooltip title="What is this?" placement="right">
          <IconButton
            size="small"
            aria-label="What is this?"
            classes={{ root: classNames(classes.helpButton, classes.noDrag) }}
            onClick={(e) => {
              e.stopPropagation();
              requestOpenInBrowser('https://webcatalog.app/multisite-apps');
            }}
          >
            <HelpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </MenuItem>
    </StatedMenu>
  </Grid>
);

CreateCustomAppCard.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogCreateCustomApp,
};

export default connectComponent(
  CreateCustomAppCard,
  null,
  actionCreators,
  styles,
);
