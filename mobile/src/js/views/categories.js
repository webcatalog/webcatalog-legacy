import Container from 'react-container';
import React from 'react';
import Sentry from 'react-sentry';
import Tappable from 'react-tappable';
import { Link, UI } from 'touchstonejs';
import categoryList from '../category-list';

const scrollable = Container.initScrollable();

var CategoryLinkItem = React.createClass({
	propTypes: {
		category: React.PropTypes.object.isRequired
	},

	render () {
		return (
			<Link to="tabs:category" transition="show-from-right" viewProps={{ category: this.props.category, prevView: 'categories' }}>
				<UI.Item showDisclosureArrow>
					<UI.ItemInner>
						<UI.ItemTitle>{this.props.category.name}</UI.ItemTitle>
					</UI.ItemInner>
				</UI.Item>
			</Link>
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
				title: 'Categories'
			}
		}
	},

	render () {
		return (
			<Container ref="scrollContainer" scrollable={scrollable}>
				<UI.GroupBody>
					{categoryList.map((category, i) => {
						return <CategoryLinkItem key={'category' + i} category={category} />
					})}
				</UI.GroupBody>
			</Container>
		);
	}
});
