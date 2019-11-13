import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Maps from '../../components/Maps';

import './styles.css';

class MapsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className='view' id='maps'>
        <Maps params={this.props.match.params} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withTranslation()
)(MapsView);
