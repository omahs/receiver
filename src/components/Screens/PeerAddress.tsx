import React, { FunctionComponent } from 'react';
import { Screen } from './Screen';
import { MessageList, MessageInput, InfoCard, LoadingList } from '../Elements';
import {
  useEnsAddress,
  useLensAddress,
  isLensName,
  sendMessage,
  isEthAddress,
  useMessages,
  usePeerOnNetwork,
  useClient,
} from '../../hooks';

export interface PeerAddressProps {
  handle?: string | null;
}

export const PeerAddress: FunctionComponent<PeerAddressProps> = ({
  handle,
}) => {
  const lensAddress = useLensAddress({
    handle: isLensName(handle) ? handle : null,
  });
  const ensAddress = useEnsAddress({
    handle,
  });
  const peerAddress = lensAddress.address || ensAddress.data || handle;
  const peerOnNetwork = usePeerOnNetwork({ peerAddress });
  const messages = useMessages({ peerAddress });
  const [, client] = useClient();

  return (
    <Screen
      content={(() => {
        if (!isEthAddress(peerAddress)) {
          if (lensAddress.status === 'fetching' || ensAddress.isLoading) {
            return (
              <>
                <LoadingList />
                <MessageInput onSendMessage={() => null} />
              </>
            );
          } else {
            return <InfoCard variant="invalid handle" handle={handle} />;
          }
        } else {
          if (messages.isLoading || peerOnNetwork.isLoading) {
            return (
              <>
                <LoadingList />
                <MessageInput
                  onSendMessage={(message: string) =>
                    client.data &&
                    sendMessage(client.data, peerAddress, message)
                  }
                />
              </>
            );
          } else if (messages.isSuccess) {
            if (peerOnNetwork.data === false) {
              return <InfoCard variant="no peer" />;
            } else if (messages.data.length === 0) {
              return (
                <>
                  <InfoCard variant="no messages" />
                  <MessageInput
                    onSendMessage={(message: string) =>
                      client.data &&
                      sendMessage(client.data, peerAddress, message)
                    }
                  />
                </>
              );
            } else {
              return (
                <>
                  <MessageList peerAddress={peerAddress} />
                  <MessageInput
                    onSendMessage={(message: string) =>
                      client.data &&
                      sendMessage(client.data, peerAddress, message)
                    }
                  />
                </>
              );
            }
          } else {
            throw new Error('We shouldnt be able to get to this state!');
          }
        }
      })()}
    />
  );
};
