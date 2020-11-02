/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';

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
        <Tooltip title="Create...">
          <IconButton
            size="small"
            color="inherit"
            aria-label="Create..."
            className={classnames(classes.noDrag, classes.addButton)}
            onClick={() => {
              const template = [
                {
                  label: 'Create Custom App',
                  click: () => onOpenDialogCreateCustomApp(),
                },
                {
                  label: 'Submit New App to Catalog',
                  click: () => requestOpenInBrowser('https://forms.gle/redZCVMwkuhvuDtb9'),
                },
              ];

              const menu = window.remote.Menu.buildFromTemplate(template);
              menu.popup(window.remote.getCurrentWindow());
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
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
