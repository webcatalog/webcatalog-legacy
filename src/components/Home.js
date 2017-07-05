import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
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
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    overflow: 'auto',
    boxSizing: 'border-box',
  },

  paper: {
    width: 200,
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    boxSizing: 'border-box',
  },

  paperIcon: {
    width: 64,
    height: 64,
  },

  titleText: {
    fontWeight: 500,
    lineHeight: 1.5,
    marginTop: theme.spacing.unit,
  },

  domainText: {
    fontWeight: 400,
    lineHeight: 1,
    marginBottom: theme.spacing.unit,
  },

  rightButton: {
    marginLeft: theme.spacing.unit,
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
        onFetchApps();
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

    return (
      <div
        className={classes.scrollContainer}
        ref={(container) => { this.scrollContainer = container; }}
      >
        {dialogs}
        <Grid container>
          <Grid item xs={12}>
            <Grid container justify="center" gutter={16}>
              {apps.map(app => (
                <Grid key={app.id} item>
                  <Paper className={classes.paper}>
                    <img src={`https://getwebcatalog.com/s3/${app.id}.webp`} alt="Messenger" className={classes.paperIcon} />
                    <Typography type="subheading" color="inherit" className={classes.titleText}>
                      {app.name}
                    </Typography>
                    <Typography type="body2" color="inherit" className={classes.domainText}>
                      {extractHostname(app.url)}
                    </Typography>
                    <Button dense color="primary">Open</Button>
                    <Button dense color="accent" className={classes.rightButton}>Uninstall</Button>
                  </Paper>
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
  onFetchApps: () => dispatch(fetchApps()),
  onSetCategory: category => dispatch(setCategory(category)),
  onSetSortBy: sortBy => dispatch(setSortBy(sortBy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Home));
