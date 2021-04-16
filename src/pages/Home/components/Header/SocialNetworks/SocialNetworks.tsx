import React from 'react'
import styled from 'styled-components'
import first from '../../../images/ghub.svg'
import second from '../../../images/tel.svg'
import third from '../../../images/twi.svg'
import fourth from '../../../images/med.svg'

const header = [
  {
    img: first,
    link: 'https://github.com/Aliumswap',
  },
  {
    img: second,
    link: 'https://t.me/aliumswap_official',
  },
  {
    img: third,
    link: 'https://twitter.com/AliumSwap',
  },
  {
    img: fourth,
    link: 'https://medium.com/@aliumswap',
  },
].map((item, i) => ({ ...item, id: i }))

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 20px;
  > a:not(:last-child) {
    margin-right: 10px;
  }
  & .header-links-item {
    cursor: pointer;
    outline: none;
    border: none;
    background: none;
    padding: 0 4px;
    height: 52px;
    width: 52px;
    border: 1px solid #EBEDF9;
    border-radius: 6px;
    & .header-links-item__img {
      width: 100%;
      height: 100%;
    }
  }
  
  & .header-links-item:hover {
    background-color: #EBEDF9;
  }

  @media screen and (max-width: 640px) {
    margin-left: 10px;
    margin-right: 10px;
    width: auto;
    .header-links-item {
      padding: 0 2px;
      width: 42px;
      height: 42px;
    }
    .header-links-item__img {
      min-height: auto;
      max-height: auto;
      width: 100%;
    }
  }
 
`

const SocialNetworks = () => {
  const openInNewTab = (url) => {
    if (!url) return;
    const win = window.open(header[url].link, "_blank");
    win?.focus();
  };

  const handleClick = (e) => {
    openInNewTab(e.currentTarget.name)
  }

  return (
    <Wrapper>
      {header.map((item) => (
        <a href={item.link} key={item.id} onClick={handleClick} className="header-links-item">
          <img className="header-links-item__img" src={item.img} alt="img" />
        </a>
      ))}
    </Wrapper>
  )
}

export default SocialNetworks;
