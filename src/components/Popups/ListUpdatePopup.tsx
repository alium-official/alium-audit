import React, { useCallback, useMemo } from 'react'
import { diffTokenLists, TokenList } from '@uniswap/token-lists'
import { Button, Text } from '@alium-official/uikit'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { useRemovePopup } from '../../state/application/hooks'
import { acceptListUpdate } from '../../state/lists/actions'
import { TYPE } from '../Shared'
import listVersionLabel from '../../utils/listVersionLabel'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'


const { body: Body } = TYPE

export default function ListUpdatePopup({
  popKey,
  listUrl,
  oldList,
  newList,
  auto,
}: {
  popKey: string
  listUrl: string
  oldList: TokenList
  newList: TokenList
  auto: boolean
}) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  const dispatch = useDispatch<AppDispatch>()
  const {t} = useTranslation();
  const handleAcceptUpdate = useCallback(() => {
    if (auto) return
    dispatch(acceptListUpdate(listUrl))
    removeThisPopup()
  }, [auto, dispatch, listUrl, removeThisPopup])

  const { added: tokensAdded, changed: tokensChanged, removed: tokensRemoved } = useMemo(() => {
    return diffTokenLists(oldList.tokens, newList.tokens)
  }, [newList.tokens, oldList.tokens])
  const numTokensChanged = useMemo(
    () =>
      Object.keys(tokensChanged).reduce((memo, chainId: any) => memo + Object.keys(tokensChanged[chainId]).length, 0),
    [tokensChanged]
  )

  return (
    <AutoRow>
      <AutoColumn style={{ flex: '1' }} gap="8px">
        {auto ? (
          <Body fontWeight={500}>
            {t('tokenListUpdated', {label: oldList.name})}{' '}
            <strong>{listVersionLabel(newList.version)}</strong>.
          </Body>
        ) : (
          <>
            <div>
              <Text fontSize="14px">
                {t('popups.updateAvailable', {label: oldList.name})}(
                {listVersionLabel(oldList.version)} to {listVersionLabel(newList.version)}).
              </Text>
              <ul>
                {tokensAdded.length > 0 ? (
                  <li>
                    {tokensAdded.map((token, i) => (
                      <React.Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>{token.symbol}</strong>
                        {i === tokensAdded.length - 1 ? null : ', '}
                      </React.Fragment>
                    ))}{' '}
                    {t('popups.added')}
                  </li>
                ) : null}
                {tokensRemoved.length > 0 ? (
                  <li>
                    {tokensRemoved.map((token, i) => (
                      <React.Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>{token.symbol}</strong>
                        {i === tokensRemoved.length - 1 ? null : ', '}
                      </React.Fragment>
                    ))}{' '}
                    {t('popups.removed')}
                  </li>
                ) : null}
                {numTokensChanged > 0 ? <li>{numTokensChanged} {t('popups.tokensUpdated')}</li> : null}
              </ul>
            </div>
            <AutoRow>
              <div style={{ flexGrow: 1, marginRight: 12 }}>
                <Button onClick={handleAcceptUpdate}>{t('popups.acceptUpdate')}</Button>
              </div>
              <div style={{ flexGrow: 1 }}>
                <Button onClick={removeThisPopup}>{t('popups.dismiss')}</Button>
              </div>
            </AutoRow>
          </>
        )}
      </AutoColumn>
    </AutoRow>
  )
}
