import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  FC,
  createContext,
  useState,
} from 'react';
import { prepareUseMyInbox, prepareSendToInbox } from '../utils/inbox';
import { useAuth } from '@altrx/gundb-react-auth';
import { Message } from '../utils/types';
import {
  prepareIndexNotifications,
  prepareIndexUser,
  prepareUsePagination,
  prepareIndexUsers,
  init,
} from '../utils/feed';
import { useGunState } from '@altrx/gundb-react-hooks';
import { syncManagerInstance } from '../utils/sync';

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
  indexNotifications: Function;
  indexUser: Function;
  usePagination: Function;
  indexPost: Function;
  indexUsers: Function;
  api: any;
  updateFeed: boolean;
  setUpdateFeed: (value: boolean) => void;
  gun: any;
};
type ContextValue = undefined | CoreProviderValue;

const CoreContext = createContext<ContextValue>(undefined);
CoreContext.displayName = 'CoreContext';

const initedApi: any = init();

const CoreProvider: FC = (props: any) => {
  const [updateFeed, setUpdateFeed] = useState(false);
  const { appKeys, sea, gun, user } = useAuth();

  const appGunInstance = gun.get('364');
  const api = useRef<any>(initedApi);
  const indexNotifications = prepareIndexNotifications(api.current);
  const indexUser = prepareIndexUser(api.current);
  const usePagination = prepareUsePagination(api.current);
  const indexUsers = prepareIndexUsers(api.current);
  const indexPost = api.current.insertIndex;

  const useMyInbox = prepareUseMyInbox(appKeys, appGunInstance, sea);
  const sendToInbox = prepareSendToInbox(appKeys, appGunInstance, sea);
  const get364node = useCallback(
    (name, isOwnProfile = true, pub = '') => {
      return isOwnProfile
        ? user.get('364').get(name)
        : gun.get(`~${pub}`).get('364').get(name);
    },
    [gun, user]
  );
  const get364UserNode = useCallback(
    (name, isOwnProfile = true, pub = '') => {
      return isOwnProfile ? user : gun.get(`~${pub}`);
    },
    [gun, user]
  );

  const syncManager = useRef(syncManagerInstance(gun, indexPost)).current;
  const { fields: followees } = useGunState<any>(get364node('followees'));
  const timeoutId = useRef<any>();

  useEffect(() => {
    const run = async () => {
      initedApi.init();
    };
    run();
  }, []);

  const initUser = useCallback(() => {
    if (!appKeys || !appKeys.pub) {
      return;
    }
    get364node('profile').put({
      pub: appKeys.pub,
      epub: appKeys.epub,
      inbox: `@${appKeys.pub}/inbox`,
    });
  }, [appKeys, get364node]);

  useEffect(() => {
    delete followees['_'];
    const fw = Object.keys(followees).filter((k) => !!followees[k]);

    if (appKeys && appKeys.pub && Object.keys(fw)?.length) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      } else {
        syncManager.indexFollowees(fw, () => {
          setUpdateFeed(true);
        });
      }
      timeoutId.current = setInterval(() => {
        syncManager.indexFollowees(fw, () => {
          setUpdateFeed(true);
        });
      }, 1 * 20 * 1000);
    }

    return () => {
      if (timeoutId.current) {
        clearInterval(timeoutId.current);
      }
      syncManager.cleanup();
    };
  }, [followees]);

  initUser();

  const value: CoreProviderValue = useMemo(
    () => ({
      useMyInbox,
      sendToInbox,
      appGunInstance,
      get364node,
      get364UserNode,
      indexNotifications,
      indexUser,
      indexPost,
      usePagination,
      indexUsers,
      api,
      updateFeed,
      setUpdateFeed,
      gun,
    }),
    [
      useMyInbox,
      sendToInbox,
      appGunInstance,
      get364node,
      get364UserNode,
      indexNotifications,
      indexUser,
      indexPost,
      usePagination,
      indexUsers,
      updateFeed,
      setUpdateFeed,
      gun,
    ]
  );

  return <CoreContext.Provider value={value} {...props} />;
};

function useCore(): CoreProviderValue {
  const context = useContext(CoreContext);
  if (context === undefined) {
    throw new Error(`useCore must be used within a CoreProvider`);
  }
  return context;
}

export { CoreProvider, useCore };
