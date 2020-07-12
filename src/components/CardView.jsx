/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  StyledCardContainer,
  StyledCardName,
  StyledCardInformation,
  StyledCardImageContainer,
  StyledArtImg,
  StyledButton,
} from '../styles/cardStyles';
import AudioContainer from './AudioContainer';
import TokenContainer from './TokenContainer';

const CardView = () => {
  const [cardJson, setCardJson] = useState(null);
  const [evo, setEvo] = useState(false);
  const { cardId } = useParams();
  useEffect(() => {
    if (!cardJson || (cardJson && parseInt(cardId, 10) !== cardJson.id_)) {
      window.scrollTo(0, 0);
      fetch(`${process.env.REACT_APP_API_URL}/cards/${cardId}`)
        .then((res) => res.json())
        .then((resjson) => {
          setCardJson(resjson);
        });
    }
  }, [cardId, cardJson]);

  if (cardJson && cardJson.id_ && !Number.isNaN(+cardId)) {
    return (
      <StyledCardContainer>
        <StyledCardName>
          {cardJson.name_}
          <span style={{ float: 'right' }}>{cardJson.craft_}</span>
        </StyledCardName>
        <StyledCardImageContainer>
          <a target="_blank" href={`${process.env.REACT_APP_ASSETS_URL}/cards/${evo ? 'E' : 'C'}_${cardId}.png`} rel="noopener noreferrer">
            <StyledArtImg src={`${process.env.REACT_APP_ASSETS_URL}/cards/${evo ? 'E' : 'C'}_${cardId}.png`} alt="" />
          </a>
          <a target="_blank" href={`${process.env.REACT_APP_ASSETS_URL}/fullart/${cardId}${evo ? '1' : '0'}.png`} rel="noopener noreferrer">
            <StyledArtImg src={`${process.env.REACT_APP_ASSETS_URL}/fullart/${cardId}${evo ? '1' : '0'}.png`} alt="" />
          </a>
        </StyledCardImageContainer>
        {cardJson.type_ === 'Follower'
        && (
          <div style={{ textAlign: 'center' }}>
            <StyledButton type="button" onClick={() => setEvo(!evo)}>
              {evo ? 'Base' : 'Evo'} Art
            </StyledButton>
          </div>
        )}
        <StyledCardInformation>
          <div style={{ maxWidth: '40%' }}>
            <div style={{ textAlign: 'left', fontSize: '1.2rem', marginTop: '19.2px' }}>
              <b>Type: </b>{cardJson.type_} <br />
              {cardJson.trait_ !== '-' && <><b>Trait: </b>{cardJson.trait_} <br /></>}
              <b>Rarity: </b>{cardJson.rarity_} <br />
              <b>Set: </b>{cardJson.expansion_} {cardJson.rotation_ ? '(Rotation)' : '(Unlimited)'} <br />
              <b>Cost: </b>{cardJson.pp_} <br />
              <br />
              <b>Base: </b><br />
              <div style={{ paddingLeft: '10px' }}>
                {cardJson.type_ === 'Follower' && <><b>Stats: </b>{cardJson.baseAtk_}/{cardJson.baseDef_} <br /></>}
                <b>Effect: </b>{cardJson.baseEffect_} <br />
              </div>
              <br />
              {cardJson.type_ === 'Follower'
              && (
                <>
                  <b>Evolved: </b><br />
                  <div style={{ paddingLeft: '10px' }}>
                    <b>Stats: </b>{cardJson.evoAtk_}/{cardJson.evoDef_} <br />
                    <b>Effect: </b>{cardJson.evoEffect_}
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{ maxWidth: '45%' }}>
            <p style={{ textAlign: 'right', fontSize: '1.2rem' }}>
              <b>Base Flair</b> <br />
              {cardJson.baseFlair_} <br />
              <br />
              {cardJson.type_ === 'Follower'
              && (
              <>
                <b>Evolved Flair</b> <br />
                {cardJson.evoFlair_}
              </>
              )}
            </p>
          </div>
        </StyledCardInformation>
        <AudioContainer cardJson={cardJson} cardId={cardId} />
        <h2>Related Cards: </h2> <br />
        <div style={{ display: 'flex' }}>
          {cardJson.tokens_.map((token) => (
            <TokenContainer token={token} />
          ))}
        </div>
      </StyledCardContainer>
    );
  }
  return null;
};

export default CardView;
