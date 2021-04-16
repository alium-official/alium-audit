import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
// import { Heading, Button, Flex, ConnectorId, useWalletModal } from '@aliumswap/uikit'
import { Heading, Button, Flex, useWalletModal } from '@aliumswap/uikit'
import { injected, walletconnect } from 'connectors'
import SocialNetworks from './SocialNetworks/SocialNetworks'
import logo from '../../images/logo.svg'
import logoMobile from '../../images/logo-mobile.svg'
import icon from '../../images/plus-icon.svg'

const Wrapper = styled.div`
  padding: 30px;
  border-bottom: 1px solid #d2d6e6;
  width: 100%;
  display: flex;
  justify-content: space-between;
@media screen and (max-width: 600px)
  & .logo--desktop {
    display: block;
  }
  & .logo--mobile {
    display: none;
  }
  @media screen and (max-width: 854px) {
    padding: 30px 40px 30px 40px;
  }
  @media screen and (max-width: 790px) {
    padding: 30px 10px 30px 10px;
  }
  @media screen and (max-width: 640px) {
    padding: 15px 10px;

    & .logo--desktop {
      display: none;
    }

    & .logo--mobile {
      display: block;
    }

    & .login-btn {
      padding: 0 12px;
    }
  }
`

const ImageWrap = styled.div`
  margin-right: 20px;
`

const StyledHeading = styled(Heading)`
  &.heading--desktop {
    margin: 0;
    margin-left: 116px;
    display: block;
    font-size: 32px;
  }
  @media screen and (max-width: 1290px) {
    &.heading--desktop {
      font-size: 30px;
      margin-left: 30px;
    }
  }
  @media screen and (max-width: 1170px) {
    &.heading--desktop {
      display: none;
    }
  }
`

const Header = () => {
  const { account, activate, deactivate } = useWeb3React()

  const { t } = useTranslation()
  const handleLogin = (connectorId: any) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(
    handleLogin,
    deactivate,
    account as string,
    t('yourWallet'),
    '',
    t('copyAddress'),
    t('logoutTitle'),
    t('viewOnBscScan')
  )

  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

  return (
    <Wrapper>
      <Flex style={{ width: '100%' }} justifyContent="space-between">
        <Flex style={{ width: '100%' }} alignItems="center">
          <img src={logo} alt="logo" className="logo--desktop" />
          <img src={logoMobile} alt="logo" className="logo--mobile" />
          <StyledHeading as="h1" size="xl" color="heading" mb="40px" mt="20px" className="heading--desktop">
            {t('strategicalPartnership')}
          </StyledHeading>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <SocialNetworks />
          {account ? (
            <Button onClick={onPresentAccountModal} className="login-btn">
              {accountEllipsis}
            </Button>
          ) : (
            <Button onClick={onPresentConnectModal} className="login-btn">
              <ImageWrap>
                <img src={icon} alt="plus" />
              </ImageWrap>
              {t('connect')}
            </Button>
          )}
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default Header
