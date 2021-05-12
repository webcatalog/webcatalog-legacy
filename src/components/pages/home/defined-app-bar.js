/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import {
  WithSearch,
} from '@elastic/react-search-ui';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import connectComponent from '../../../helpers/connect-component';

import { changeRoute } from '../../../state/router/actions';

import SearchBox from './search-box';

import EnhancedAppBar from '../../shared/enhanced-app-bar';
import CreateButton from '../../shared/create-button';

import { ROUTE_CATEGORIES } from '../../../constants/routes';

const styles = (theme) => ({
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
              <CreateButton />
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
};

const actionCreators = {
  changeRoute,
};

export default connectComponent(
  DefinedAppBar,
  null,
  actionCreators,
  styles,
);
