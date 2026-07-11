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
  } = useInfiniteQuery({
    queryKey: ['index'],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const pList = await api.getIndex(filter, pageParam * LIMIT, LIMIT);
      const total = pList[0] ? pList[0].total : 0;
      const newPp = pageParam + 1;
      return {
        posts: pList,
        cursor: total > newPp * LIMIT ? newPp : null,
        total,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastGroup: any) => {
      return lastGroup?.posts?.length >= LIMIT ? lastGroup.cursor : null;
    },
  });

  // react-query v5 removed refetchPage; refetch() re-fetches the loaded pages.
  const reset = async () => {
    refetch();
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
