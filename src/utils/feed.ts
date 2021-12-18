import { useEffect, useState, useCallback } from 'react';
import { Idx } from './types';
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
import Worker from '../index.worker.ts?worker';
import { wrap } from 'comlink';

export function init() {
  const worker = new Worker();
  initBackend(worker);
  const api = wrap(worker);
  return api;
}
export const prepareIndexUsers = (api: any) => (users: []) => {
  api.indexFollowees(users);
};

export const prepareIndexUser = (api: any) => (pub: string) => {
  api.indexFollowees([pub]);
};

export const prepareIndexNotifications = prepareIndexUser;
const LIMIT = 10;

export const prepareUseFetchPosts =
  (api: any) =>
  (filter?: string): [Idx[], Function] => {
    const [posts, setPosts] = useState([] as Idx[]);
    const fetchPosts = useCallback(
      async (f?: string, limit: number = LIMIT, skip: number = 0) => {
        const pList = await api.getIndex(filter || f, skip, limit);
        setPosts(pList as Idx[]);
        return pList;
      },
      [filter]
    );

    useEffect(() => {
      fetchPosts(filter);
    }, [fetchPosts, filter]);

    return [posts, fetchPosts];
  };

export const prepareUsePagination =
  (useFetchPosts: Function) => (filter?: string) => {
    const [items, fetchPosts] = useFetchPosts(filter);
    const [
      { hasNextPage = items?.length > LIMIT, isLoading = false, _skip = 0 },
      setPagination,
    ] = useState<any>({});

    const loadMore = async (f?: string, skip = _skip) => {
      setPagination((state: any) => {
        return {
          ...state,
          isLoading: true,
        };
      });
      await fetchPosts(filter || f, LIMIT, skip);
      setPagination((state: any) => {
        const newState = {
          ...state,
          items: [...(state?.items || []), ...items],
          skip: _skip + LIMIT,
          hasNextPage: items.length < LIMIT,
          isLoading: false,
        };
        return newState;
      });
    };

    const reset = async () => {
      const posts = await fetchPosts(filter);
      setPagination({
        items: posts,
        _skip: 0,
        hasNextPage: items.length < LIMIT,
      });
      console.log('reset');
    };
    return [items, hasNextPage, isLoading, loadMore, reset];
  };
