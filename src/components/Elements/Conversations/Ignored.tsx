import React, { FunctionComponent, useMemo } from 'react';
import { useConversationsPreviews, useIgnoredAddresses } from '../../../hooks';
import { ConversationListView, Conversation } from './ConversationListView';
import { LoadingList } from '../LoadingList';
import { NoIgnoredConversations } from './NoIgnoredConversations';

export const Ignored: FunctionComponent = () => {
  const ignoredAddresses = useIgnoredAddresses();
  const ignoredPreviews = useConversationsPreviews(ignoredAddresses.data || []);
  const ignoredIsLoading =
    ignoredAddresses.isLoading ||
    Boolean(ignoredPreviews.find((pq) => pq.isLoading));

  const conversationsProps: Conversation[] = useMemo(() => {
    return ignoredPreviews
      .filter((cp) => cp.data && cp.data.messages.length > 0)
      .map((cp) => cp.data)
      .sort((a, b) => {
        if (a === undefined) return 1;
        if (b === undefined) return -1;
        if (a.messages[0] === undefined) return 1;
        if (b.messages[0] === undefined) return -1;
        if (a.messages[0].sent === undefined) return 1;
        if (b.messages[0].sent === undefined) return 1;
        return a.messages[0].sent.getTime() < b.messages[0].sent.getTime()
          ? 1
          : -1;
      }) as Conversation[];
  }, [ignoredPreviews]);

  if (ignoredIsLoading) {
    return <LoadingList />;
  } else if (conversationsProps.length === 0) {
    return <NoIgnoredConversations />;
  } else {
    return <ConversationListView conversations={conversationsProps} />;
  }
};
