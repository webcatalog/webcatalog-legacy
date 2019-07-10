import Container from 'react-container';
import React from 'react';
import Sentry from 'react-sentry';
import Tappable from 'react-tappable';
import { Link, UI } from 'touchstonejs';
import ConnectToWebStoreMixin from '../mixins/connect-to-web-store';
import WebAppActions from '../actions/web-app';
import WebAppItem from './web-app-item.js';


const scrollable = Container.initScrollable();

module.exports = React.createClass({
	mixins: [Sentry, ConnectToWebStoreMixin],

	statics: {
		navigationBar: 'main',
		getNavigation (props, app) {
			return {
				leftArrow: false,
				title: 'Search'
			}
		}
	},

	getInitialState () {
		return {
			searchString: this.props.searchString || ''
		}
	},

	clearSearch () {
		this.setState({ searchString: '' });
	},

	updateSearch (str) {
		this.setState({ searchString: str });
		if (str.length > 0) WebAppActions.fetch({ type: 'search', data: str });
	},

	submitSearch (str) {
		if (str.length > 0) WebAppActions.fetch({ type: 'search', data: str });
	},

	render () {
		let { searchString } = this.state;
		let webApps = this.state.webAppStore.get('webApps');
		let status = this.state.webAppStore.get('status');

		let results;
		if (searchString.length < 1) {
			results = null;
		}
		else if (status == 'failed') {
			results = (
				<Container direction="column" align="center" justify="center" className="no-results">
					<div className="no-results__icon ion-sad" />
					<div className="no-results__text">Connection Error.</div>
				</Container>
			)
		}
		else if (status == 'done' && webApps.size == 0) {
			results = (
				<Container direction="column" align="center" justify="center" className="no-results">
					<div className="no-results__icon ion-sad" />
					<div className="no-results__text">Your search did not match any apps.</div>
				</Container>
			)
		}
		else if (webApps.size > 0) {
			results = (
				<UI.GroupBody>
					<UI.ListHeader sticky>Results for '{searchString}'</UI.ListHeader>
					{
						webApps.map((webApp, i) => {
							return <WebAppItem key={'webApp' + i} webApp={webApp} prevProps={{ searchString: this.state.searchString }} prevView='search'/>
						})
					}
				</UI.GroupBody>
			)
		}

		return (
			<Container ref="scrollContainer" scrollable={scrollable}>
				<div className="Alert-Container" style={{ display: this.state.webAppStore.get('status') == 'loading' ? '' : 'none' }}>
					<UI.Alertbar type="warning" pulse>Loading...</UI.Alertbar>
				</div>
				<UI.SearchField type="dark" value={this.state.searchString} onSubmit={this.submitSearch} onChange={this.updateSearch} onCancel={this.clearSearch} onClear={this.clearSearch} placeholder="Search..." />
				{results}
			</Container>
		);
	}
});
