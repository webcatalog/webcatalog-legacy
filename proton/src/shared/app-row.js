import React from 'react';
import PropTypes from 'prop-types';

import GetAppIcon from 'material-ui-icons/GetApp';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import grey from 'material-ui/colors/grey';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';

import connectComponent from '../helpers/connect-component';

import extractHostname from '../helpers/extract-hostname';

import {
  STRING_INSTALL,
} from '../constants/strings';

const styles = (theme) => {
  const cardContentDefaults = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  };

  return {
    button: {
      color: grey[600],
      '&:not(:first-child)': {
        marginLeft: 12,
      },
    },
    scrollContainer: {
      boxSizing: 'border-box',
      flex: 1,
      overflow: 'auto',
      padding: 36,
    },
    buttonText: {
      fontSize: 12,
      marginLeft: 6,
      transform: 'translateY(-1px)',
    },
    cardHeader: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      width: '100%',
    },
    card: {
      width: 240,
      boxSizing: 'border-box',
    },
    cardIsViewing: {
      padding: 0,
      width: '90vw',
    },
    appName: {
      marginTop: 16,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    paperIcon: {
      width: 72,
      height: 72,
    },
    cardContent: {
      ...cardContentDefaults,
    },
    cardContentIsViewing: {
      ...cardContentDefaults,
      backgroundColor: 'white',
      padding: 0,
    },
    domainText: {
      fontWeight: 400,
      lineHeight: 1,
      marginBottom: theme.spacing.unit,
    },
    cardActions: {
      justifyContent: 'center',
      overflow: 'hidden',
    },
    linearProgress: {
      marginTop: -5,
    },
    linearProgressContainer: {
      flex: 1,
      padding: '0 16px',
    },
    rightButton: {
      marginLeft: theme.spacing.unit,
    },
    iconButton: {
      margin: 0,
    },
    moreIconMenu: {
      position: 'absolute',
      transform: 'translate(82px, -16px)',
    },
    hiddenMenuItem: {
      display: 'none',
    },
  };
};

const AppCard = (props) => {
  const {
    app,
  } = props;

  return (
    <div>
      <ListItem button>
        <ListItemText
          primary={app.name}
          secondary={extractHostname(app.url)}
        />
        <ListItemSecondaryAction>
          <Tooltip title={STRING_INSTALL} placement="bottom">
            <IconButton aria-label="Comments">
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider light />
    </div>
  );
};

AppCard.propTypes = {
  app: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({});

const actionCreators = {
};

export default connectComponent(
  AppCard,
  mapStateToProps,
  actionCreators,
  styles,
);
