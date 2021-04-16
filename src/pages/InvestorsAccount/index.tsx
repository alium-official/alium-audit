import React from 'react'
import styled from 'styled-components'
import { Text } from '@aliumswap/uikit'
import AppBody from '../AppBody'
import AuditItem from './components/AuditItem'
import audits from './constants/audits'

const ContentHolder = styled.div`
  position: relative;
  margin: auto;
`

const CardWrapper = styled.div`
  width: 100%;
  font-family: Roboto, sans-serif;
  width: 100%;
  margin: 0 auto;
  position: relative;
  
  @media screen and (max-width: 1024px) {
    max-width: 954px;
  }
  
  @media screen and (max-width: 1016px) {
    padding: 0 32px 0 32px;
  }
  @media screen and (max-width: 790px) {
    padding: 0;
  }
`

const AuditListContainer = styled.div`
  > div:not(:last-child) {
    margin-bottom: 16px;
  }
`

const StyledWrapper = styled.div`
  display: flex;
`

const AuditPage = () => {

  return (
    <StyledWrapper>
    <ContentHolder>
      <CardWrapper>
        <Text fontSize="48px" style={{fontWeight: 700, marginBottom: '32px'}}>Our completed audits</Text>

        <AppBody>
          <AuditListContainer>
            {audits.map((audit)=>
              <AuditItem headline={audit.headline}/>
            )}
          </AuditListContainer>
        </AppBody>
      </CardWrapper>
    </ContentHolder>
    </StyledWrapper>
  )
}

export default AuditPage
