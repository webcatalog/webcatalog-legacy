/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import {
  WithSearch,
} from '@elastic/react-search-ui';

import AddIcon from '@material-ui/icons/Add';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogCreateCustomApp } from '../../../state/dialog-create-custom-app/actions';
import { changeRoute } from '../../../state/router/actions';

import SearchBox from './search-box';

import EnhancedAppBar from '../../shared/enhanced-app-bar';

import { requestOpenInBrowser } from '../../../senders';
import { ROUTE_CATEGORIES } from '../../../constants/routes';

const styles = (theme) => ({
  addButton: {
    marginLeft: theme.spacing(1),
  },
  helpButton: {
    marginLeft: theme.spacing(1),
  },
  backButton: {
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
  onChangeRoute,
}) => (
  <WithSearch
    mapContextToProps={({
      filters,
      clearFilters,
    }) => ({
      filters,
      clearFilters,
    })}
  >
    {({
      filters,
      clearFilters,
    }) => {
      const categoryFilter = filters.find((filter) => filter.field === 'category');

      return (
        <EnhancedAppBar
          left={categoryFilter == null ? null : (
            <Button
              variant="text"
              color="default"
              size="small"
              className={classes.backButton}
              startIcon={<ArrowBackIosIcon fontSize="small" />}
              onClick={() => {
                clearFilters();
                onChangeRoute(ROUTE_CATEGORIES);
              }}
            >
              Back
            </Button>
          )}
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
                        label: 'Create Custom App...',
                        click: () => {
                          onOpenDialogCreateCustomApp();
                        },
                      },
                      {
                        label: 'Create Custom Space...',
                        click: () => {
                          onOpenDialogCreateCustomApp({ urlDisabled: true });
                        },
                      },
                      {
                        label: 'Submit New App to the Catalog...',
                        click: () => {
                          requestOpenInBrowser('https://forms.gle/redZCVMwkuhvuDtb9');
                        },
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
    }}
  </WithSearch>
);

DefinedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
};

const actionCreators = {
  changeRoute,
  openDialogCreateCustomApp,
};

export default connectComponent(
  DefinedAppBar,
  null,
  actionCreators,
  styles,
);
