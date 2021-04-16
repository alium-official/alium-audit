/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Flex, Heading, Text, ColoredCopyIcon } from '@aliumswap/uikit'
import { AppState } from 'state/index'
import { PopupList } from 'state/application/reducer'
import { CardType } from 'pages/Home/constants/cards'
import { NFT_COLLECTIBLE_ADDRESS } from 'constants/abis/nftPrivate'

import styled from 'styled-components'
import { Wrapper, Section, ContentHeader } from './helpers'

import previewImg from '../../assets/images/transaction-succeed-preview.svg'
import copyImg from '../../assets/svg/copy-icon.svg'


type TransactionSucceedContentProps = {
  onDismiss: () => void
  hash: string | undefined
}



const StyledDetailsLabel = (props: React.ComponentProps<typeof Text>) => (
  <Text style={{ fontSize: "14px", lineHeight: "20px", letterSpacing: "0.3px", color: "#8990A5", textAlign: "center" }}  {...props} />
)
const StyledDetailsText = (props: React.ComponentProps<typeof Text>) => (
  <Text style={{ fontSize: "14px", lineHeight: "20px", letterSpacing: "0.3px", fontWeight: "bold", color: "#6C5DD3", textAlign: "center", marginLeft: "4px" }}  {...props} />
)

const Content = styled.div`
  & .preview-image {
    margin: 0 auto;
    display: block;
  }
  & .address-block {
    width: 70%;
    margin-top: 16px;
    margin: 0 auto;
    background: transparent;
    border: none;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: cetner;
    justify-content: space-between;
  
    margin-top: 20px;
    & .address-field {
      max-width: 330px;
      margin: 0 auto;
      margin-top: 8px;
      padding: 6px 10px;
      box-sizing: border-box;
      border: 1px solid #D2D6E5;
      border-radius: 6px;
      cursor: pointer;
      & .address {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; 
      }
    }
  }


  @media screen and (max-width: 1024px) {
    & .address-block {
      & .address-field {
        max-width: 300px
      }
    }
  }
  @media screen and (max-width: 480px) {
    & .address-block {
      width: 100%;
      & .address-field {
        width: 100%;
        max-width: 250px;
      }
    }
   
    & .info-block {
      width: 100%;
      
      & .exchange-info {
        display: flex;
        flex-direction: column;
      }
    }
  }
  @media screen and (max-width: 400px) {
    & .address-field {
      max-width: 150px;
    }
  }
`

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  svg * {
    stroke: #8990A5;
    transition: stroke 100ms ease-in-out;
  }
  &:hover {
    svg * {
      stroke: #6C5DD3;
    }
  }
  &:active {
    background-color: rgba(108, 93, 211, 0.3);
  }
`

const TransactionSucceedContent = ({ onDismiss, hash }: TransactionSucceedContentProps) => {
  const popupList = useSelector<AppState, PopupList | any>(s => s.application.popupList)
  const filteredPopups = popupList.filter(popup => popup.key === hash)

  let popupSummary = { count: 0, card: { } } as { count: number, card: CardType }
  if (filteredPopups[0]) {
    popupSummary = filteredPopups[0].content.txn.additionalData
  }
  const {t} = useTranslation();
  const [copied, setCopied] = useState(false)
  const copyAddress = () => {
    navigator.clipboard.writeText(NFT_COLLECTIBLE_ADDRESS)
  }

  return (
    <Wrapper style={{ maxWidth: "550px" }}>
      <Section>

        <Content>
          <div className="info-block">
            {/* <ContentHeader onDismiss={onDismiss}> </ContentHeader> */}
            <img className="preview-image" src={previewImg} alt="transaction-succeed-preview" />
            <Heading style={{ textAlign: "center", marginTop: 20, marginBottom: 16 }}>{t('congratulations')}!</Heading>
            <StyledDetailsText>{popupSummary.card.headline}</StyledDetailsText>

            <Flex alignItems="center" justifyContent="center" style={{ marginTop: "4px" }}>
              <StyledDetailsLabel>{t('successfullyBought')}</StyledDetailsLabel>
              {/* <StyledDetailsText>{popupSummary.count} {popupSummary.count > 1 ? "cards" : "card"}</StyledDetailsText> */}
            </Flex>

            <Flex alignItems="center" justifyContent="center" className="exchange-info" style={{ marginTop: "4px" }}>
              <StyledDetailsLabel>{t('laterExchange')}</StyledDetailsLabel>
              <StyledDetailsText>575 000 ALM</StyledDetailsText>
              {/* <StyledDetailsText>{popupSummary?.card.tokens}</StyledDetailsText> */}
            </Flex>

          </div>
          <button className="address-block" onClick={copyAddress} type="button">
            <StyledDetailsLabel >{t('toSeeNftCards')}</StyledDetailsLabel>
            <Flex className="address-field" alignItems="center" justifyContent="space-between">
              <StyledDetailsLabel className="address">{NFT_COLLECTIBLE_ADDRESS}</StyledDetailsLabel>
              <CopyButton type="button" className={copied ? "active" : ""}>
                <ColoredCopyIcon />
              </CopyButton>
            </Flex>
          </button>
        </Content>
      </Section>
    </Wrapper>
  )
}

export default TransactionSucceedContent
