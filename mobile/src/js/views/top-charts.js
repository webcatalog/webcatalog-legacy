import Container from 'react-container';
import React from 'react';
import Sentry from 'react-sentry';
import { UI } from 'touchstonejs';
import ConnectToWebStoreMixin from '../mixins/connect-to-web-store';
import WebAppActions from '../actions/web-app';
import WebAppItem from './web-app-item.js';

const scrollable = Container.initScrollable();

function getNavigation (props, app) {
	return {
		leftArrow: false,
		rightLabel: 'Refresh',
		rightAction: () => { WebAppActions.refresh(); },
		title: 'Top Charts'
	};
}

module.exports = React.createClass({
	mixins: [ConnectToWebStoreMixin],

	contextTypes: {
		app: React.PropTypes.object
	},

	statics: {
		navigationBar: 'main',
		getNavigation: getNavigation
	},

	getInitialState () {
		return {
			selectedMode: this.props.selectedMode || 'most-installed'
		}
	},

	handleModeChange (newMode) {
		let selectedMode = newMode;

		WebAppActions.fetch({ type: newMode });

		this.setState({ selectedMode })
	},

	componentDidMount() {
		if (this.state.webAppStore.get('type') != this.state.selectedMode)
			WebAppActions.fetch({ type: this.state.selectedMode });
	},

	render () {
		let { selectedMode } = this.state;
		let webApps = this.state.webAppStore.get('webApps');
		let status = this.state.webAppStore.get('status');

		let results;

		if (status == 'failed') {
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
					<div className="no-results__text">There are no apps in this section.</div>
				</Container>
			)
		}
		else if (webApps.size > 0) {
			results = (
				<UI.GroupBody>
					{<UI.ListHeader sticky>{this.state.selectedMode == 'most-installed' ? 'Most Installed Apps' : 'New Apps'}</UI.ListHeader>}
					{
						webApps.map((webApp, i) => {
							return <WebAppItem key={'webApp' + i} webApp={webApp} prevProps={{ selectedMode: this.state.selectedMode }} prevView='top-charts'/>
						})
					}
				</UI.GroupBody>
			)
		}


		return (
			<Container scrollable={scrollable}>
				<div className="Alert-Container" style={{ display: this.state.webAppStore.get('status') == 'loading' ? '' : 'none' }}>
					<UI.Alertbar type="warning" pulse>Loading...</UI.Alertbar>
				</div>
				<UI.SegmentedControl value={this.state.selectedMode} onChange={this.handleModeChange} hasGutter equalWidthSegments options={[
					{ label: 'Most Installed', value: 'most-installed' },
					{ label: 'New', value: 'new' }
				]} />
				{results}
				{this.state.webAppStore.get('status') == 'done' && this.state.webAppStore.get('loadMoreOk') == true ? (
					<UI.Button type="primary" style={{ marginBottom: 0 }} onTap={() => WebAppActions.fetchMore()}>
						Load More
					</UI.Button>
				) : null}
			</Container>
		);
	}
});
