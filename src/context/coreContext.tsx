import React from 'react';
import { prepareUseMyInbox, prepareSendToInbox } from '../utils/inbox';
import { useAuth } from '@altrx/gundb-react-auth';
import { useGunOnNodeUpdated } from '@altrx/gundb-react-hooks';
import { Message, Post } from '../utils/types';
import { indexPost } from '../utils/feed';

type CoreProviderValue = {
  get364node: (name: string, isOwnProfile?: boolean, pub?: string) => any;
  useMyInbox: (postsRef: any, notificationsRef: any) => any[];
  sendToInbox: (
    message: Message,
    pubTo: string,
    epubTo: string,
    inbox: string
  ) => Promise<any>;
  appGunInstance: any;
};
type ContextValue = undefined | CoreProviderValue;

const CoreContext = React.createContext<ContextValue>(undefined);
CoreContext.displayName = 'CoreContext';

const CoreProvider: React.FC = (props: any) => {
  const { appKeys, sea, gun, user } = useAuth();
  const appGunInstance = gun.get('364');

  const useMyInbox = prepareUseMyInbox(appKeys, appGunInstance, sea);
  const sendToInbox = prepareSendToInbox(appKeys, appGunInstance, sea);
  const get364node = React.useCallback(
    (name, isOwnProfile = true, pub = '') => {
      return isOwnProfile
        ? user.get('364').get(name)
        : gun.get(`~${pub}`).get('364').get(name);
    },
    [gun, user]
  );
  const get364UserNode = React.useCallback(
    (name, isOwnProfile = true, pub = '') => {
      return isOwnProfile ? user : gun.get(`~${pub}`);
    },
    [gun, user]
  );

  const initUser = React.useCallback(() => {
    if (!appKeys || !appKeys.pub) {
      return;
    }
    get364node('profile').put({
      pub: appKeys.pub,
      epub: appKeys.epub,
      inbox: `@${appKeys.pub}/inbox`,
    });
  }, [appKeys, get364node]);

  initUser();

  useGunOnNodeUpdated(get364node('feedPostsByDate').map(), {}, (item: Post) => {
    indexPost({ pub: item.name, date: item.createdAt });
  });

  const value: CoreProviderValue = React.useMemo(
    () => ({
      useMyInbox,
      sendToInbox,
      appGunInstance,
      get364node,
      get364UserNode,
    }),
    [useMyInbox, sendToInbox, appGunInstance, get364node, get364UserNode]
  );

  return <CoreContext.Provider value={value} {...props} />;
};

function useCore(): CoreProviderValue {
  const context = React.useContext(CoreContext);
  if (context === undefined) {
    throw new Error(`useCore must be used within a CoreProvider`);
  }
  return context;
}

export { CoreProvider, useCore };
