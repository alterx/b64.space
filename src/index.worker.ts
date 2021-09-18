/* eslint-disable import/first */
/* eslint-disable no-restricted-globals */
import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
import { Idx } from './utils/types';
import { expose } from 'comlink';

// eslint-disable-next-line import/no-webpack-loader-syntax
import sqlWasm from '!!file-loader?name=sql-wasm-[contenthash].wasm!@jlongster/sql.js/dist/sql-wasm.wasm';

export default {} as typeof Worker & { new (): Worker };

import Gun from 'gun';
import * as radix from 'gun/lib/radix';
import * as radisk from 'gun/lib/radisk';

import 'gun/lib/store';
import * as rindexed from 'gun/lib/rindexed';

declare const self: any;
var window: any = {
  crypto: self.crypto,
  TextEncoder: self.TextEncoder,
  TextDecoder: self.TextDecoder,
  WebSocket: self.WebSocket,
  Gun,
  Radix: radix,
  Radisk: radisk,
};

const peers = ['http://localhost:8765/gun'];

const gun = new window.Gun({
  localStorage: false,
  radisk: true,
  peers,
  store: rindexed(),
});

let database: any;

async function init(filename = 'db') {
  if (database) {
    return database;
  }
  let SQL = await initSqlJs({ locateFile: () => sqlWasm });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  database = new SQL.Database(`/sql/${filename}.sqlite`, { filename: true });
  database.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);

  try {
    database.exec(
      `CREATE TABLE IF NOT EXISTS postIdx (
          pub TEXT NOT NULL,
          ref TEXT NOT NULL,
          PRIMARY KEY (pub, ref)
        )`
    );
    database.exec(
      `CREATE TABLE IF NOT EXISTS notificationIdx (
          pub TEXT NOT NULL,
          ref TEXT NOT NULL,
          PRIMARY KEY (pub, ref)
        )`
    );
  } catch (e) {
    console.log('Error: ', e);
  } finally {
    return database;
  }
}

async function getIndex(
  pub?: string,
  skip = 0,
  limit = 10,
  table = 'postIdx'
): Promise<any> {
  if (!database) {
    return [];
  }
  const query = `
    SELECT * FROM ${table}
    ${pub ? `WHERE pub = '${pub}'` : ''}
    ORDER BY ref DESC
    LIMIT ${limit}
    OFFSET ${skip}
  `;
  let result = database.exec(query);
  return result[0]?.values.map(([pub, ref]: any) => ({ pub, date: ref })) || [];
}

async function insertIndex(items: Idx[], table = 'postIdx') {
  if (!database) {
    return false;
  }
  database.exec('BEGIN TRANSACTION');
  let stmt = database.prepare(
    `INSERT OR REPLACE INTO ${table} (pub, ref) VALUES (?, ?)`
  );
  for (let i = 0; i < items.length; i++) {
    stmt.run([items[i].pub, items[i].date]);
  }
  stmt.free();
  database.exec('COMMIT');

  console.log('indexed', items);

  return true;
}

// const handlers: any = {};

async function indexFollowees(followeeList: string[]) {
  console.log('indexFollowees', followeeList);
  for (let i = 0; i < followeeList.length; i++) {
    const pub = followeeList[i];
    console.log(pub);
    gun
      .get(`~${pub}/364/postsByDate`)
      // eslint-disable-next-line no-loop-func
      .once(async (data: any, i: any, k: any, e: any) => {
        const indexes = Object.keys(data)
          .filter((key) => key !== '_')
          .map((key: string) => {
            return { date: key, pub };
          });
        await insertIndex(indexes);
        // if (!handlers[pub]) {
        //   handlers[pub] = e;
        // } else {
        //   handlers[pub].off();
        // }
      });
  }
}

const api = {
  getIndex,
  insertIndex,
  indexFollowees,
  init,
};

expose(api);
