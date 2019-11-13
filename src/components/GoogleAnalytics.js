import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

import packageJSON from '../../package.json';

class GoogleAnalytics extends Component {
  componentDidMount() {
    this.logPageChange(this.props.location.pathname, this.props.location.search);
  }

  componentDidUpdate({ location: prevLocation }) {
    const {
      location: { pathname, search }
    } = this.props;
    const isDifferentPathname = pathname !== prevLocation.pathname;
    const isDifferentSearch = search !== prevLocation.search;

    if (isDifferentPathname || isDifferentSearch) {
      this.logPageChange(pathname, search);
    }
  }

  logPageChange(pathname, search = '') {
    const page = pathname + search;
    const { location } = window;
    ReactGA.set({
      page,
      location: `${location.origin}${page}`,
      appName: 'Braytech',
      appVersion: packageJSON.version,
      ...this.props.options
    });
    ReactGA.pageview(page);
  }

  render() {
    return null;
  }
}

GoogleAnalytics.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }).isRequired,
  options: PropTypes.object
};

const init = (options = {}) => {
  const isGAEnabled = !!process.env.REACT_APP_GA_TRACKING_ID || !!process.env.REACT_APP_GA_TRACKING_ID_BETA;

  if (isGAEnabled) {
    ReactGA.initialize(process.env.REACT_APP_BETA ? process.env.REACT_APP_GA_TRACKING_ID_BETA : process.env.REACT_APP_GA_TRACKING_ID, {
      debug: process.env.REACT_APP_GA_DEBUG === 'true',
      ...options
    });
  }

  return isGAEnabled;
};

export default {
  GoogleAnalytics,
  init
};
