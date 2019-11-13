import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import './styles.css';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classNames, checked, text, children, linked, action } = this.props;

    return (
      <div
        className={cx('check-box', classNames, { checked: checked, linked: linked })}
        onClick={e => {
          if (action) {
            action(e);
          }
        }}
      >
        <div className={cx('check', { ed: checked })} />
        {!children ? <div className='text'>{text}</div> : children}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {};
}

export default compose(connect(mapStateToProps))(Checkbox);
