import Container from 'react-container';
import React from 'react';
import Tappable from 'react-tappable';
import { UI } from 'touchstonejs';
import InstallAppMixin from '../mixins/install-app';
import categoryList from '../category-list';

function getCategory(id) {
	let foundCategory = categoryList.find(function(category) {
		if (category.id == id) return true;
		return false;
	});
	return foundCategory;
}

module.exports = React.createClass({
	mixins: [InstallAppMixin],

	statics: {
		navigationBar: 'main',
		getNavigation (props, app) {
			let category = getCategory(props.webApp.get('category'));
			return {
				leftArrow: true,
				leftLabel: 'Back',
				leftAction: () => {
					app.transitionTo(
						'tabs:' + props.prevView,
						{
							transition: 'reveal-from-right',
							viewProps: props.prevProps
						}
					)
				},
				rightLabel: category.name,
				rightAction: () => {
					app.transitionTo(
						'tabs:category',
						{
							transition: 'reveal-from-top',
							viewProps: { category: category, prevView: 'categories' }
						}
					)
				},
				title: ''
			}
		}
	},
	getDefaultProps () {
		return {
			prevView: 'top-charts'
		}
	},
	render () {
		let { webApp } = this.props;
		let httpSecure = webApp.get('url').indexOf('https://') > -1 ? 'Yes' : 'No';
		console.log(webApp.get('developer'));
		return (
			<Container direction="column">
				<Container fill scrollable ref="scrollContainer" className="AppDetails">
					<img src={webApp.get('icon512x512')} className="AppDetails__avatar" />
					<div className="AppDetails__heading">{webApp.get('name')}</div>
					<Tappable onTap={() => OpenUrlExt.open(webApp.get('url'))} stopPropagation>
						<div className="AppDetails__installButton">
							TRY
						</div>
					</Tappable>
					<Tappable onTap={this.installApp.bind(null, webApp.get('id'))} stopPropagation>
						<div className="AppDetails__installButton">
							INSTALL
						</div>
					</Tappable>
					{webApp.get('developer') ? <UI.LabelInput type="text" label="Developer" value={webApp.get('developer')} disabled={true}/> : null}
					<UI.LabelInput type="url" label="URL" value={webApp.get('url')} disabled={true} />
					<UI.LabelInput type="text" label="HTTP Secure" value={httpSecure} disabled={true}/>
				</Container>
			</Container>
		);
	}
});
