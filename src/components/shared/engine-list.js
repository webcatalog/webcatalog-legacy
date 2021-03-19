/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

import HelpIcon from '@material-ui/icons/Help';

import connectComponent from '../../helpers/connect-component';

import braveIcon from '../../assets/brave.png';
import chromeCanaryIcon from '../../assets/chrome-canary.png';
import chromeIcon from '../../assets/chrome.png';
import chromiumIcon from '../../assets/chromium.png';
import coccocIcon from '../../assets/coccoc.png';
import edgeIcon from '../../assets/edge.png';
import electronIcon from '../../assets/default-icon.png';
import firefoxIcon from '../../assets/firefox.png';
import operaIcon from '../../assets/opera.png';
import vivaldiIcon from '../../assets/vivaldi.png';
import webkitIcon from '../../assets/webkit.png';
import yandexIcon from '../../assets/yandex.png';

import HelpTooltip from './help-tooltip';

const CustomHelpIcon = withStyles((theme) => ({
  fontSizeSmall: {
    marginTop: theme.spacing(0.5),
  },
}))(HelpIcon);

const getDesc = (engineCode, browserName) => {
  if (engineCode === 'webkit') {
    return `This option creates lightweight ${browserName}-based app, optimized to save memory & battery.`;
  }

  if (engineCode === 'electron') {
    return `This option creates ${browserName}-based app with many exclusive features such as accounts, notifications, badges and email handling. ${browserName} does not support WebExtensions and DRM-protected apps such as Netflix or Spotify.`;
  }

  const standardDesc = `This option creates bare-bone ${browserName}-based app${engineCode !== 'firefox' ? ' with WebExtension support' : ''}.`;
  const tabbedDesc = `This option creates ${browserName}-based app with traditional browser user interface, tab and WebExtension support.`;
  if (engineCode === 'opera') {
    return tabbedDesc;
  }

  return (
    <>
      <strong>Standard: </strong>
      {standardDesc}
      <br />
      <br />
      <strong>Tabbed: </strong>
      {tabbedDesc}
      <br />
      <br />
      This option is experimental, buggy and not recommended.
    </>
  );
};

const styles = (theme) => ({
  disabledListItem: {
    opacity: '0.2',
    cursor: 'not-allowed',
  },
  toggleButton: {
    padding: theme.spacing(0.5),
  },
  smallAvatar: {
    height: 28,
    width: 28,
  },
  smallListItemAvatar: {
    minWidth: 36,
  },
});

const EngineList = ({
  classes,
  engine,
  isMultisite,
  onEngineSelected,
  widevine,
}) => (
  <List>
    {widevine ? (
      <HelpTooltip
        title={(
          <Typography variant="body2" color="textPrimary">
            This app is incompatible with WebCatalog Engine.
          </Typography>
        )}
      >
        <ListItem
          button
          onClick={null}
          selected={engine === 'electron'}
          className={classnames(classes.disabledListItem)}
        >
          <ListItemAvatar>
            <Avatar alt="Electron" src={electronIcon} />
          </ListItemAvatar>
          <ListItemText
            primary={(
              <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="body2" noWrap>
                    WebCatalog Engine
                  </Typography>
                </Grid>
              </Grid>
            )}
          />
        </ListItem>
      </HelpTooltip>
    ) : (
      <ListItem
        button
        onClick={() => onEngineSelected('electron')}
        selected={engine === 'electron'}
      >
        <ListItemAvatar>
          <Avatar alt="Electron" src={electronIcon} />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="body2" noWrap>
                  WebCatalog Engine
                </Typography>
              </Grid>
              <Grid item>
                <Chip size="small" label="Default" variant="outlined" />
              </Grid>
              <Grid item>
                <Chip size="small" label="Feature-Rich" variant="outlined" />
              </Grid>
              <Grid item>
                <Chip size="small" label="Recommended" color="secondary" />
              </Grid>
              <Grid item>
                <HelpTooltip
                  title={(
                    <Typography variant="body2" color="textPrimary">
                      {getDesc('electron', 'WebCatalog Engine (Electron)')}
                    </Typography>
                  )}
                >
                  <CustomHelpIcon fontSize="small" color="disabled" />
                </HelpTooltip>
              </Grid>
            </Grid>
          )}
        />
      </ListItem>
    )}
    {window.process.platform === 'darwin' && (
      <>
        {isMultisite ? (
          <HelpTooltip
            title={(
              <Typography variant="body2" color="textPrimary">
                This app is incompatible with WebKit.
              </Typography>
            )}
          >
            <ListItem
              button
              onClick={() => null}
              selected={engine === 'webkit'}
              className={classnames(classes.disabledListItem)}
            >
              <ListItemAvatar>
                <Avatar alt="WebKit (part of Safari)" src={webkitIcon} />
              </ListItemAvatar>
              <ListItemText
                primary={(
                  <Grid container direction="row" alignItems="center" spacing={1}>
                    <Grid item>
                      <Typography variant="body2" noWrap>
                        WebKit (part of Safari)
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip size="small" label="Lightweight" variant="outlined" />
                    </Grid>
                    <Grid>
                      <HelpTooltip
                        title={(
                          <Typography variant="body2" color="textPrimary">
                            {getDesc('webkit', 'WebKit')}
                          </Typography>
                        )}
                      >
                        <CustomHelpIcon fontSize="small" color="disabled" />
                      </HelpTooltip>
                    </Grid>
                  </Grid>
                )}
              />
            </ListItem>
          </HelpTooltip>
        ) : (
          <ListItem
            button
            onClick={() => onEngineSelected('webkit')}
            selected={engine === 'webkit'}
          >
            <ListItemAvatar>
              <Avatar alt="WebKit (part of Safari)" src={webkitIcon} />
            </ListItemAvatar>
            <ListItemText
              primary={(
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography variant="body2" noWrap>
                      WebKit (part of Safari)
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip size="small" label="Lightweight" variant="outlined" />
                  </Grid>
                  <Grid>
                    <HelpTooltip
                      title={(
                        <Typography variant="body2" color="textPrimary">
                          {getDesc('webkit', 'WebKit')}
                        </Typography>
                      )}
                    >
                      <CustomHelpIcon fontSize="small" color="disabled" />
                    </HelpTooltip>
                  </Grid>
                </Grid>
              )}
            />
          </ListItem>
        )}
      </>
    )}
    <Divider />
    <ListSubheader>
      Experimental (Unstable)
    </ListSubheader>
    {window.process.platform !== 'linux' && (
      <ListItem
        dense
        button
        onClick={() => {
          if (engine === 'firefox' || engine.startsWith('firefox/')) return;
          onEngineSelected('firefox/tabs');
        }}
        selected={engine === 'firefox' || engine.startsWith('firefox/')}
      >
        <ListItemAvatar className={classes.smallListItemAvatar}>
          <Avatar alt="Mozilla Firefox" src={firefoxIcon} className={classes.smallAvatar} />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="body2" noWrap>
                  Mozilla Firefox
                </Typography>
              </Grid>
              <Grid item>
                <HelpTooltip
                  title={(
                    <Typography variant="body2" color="textPrimary">
                      {getDesc('firefox', 'Mozilla Firefox')}
                    </Typography>
                  )}
                >
                  <CustomHelpIcon fontSize="small" color="disabled" />
                </HelpTooltip>
              </Grid>
            </Grid>
          )}
        />
        {!isMultisite && (
          <ListItemSecondaryAction>
            <ToggleButtonGroup
              value={engine}
              exclusive
              onChange={(_, val) => {
                if (!val) return;
                onEngineSelected(val);
              }}
              size="small"
            >
              <ToggleButton value="firefox/tabs" classes={{ root: classes.toggleButton }}>
                Tabbed
              </ToggleButton>
            </ToggleButtonGroup>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    )}
    <ListItem
      dense
      button
      onClick={() => {
        if (engine === 'chrome' || engine.startsWith('chrome/')) return;
        onEngineSelected('chrome');
      }}
      selected={engine === 'chrome' || engine.startsWith('chrome/')}
    >
      <ListItemAvatar className={classes.smallListItemAvatar}>
        <Avatar alt="Google Chrome" src={chromeIcon} className={classes.smallAvatar} />
      </ListItemAvatar>
      <ListItemText
        primary={(
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="body2" noWrap>
                Google Chrome
              </Typography>
            </Grid>
            <Grid item>
              <HelpTooltip
                title={(
                  <Typography variant="body2" color="textPrimary">
                    {getDesc('chrome', 'Google Chrome')}
                  </Typography>
                )}
              >
                <CustomHelpIcon fontSize="small" color="disabled" />
              </HelpTooltip>
            </Grid>
          </Grid>
        )}
      />
      {!isMultisite && (
        <ListItemSecondaryAction>
          <ToggleButtonGroup
            value={engine}
            exclusive
            onChange={(_, val) => {
              if (!val) return;
              onEngineSelected(val);
            }}
            size="small"
          >
            <ToggleButton value="chrome" classes={{ root: classes.toggleButton }}>
              Standard
            </ToggleButton>
            <ToggleButton value="chrome/tabs" classes={{ root: classes.toggleButton }}>
              Tabbed
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItemSecondaryAction>
      )}
    </ListItem>
    <ListItem
      dense
      button
      onClick={() => {
        if (engine.startsWith('brave')) return;
        onEngineSelected('brave');
      }}
      selected={engine.startsWith('brave')}
    >
      <ListItemAvatar className={classes.smallListItemAvatar}>
        <Avatar alt="Brave" src={braveIcon} className={classes.smallAvatar} />
      </ListItemAvatar>
      <ListItemText
        primary={(
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="body2" noWrap>
                Brave
              </Typography>
            </Grid>
            <Grid item>
              <HelpTooltip
                title={(
                  <Typography variant="body2" color="textPrimary">
                    {getDesc('brave', 'Brave')}
                  </Typography>
                )}
              >
                <CustomHelpIcon fontSize="small" color="disabled" />
              </HelpTooltip>
            </Grid>
          </Grid>
        )}
      />
      {!isMultisite && (
        <ListItemSecondaryAction>
          <ToggleButtonGroup
            value={engine}
            exclusive
            onChange={(_, val) => {
              if (!val) return;
              onEngineSelected(val);
            }}
            size="small"
          >
            <ToggleButton value="brave" classes={{ root: classes.toggleButton }}>
              Standard
            </ToggleButton>
            <ToggleButton value="brave/tabs" classes={{ root: classes.toggleButton }}>
              Tabbed
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItemSecondaryAction>
      )}
    </ListItem>
    {window.process.platform === 'darwin' && (
      <ListItem
        dense
        button
        onClick={() => {
          if (engine.startsWith('chromeCanary')) return;
          onEngineSelected('chromeCanary');
        }}
        selected={engine.startsWith('chromeCanary')}
      >
        <ListItemAvatar className={classes.smallListItemAvatar}>
          <Avatar alt="Google Chrome Canary" src={chromeCanaryIcon} className={classes.smallAvatar} />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="body2" noWrap>
                  Google Chrome Canary
                </Typography>
              </Grid>
              <Grid item>
                <HelpTooltip
                  title={(
                    <Typography variant="body2" color="textPrimary">
                      {getDesc('chromeCanary', 'Google Chrome Canary')}
                    </Typography>
                  )}
                >
                  <CustomHelpIcon fontSize="small" color="disabled" />
                </HelpTooltip>
              </Grid>
            </Grid>
          )}
        />
        {!isMultisite && (
          <ListItemSecondaryAction>
            <ToggleButtonGroup
              value={engine}
              exclusive
              onChange={(_, val) => {
                if (!val) return;
                onEngineSelected(val);
              }}
              size="small"
            >
              <ToggleButton value="chromeCanary" classes={{ root: classes.toggleButton }}>
                Standard
              </ToggleButton>
              <ToggleButton value="chromeCanary/tabs" classes={{ root: classes.toggleButton }}>
                Tabbed
              </ToggleButton>
            </ToggleButtonGroup>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    )}
    {window.process.platform !== 'win32' && (
      <ListItem
        dense
        button
        onClick={() => {
          if (engine.startsWith('chromium')) return;
          onEngineSelected('chromium');
        }}
        selected={engine.startsWith('chromium')}
      >
        <ListItemAvatar className={classes.smallListItemAvatar}>
          <Avatar alt="Chromium" src={chromiumIcon} className={classes.smallAvatar} />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="body2" noWrap>
                  Chromium
                </Typography>
              </Grid>
              <Grid item>
                <HelpTooltip
                  title={(
                    <Typography variant="body2" color="textPrimary">
                      {getDesc('chromium', 'Chromium')}
                    </Typography>
                  )}
                >
                  <CustomHelpIcon fontSize="small" color="disabled" />
                </HelpTooltip>
              </Grid>
            </Grid>
          )}
        />
        {!isMultisite && (
          <ListItemSecondaryAction>
            <ToggleButtonGroup
              value={engine}
              exclusive
              onChange={(_, val) => {
                if (!val) return;
                onEngineSelected(val);
              }}
              size="small"
            >
              <ToggleButton value="chromium" classes={{ root: classes.toggleButton }}>
                Standard
              </ToggleButton>
              <ToggleButton value="chromium/tabs" classes={{ root: classes.toggleButton }}>
                Tabbed
              </ToggleButton>
            </ToggleButtonGroup>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    )}
    {window.process.platform !== 'linux' && (
      <ListItem
        dense
        button
        onClick={() => {
          if (engine.startsWith('coccoc')) return;
          onEngineSelected('coccoc');
        }}
        selected={engine.startsWith('coccoc')}
      >
        <ListItemAvatar className={classes.smallListItemAvatar}>
          <Avatar alt="Cốc Cốc" src={coccocIcon} className={classes.smallAvatar} />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="body2" noWrap>
                  Cốc Cốc
                </Typography>
              </Grid>
              <Grid item>
                <HelpTooltip
                  title={(
                    <Typography variant="body2" color="textPrimary">
                      {getDesc('coccoc', 'Cốc Cốc')}
                    </Typography>
                  )}
                >
                  <CustomHelpIcon fontSize="small" color="disabled" />
                </HelpTooltip>
              </Grid>
            </Grid>
          )}
        />
        {!isMultisite && (
          <ListItemSecondaryAction>
            <ToggleButtonGroup
              value={engine}
              exclusive
              onChange={(_, val) => {
                if (!val) return;
                onEngineSelected(val);
              }}
              size="small"
            >
              <ToggleButton value="coccoc" classes={{ root: classes.toggleButton }}>
                Standard
              </ToggleButton>
              <ToggleButton value="coccoc/tabs" classes={{ root: classes.toggleButton }}>
                Tabbed
              </ToggleButton>
            </ToggleButtonGroup>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    )}
    {window.process.platform !== 'linux' && (
      <ListItem
        dense
        button
        onClick={() => {
          if (engine.startsWith('edge')) return;
          onEngineSelected('edge');
        }}
        selected={engine.startsWith('edge')}
      >
        <ListItemAvatar className={classes.smallListItemAvatar}>
          <Avatar alt="Microsoft Edge" src={edgeIcon} className={classes.smallAvatar} />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="body2" noWrap>
                  Microsoft Edge
                </Typography>
              </Grid>
              <Grid item>
                <HelpTooltip
                  title={(
                    <Typography variant="body2" color="textPrimary">
                      {getDesc('edge', 'Microsoft Edge')}
                    </Typography>
                  )}
                >
                  <CustomHelpIcon fontSize="small" color="disabled" />
                </HelpTooltip>
              </Grid>
            </Grid>
          )}
        />
        {!isMultisite && (
          <ListItemSecondaryAction>
            <ToggleButtonGroup
              value={engine}
              exclusive
              onChange={(_, val) => {
                if (!val) return;
                onEngineSelected(val);
              }}
              size="small"
            >
              <ToggleButton value="edge" classes={{ root: classes.toggleButton }}>
                Standard
              </ToggleButton>
              <ToggleButton value="edge/tabs" classes={{ root: classes.toggleButton }}>
                Tabbed
              </ToggleButton>
            </ToggleButtonGroup>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    )}
    <ListItem
      dense
      button
      onClick={() => onEngineSelected('opera/tabs')}
      selected={engine === 'opera/tabs'}
    >
      <ListItemAvatar className={classes.smallListItemAvatar}>
        <Avatar alt="Opera" src={operaIcon} className={classes.smallAvatar} />
      </ListItemAvatar>
      <ListItemText
        primary={(
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="body2" noWrap>
                Opera
              </Typography>
            </Grid>
            <Grid item>
              <HelpTooltip
                title={(
                  <Typography variant="body2" color="textPrimary">
                    {getDesc('opera', 'Opera')}
                  </Typography>
                )}
              >
                <CustomHelpIcon fontSize="small" color="disabled" />
              </HelpTooltip>
            </Grid>
          </Grid>
        )}
      />
      {!isMultisite && (
        <ListItemSecondaryAction>
          <ToggleButtonGroup
            value={engine}
            exclusive
            onChange={(_, val) => {
              if (!val) return;
              onEngineSelected(val);
            }}
            size="small"
          >
            <ToggleButton value="opera/tabs" classes={{ root: classes.toggleButton }}>
              Tabbed
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItemSecondaryAction>
      )}
    </ListItem>
    <ListItem
      dense
      button
      onClick={() => {
        if (engine.startsWith('vivaldi')) return;
        onEngineSelected('vivaldi');
      }}
      selected={engine.startsWith('vivaldi')}
    >
      <ListItemAvatar className={classes.smallListItemAvatar}>
        <Avatar alt="Vivaldi" src={vivaldiIcon} className={classes.smallAvatar} />
      </ListItemAvatar>
      <ListItemText
        primary={(
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="body2" noWrap>
                Vivaldi
              </Typography>
            </Grid>
            <Grid item>
              <HelpTooltip
                title={(
                  <Typography variant="body2" color="textPrimary">
                    {getDesc('vivaldi', 'Vivaldi')}
                  </Typography>
                )}
              >
                <CustomHelpIcon fontSize="small" color="disabled" />
              </HelpTooltip>
            </Grid>
          </Grid>
        )}
      />
      {!isMultisite && (
        <ListItemSecondaryAction>
          <ToggleButtonGroup
            value={engine}
            exclusive
            onChange={(_, val) => {
              if (!val) return;
              onEngineSelected(val);
            }}
            size="small"
          >
            <ToggleButton value="vivaldi" classes={{ root: classes.toggleButton }}>
              Standard
            </ToggleButton>
            <ToggleButton value="vivaldi/tabs" classes={{ root: classes.toggleButton }}>
              Tabbed
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItemSecondaryAction>
      )}
    </ListItem>
    <ListItem
      dense
      button
      onClick={() => {
        if (engine.startsWith('yandex')) return;
        onEngineSelected('yandex');
      }}
      selected={engine.startsWith('yandex')}
    >
      <ListItemAvatar className={classes.smallListItemAvatar}>
        <Avatar alt="Yandex" src={yandexIcon} className={classes.smallAvatar} />
      </ListItemAvatar>
      <ListItemText
        primary={(
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="body2" noWrap>
                Yandex Browser
              </Typography>
            </Grid>
            <Grid item>
              <HelpTooltip
                title={(
                  <Typography variant="body2" color="textPrimary">
                    {getDesc('yandex', 'Yandex Browser')}
                  </Typography>
                )}
              >
                <CustomHelpIcon fontSize="small" color="disabled" />
              </HelpTooltip>
            </Grid>
          </Grid>
        )}
      />
      {!isMultisite && (
        <ListItemSecondaryAction>
          <ToggleButtonGroup
            value={engine}
            exclusive
            onChange={(_, val) => {
              if (!val) return;
              onEngineSelected(val);
            }}
            size="small"
          >
            <ToggleButton value="yandex" classes={{ root: classes.toggleButton }}>
              Standard
            </ToggleButton>
            <ToggleButton value="yandex/tabs" classes={{ root: classes.toggleButton }}>
              Tabbed
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  </List>
);

EngineList.defaultProps = {
  engine: '',
  isMultisite: false,
  widevine: false,
};

EngineList.propTypes = {
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string,
  isMultisite: PropTypes.bool,
  onEngineSelected: PropTypes.func.isRequired,
  widevine: PropTypes.bool,
};

export default connectComponent(
  EngineList,
  null,
  null,
  styles,
);
