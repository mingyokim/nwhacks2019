import React from 'react';
import PropTypes from 'prop-types';

import { Application } from '../../components/application';
import { ApplicationContext } from './Context';

export class ApplicationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelled: false,
    };
  }

  onPageChange = (activeIndex) => {
    const { changePage, changeLastActiveIndex, lastValidIndex } = this.props;
    changePage(activeIndex);
    if (activeIndex > lastValidIndex) {
      changeLastActiveIndex(activeIndex);
    }
  }

  onPageNext = () => {
    const { activeIndex } = this.props;
    const nextIndex = activeIndex + 1;
    this.onPageChange(nextIndex);
  }

  onPageBack = () => {
    const { activeIndex } = this.props;
    const nextIndex = activeIndex - 1;
    this.onPageChange(nextIndex);
  }

  onApplicationChange = (app) => {
    const { updateApplication } = this.props;
    updateApplication(app);
  }

  alertThenCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      this.cancel();
    }
  };

  cancel = () => {
    const { cancelApplication } = this.props;
    this.setState({ cancelled: true });
    cancelApplication();
  }

  // submitApplication = (userCredentials) => {
  //   const { firebase } = this.props;
  //   // TODO: hide this under feature flag https://github.com/nwplus/nwhacks2019/issues/114
  //   // this.signUp(firebase, userCredentials);
  // }
  submitApplication = () => {
    // const { firebase } = this.props;
    // TODO: hide this under feature flag https://github.com/nwplus/nwhacks2019/issues/114
    // this.signUp(firebase, userCredentials);
  }

  // signUp(firebase, userCredentials) {
  //   const auth = firebase.auth();
  //   const { email, password } = userCredentials;
  //   auth.createUserWithEmailAndPassword(email, password).then(() => {
  //     console.log('user successfully created!');
  //   }).catch((error) => {
  //     console.err('failed to create user: ', error);
  //   });
  // }

  render() {
    const {
      application,
      activeIndex,
      lastValidIndex,
    } = this.props;
    const { cancelled } = this.state;

    const { pages } = this.props;

    const applicationProps = {
      count: pages.length,
      activeIndex,
      lastValidIndex,
      onPageChange: this.onPageChange,
      onPageBack: this.onPageBack,
      onPageNext: this.onPageNext,
      onApplicationChange: this.onApplicationChange,
      cancelApplication: this.alertThenCancel,
      cancelled,
      submitApplication: this.submitApplication,
      application,
    };

    return (
      <ApplicationContext.Provider value={applicationProps}>
        <Application pages={pages} />
      </ApplicationContext.Provider>
    );
  }
}

ApplicationContainer.propTypes = {
  // application contains the application itself.
  application: PropTypes.object.isRequired,

  // changePage is called whenever the user changes pages with an argument for the new active index.
  changePage: PropTypes.func.isRequired,

  // changeLastActiveIndex is called whenever the user visits an unvisited page,
  // with an argument for the index of such page.
  changeLastActiveIndex: PropTypes.func.isRequired,

  // activeIndex determines the current index/page the user is on.
  activeIndex: PropTypes.number.isRequired,

  // lastValidIndex determines the furthest page that the user has been on.
  lastValidIndex: PropTypes.number.isRequired,

  // updateApplication is called whenver the user updates the application.
  updateApplication: PropTypes.func.isRequired,

  // cancelApplication is called whenever the user cancels the application.
  cancelApplication: PropTypes.func.isRequired,

  // pages determines the pages in the application.
  pages: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]),
};

export default ApplicationContainer;
