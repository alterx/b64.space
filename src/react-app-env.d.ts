declare module 'gun/sea';
declare module '@jlongster/sql.js';
declare module 'absurd-sql';
declare module 'absurd-sql/dist/indexeddb-backend';
declare module 'absurd-sql/dist/indexeddb-main-thread';
declare module 'gun/lib/radix';
declare module 'gun/lib/radisk';
declare module 'gun/lib/store';
declare module 'gun/lib/rindexed';

declare module '!!file-loader?name=sql-wasm-[contenthash].wasm!@jlongster/sql.js/dist/sql-wasm.wasm';

declare module 'worker-loader!*' {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
  class WebpackWorker extends Worker {
    constructor();
  }

  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}
