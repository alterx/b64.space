let singletonInstance: SyncManager;

class SyncManager {
  #handlers: any = {};
  #isSyncing = false;
  #gun: any;
  #indexPost: any;

  constructor(gun: any, api: any) {
    this.#gun = gun;
    this.#indexPost = api;
  }

  cleanup() {
    for (const pub in this.#handlers) {
      this.#handlers[pub].off();
    }
    this.#handlers = {};
  }

  async indexFollowees(followeeList: string[], cb: Function) {
    if (this.#isSyncing || localStorage.getItem('364#isSyncing') === 'true') {
      return;
    }
    this.#isSyncing = true;
    localStorage.setItem('364#isSyncing', 'true');
    const promises = [];
    for (let i = 0; i < followeeList.length; i++) {
      const pub = followeeList[i];
      promises.push(
        new Promise((resolve, reject) =>
          this.#gun
            .get(`~${pub}/364/postsByDate`)
            .map()
            // eslint-disable-next-line no-loop-func
            .on(async (data: any, id: any, k: any, e: any) => {
              await this.#indexPost([
                {
                  date: id,
                  pub,
                },
              ]);
              resolve(null);
              if (!this.#handlers[pub]) {
                this.#handlers[pub] = e;
              }
            })
        )
      );
    }

    Promise.all(promises)
      .then(() => {
        this.#isSyncing = false;
        localStorage.setItem('364#isSyncing', 'false');
        cb();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export const syncManagerInstance = (gun: any, indexPost: any) => {
  if (!singletonInstance) {
    singletonInstance = new SyncManager(gun, indexPost);
    Object.freeze(singletonInstance);
  }
  return singletonInstance;
};
