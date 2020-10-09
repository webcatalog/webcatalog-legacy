/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';
import HelpIcon from '@material-ui/icons/Help';

import StatedMenu from '../../shared/stated-menu';

import { requestOpenInBrowser } from '../../../senders';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogCreateCustomApp } from '../../../state/dialog-create-custom-app/actions';

import SearchBox from './search-box';

import EnhancedAppBar from '../../shared/enhanced-app-bar';

const styles = (theme) => ({
  addButton: {
    marginLeft: theme.spacing(1),
  },
  helpButton: {
    marginLeft: theme.spacing(1),
  },
  noDrag: {
    WebkitAppRegion: 'no-drag',
  },
  centerContainer: {
    display: 'flex',
    maxWidth: 480,
    margin: '0 auto',
  },
});

const DefinedAppBar = ({
  classes,
  onOpenDialogCreateCustomApp,
}) => (
  <EnhancedAppBar
    center={(
      <div className={classes.centerContainer}>
        <SearchBox />
        <StatedMenu
          id="more-options"
          buttonElement={(
            <Tooltip title="Create...">
              <IconButton
                size="small"
                color="inherit"
                aria-label="Create..."
                className={classnames(classes.noDrag, classes.addButton)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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
                classes={{ root: classnames(classes.helpButton, classes.noDrag) }}
                onClick={(e) => {
                  e.stopPropagation();
                  requestOpenInBrowser('https://webcatalog.app/multisite-apps');
                }}
              >
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </MenuItem>
          <Divider />
          <MenuItem
            dense
            onClick={() => requestOpenInBrowser('https://forms.gle/redZCVMwkuhvuDtb9')}
          >
            Submit New App to Catalog
          </MenuItem>
        </StatedMenu>
      </div>
    )}
  />
);

DefinedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogCreateCustomApp,
};

export default connectComponent(
  DefinedAppBar,
  null,
  actionCreators,
  styles,
);
