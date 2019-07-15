import React from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';

import connectComponent from '../../helpers/connect-component';

const styles = {
  container: {
    display: 'inline-flex',
  },
};

class RightClickMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: undefined,
      open: false,
    };

    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleContextMenu(event) {
    event.preventDefault();
    this.setState({ open: true, anchorEl: event.currentTarget });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    const {
      buttonElement,
      children,
      classes,
      id,
    } = this.props;

    return (
      <div className={classes.container}>
        {React.cloneElement(buttonElement, {
          'aria-owns': id,
          'aria-haspopup': true,
          onContextMenu: this.handleContextMenu,
        })}
        <Menu
          id={id}
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
        >
          {React.Children.map(children, child => React.cloneElement(child, {
            onClick: () => {
              if (child.props.onClick) child.props.onClick();
              this.handleRequestClose();
            },
          }))}
        </Menu>
      </div>
    );
  }
}

RightClickMenu.propTypes = {
  buttonElement: PropTypes.element.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default connectComponent(
  RightClickMenu,
  null,
  null,
  styles,
);
