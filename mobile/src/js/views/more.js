import Container from 'react-container';
import React from 'react';
import Sentry from 'react-sentry';
import Tappable from 'react-tappable';
import { Link, UI } from 'touchstonejs';
import categoryList from '../category-list';

const scrollable = Container.initScrollable();

var MoreLinkItem = React.createClass({
  handleTap() {
    if (this.props.url) {
      window.openInBrowser(this.props.url);
    }
  },

	render () {
		return (
			<Tappable onTap={this.handleTap}>
				<UI.Item showDisclosureArrow>
					<UI.ItemInner>
						<UI.ItemTitle>{this.props.title}</UI.ItemTitle>
					</UI.ItemInner>
				</UI.Item>
			</Tappable>
		);
	}
});

module.exports = React.createClass({
	mixins: [Sentry],

	statics: {
		navigationBar: 'main',
		getNavigation (props, app) {
			return {
				leftArrow: false,
				title: 'About'
			}
		}
	},

	render () {
		return (
			<Container ref="scrollContainer" scrollable={scrollable}>
				<UI.GroupBody>
          <MoreLinkItem key="website" title="Website" url="https://www.getwebstore.io" />
          <MoreLinkItem key="submitNewApp" title="Submit New App" url="https://www.getwebstore.io/submit-new-app" />
          <UI.LabelInput type="text" label="Version" value={window.AppVersion ? AppVersion.version : "0.0.0"} disabled={true}/>
				</UI.GroupBody>
			</Container>
		);
	}
});
