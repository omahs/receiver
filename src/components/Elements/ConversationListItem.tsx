import styled from 'styled-components';
import React, { FunctionComponent } from 'react';
import { Avatar } from './Avatar';
import { useResponsiveName, useEnsName } from '../../hooks';
import { useReceiver } from '../../hooks';
import { setConversationTime } from '../../utils/date';

export interface ConversationListItemProps {
  peerAddress: string;
  subtitle: string;
  topMessageTime: Date;
}

export const ConversationListItem: FunctionComponent<
  ConversationListItemProps
> = ({ peerAddress, subtitle, topMessageTime }) => {
  const dispatch = useReceiver((state) => state.dispatch);
  const { name } = useEnsName({
    handle: peerAddress,
  });
  const responsiveName = useResponsiveName(name, peerAddress, '');

  return (
    <ListItem
      onClick={() =>
        dispatch({
          id: 'go to screen',
          screen: { id: 'messages', peerAddress },
        })
      }>
      <Avatar handle={peerAddress} onClick={() => null} />
      <TextContainer>
        <div className="ConversationListItem TopLineContainer">
          <span className="ConversationListItem Title">{responsiveName}</span>
          <span className="ConversationListItem Time">
            {setConversationTime(topMessageTime)}
          </span>
        </div>
        <Subtitle>{subtitle}</Subtitle>
      </TextContainer>
    </ListItem>
  );
};

const ListItem = styled.li`
  &&& {
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0px 4px 4px -4px rgba(0, 0, 0, 0.25);
    padding: 15px 10px;
    cursor: pointer;
    width: 100%;
    background-color: transparent;
    transition: background-color 300ms ease-in-out;

    :hover {
      background-color: #eeeeee;
      transition: background-color 300ms ease-in-out;
    }
  }
`;

const TextContainer = styled.div`
  &&& {
    color: black;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }
`;

const Subtitle = styled.span`
  &&& {
    color: black;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: start;
    padding: 2px 0px;
  }
`;
