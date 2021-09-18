import { useEffect, useState, useCallback } from 'react';
import { Idx } from './types';
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
import Worker from '../index.worker';
import { wrap } from 'comlink';

export function init() {
  const worker = new Worker();
  initBackend(worker);
  const api = wrap(worker);
  return api;
}
export const prepareIndexFollowees = (api: any) => (followees: []) => {
  api.indexFollowees(followees);
};

export const prepareIndexUser = (api: any) => (pub: string) => {
  api.indexFollowees([pub]);
};

export const prepareIndexNotifications = prepareIndexUser;

export const prepareUseFetchPosts =
  (api: any) =>
  (filter?: string): [Idx[], Function] => {
    const [posts, setPosts] = useState([] as Idx[]);
    const fetchPosts = useCallback(
      async (f?: string, limit: number = 10, skip: number = 0) => {
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

const LIMIT = 5;
export const prepareUsePagination =
  (useFetchPosts: Function) => (filter?: string) => {
    const [{ hasNextPage, isLoading, _skip = 0 }, setPagination] =
      useState<any>({});

    const [items, fetchPosts] = useFetchPosts(filter);

    const loadMore = async (f?: string, skip = _skip) => {
      await fetchPosts(filter || f, LIMIT, skip);
      setPagination((state: any) => {
        return {
          ...state,
          items: [...(state?.items || []), ...items],
          skip: _skip + LIMIT,
          hasNextPage: items.length < LIMIT,
        };
      });
    };

    return [items, hasNextPage, isLoading, loadMore];
  };
