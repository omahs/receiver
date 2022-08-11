import React, { useCallback, useEffect, useState } from 'react';
import styled, { Interpolation } from 'styled-components';
import LightCoinbase from '../../assets/images/LightCoinbase.png';
import LightWalletConnect from '../../assets/images/LightWalletConnect.png';
import Metamask from '../../assets/images/Metamask.svg';
import SignInLink from '../Connector';
import Messages from './Messages';
import Card from '../Card';
import MessageInput from '../MessageInput';
import Header from './Header';
import Logo from '../../assets/images/logo2.svg';
import { useIsMetaMask } from '../../hooks';
import { useConnect, useAccount, useSigner} from 'wagmi';
import {
  useSendMessage,
  Status as SendMessageStatus,
} from '../../xmtp-react/conversations';
import { receiverStore } from '../../store';


interface ChatButtonProps {
  visible: boolean;
  as?: string | React.ComponentType<any>;
  style?: Interpolation<React.CSSProperties>;
  isUserConnected: boolean;
  toggleReceiver: () => unknown;
  closeReceiver: () => unknown;
}

const ChatBox = ({ style, isUserConnected, visible, as, toggleReceiver, closeReceiver}: ChatButtonProps) => {
  const { peerAddress, peerName, xmtpInit } = receiverStore();
  
  const isMetaMask = useIsMetaMask();
  const [xmtpReady, setXmptReady] = useState<boolean>(false);
  const [userDidConnect, setUserDidConnect] = useState<boolean>(false);
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const { data: wallet } = useSigner();

  useEffect(() => {
    if (userDidConnect && isConnected && wallet) {
      // Initialize XMTP once the wallet is connected.
      xmtpInit(wallet);
    }
  }, [wallet, isConnected, userDidConnect])

  const sendMessage = useSendMessage();

  const metamaskConnector = connectors.find(
    (connector) => connector.id === 'injected'
  );

  const walletConnectConnector = connectors.find(
    (connector) => connector.id === 'walletConnect'
  );

  const coinbaseConnector = connectors.find(
    (connector) => connector.id === 'coinbaseWallet'
  );

  // TODO prevent connection if already connected.
  const handleClickMetamask = useCallback(() => {
    setUserDidConnect(true);
    connect({connector: metamaskConnector});
  
    /* eslint-disable-next-line */
  }, []);

  const handleClickCoinbase = useCallback(() => {
    setUserDidConnect(true);
    connect({connector: coinbaseConnector});
    /* eslint-disable-next-line */
  }, []);

  const handleClickWalletConnect = useCallback(() => {
    setUserDidConnect(true);
    connect({connector: walletConnectConnector});
    /* eslint-disable-next-line */
  }, []);

  const handleOnXmtpReady = useCallback((isReady: boolean) => {
    setXmptReady(isReady);
  }, []);
  

  const doSendMessage = useCallback(
    async (message: string) => {
      if (peerAddress && sendMessage.status === SendMessageStatus.ready) {
        sendMessage.send(peerAddress, message);
      }
    },
    [sendMessage, peerAddress]
  );

  const textForHeader = (isUserConnected || (isConnected && userDidConnect)) ? null : 'Relay Receiver';

  return (
    <ChatContainer visible={visible} as={as} style={style}>
      <Header visible={visible} peerName={peerName} peerAddress={peerAddress} text={textForHeader} closeReceiver={ closeReceiver } toggleReceiver={toggleReceiver} />

      <RelayRelativeContainer>
        {((isUserConnected || isConnected) && userDidConnect) ? (
          <Messages onXmptReady={handleOnXmtpReady} />
        ) : (
          <Card title='Connect your wallet to start a converation!'>
            <ConnectorList>
              {isMetaMask && (
                <Connector onClick={handleClickMetamask}>
                  <SignInLink
                    hoverLogo={Metamask}
                    name={'Metamask'}
                    onClick={handleClickMetamask}
                  />
                </Connector>
              )}
              <MaybeHideOnConnector onClick={handleClickWalletConnect} shouldHide={isMetaMask}>
                <SignInLink
                  hoverLogo={LightWalletConnect}
                  name={'Wallet Connect'}
                  onClick={handleClickWalletConnect}
                />
              </MaybeHideOnConnector>
              <MaybeHideOnConnector onClick={handleClickCoinbase} shouldHide={isMetaMask}>
                <SignInLink
                  hoverLogo={LightCoinbase}
                  name={'Coinbase'}
                  onClick={handleClickCoinbase}
                />
              </MaybeHideOnConnector>
            </ConnectorList>
          </Card>
        )}
      </RelayRelativeContainer>
      { !xmtpReady ? (
        <RelayFooter>
          Powered by Relay
          <img src={Logo}
            height={30}
            width={30} />
        </RelayFooter>
      ) : (
        <RelayInputFooter>
          <MessageInput
            onSendMessage={doSendMessage}
          />
        </RelayInputFooter>
      )}
    </ChatContainer>
  );
};

const RelayInputFooter = styled.div`
  color: #333333;
  text-align: center;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  height: 45px;
  width: 100%;
  background-color: white;
`;

const ChatContainer = styled.div<ChatButtonProps>`
  background-color: transparent;
  color: white;
  border: none;
  padding: 0px;
  font-size: 16px;
  letter-spacing: .1em;
  height: 100%;
  z-index: 1000;
  width: 375px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0 0;
  ${({ style }) => style };
`;

const RelayRelativeContainer = styled.div`
  height: 375px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FBFAFF;
`;

const RelayFooter = styled.div`
  color: #333333;
  text-align: center;
  font-family: sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  height: 45px;
  width: 100%;
  background-color: #FBFAFF;
  line-height: 45px;

  img {
    display:inline-block;
    height: 15px;
    width: 15px;
    vertical-align: sub;
    margin-left: 5px;
  }
`;

const ConnectorList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Connector = styled.div`
  color: #333333;
  list-style-type: none;
  cursor: pointer;
  width: 206px;
  height: 58px;
  border-radius: 5px;
  background: white;
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-family: sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;

const MaybeHideOnConnector = styled(Connector)<{ shouldHide: boolean }>`
  @media (pointer: coarse) {
    display: ${(p) => (p.shouldHide ? 'none' : 'flex')};
  }
`;

export default ChatBox;
