/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes, { bool, string } from 'prop-types';
import { StyledCardImageContainer, StyledArtImg } from '../styles/cardStyles';
import VideoContainer from './VideoContainer';

const propTypes = {
  evo: PropTypes.bool.isRequired,
  cardId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  hidden: PropTypes.bool,
  censored: bool,
  locale: string,
  anim: bool,
};

const CardImageContainer = ({
  evo, cardId, hidden = false, censored = false, locale = 'en', anim = false,
}) => {
  const formatCardId = (id) => {
    const base = id.substring(0, id.length - 1);
    if (evo) {
      return `${base}1`;
    }
    return `${base}0`;
  };

  if (!hidden) {
    if (!anim) {
      return (
        <StyledCardImageContainer>
          <a
            target="_blank"
            href={`${process.env.REACT_APP_ASSETS_URL}/${censored ? 'censored' : `cards/${locale}`}/${evo ? 'E' : 'C'}_${cardId}.png`}
            rel="noopener noreferrer"
            style={{ margin: 'auto' }}
          >
            <StyledArtImg src={`${process.env.REACT_APP_ASSETS_URL}/${censored ? 'censored' : 'cards'}/${locale}/${evo ? 'E' : 'C'}_${cardId}.png`} alt="" />
          </a>
          <a
            target="_blank"
            href={`${process.env.REACT_APP_ASSETS_URL}/${censored ? 'censored' : 'fullart'}/${cardId}${evo ? '1' : '0'}.png`}
            rel="noopener noreferrer"
            style={{ margin: 'auto' }}
          >
            <StyledArtImg src={`${process.env.REACT_APP_ASSETS_URL}/${censored ? 'censored' : 'fullart'}/${cardId}${evo ? '1' : '0'}.png`} alt="" />
          </a>
        </StyledCardImageContainer>
      );
    }
    return (
      <StyledCardImageContainer>
        <VideoContainer videoSrc={`${process.env.REACT_APP_ASSETS_URL}/cardanim/${formatCardId(cardId)}.mp4`} cardId={cardId.toString()} evo={evo} />
        <a
          target="_blank"
          href={`${process.env.REACT_APP_ASSETS_URL}/${censored ? 'censored' : 'fullart'}/${cardId}${evo ? '1' : '0'}.png`}
          rel="noopener noreferrer"
        >
          <StyledArtImg src={`${process.env.REACT_APP_ASSETS_URL}/${censored ? 'censored' : 'fullart'}/${cardId}${evo ? '1' : '0'}.png`} alt="" />
        </a>
      </StyledCardImageContainer>
    );
  } return '';
};

CardImageContainer.propTypes = propTypes;

export default CardImageContainer;
