import React from 'react';

import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';
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
} from '../../../../state/dialogs/settings/advanced/actions';

const styleSheet = createStyleSheet('Advanced', {
  formControl: {
    width: '100%',
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

const Advanced = (props) => {
  const {
    classes,
    isSaving,
    customUserAgent,
    customUserAgentError,
    onFormUpdate,
    onSave,
    injectedCss,
    injectedCssError,
    injectedJs,
    injectedJsError,
  } = props;

  return (
    <div className={classes.root}>
      <div>
        <FormControl className={classes.formControl} error={injectedCssError}>
          <InputLabel htmlFor="injectedCss">Injected CSS</InputLabel>
          <Input
            disabled={isSaving}
            placeholder="Enter CSS to inject"
            id="injectedCss"
            value={injectedCss}
            onChange={e => onFormUpdate({ injectedCss: e.target.value })}
          />
          {injectedCssError ? <FormHelperText>{injectedCssError}</FormHelperText> : null}
        </FormControl>
        <FormControl className={classes.formControl} error={injectedJsError}>
          <InputLabel htmlFor="injectedJs">Injected JS</InputLabel>
          <Input
            disabled={isSaving}
            placeholder="Enter javascript to inject"
            id="injectedJs"
            value={injectedJs}
            onChange={e => onFormUpdate({ injectedJs: e.target.value })}
          />
          {injectedJsError ? <FormHelperText>{injectedJsError}</FormHelperText> : null}
        </FormControl>
        <FormControl className={classes.formControl} error={customUserAgentError}>
          <InputLabel htmlFor="customUserAgent">Custom User Agent</InputLabel>
          <Input
            disabled={isSaving}
            placeholder="Enter a custom user agent"
            id="customUserAgent"
            value={customUserAgent}
            onChange={e => onFormUpdate({ customUserAgent: e.target.value })}
          />
          {customUserAgentError ? <FormHelperText>{customUserAgentError}</FormHelperText> : null}
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

Advanced.defaultProps = {
};

Advanced.propTypes = {
  classes: PropTypes.object.isRequired,
  customUserAgent: PropTypes.string.isRequired,
  customUserAgentError: PropTypes.string.isRequired,
  injectedCss: PropTypes.string.isRequired,
  injectedCssError: PropTypes.string.isRequired,
  injectedJs: PropTypes.string.isRequired,
  injectedJsError: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    injectedCss,
    injectedCssError,
    injectedJs,
    injectedJsError,
    customUserAgent,
    customUserAgentError,
  } = state.dialogs.settings.advanced.form;

  const { isSaving } = state.dialogs.settings.advanced;

  return {
    injectedCss,
    injectedCssError,
    injectedJs,
    injectedJsError,
    customUserAgent,
    customUserAgentError,
    isSaving,
  };
};

const mapDispatchToProps = dispatch => ({
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Advanced));
