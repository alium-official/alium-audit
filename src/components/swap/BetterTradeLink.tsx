import React, { useMemo } from 'react'
import { stringify } from 'qs'
import { useLocation } from 'react-router'
import { Text } from '@aliumswap/uikit'
import { useTranslation } from 'react-i18next'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { DEFAULT_VERSION, Version } from '../../hooks/useToggledVersion'
import { StyledInternalLink } from "../Shared"
import { YellowCard } from '../Card'
import { AutoColumn } from '../Column'


export default function BetterTradeLink({ version }: { version: Version }) {
  const location = useLocation()
  const search = useParsedQueryString()
  const {t} = useTranslation();
  const linkDestination = useMemo(() => {
    return {
      ...location,
      search: `?${stringify({
        ...search,
        use: version !== DEFAULT_VERSION ? version : undefined
      })}`
    }
  }, [location, search, version])

  return (
    <YellowCard style={{ marginTop: '12px', padding: '8px 4px' }}>
      <AutoColumn gap="sm" justify="center" style={{ alignItems: 'center', textAlign: 'center' }}>
        <Text style={{ lineHeight: '145.23%' }} fontSize="14px">
          {t('betterPrice')}{' '}
          <StyledInternalLink to={linkDestination}>
            <b>Uniswap {version.toUpperCase()} ↗</b>
          </StyledInternalLink>
        </Text>
      </AutoColumn>
    </YellowCard>
  )
}
