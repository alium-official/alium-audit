import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { parseUnits } from '@ethersproject/units'
import styled from 'styled-components'
import { JSBI, TokenAmount } from '@aliumswap/sdk'
import { Heading, Button, Text, Flex } from '@aliumswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { GreyCard } from 'components/Card'
import Modal from 'components/Modal'
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@material-ui/core'

import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useCollectibleContract, useNFTPrivateContract } from 'hooks/useContract'

import { NFT_PRIVATE_ADDRESS } from 'constants/abis/nftPrivate'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { PopupList } from 'state/application/reducer'
import { useRemovePopup } from 'state/application/hooks'
import { AppState } from 'state/index'

import { TransactionSubmittedContent, TransactionSucceedContent } from 'components/TransactionConfirmationModal'
import { Dots } from '../Pool/styleds'
import AppBody from '../AppBody'
import max from './images/max-button.svg'
import currencies from './constants/currencies'
import whitelist from './constants/whitelist'
import cardList from './constants/cards'

import NftCard from './components/NftCard'
import { StyledTextField, StyledFormControl } from './components/Styled/Inputs'
import bgIMG from './images/background-img.svg'
import emails from './constants/membersList'

const ContentHolder = styled.div`
  position: relative;
  & .content-background {
    position: absolute;
    right: 0;
    top: -20px;
  }

  @media screen and (max-width: 480px) {
    & .content-background {
      right: 0;
      top: 50px;
    }
  }
`

const CardWrapper = styled.div`
  width: 100%;
  font-family: Roboto, sans-serif;
  max-width: 950px;
  width: 100%;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
`
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 0;
  column-gap: 20px;
  @media screen and (max-width: 641px) {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
`

const GridForm = styled.div`
  display: grid;
  grid-template-columns: 200px 3fr 2fr;
  max-width: 90%;
  column-gap: 20px;
  margin: 0 auto;
  margin-top: 30px;

  @media screen and (max-width: 1024px) {
    max-width: 100%;
  }
  @media screen and (max-width: 641px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    column-gap: 0px;
    row-gap: 20px;
  }
`

const StyledHeading = styled(Heading)`
  &.heading--desktop {
    display: none;
  }
  &.heading--mobile {
    display: none;
  }
  @media screen and (max-width: 1024px) {
    &.heading--desktop {
      display: block;
    }
  }
  @media screen and (max-width: 641px) {
    &.heading--desktop {
      display: none;
    }
    &.heading--mobile {
      display: block;
      text-align: center;
    }
  }
  @media screen and (max-width: 480px) {
    &.heading--mobile {
      margin-bottom: 70px;
    }
  }
`

const ButtonWrap = styled.div`
  width: 100%;
  max-width: initial;
  width: 100%;
  & button {
    width: 100%;
    margin-top: 4px;
  }
  & div {
    margin-top: 0;
  }
`

const AddressWrap = styled.div`
  margin-top: 10px;
  background: rgba(108, 93, 211, 0.1);
  border: 1px solid #6c5dd3;
  padding: 5px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px;
  color: #6c5dd3;
`

const NotifyMembers = (hash, count, card, currency) => {
  const explorer = 'https://bscscan.com/tx'
  if (process.env.NODE_ENV !== 'development') {
    emails.forEach((email) => {
      const obj = {
        to: email,
        subject: 'New card purchase',
        message: `Client bought ${count} cards of type ${card} for ${currency} \n  ${explorer}/${hash}`,
      }
      axios.post('https://private.alium.finance/api/send-email/', obj).catch((err) => {
        console.error(err)
      })
    })
  }
}

const Home = () => {
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
  const collectibleContract = useCollectibleContract()

  const [values, setValues] = useState<any>({
    currency: currencies.stablecoins[0],
    count: 1,
  })

  const inputLabel = React.useRef(null)
  const [labelWidth, setLabelWidth] = useState<any>(0)
  const [maxAmountOfCards, setMaxAmountOfCards] = useState<any>()
  const [maxCardsAmounts, setMaxCardsAmount] = useState<number[]>([])
  const [activeCard, setActiveCard] = useState<any>('0')

  const updateMaxCardsAmount = useCallback(() => {
    ;(async () => {
      const maxAmounts = await Promise.all(
        [1, 2, 3].map(async (item) => {
          const result = await collectibleContract
            ?.getTypeInfo(item)
            .then((resp) => {
              const amount = +resp.maxSupply - +resp.totalSupply
              if ((item - 1).toString() === activeCard) {
                setMaxAmountOfCards(amount)
              }
              return amount
            })
            .catch((err) => console.error(err))
          return result
        })
      )
      setMaxCardsAmount(maxAmounts)
    })()
  }, [activeCard, collectibleContract])

  useEffect(() => {
    updateMaxCardsAmount()
  }, [updateMaxCardsAmount])

  useEffect(() => {
    const currentInput: any = inputLabel?.current
    const width: any = currentInput?.offsetWidth
    setLabelWidth(width)
  }, [])

  useEffect(() => {
    setValues((oldValues) => ({
      ...oldValues,
      count: 1,
    }))
  }, [activeCard])

  const handleChange = (event) => {
    const { name } = event.target
    let { value } = event.target

    if (name === 'count' && (value.indexOf('-') !== -1 || !parseInt(value) || !/^[0-9]+$/.test(value)) && value !== '')
      return

    if (name === 'count') {
      if (value > maxAmountOfCards) {
        value = maxAmountOfCards
      }
    }

    setValues((oldValues) => ({
      ...oldValues,
      [name]: value,
    }))
  }

  const handleClickCard = (id: string) => {
    setActiveCard(id)
    setMaxAmountOfCards(maxCardsAmounts[id])
  }

  const handleClickMax = () => {
    setValues((oldValues) => ({
      ...oldValues,
      count: maxAmountOfCards,
    }))
  }

  const [txHash, setTxHash] = useState('xczxczxczxc')
  const [tempTxHash, setTempTxHash] = useState('')
  const [isTxOpen, setTxOpen] = useState(false)

  const state = useSelector<AppState, AppState['transactions']>((s) => s.transactions)
  const transactions: any = chainId ? state[chainId] ?? {} : {}

  if (txHash !== '' && transactions[txHash]?.receipt) {
    setTempTxHash(txHash)
    setTxHash('')
    setTxOpen(false)
    updateMaxCardsAmount()
  }

  const addTransaction = useTransactionAdder()

  const handleBuy = () => {
    const totalAmount: string = (values.count * cardList[activeCard]?.price).toString()
    const args = [
      currencies.match[values.currency]?.address,
      +activeCard + 1,
      parseUnits(totalAmount, currencies.match[values.currency]?.decimals),
      values.count,
    ]
    nftContract?.estimateGas
      .buyBatch(...args, { from: account })
      .then((estimatedGasLimit) => {
        nftContract
          ?.buyBatch(...args, { gasLimit: estimatedGasLimit })
          .then((resp) => {
            NotifyMembers(resp.hash, values.count, +activeCard + 1, values.currency)
            const selectedCard = cardList.filter((card) => card.id.toString() === activeCard)[0]
            addTransaction(resp, {
              summary: t('boughtCards', { count: values.count }),
              additionalData: {
                count: values.count,
                card: selectedCard,
              },
            })

            setTxHash(resp.hash)
            setTxOpen(true)
          })
          .catch((err) => console.error(err))
      })
      .catch((err) => console.error(err))
  }
  const [approval, approveCallback] = useApproveCallback(
    new TokenAmount(
      new WrappedTokenInfo(currencies.match[values.currency], []),
      JSBI.BigInt(
        parseUnits(
          values.count ? values?.count.toString() : '1',
          currencies.match[values.currency]?.decimals
        ).toString()
      )
    ),
    NFT_PRIVATE_ADDRESS
  )
  const [approvalSubmitted, setApprovalSubmitted] = React.useState<boolean>(false)

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const balance = useCurrencyBalance(account?.toString(), new WrappedTokenInfo(currencies.match[values.currency], []))

  const sufficientBalance =
    balance &&
    parseInt(balance?.raw.toString()) >=
      parseInt(
        parseUnits(
          (+cardList[activeCard]?.price * values.count).toString(),
          currencies.match[values.currency]?.decimals
        ).toString()
      )

  const isValidInputs = values.count && values.currency && sufficientBalance

  const accountEllipsis = account ? `${account.substring(0, 8)}...${account.substring(account.length - 8)}` : null

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleClose = () => {}

  const handleTxClose = () => {
    setTxOpen(false)
  }

  const removePopup = useRemovePopup()
  const popupList = useSelector<AppState, PopupList>((s) => s.application.popupList)
  const succeedHash = txHash || tempTxHash

  let isSucceedPopupVisible = false
  const filteredPopups = popupList.filter((popup) => popup.key === succeedHash)
  if (filteredPopups.length && filteredPopups[0].show) {
    isSucceedPopupVisible = true
  }

  const handleSucceedModalClose = () => {
    removePopup(succeedHash)
    setTempTxHash('')
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
              {t('sorryNotFound')}:
            </Text>
            <AddressWrap>{accountEllipsis}</AddressWrap>
            <Text
              mt="35px"
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
              {t('haveBeenRegistered')}.
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
              {t('didNotHelp')}
            </Text>
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
        <Modal isOpen={isTxOpen} onDismiss={handleTxClose} maxHeight={90} padding="24px">
          <TransactionSubmittedContent chainId={chainId} hash={txHash} onDismiss={handleTxClose} />
        </Modal>129

        <Modal isOpen={isSucceedPopupVisible} onDismiss={handleSucceedModalClose} maxHeight={90} padding="24px">
          <TransactionSucceedContent hash={succeedHash} onDismiss={handleSucceedModalClose} />
        </Modal>

        <StyledHeading as="h1" size="xl" color="heading" mb="40px" mt="20px" className="heading--desktop">
          {t('privateRound')}
        </StyledHeading>
        <StyledHeading as="h1" size="xl" color="heading" mb="40px" mt="20px" className="heading--mobile">
          {t('butNftCards')}
        </StyledHeading>

        <AppBody>
          <GridContainer>
            {cardList.map((card) => (
              <NftCard
                card={card}
                handleClickCard={handleClickCard}
                activeCard={activeCard}
                maxCardsAmounts={maxCardsAmounts}
              />
            ))}
          </GridContainer>
          <GridForm>
            <FormControl>
              <StyledTextField
                disabled={!maxAmountOfCards}
                label={t('nftQuantity')}
                type="text"
                name="count"
                value={values.count}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: {
                    pattern: '^[0-9]*[.,]?[0-9]*$',
                    inputMode: 'decimal',
                    placeholder: '1',
                    spellCheck: false,
                    minLength: 1,
                    maxLength: 2,
                    autoComplete: 'off',
                  },
                  endAdornment: (
                    <InputAdornment position="end" style={{ marginRight: '10px' }}>
                      <IconButton onClick={handleClickMax} edge="end" disabled={!maxAmountOfCards}>
                        <img src={max} alt="icon" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                variant="outlined"
              />
              {!!maxAmountOfCards && <FormHelperText>{t('maxAmount', { count: maxAmountOfCards })}</FormHelperText>}
            </FormControl>
            <StyledFormControl variant="outlined">
              <InputLabel shrink ref={inputLabel}>
                {t('priceAndCurrency')}
              </InputLabel>
              <Select
                value={values.currency}
                onChange={handleChange}
                name="currency"
                disabled={!maxAmountOfCards}
                input={<OutlinedInput style={{ background: 'none' }} notched labelWidth={labelWidth} />}
              >
                {currencies.stablecoins.map((item) => (
                  <MenuItem style={{ backgroundColor: 'transparent' }} value={item}>
                    {(+cardList[activeCard]?.price * values.count).toLocaleString()} {item}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('chooseStablecoin')}</FormHelperText>
            </StyledFormControl>
            {/* <ButtonWrap>
              {!account ? (
                <ConnectWalletButton fullwidth />
              ) : (
                <AutoColumn gap="md">
                  <RowBetween>
                        <Button
                          onClick={handleBuy}
                        >
                          Buy {values.count} cards
                    </Button>
                    </RowBetween>
                </AutoColumn>
              )}
            </ButtonWrap> */}

            <ButtonWrap>
              {!account ? (
                <ConnectWalletButton fullwidth />
              ) : (
                <AutoColumn gap="md">
                  {isValidInputs && activeCard && values.count <= maxAmountOfCards ? (
                    approval === ApprovalState.APPROVED ? (
                      <RowBetween>
                        <Button onClick={handleBuy}>{t('buyAmountCards', { count: values.count })}</Button>
                      </RowBetween>
                    ) : (
                      <RowBetween>
                        <Button onClick={approveCallback} disabled={approval === ApprovalState.PENDING}>
                          {approval === ApprovalState.PENDING ? (
                            <Dots>{t('approving', { count: values.currency })}</Dots>
                          ) : (
                            t('approve', { count: values.currency })
                          )}
                        </Button>
                      </RowBetween>
                    )
                  ) : (
                    <GreyCard style={{ textAlign: 'center' }}>
                      {balance && !sufficientBalance
                        ? t('insufficientBalance')
                        : !values.count
                        ? t('enterInputData')
                        : t('pleaseWait')}
                    </GreyCard>
                  )}
                </AutoColumn>
              )}
            </ButtonWrap>
          </GridForm>
        </AppBody>
      </CardWrapper>
    </ContentHolder>
  )
}

export default Home
