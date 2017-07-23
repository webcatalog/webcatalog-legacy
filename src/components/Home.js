import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import AddBoxIcon from 'material-ui-icons/AddBox';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import { grey } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import DialogAbout from './Dialogs/About';
import DialogSubmitApp from './Dialogs/SubmitApp';
import extractHostname from '../tools/extractHostname';
import {
  fetchApps,
  setCategory,
  setSortBy,
} from '../actions/home';

const styleSheet = createStyleSheet('Home', theme => ({
  scrollContainer: {
    flex: 1,
    padding: 36,
    overflow: 'auto',
    boxSizing: 'border-box',
  },

  card: {
    width: 200,
    boxSizing: 'border-box',
  },

  appName: {
    marginTop: 16,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  paperIcon: {
    width: 60,
    height: 'auto',
  },

  titleText: {
    fontWeight: 500,
    lineHeight: 1.5,
    marginTop: theme.spacing.unit,
  },
  cardContent: {
    position: 'relative',
    backgroundColor: grey[100],
    // height: 100,
    // flex
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  domainText: {
    fontWeight: 400,
    lineHeight: 1,
    marginBottom: theme.spacing.unit,
  },
  cardActions: {
    justifyContent: 'center',
  },

  rightButton: {
    marginLeft: theme.spacing.unit,
  },
  iconButton: {
    margin: 0,
  },

  moreIcon: {
    alignSelf: 'flex-end',
    position: 'absolute',
    transform: 'translate(22px, -16px)',
  },
}));

class Home extends React.Component {
  componentDidMount() {
    const { onFetchApps } = this.props;
    onFetchApps();

    const el = this.scrollContainer;

    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        onFetchApps({ next: true });
      }
    };
  }

  render() {
    const {
      classes,
      apps,
    } = this.props;

    const dialogs = [
      <DialogAbout />,
      <DialogSubmitApp />,
    ];

    const app = {
      id: 1,
      url: 'url',
    };
    const temp = (
      <Grid key={app.id} item>
        <Paper className={classes.paper}>
          <img src={`https://getwebcatalog.com/s3/${app.id}.webp`} alt="Messenger" className={classes.paperIcon} />
          <Typography type="subheading" color="inherit" className={classes.titleText}>
            {app.name}
          </Typography>
          <Typography type="body2" color="inherit" className={classes.domainText}>
            {extractHostname(app.url)}
            {app.description}
          </Typography>
          <Button dense color="primary">Open</Button>
          <Button dense color="accent" className={classes.rightButton}>Uninstall</Button>
        </Paper>
      </Grid>
    );
    console.log(temp);

    return (
      <div
        className={classes.scrollContainer}
        ref={(container) => { this.scrollContainer = container; }}
      >
        {dialogs}
        <Grid container>
          <Grid item xs={12}>
            <Grid container justify="center" gutter={24}>
              {apps.map(app => (
                <Grid key={app.id} item>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <IconButton
                        className={classes.moreIcon}
                        aria-label="More"
                        onClick={() => {}}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <img src={`https://getwebcatalog.com/s3/${app.id}.webp`} alt="Messenger" className={classes.paperIcon} />
                      <Typography type="subheading" className={classes.appName}>
                        {app.name}
                      </Typography>
                      <Typography type="heading2" color="secondary">
                        {extractHostname(app.url)}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                      <IconButton
                        className={classes.iconButton}
                        aria-label="Install"
                        onClick={() => {}}
                      >
                        <AddBoxIcon />
                      </IconButton>
                      <IconButton
                        className={classes.iconButton}
                        aria-label="Open"
                        onClick={() => {}}
                      >
                        <ExitToAppIcon />
                      </IconButton>
                      <IconButton
                        className={classes.iconButton}
                        aria-label="Uninstall"
                        onClick={() => {}}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
                ),
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Home.defaultProps = {
  category: null,
  sortBy: null,
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,

  // status: PropTypes.string.isRequired,
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  // category: PropTypes.string,
  // sortBy: PropTypes.string,

  onFetchApps: PropTypes.func.isRequired,
  // onSetCategory: PropTypes.func.isRequired,
  // onSetSort: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  status: state.home.status,
  apps: state.home.apps,
  category: state.home.category,
  sortBy: state.home.sortBy,
});

const mapDispatchToProps = dispatch => ({
  onFetchApps: optionsObject => dispatch(fetchApps(optionsObject)),
  onSetCategory: category => dispatch(setCategory(category)),
  onSetSortBy: sortBy => dispatch(setSortBy(sortBy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Home));
