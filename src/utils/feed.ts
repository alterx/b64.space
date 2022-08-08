import { useEffect, useState } from 'react';
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
import Worker from '../index.worker.ts?worker';
import { wrap } from 'comlink';
import { useInfiniteQuery } from '@tanstack/react-query';

export function init() {
  const worker = new Worker();
  initBackend(worker);
  const api = wrap(worker);
  return api;
}
export const prepareIndexUsers = (api: any) => (users: string[]) => {
  return api.indexFollowees(users);
};

export const prepareIndexUser = (api: any) => (pub: string) => {
  return api.indexFollowees([pub]);
};

export const prepareIndexNotifications = prepareIndexUser;
export const LIMIT = 10;

export const prepareUsePagination = (api: any) => (filter?: string) => {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ['index'],
    async ({ pageParam = 0, ...rest }) => {
      const pList = await api.getIndex(filter, pageParam * LIMIT, LIMIT);
      const total = pList[0] ? pList[0].total : 0;
      const newPp = pageParam + 1;
      return {
        posts: pList,
        cursor: total > newPp * LIMIT ? newPp : null,
        total,
      };
    },
    {
      getNextPageParam: (lastGroup) => {
        return lastGroup?.posts?.length >= LIMIT ? lastGroup.cursor : null;
      },
    }
  );

  const reset = async () => {
    refetch({
      refetchPage: (page: any, index: number) => {
        //console.log('refetchPage', index === 0, page);
        return index === 0;
      },
    });
  };

  useEffect(() => {
    reset();
  }, []);

  return [
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    reset,
  ];
};
