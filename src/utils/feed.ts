import { DATA_TYPE, Connection } from 'jsstore';
import { useState } from 'react';
import { useGunOnNodeUpdated } from '@altrx/gundb-react-hooks';
import { useCore } from '../context/coreContext';

import { PostIdx } from './types';

const getWorkerPath = () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line import/no-webpack-loader-syntax
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js');
  } else {
    // eslint-disable-next-line import/no-webpack-loader-syntax
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js');
  }
};

const workerPath = getWorkerPath().default;

const connection = new Connection(new Worker(workerPath));

export const init = async () => {
  // step1 - create database schema
  const tblFeed = {
    name: 'Feed',
    columns: {
      // Here "Id" is name of column
      pub: { dataType: DATA_TYPE.String },
      date: { dataType: DATA_TYPE.String },
      datePub: { primaryKey: true, keyPath: ['pub', 'date'] },
    },
  };
  const db = {
    name: '364Data',
    tables: [tblFeed],
  };

  // step 2
  const isDbCreated = await connection.initDb(db);
  // isDbCreated will be true when database will be initiated for first time

  if (isDbCreated) {
    console.log('Db Created & connection is opened');
  }
  return connection;
};

export const indexPost = async (data: PostIdx) => {
  const db = await init();

  const noOfRowsInserted = await db.insert({
    into: 'Feed',
    upsert: true,
    values: [{ ...data, datePub: data.pub + data.date }], //you can insert multiple values at a time
  });
  return noOfRowsInserted;
};

export function indexUser(gunNode: any, pub: string, targetNode: any) {
  let unsubscribe: any;
  return new Promise((resolve, reject) => {
    gunNode.map().on((_: any, nodeID: string, message: any, e: any) => {
      if (!unsubscribe) {
        unsubscribe = e;
        resolve(unsubscribe);
      }
      indexPost({ date: nodeID, pub });
      targetNode.put({ date: nodeID, pub });
    });
  });
}

export const getPosts = async (pub?: string) => {
  const db = await init();
  let where;

  if (pub) {
    where = {
      pub,
    };
  }

  const results = await db.select({
    from: 'Feed',
    where,
    order: {
      by: 'date',
      type: 'desc',
    },
  });

  return results as PostIdx[];
};

export const useFetchPosts = (filter?: string): [PostIdx[], Function] => {
  const { get364node } = useCore();
  const [posts, setPosts] = useState([] as PostIdx[]);
  // my own feedindex node
  const feedIndexRef = get364node('feedPostsByDate');
  const fetchPosts = async (f?: string) => {
    const pList = await getPosts(filter || f);
    setPosts(pList);
  };

  useGunOnNodeUpdated(feedIndexRef.map(), {}, () => {
    fetchPosts();
  });

  return [posts, fetchPosts];
};
