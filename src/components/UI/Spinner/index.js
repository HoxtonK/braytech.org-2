import React from 'react';
import cx from 'classnames';

import './styles.css';

class Spinner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={cx('spinner', { mini: this.props.mini })}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 62.08 71.68'>
          <polygon className='a' points='30.04 59.7 10.87 48.64 1 54.34 30.04 71.1 30.04 59.7' />
          <polygon className='e' points='1 17.34 10.87 23.04 30.04 11.97 30.04 0.58 1 17.34' />
          <polygon className='f' points='9.87 46.91 9.87 24.77 0 19.07 0 52.6 9.87 46.91' />
          <polygon className='d' points='32.04 0.58 32.04 11.97 51.2 23.04 61.08 17.34 32.04 0.58' />
          <polygon className='b' points='61.08 54.34 51.2 48.64 32.04 59.7 32.04 71.1 61.08 54.34' />
          <polygon className='c' points='52.2 24.77 52.2 46.91 62.08 52.6 62.08 19.07 52.2 24.77' />
        </svg>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 62.08 71.68'>
          <polygon className='c' points='21.8 29.35 30.04 24.59 30.04 14.32 12.9 24.21 21.8 29.35' />
          <polygon className='b' points='20.8 40.6 20.8 31.08 11.9 25.95 11.9 45.73 20.8 40.6' />
          <polygon className='d' points='32.04 14.32 32.04 24.59 40.28 29.35 49.17 24.21 32.04 14.32' />
          <polygon className='e' points='41.28 31.08 41.28 40.6 50.17 45.73 50.17 25.95 41.28 31.08' />
          <polygon className='a' points='30.04 47.09 21.8 42.33 12.9 47.47 30.04 57.36 30.04 47.09' />
          <polygon className='f' points='40.28 42.33 32.04 47.09 32.04 57.36 49.17 47.47 40.28 42.33' />
        </svg>
      </div>
    );
  }
}

export default Spinner;
