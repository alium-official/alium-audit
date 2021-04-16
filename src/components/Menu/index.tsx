import React from 'react'
import { Menu as UikitMenu, MenuEntry } from '@aliumswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { ETHER } from '@aliumswap/sdk'

const Menu: React.FC<{ loginBlockVisible?: boolean }> = ({ loginBlockVisible, ...props }) => {
  const { t } = useTranslation()

  const links: MenuEntry[] = [
    {
      label: 'Home',
      icon: 'HomeIcon',
      href: process.env.REACT_APP_HOME_URL,
    },
    {
      label: 'Trade',
      icon: 'TradeIcon',
      items: [
        {
          label: 'Exchange',
          href: '/swap',
        },
        {
          label: 'Liquidity',
          href: '/pool',
        },
        // {
        //   label: 'Migrate',
        //   href: '/migrate',
        // },
      ],
    },
    {
      label: 'Private Round NFTs',
      icon: 'PrivateRoundIcon',
      href: '/'
    },
    {
      label: 'Analytics',
      icon: 'InfoIcon',
      items: [
        {
          label: 'Overview',
          href: process.env.REACT_APP_INFO_URL,
        },
        {
          label: 'Tokens',
          href: `${process.env.REACT_APP_INFO_URL}/tokens`,
        },
        {
          label: 'Pairs',
          href: `${process.env.REACT_APP_INFO_URL}/pairs`,
        },
      ],
    },
    {
      label: 'More',
      icon: 'MoreIcon',
      items: [
        // {
        //   label: 'Voting',
        //   href: 'https://voting.dev.alium.finance',
        // },
        {
          label: 'GitHub',
          href: 'https://github.com/Aliumswap',
        },
        {
          label: 'Docs',
          href: 'https://aliumswap.gitbook.io/alium-finance',
        },
        {
          label: 'Blog',
          href: 'https://medium.com/@aliumswap',
        },
      ],
    },
  ]

  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const balance = useCurrencyBalance(account as string, ETHER)
  const useBalance = async () => {
    // const bal = useCurrencyBalance(account as string, ETHER)
    // return bal?.toSignificant(6);
    const result = await useCurrencyBalance(account as string, ETHER)
    return result
  }

  // useBalance().then((result)=>console.log(result))

  return (
    <UikitMenu
      // isProduction={process.env.NODE_ENV === "production"}
      links={links}
      account={account as string}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      loginBlockVisible={loginBlockVisible}
      buttonTitle={t('connect')}
      balance={balance?.toSignificant(6)}
      options={{
        modalTitle: 'Account',
        modalFooter: t('learnHowConnect'),
        modelLogout: t('logout'),
        modalBscScan: t('viewOnBscscan'),
        modelCopyAddress: t('copyAddress'),
      }}
      betaText=""
      balanceHook={useBalance}
      {...props}
    />
  )
}

export default Menu
