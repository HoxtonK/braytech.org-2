import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Items from '../../components/Items';

import './styles.css';

class Character extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  componentDidMount() {
    const { member } = this.props;

    console.log(member.characterId, member.data.profile.characterEquipment.data[member.characterId])
  }

  render() {

    const { member } = this.props;

    return (
      <div className='view' id='character'>
        <ul className='list inventory-items'>
          <Items items={member.data.profile.characterEquipment.data[member.characterId].items} />
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Character);
