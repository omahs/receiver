import styled from 'styled-components';
import CloseReceiverLine from '../../assets/images/close-receiver-line.svg';
import CloseReceiverX from '../../assets/images/close-x.svg'
import React from 'react';
import { truncated } from '../../utls/strings';

interface HeaderProps {
  text: string | null;
  peerName: string | null;
  peerAddress: string | null;
  visible: boolean;
  toggleReceiver: () => unknown;
  closeReceiver: () => unknown;
}

export default function RelayHeader({
  text = 'Relay Receiver',
  visible,
  peerName,
  peerAddress,
  toggleReceiver,
  closeReceiver
}: HeaderProps) {

  const headerText = () => {
    if (text) {
      return (
        <SoloTextContainer>
          {text}
        </SoloTextContainer>
    )}

    if (peerName) {
      return (
        <TextContainer>
          <MainText>
            {peerName}
          </MainText>
          <SubText>
            {peerAddress && truncated(peerAddress)}
          </SubText>
        </TextContainer>
      )
    } else {
      return (
        <SoloTextContainer>
          {peerAddress && truncated(peerAddress)}
        </SoloTextContainer>
    )}
  }

  return (
    <Header onClick={toggleReceiver}>
      { headerText() }
      
      { visible && 
        <Minimizeontainer>
          <img
            src={CloseReceiverLine}
            width={12}
            height={13}
            alt="relay"
          />
        </Minimizeontainer>
      }

      <CloseContainer>
        <img
          src={CloseReceiverX}
          width={13}
          height={13}
          alt="relay"
          onClick={closeReceiver}
        />
      </CloseContainer>

    </Header>
  );
}

const Header = styled.div`
  background-color: #5A46C6;
  color: #F7F7F7;
  font-size: 16px;
  font-weight: 600;
  padding: 22px;
  font-family: 'Circular Std', sans-serif;;
  z-index: 1000;
  text-align: left;
  border-radius: 20px 20px 0 0;
  
  &:hover {
    cursor: pointer;
  }
`;

const TextContainer = styled.div`
  margin-right: 35px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const SoloTextContainer = styled.div`
  margin-right: 35px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 10px 0;
`;

const MainText = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  padding-bottom: 4px;
  color: #F7F7F7;
`;

const SubText = styled.div`
  font-weight: 450;
  font-size: 10px;
  line-height: 15px;
  color: #F7F7F7;
`;

const CloseContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 33px;
`;

const Minimizeontainer = styled.div`
  position: absolute;
  right: 55px;
  top: 33px;
`;
