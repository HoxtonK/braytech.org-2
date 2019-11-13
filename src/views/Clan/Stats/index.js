import React from 'react';

import RosterLeaderboards from '../../../components/RosterLeaderboards';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class StatsView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  componentDidUpdate(pP) {
    if (pP.subView !== this.props.subView || pP.subSubView !== this.props.subSubView) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { subView, subSubView } = this.props;

    return (
      <>
        <ClanViewsLinks {...this.props} />
        <RosterLeaderboards mode='70' scopeId={subView} statId={subSubView} />
      </>
    );
  }
}

export default StatsView;
