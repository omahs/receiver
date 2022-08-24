import styled from "styled-components";
import CloseReceiverLine from "../../assets/images/close-receiver-line.svg";
import CloseReceiverX from "../../assets/images/close-x.svg";
import ArrowUp from "../../assets/images/arrowUp.svg";
import { truncateAddress } from "../../utls/address";

import React from "react";
import { FetchEnsNameResult } from "@wagmi/core";

interface HeaderProps {
  text: string | null;
  visible: boolean;
  peerAddress: string | undefined;
  peerName: FetchEnsNameResult | undefined;
  toggleReceiver: () => unknown;
  closeReceiver: () => unknown;
}

export default function RelayHeader({
  text = "Relay Receiver",
  visible,
  peerAddress,
  peerName,
  toggleReceiver,
  closeReceiver,
}: HeaderProps) {
  const headerText = () => {
    if (text) {
      return <SoloTextContainer>{text}</SoloTextContainer>;
    }

    if (peerName) {
      return (
        <TextContainer>
          <MainText>{peerName}</MainText>
          <SubText>{peerAddress && truncateAddress(peerAddress)}</SubText>
        </TextContainer>
      );
    } else {
      return (
        <SoloTextContainer>
          {peerAddress && truncateAddress(peerAddress)}
        </SoloTextContainer>
      );
    }
  };

  return (
    <Header>
      {headerText()}

      {visible ? (
        <MinimizeContainerLine>
          <img
            src={CloseReceiverLine}
            width={12}
            height={13}
            alt="relay"
            onClick={toggleReceiver}
          />
        </MinimizeContainerLine>
      ) : (
        <MinimizeContainer>
          <img
            src={ArrowUp}
            width={18}
            height={13}
            alt="relay"
            onClick={toggleReceiver}
          />
        </MinimizeContainer>
      )}

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
  font-size: 16px;
  font-weight: 600;
  padding: 22px;
  font-family: "Circular Std", sans-serif;
  z-index: 1000;
  text-align: left;
  border-radius: 4px 4px 0 0;
  box-shadow: 0px 4px 4px -4px rgba(0, 0, 0, 0.25);
  color: black;
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
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  padding-bottom: 4px;
  color: black;
`;

const SubText = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
`;

const CloseContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 33px;

  &:hover {
    cursor: pointer;
  }
`;

const MinimizeContainer = styled.div`
  position: absolute;
  right: 55px;
  top: 33px;

  &:hover {
    cursor: pointer;
  }
`;

const MinimizeContainerLine = styled(MinimizeContainer)`
  top: 38px;
`;
