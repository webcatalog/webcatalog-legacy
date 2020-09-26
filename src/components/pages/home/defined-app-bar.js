/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpIcon from '@material-ui/icons/Help';

import StatedMenu from '../../shared/stated-menu';

import { requestOpenInBrowser, requestShowAppMenu } from '../../../senders';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogCreateCustomApp } from '../../../state/dialog-create-custom-app/actions';
import { resetThenGetHits } from '../../../state/home/actions';

import SearchBox from './search-box';

const styles = (theme) => ({
  appBar: {
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  toolbar: {
    minHeight: 40,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
  },
  helpButton: {
    marginLeft: theme.spacing(1),
  },
  left: {
    width: 200,
  },
  center: {
    flex: 1,
  },
  right: {
    width: 200,
    textAlign: 'right',
  },
  button: {
    WebkitAppRegion: 'no-drag',
  },
});

const DefinedAppBar = ({
  classes,
  onOpenDialogCreateCustomApp,
  onResetThenGetHits,
}) => (
  <AppBar position="static" className={classes.appBar}>
    <Toolbar variant="dense" className={classes.toolbar}>
      <div className={classes.left}>
        <Tooltip title="Menu">
          <IconButton
            size="small"
            color="inherit"
            aria-label="More"
            className={classes.button}
            onClick={(e) => requestShowAppMenu(e.x, e.y)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.center}>
        <SearchBox />
      </div>
      <div className={classes.right}>
        <StatedMenu
          id="more-options"
          buttonElement={(
            <Button
              className={classes.button}
              color="inherit"
              size="small"
              startIcon={<AddIcon />}
            >
              Create Custom App
            </Button>
          )}
        >
          <MenuItem
            dense
            onClick={() => onOpenDialogCreateCustomApp()}
          >
            Create Standard App
          </MenuItem>
          <Divider />
          <MenuItem
            dense
            onClick={() => onOpenDialogCreateCustomApp({ urlDisabled: true })}
          >
            Create Multisite App
            <Tooltip title="What is this?" placement="right">
              <IconButton
                size="small"
                aria-label="What is this?"
                classes={{ root: classes.helpButton }}
                onClick={(e) => {
                  e.stopPropagation();
                  requestOpenInBrowser('https://atomery.com/webcatalog/multisite-apps');
                }}
              >
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </MenuItem>
        </StatedMenu>
        <StatedMenu
          id="more-options"
          buttonElement={(
            <Tooltip title="More">
              <IconButton
                size="small"
                color="inherit"
                aria-label="More"
                className={classes.actionButton}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        >
          <MenuItem
            dense
            onClick={() => requestOpenInBrowser('https://forms.gle/redZCVMwkuhvuDtb9')}
          >
            Submit New App to Catalog
          </MenuItem>
          <Divider />
          <MenuItem
            dense
            onClick={() => onResetThenGetHits(true)}
          >
            Refresh
          </MenuItem>
        </StatedMenu>
      </div>
    </Toolbar>
  </AppBar>
);

DefinedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  onResetThenGetHits: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogCreateCustomApp,
  resetThenGetHits,
};

export default connectComponent(
  DefinedAppBar,
  null,
  actionCreators,
  styles,
);
