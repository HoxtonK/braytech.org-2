import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Ranks from '../../../../components/Ranks';

import './styles.css';

class RanksComp extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterProgressions = member.data.profile.characterProgressions.data;

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{t('Ranks')}</div>
        </div>
        <div className='ranks'>
          {[2772425241, 2626549951, 2000925172].map(hash => {
            return <Ranks key={hash} hash={hash} data={{ membershipType: member.membershipType, membershipId: member.membershipId, characterId: member.characterId, characters: member.data.profile.characters.data, characterProgressions }} />;
          })}
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withTranslation()
)(RanksComp);
