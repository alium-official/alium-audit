import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { parseUnits } from '@ethersproject/units'
import styled from 'styled-components'
import { JSBI, TokenAmount } from '@aliumswap/sdk'
import { Heading, Text, Flex, Button } from '@aliumswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Modal from 'components/Modal'

import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useNFTPrivateContract } from 'hooks/useContract'

import { NFT_PRIVATE_ADDRESS } from 'constants/abis/nftPrivate'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { PopupList } from 'state/application/reducer'
import { AppState } from 'state/index'
import { TransactionSubmittedContent, TransactionSucceedContent } from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { GreyCard } from 'components/Card'
import { Dots } from '../Pool/styleds'
import AppBody from '../AppBody'
import currencies from './constants/currencies'
import whitelist from './constants/whitelist'
import cardList from './constants/cards'
import bgIMG from '../Home/images/background-img.svg'
import emails from './constants/membersList'
import NftPartnershipCard from './components/NftPartnershipCard'

const ContentHolder = styled.div`
  position: relative;
  & .content-background {
    position: absolute;
    right: -20px;
    top: -35px;
  }
  
  @media screen and (max-width: 1170px) {
    & .content-background {
      top: 12px;
      }
  }

  @media screen and (max-width: 480px) {
    & .content-background {
      right: 0;
      top: 50px;
    }
  }
`

const ButtonWrap = styled.div`
  
`

const CardWrapper = styled.div`
  width: 100%;
  font-family: Roboto, sans-serif;
  max-width: 906px;
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

const StyledHeading = styled(Heading)`
  &.heading--desktop {
    display: none;
  }
  &.heading--mobile {
    display: none;
  }
  @media screen and (max-width: 1170px) {
    &.heading--desktop {
      display: block;
      font-size: 32px;
      text-align: center;
    }
  }
  @media screen and (max-width: 850px) {
    &.heading--desktop {
      display: block;
      font-size: 32px;
      text-align: left;
      margin: 36px 0 24px 0;
    }
  }
  @media screen and (max-width: 850px) {
    &.heading--desktop {
      display: none;
    }
    &.heading--mobile {
      display: block;
      text-align: left;
      letter-spacing: 0.3px;
      margin-bottom: 24px;
    }
  }
  @media screen and (max-width: 790px) {
    &.heading--mobile {
      font-size: 28px;
      text-align: center;
      line-height: 34.1px;
    }
  }
  @media screen and (max-width: 544px) {
    padding: 0 78px;
  }
  @media screen and (max-width: 482px) {
    padding: 0 60px;
  }
  @media screen and (max-width: 446px) {
    padding: 0 60px;
  }
  @media screen and (max-width: 446px) {
    padding: 0 30px;
  }
  @media screen and (max-width: 386px) {
    padding: 0;
  }
  @media screen and (max-width: 480px) {
    &.heading--mobile {
      // margin-bottom: 70px
    }
  }
`

const AddressWrap = styled.div`
  margin-top: 10px;
  background: rgba(108, 93, 211, 0.1);
  border: 1px solid #6c5dd3;
  padding: 5px;
  margin: 8px 0 32px 0;
  width: 207px;
  align-self: center;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px;
  color: #6c5dd3;
`

const StyledLink = styled.a`
  color: #6C5DD3;
  display: inline-block;
  text-decoration: underline;
  cursor: pointer;
  :active {
    outline: none; 
    border: none;
  }
  :focus {
    outline: none; 
    border: none;
  }
`

const StyledTextWrapper = styled.div`
  padding: 0 80px;
  
  @media screen and (max-width: 655px) {
    padding: 0 50px;
  }
  
  @media screen and (max-width: 500px) {
    padding: 0;
  }
`

const NotifyMembers = (hash, currency) => {
  const explorer = 'https://bscscan.com/tx'
  if (process.env.NODE_ENV !== 'development') {
    emails.forEach((email) => {
      const obj = {
        to: email,
        subject: 'New card purchase',
        message: `Client bought card for ${currency} \n  ${explorer}/${hash}`,
      }
      axios.post('https://private.alium.finance/api/send-email/', obj).catch((err) => {
        console.error(err)
      })
    })
  }
}

const StrategicalPartnershipHome = () => {
  const [isOpenModal, setOpenModal] = useState(false)
  const [isHideModalOpen, setHideModalOpen] = useState(false)
  const { account, chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  useEffect(() => {
    if (account) {
      setHideModalOpen(false)
      if (whitelist.indexOf(account) === -1) {
        if (!isOpenModal) setOpenModal(true)
      } else if (isOpenModal) setOpenModal(false)
    } else if (!isHideModalOpen) setHideModalOpen(true)
  }, [account, isHideModalOpen, isOpenModal])

  const nftContract = useNFTPrivateContract()
  const [ isSucceedPopupVisible, setSucceedPopupVisible ] = useState(false);

  useEffect(() => {
    if (!account) return
    nftContract?.bought(account).then(res => {
      if (res === true) {
        setSucceedPopupVisible(true);
      } else if (isSucceedPopupVisible) {
          setSucceedPopupVisible(false)
        }
    })
  }, [account, isSucceedPopupVisible, nftContract])

  const [values, setValues] = useState<any>({
    currency: currencies.stablecoins[0],
    count: 1,
  })

  const [txHash, setTxHash] = useState('xczxczxczxc')
  const [tempTxHash, setTempTxHash] = useState('')
  const [isTxOpen, setTxOpen] = useState(false)
  const [bought, setBought] = useState(false);

  const state = useSelector<AppState, AppState['transactions']>((s) => s.transactions)
  const transactions: any = chainId ? state[chainId] ?? {} : {}

  if (txHash !== '' && transactions[txHash]?.receipt) {
    setTempTxHash(txHash)
    setTxHash('')
    setTxOpen(false)
  }

  const addTransaction = useTransactionAdder()

  const cardPrice = '100000'

  const handleBuy = () => {
    const totalAmount = cardPrice
    const args = [
      currencies.match[values.currency]?.address,
      '5',
      parseUnits(totalAmount, currencies.match[values.currency]?.decimals),
    ]
    nftContract?.estimateGas
      .buy(...args, { from: account })
      .then((estimatedGasLimit) => {
        nftContract
          ?.buy(...args, { gasLimit: estimatedGasLimit })
          .then((resp) => {
            NotifyMembers(resp.hash, values.currency)
            addTransaction(resp, {
              summary: t('boughtCards', { count: '1' }),
              additionalData: {
                count: '1',
                card: '1',
              },
            })

            setTxHash(resp.hash)
            setTxOpen(true)
            setBought(true)
          })
          .catch((err) => console.error(err))
      })
      .catch((err) => console.error(err))
  }

  const [approval, approveCallback] = useApproveCallback(
    new TokenAmount(
      new WrappedTokenInfo(currencies.match[values.currency], []),
      JSBI.BigInt(parseUnits(cardPrice, currencies.match[values.currency]?.decimals).toString())
    ),
    NFT_PRIVATE_ADDRESS
  )
  const [approvalSubmitted, setApprovalSubmitted] = React.useState<boolean>(false)

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const handleChange = (value) => {
    setValues(value);
    if (approvalSubmitted && approval !== ApprovalState.PENDING) {
      setApprovalSubmitted(false)
    }
  }

  const balance = useCurrencyBalance(account?.toString(), new WrappedTokenInfo(currencies.match[values.currency], []))

  const sufficientBalance =
    balance &&
    parseInt(balance?.raw.toString()) >=
      parseInt(parseUnits(cardPrice, currencies.match[values.currency]?.decimals).toString())

  const accountEllipsis = account ? `${account.substring(0, 8)}...${account.substring(account.length - 8)}` : null

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleClose = () => {}

  const handleTxClose = () => {
    setTxOpen(false)
  }

  const popupList = useSelector<AppState, PopupList>((s) => s.application.popupList)
  const succeedHash = txHash || tempTxHash

  const filteredPopups = popupList.filter((popup) => popup.key === succeedHash)
  if (filteredPopups.length && filteredPopups[0].show) {
    if (!isSucceedPopupVisible) {
      setSucceedPopupVisible(true)
    }
  }

  const handleSucceedModalClose = () => {
    // removePopup(succeedHash)
    // setTempTxHash('')
  }

  return (
    <ContentHolder>
      <img className="content-background" src={bgIMG} alt="background" />
      <CardWrapper>
        <Modal isOpen={isOpenModal} onDismiss={handleClose}>
          <Flex flexDirection="column">
            <Text
              style={{
                textAlign: 'center',
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: '22px',
                letterSpacing: '0.3px',
                color: '#0B1359',
              }}
            >
              Sorry, we haven’t found this address in
              <Text style={{
                textAlign: 'center',
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: '22px',
                letterSpacing: '0.3px',
                color: '#0B1359',
              }}>
                the Strategical Partnership Whitelist:</Text>
            </Text>
            <AddressWrap>{accountEllipsis}</AddressWrap>
            <StyledTextWrapper>
              <Text
                style={{
                  textAlign: 'center',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.3px',
                  color: '#0B1359',
                }}
              >
                If you have been registered for the Whitelist before, please try to connect with another address.
              </Text>
              <Text
                mt="15px"
                style={{
                  textAlign: 'center',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.3px',
                  color: '#0B1359',
                }}
              >
                If that didn&#39;t help, please contact <StyledLink href="https://t.me/akents">@Akents</StyledLink> and he will help you to solve this issue.
              </Text>
            </StyledTextWrapper>
          </Flex>
        </Modal>
        <Modal isOpen={isHideModalOpen} onDismiss={handleClose}>
          <Flex flexDirection="column" style={{ margin: '0 auto' }}>
            <Text
              mb="30px"
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: '22px',
                letterSpacing: '0.3px',
                color: '#0B1359',
              }}
            >
              {t('pleaseUnlockWallet')}
            </Text>
            <ConnectWalletButton fullwidth />
          </Flex>
        </Modal>
        <Modal isOpen={isTxOpen} onDismiss={handleTxClose} maxHeight={90} padding="24px" isTransparancy>
          <TransactionSubmittedContent chainId={chainId} hash={txHash} onDismiss={handleTxClose} />
        </Modal>

        <Modal isOpen={isSucceedPopupVisible} onDismiss={handleSucceedModalClose} maxHeight={90} padding="24px">
          <TransactionSucceedContent hash={succeedHash} onDismiss={handleSucceedModalClose} />
        </Modal>

        <StyledHeading as="h1" size="xl" color="heading" mb="40px" mt="20px" className="heading--desktop">
          {t('strategicalPartnership')}
        </StyledHeading>
        <StyledHeading as="h1" size="xl" color="heading" mb="40px" className="heading--mobile">
          {t('strategicalPartnership')}
        </StyledHeading>

        <AppBody>
          {cardList.map((card) => (
            <NftPartnershipCard
              card={card}
              handleChange={handleChange}
              buttonWrap={
                <ButtonWrap>
                  {!account ? (
                    <ConnectWalletButton fullwidth />
                  ) : (
                    <AutoColumn gap="md">
                      {sufficientBalance ? (
                        approval === ApprovalState.APPROVED ? (
                          !bought ? (
                            <RowBetween>
                              <Button onClick={handleBuy}  style={{width: '100%'}}>{t('buyAmountCards', { count: 1 })}</Button>
                            </RowBetween>
                          ) : (
                            <GreyCard style={{ textAlign: 'center' }}>
                              Please, wait...
                            </GreyCard>
                          )
                        ) : (
                          <RowBetween>
                            <Button
                              onClick={approveCallback}
                              disabled={approval === ApprovalState.PENDING || approvalSubmitted}
                              style={{width: '100%'}}
                            >
                              {approval === ApprovalState.PENDING || approvalSubmitted ? (
                                <Dots>{t('approving', { count: values.currency })}</Dots>
                              ) : (
                                t('approve', { count: values.currency })
                              )}
                            </Button>
                          </RowBetween>
                        )
                      ) : (
                        <GreyCard style={{ textAlign: 'center', width: '100%' }}>
                          {balance && !sufficientBalance ? t('insufficientBalance') : 'Please, wait...'}
                        </GreyCard>
                      )}
                    </AutoColumn>
                  )}
                </ButtonWrap>
              }
            />
          ))}
        </AppBody>
      </CardWrapper>
    </ContentHolder>
  )
}

export default StrategicalPartnershipHome
