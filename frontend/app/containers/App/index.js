/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import TopbarContainer from 'containers/TopbarContainer';
import NoConnection from 'components/NoConnection';
import Dashboard from 'containers/Dashboard';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
`

function App(props) {
  return (
    <AppWrapper>
      <TopbarContainer />
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </AppWrapper>
  );
}


function mapStateToProps(state) {
  return {
    tunneling: true,
    pid: state.pid.enabled,
    scan: false,
    connected: state.monitor.connection
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(App);
