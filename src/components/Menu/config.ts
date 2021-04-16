import { MenuEntry } from '@aliumswap/uikit'


const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    initialOpenState: true,
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.dev.alium.finance/swap',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.dev.alium.finance/pool',
      },
      {
        label: 'Migrate',
        href: 'https://exchange.dev.alium.finance/migrate',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: 'https://dev.alium.finance/farms',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: 'https://pancakeswap.finance/syrup',
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: 'https://pancakeswap.finance/lottery',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: 'https://pancakeswap.finance/nft',
  // },
  // {
  //   label: 'Teams & Profile',
  //   icon: 'GroupsIcon',
  //   calloutClass: 'rainbow',
  //   items: [
  //     {
  //       label: 'Leaderboard',
  //       href: 'https://pancakeswap.finance/teams',
  //     },
  //     {
  //       label: 'Task Center',
  //       href: 'https://pancakeswap.finance/profile/tasks',
  //     },
  //     {
  //       label: 'Your Profile',
  //       href: 'https://pancakeswap.finance/profile',
  //     },
  //   ],
  // },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'Overview',
        href: 'http://info.dev.alium.finance/',
      },
      {
        label: 'Tokens',
        href: 'http://info.dev.alium.finance/tokens',
      },
      {
        label: 'Pairs',
        href: 'http://info.dev.alium.finance/pairs',
      },
      {
        label: 'Accounts',
        href: 'http://info.dev.alium.finance/accounts',
      },
    ],
  },
  // {
  //   label: 'IFO',
  //   icon: 'IfoIcon',
  //   href: 'https://pancakeswap.finance/ifo',
  // },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      // {
      //   label: 'Voting',
      //   href: 'https://voting.alium.finance',
      // },
      {
        label: 'Github',
        href: 'https://github.com/Aliumswap',
      },
      {
        label: 'Docs',
        href: 'https://docs.alium.finance',
      },
      {
        label: 'Blog',
        href: 'https://medium.com/@aliumswap',
      },
    ],
  },
]

export default config
