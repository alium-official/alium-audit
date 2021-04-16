import React from 'react'
import { useWeb3React } from '@web3-react/core'
// import { Button, ButtonProps, ConnectorId, useWalletModal } from '@aliumswap/uikit'
import { Button, ButtonProps, useWalletModal } from '@aliumswap/uikit'

import { injected, walletconnect } from 'connectors'
import { useTranslation } from 'react-i18next'

const UnlockButton: React.FC<ButtonProps> = props => {
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: any) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }
  const {t} = useTranslation();
  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string, t('modalTitle'), t('modalFooter'))

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {t('unlockWallet')}
    </Button>
  )
}

export default UnlockButton
