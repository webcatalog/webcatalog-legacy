import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactDOM from 'react-dom';
import {
	Container,
	createApp,
	UI,
	View,
	ViewManager
} from 'touchstonejs';

window.openInBrowser = function(url) {
	OpenUrlExt.open(url);
}

const App = React.createClass({
	mixins: [createApp()],

	componentDidMount () {
		// Hide the splash screen when the app is mounted
		if (navigator.splashscreen) {
			navigator.splashscreen.hide();
		}
	},

	render () {
		let appWrapperClassName = 'app-wrapper device--iOS';

		return (
			<div className={appWrapperClassName}>
				<ViewManager name="app" defaultView="main">
					<View name="main" component={MainViewController} />
				</ViewManager>
			</div>
		);
	}
});

// Main Controller
// ------------------------------

const MainViewController = React.createClass({
	render () {
		return (
			<Container>
				<UI.NavigationBar name="main" />
				<ViewManager name="main" defaultView="tabs">
					<View name="tabs" component={TabViewController} />
				</ViewManager>
			</Container>
		);
	}
});

// Tab Controller
// ------------------------------

let lastSelectedTab = 'top-charts'
const TabViewController = React.createClass({
	getInitialState () {
		return {
			selectedTab: lastSelectedTab
		};
	},

	onViewChange (nextView) {
		lastSelectedTab = nextView

		this.setState({
			selectedTab: nextView
		});
	},

	selectTab (value) {
		let viewProps;

		this.refs.vm.transitionTo(value, {
			transition: 'show-from-bottom',
			viewProps: viewProps
		});

		this.setState({
			selectedTab: value
		})
	},

	render () {
		let selectedTab = this.state.selectedTab
		let selectedTabSpan = selectedTab

		return (
			<Container>
				<ViewManager ref="vm" name="tabs" defaultView={selectedTab} onViewChange={this.onViewChange}>
					<View name="top-charts" component={require('./views/top-charts')} />
					<View name="categories" component={require('./views/categories')} />
					<View name="category" component={require('./views/category')} />
					<View name="search" component={require('./views/search')} />
					<View name="app-details" component={require('./views/app-details')} />
					<View name="more" component={require('./views/more')} />
				</ViewManager>
				<UI.Tabs.Navigator>
					<UI.Tabs.Tab onTap={this.selectTab.bind(this, 'top-charts')} selected={selectedTabSpan === 'top-charts'}>
						<span className="Tabs-Icon Tabs-Icon--topCharts" />
						<UI.Tabs.Label>Top Charts</UI.Tabs.Label>
					</UI.Tabs.Tab>
					<UI.Tabs.Tab onTap={this.selectTab.bind(this, 'categories')} selected={selectedTabSpan === 'categories'}>
						<span className="Tabs-Icon Tabs-Icon--categories" />
						<UI.Tabs.Label>Categories</UI.Tabs.Label>
					</UI.Tabs.Tab>
					<UI.Tabs.Tab onTap={this.selectTab.bind(this, 'search')} selected={selectedTabSpan === 'search'}>
						<span className="Tabs-Icon Tabs-Icon--search" />
						<UI.Tabs.Label>Search</UI.Tabs.Label>
					</UI.Tabs.Tab>
					<UI.Tabs.Tab onTap={this.selectTab.bind(this, 'more')} selected={selectedTabSpan === 'more'}>
						<span className="Tabs-Icon Tabs-Icon--more" />
						<UI.Tabs.Label>More</UI.Tabs.Label>
					</UI.Tabs.Tab>
				</UI.Tabs.Navigator>
			</Container>
		);
	}
});

function startApp () {
	if (window.StatusBar) {
		window.StatusBar.styleDefault();
	}
	ReactDOM.render(<App />, document.getElementById('app'));
}

if (!window.cordova) {
	startApp();
} else {
	document.addEventListener('deviceready', startApp, false);
}
