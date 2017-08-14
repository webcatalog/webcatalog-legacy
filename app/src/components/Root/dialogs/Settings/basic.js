import React from 'react';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Switch from 'material-ui/Switch';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';

import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';

import {
  formUpdate,
  save,
} from '../../../../state/dialogs/settings/basic/actions';

const styleSheet = createStyleSheet('Basic', {
  formControl: {
    width: '100%',
  },
  divider: {
    margin: '12px 0',
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  listItemSecondaryAction: {
    transform: 'translateX(18px)',
  },
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formFooter: {
    alignSelf: 'flex-end',
    transform: 'translate(16px, 16px)',
  },
});

const Basic = (props) => {
  const {
    swipeToNavigate,
    quitWhenLastWindowIsClosed,
    blockAdsAndTracking,
    rememberThePageYouOpen,
    classes,
    isSaving,
    customHomeUrl,
    customHomeUrlError,
    onFormUpdate,
    onSave,
  } = props;

  return (
    <div className={classes.root}>
      <div>

        <ListItem className={classes.listItem}>
          <ListItemText primary="Swipe to navigate" />
          <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
            <Switch
              onChange={() => onFormUpdate({ swipeToNavigate: !swipeToNavigate })}
              checked={swipeToNavigate}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider className={classes.divider} />
        <ListItem className={classes.listItem}>
          <ListItemText
            primary="Quit when last window is closed"
            secondary={
              <span style={{ maxWidth: 304, display: 'block' }}>
                {'Navigate between pages with 3-finger gesture. You need to change Preferences > Trackpad > More Gesture > Swipe between page to Swipe with three fingers or Swipe with two or three fingers. Restart is required.'}
              </span>
            }
          />
          <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
            <Switch
              onChange={() =>
                onFormUpdate({ quitWhenLastWindowIsClosed: !quitWhenLastWindowIsClosed })}
              checked={quitWhenLastWindowIsClosed}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider className={classes.divider} />
        <ListItem className={classes.listItem}>
          <ListItemText
            primary="Block ads and tracking"
            secondary={
              <span style={{ maxWidth: 304, display: 'block' }}>
                {'Restart is required.'}
              </span>
            }
          />
          <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
            <Switch
              onChange={() => onFormUpdate({ blockAdsAndTracking: !blockAdsAndTracking })}
              checked={blockAdsAndTracking}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider className={classes.divider} />
        <ListItem className={classes.listItem}>
          <ListItemText
            primary="Remember the last page you open"
            secondary={
              <span style={{ maxWidth: 304, display: 'block' }}>
                {'Automatically go to the last page you opened everytime you open an app'}
              </span>
            }
          />
          <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
            <Switch
              onChange={() => onFormUpdate({ rememberThePageYouOpen: !rememberThePageYouOpen })}
              checked={rememberThePageYouOpen}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider className={classes.divider} />

        <FormControl className={classes.formControl} error={customHomeUrlError}>
          <InputLabel htmlFor="customHomeUrl">Custom Home URL</InputLabel>
          <Input
          multiline
          rowsMax="4"
            disabled={isSaving}
            placeholder="Enter a custom home URL"
            id="customHomeUrl"
            value={customHomeUrl}
            onChange={e => onFormUpdate({ customHomeUrl: e.target.value })}
          />
          {customHomeUrlError ? <FormHelperText>{customHomeUrlError}</FormHelperText> : null}
        </FormControl>
      </div>
      <div className={classes.formFooter}>
        <Button
          disabled={isSaving}
          color="primary"
          onClick={onSave}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </div>
    </div>
  );
};

Basic.defaultProps = {
};

Basic.propTypes = {
  swipeToNavigate: PropTypes.func.isRequired,
  quitWhenLastWindowIsClosed: PropTypes.func.isRequired,
  blockAdsAndTracking: PropTypes.func.isRequired,
  rememberThePageYouOpen: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  customHomeUrl: PropTypes.string.isRequired,
  customHomeUrlError: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    swipeToNavigate,
    quitWhenLastWindowIsClosed,
    blockAdsAndTracking,
    rememberThePageYouOpen,
    customHomeUrl,
    customHomeUrlError,
  } = state.dialogs.settings.basic.form;

  const { isSaving } = state.dialogs.settings.basic;

  return {
    swipeToNavigate,
    quitWhenLastWindowIsClosed,
    blockAdsAndTracking,
    rememberThePageYouOpen,
    customHomeUrl,
    customHomeUrlError,
    isSaving,
  };
};

const mapDispatchToProps = dispatch => ({
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Basic));
