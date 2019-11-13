import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import './styles.css';

import Root from './Root/';
import Crucible from './Crucible/';
import Gambit from './Gambit/';
import Raids from './Raids/';
import Strikes from './Strikes/';

class PGCRs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    
  }

  render() {
    const type = this.props.match.params.type || false;
    const mode = this.props.match.params.mode || false;
    const offset = this.props.match.params.offset || 0;

    if (type === 'crucible') {
      return <Crucible mode={mode} offset={offset} />;
    } else if (type === 'gambit') {
      return <Gambit mode={mode} offset={offset} />;
    } else if (type === 'raids') {
      return <Raids mode={mode} offset={offset} />;
    } else if (type === 'strikes') {
      return <Strikes mode={mode} offset={offset} />;
    } else {
      return <Root offset={offset} />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    PGCRcache: state.PGCRcache
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(PGCRs);
