import React from 'react';
import Tappable from 'react-tappable';
import { Link, UI } from 'touchstonejs';
import InstallAppMixin from '../mixins/install-app';

const WebAppItem = React.createClass({
	mixins: [InstallAppMixin],

	render () {
		let webApp = this.props.webApp;

		return (
			<Link to="tabs:app-details" transition="show-from-right" viewProps={{ webApp: webApp, prevView: this.props.prevView, prevProps: this.props.prevProps }}>
				<UI.Item>
					<UI.ItemMedia avatar={webApp.get('icon180x180')} avatarInitials={webApp.get('name').charAt(0)} className="Item__webApp--avatar" />
					<UI.ItemInner>
						<UI.ItemContent>
							<UI.ItemTitle>{webApp.get('name')}</UI.ItemTitle>
						</UI.ItemContent>
						<Tappable onTap={this.installApp.bind(null, webApp.get('id'))} stopPropagation>
							<div className="Item__webApp--installButton">
								INSTALL
							</div>
						</Tappable>
					</UI.ItemInner>
				</UI.Item>
			</Link>
		);
	}
});

export default WebAppItem;
