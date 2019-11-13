import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import MemberLink from '../../components/MemberLink';
import userFlair from '../../data/userFlair';

import './styles.css';

class Credits extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.supporters = this.shuffle(userFlair.slice().filter(m => m.trophies.find(t => t.classnames.includes('patron'))));
  }

  thanks = [
    {
      name: 'Alex Loret de Mola',
      description: 'Senior Software Engineer, Bungie. His efforts literally enable this web site, and similar, to function. Herein known as the Architect.'
    },
    {
      name: 'Michael Pearson',
      description: 'Responsible for refactoring core components that have brought Braytech properly into 2019. He lives in a tree house.'
    },
    {
      name: 'Richard Deveraux',
      description: "From what I understand, lowlines is a pioneer in all things Destiny and Destiny api stuff. His meticulous work helps power Braytech's checklists."
    },
    {
      name: 'Rob Jones',
      description: 'delphiactual prototyped the very popular This Week view. He seems pretty cool, too.'
    },
    {
      name: 'João Paulo Marquesini',
      description: 'The very handsome developer of the Little Light app laid the foundations for a multilingual Braytech.'
    }
  ];

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t } = this.props;

    return (
      <div className={cx('view', this.props.theme.selected)} id='credits'>
        <div className='module intro'>
          <div className='page-header'>
            <div className='name'>{t('Credits')}</div>
          </div>
          <div className='text'>
            <p>The Architects and Guardians that make Braytech possible.</p>
            <p>Braytech's history spans the life of Destiny 2's release. There's been many changes in its trajectory, and it continues to soar. I, justrealmilk, have been aided in my journey by a handful of generous developers, designers, and friendly blueberries, to build this passion project out of the ground from rudimentary HTML and jQuery.</p>
            <p>Love for this game is as undying as the Light itself.</p>
            <p>© Bungie, Inc. All rights reserved. Destiny, the Destiny Logo, Bungie and the Bungie logo are among the trademarks of Bungie, Inc.</p>
          </div>
        </div>
        <div className='module thanks'>
          <div className='sub-header sub'>
            <div>{t('Special thanks')}</div>
          </div>
          <div className='persons'>
            {this.thanks.map((person, index) => {
              return (
                <div key={index} className='person'>
                  <div className='text'>
                    <strong>{person.name}</strong>
                    <p>{person.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='sub-header sub'>
            <div>{t('Patreon supporters')}</div>
          </div>
          <div className='tags'>
            {this.supporters.map((m, k) => {
              let t = m.user.slice(0, 1);
              let i = m.user.slice(1);
              return <MemberLink key={k} type={t} id={i} hideFlair />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Credits);
