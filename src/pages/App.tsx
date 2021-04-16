import useEagerConnect from 'hooks/useEagerConnect'
import React, { Suspense } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import Menu from '../components/Menu'
import AuditPage from './InvestorsAccount'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  width: 100%;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  justify-content: center;
  padding: 42px 20px;
  width: 100%;
  height: auto;
  background: transparent;

  @media screen and (max-width: 1170px) {
    padding: 0;
  }

  @media screen and (max-width: 850px) {
    padding: 22px 10px;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  useEagerConnect();

  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <AppWrapper>
          <BodyWrapper>
            <Popups />
            <Web3ReactManager>
              <Switch>
                {/* <Route exact strict path="/" component={Home} /> */}
                {/* <Route exact strict path="/" component={StrategicalPartnerShipHome} /> */}
                <Menu>
                  <Route exact strict path="/" component={AuditPage} />
                </Menu>
                <Route render={() => <Redirect to={{ pathname: '/' }} />} />
              </Switch>
            </Web3ReactManager>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      </BrowserRouter>
    </Suspense>
  )
}
