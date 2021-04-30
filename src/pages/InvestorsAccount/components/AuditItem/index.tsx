import React from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal, Text } from '@alium-official/uikit'
import { BSCScanIcon, GitHubIcon } from '../../../../assets/Icons'

const StyledContainer = styled.div`
  width: 738px;
  height: 275px;
  
  background: #FFFFFF;
  padding: 24px;
`

const AuditItem = ({headline}) => {
  return (
    <StyledContainer>
      <Flex justifyContent="space-between" style={{height: '100%'}}>
        <Flex flexDirection="column" justifyContent="space-between" style={{height: '100%'}}>
          <Flex flexDirection="column" justifyContent="space-between" style={{paddingBottom: '16px', borderBottom: '1px solid #F5F7FF'}}>
            <Text color="#8990A5" fontSize="14px">Chainsulting - DLT Consulting & Development</Text>
            <Text color="#0B1359" fontSize="24px">{headline}</Text>
            <Text color="#8990A5" fontSize="14px">29th March 2020</Text>
          </Flex>
          <Flex flexDirection="column">
            <Flex alignItems="center">
              <GitHubIcon style={{marginRight: '4px'}}/>
              <Text fontSize="14px">On Github:</Text>
            </Flex>
            <Flex alignItems="center">
              <BSCScanIcon style={{marginRight: '4px'}}/>
              <Text fontSize="14px">On BscScan:</Text>
            </Flex>
          </Flex>
          <Flex>
            <LinkExternal paddingRight="16px">GitHub Cerificate PDF</LinkExternal>
            <LinkExternal>Detailed report</LinkExternal>
          </Flex>
        </Flex>
        <h1>Avatar</h1>
      </Flex>
    </StyledContainer>
  )
}

export default AuditItem
