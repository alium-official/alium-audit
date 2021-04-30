import React from 'react'
// import { BigNumber } from '@ethersproject/bignumber'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Text, Flex } from '@alium-official/uikit'
import { CardType } from '../../constants/cards'

import nftChecked from '../../images/nft-checked.svg'

const NFTWrapper = styled.button`
  border: 1px solid #eef0f9;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  outline: none;
  background: none;
  position: relative;

  & .nth-checked-icon {
    content: '""';
    display: none;
    position: absolute;
    top: -10px;
    left: 16px;
  }
  & .nft-preview {
    width: 100%;
  }

  &.active {
    border: 1px solid #6c5dd3;
    position: relative;

    & .nth-checked-icon {
      display: block;
    }
  }

  & .desktop {
    display: block;
  }
  & .mobile {
    display: none;
  }

  @media screen and (max-width: 641px) {
    padding: 10px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: flex-start;

    & .nft-preview {
      max-width: 100px;
    }

    & .desktop {
      display: none;
    }
    & .mobile {
      display: block;
    }
  }
`

const ContentHolder = styled.div`
  @media screen and (max-width: 641px) {
  }
`

type TextPropsType = React.ComponentProps<typeof Text>

const StyledHeading = (props: TextPropsType) => (
  <Text
    mt="15px"
    mb="15px"
    style={{
      textAlign: 'left',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '19px',
      letterSpacing: '0.1px',
      color: '#0B1359',
    }}
    {...props}
  />
)

const StyledListLabel = (props: TextPropsType) => (
  <Text style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.3px', color: '#8990A5' }} {...props} />
)

const StyledListValue = (props: TextPropsType) => (
  <Text style={{ fontSize: '12px', lineHeight: '16px', color: '#6C5DD3', fontWeight: 'bold' }} {...props} />
)

type PropsType = {
  card: CardType
  activeCard: string
  handleClickCard: (activeCard: string) => void

  maxCardsAmounts: number[]
}

const NftCard = ({ card, activeCard, maxCardsAmounts, handleClickCard }: PropsType) => {
  const { t } = useTranslation()

  const isActive = card.id.toString() === activeCard
  const ID = card.id.toString()
  return (
    <NFTWrapper key={ID} type="button" onClick={() => handleClickCard(ID)} className={isActive ? 'active' : ''}>
      {isActive && <img className="nth-checked-icon" src={nftChecked} alt="nft-checked" />}

      <img src={card.img} alt="nft-preview" className="nft-preview" />
      <StyledHeading className="desktop">{card.headline}</StyledHeading>

      <ContentHolder>
        <StyledHeading className="mobile">{card.headline}</StyledHeading>

        <Flex justifyContent="space-between">
          <StyledListLabel>{t('cards.remainingCards')}</StyledListLabel>
          <StyledListValue>{maxCardsAmounts[card.id] || card.cards}</StyledListValue>
        </Flex>
        <Flex justifyContent="space-between" mt="10px">
          <StyledListLabel>{t('cards.cardCost')}</StyledListLabel>
          <StyledListValue>{card.cost}</StyledListValue>
        </Flex>
        <Flex justifyContent="space-between" mt="10px">
          <StyledListLabel>{t('cards.tokens')}</StyledListLabel>
          <StyledListValue>{card.tokens}</StyledListValue>
        </Flex>
      </ContentHolder>
    </NFTWrapper>
  )
}

export default NftCard
