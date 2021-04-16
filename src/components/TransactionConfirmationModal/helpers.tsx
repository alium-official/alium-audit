import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, CloseIcon } from '@aliumswap/uikit'

import { AutoColumn, ColumnCenter } from '../Column'


export const Wrapper = styled.div`
  width: 100%;
`
export const Section = styled(AutoColumn)`
  padding: 24px;

  @media screen and (max-width: 480px) {
    padding: 6px 12px;
  }
`

export const ConfirmedIcon = styled(ColumnCenter)`
  padding: 40px 0;
`

export const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

/**
 * TODO: Remove this when modal system from the UI Kit is implemented
 */
const StyledContentHeader = styled.div`
  align-items: center;
  display: flex;
  position: relative;

  & > ${Heading} {
    flex: 1;
    text-align: center;
  }
  & > ${IconButton} {
    position: absolute;
    right: -12px;
    top: -12px;
  }
  @media screen and (max-width: 480px) {
    & > ${Heading} {
     margin-top: 32px;
    }
  }
`

type ContentHeaderProps = {
  children: ReactNode
  onDismiss: () => void
}

export const ContentHeader = ({ children, onDismiss }: ContentHeaderProps) => (
  <StyledContentHeader>
    <Heading>{children}</Heading>
    <IconButton onClick={onDismiss} variant="text">
      <CloseIcon color="primary" />
    </IconButton>
  </StyledContentHeader>
)
