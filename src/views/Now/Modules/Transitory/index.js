import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../../utils/manifest';
import * as bungie from '../../../../utils/bungie';
import Spinner from '../../../../components/UI/Spinner';

import './styles.css';

class Transitory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    const {} = this.props;

    this.getTransitory();
  }

  componentDidUpdate(p, s) {
    if (s.loading !== this.state.loading) {
      this.props.rebindTooltips();
    }
  }

  getTransitory = async () => {
    const { member } = this.props;

    const response = await bungie.GetProfile({
      params: {
        membershipType: member.membershipType,
        membershipId: member.membershipId,
        components: '200,204,1000'
      }
    })
    .then(response => {
      if (response && response.ErrorCode === 1 && response.Response && response.Response.profileTransitoryData.data) { 
        response.Response.characterActivities.data = Object.keys(response.Response.characterActivities.data)
          .map(key => ({ ...response.Response.characterActivities.data[key], characterId: key }))
          .sort(function(a, b) {
            return new Date(b.dateActivityStarted).getTime() - new Date(a.dateActivityStarted).getTime();
          });
      }
        
      return response;
    });

    if (response && response.ErrorCode === 1 && response.Response && response.Response.profileTransitoryData.data) {

      response.Response.profileTransitoryData.data.partyMembers = await Promise.all(
        response.Response.profileTransitoryData.data.partyMembers.map(async m => {
          const response = await bungie.GetLinkedProfiles(m.membershipId);

          if (response && response.ErrorCode === 1) {
            m.linkedProfiles = response.Response;
          }

          return m;
        })
      );

      this.setState({
        loading: false,
        error: false,
        data: response.Response
      });
    } else {
      this.setState(p => ({
        ...p,
        loading: false,
        error: true
      }));
    }
  };

  render() {
    const { t, member } = this.props;
    const { loading, data } = this.state;

    console.log(data)

    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{t('Fireteam')}</div>
        </div>
        <div className='fireteam'>
          
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

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Transitory);
