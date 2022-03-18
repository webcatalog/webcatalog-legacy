/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';

const StatedMenu = ({
  buttonElement,
  children,
  id,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      {React.cloneElement(buttonElement, {
        'aria-owns': id,
        'aria-haspopup': true,
        onClick: (e) => {
          e.stopPropagation();
          setOpen(true);
          setAnchorEl(e.currentTarget);
        },
      })}
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {React.Children.map(children, (child) => child && React.cloneElement(child, {
          onClick: (e) => {
            e.stopPropagation();
            if (child.props.onClick) child.props.onClick();
            setOpen(false);
          },
        }))}
      </Menu>
    </>
  );
};

StatedMenu.propTypes = {
  buttonElement: PropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

export default StatedMenu;
