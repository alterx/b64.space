import { Message } from './types';
import { useReducer, useEffect, useRef } from 'react';
import {
  nodeReducer,
  debouncedUpdates,
  useIsMounted,
  KeyPair,
} from '@altrx/gundb-react-hooks';

const updatePostWithReaction = async (
  postsRef: any,
  notificationsRef: any,
  reaction: any
) => {
  try {
    const { postId, type, from, contents } = reaction;
    const fromJson = JSON.parse(from);
    if (type === 'reaction') {
      postsRef.get(postId).put({
        likes: {
          [fromJson.pub]: contents === 'like',
        },
      });
    } else {
      console.log('TODO: add comment to post.');
      postsRef
        .get(postId)
        .get('comments')
        .get(new Date().toISOString())
        .put({ contents, from: fromJson.pub });
    }
    notificationsRef
      .get(new Date().toISOString())
      .put({ from: fromJson.pub, type, contents, postId });
  } catch (e) {
    console.log(e);
  }
};

export const prepareUseMyInbox =
  (pair: KeyPair, node: any, SEA: any) =>
  (postsRef: any, notificationsRef: any) => {
    const myInbox = `@${pair.pub}/inbox`;
    const [collection, dispatch] = useReducer<any>(nodeReducer, {});
    const handler = useRef<Record<string, any>>(null);
    const isMounted = useIsMounted();

    useEffect(() => {
      const debouncedHandlers: any[] = [];
      if (isMounted.current) {
        const updater = debouncedUpdates(
          (data: any) => {
            dispatch({ type: 'add', data });
          },
          'object',
          1000
        );
        node
          .get(myInbox)
          .map()
          .on(async (node: any /*, hash*/) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _, ...rest } = node;

            const keys = Object.keys(rest);

            if (keys.length) {
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const str = rest[keys[i]];

                const item = JSON.parse(str);
                const sharedSecret = await SEA.secret(item.epub, pair);
                const decryptedData = await SEA.decrypt(
                  item.data,
                  sharedSecret
                );
                updatePostWithReaction(
                  postsRef,
                  notificationsRef,
                  decryptedData
                );
                updater({
                  id: key,
                  data: { ...decryptedData, nodeID: key },
                });
              }
            }
          });
      }
      return () => {
        if (handler && handler.current) {
          //cleanup gun .on listener
          // eslint-disable-next-line react-hooks/exhaustive-deps
          handler.current.off();
        }
        if (debouncedHandlers.length) {
          //cleanup timeouts
          debouncedHandlers.forEach((c) => c());
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [collection];
  };

export const prepareSendToInbox =
  (pair: KeyPair, node: any, SEA: any) =>
  (message: Message, pubTo: string, epubTo: string, inbox: string) => {
    console.log('TODO: add reaction being sent to my posts.');
    return new Promise((resolve, reject) => {
      const { reference, type, postId, from, contents } = message;
      const id = new Date().toISOString();
      reference
        .get(id)
        .put({ type, postId, pubTo }, async ({ err }: { err: any }) => {
          if (err) {
            reject(err);
            return;
          }
          const sharedSecret = await SEA.secret(epubTo, pair);
          const encryptedData = await SEA.encrypt(
            JSON.stringify({ type, postId, from, reactionSoul: id, contents }),
            sharedSecret
          );
          const payload = JSON.stringify({
            data: encryptedData,
            epub: pair.epub,
          });
          const hash = await SEA.work(payload, null, null, { name: 'SHA-256' });
          try {
            node
              .get(inbox)
              .get(`@${postId}#reactions<?60`)
              .get(hash)
              .put(payload, (ack: any) =>
                ack.ok ? resolve(null) : reject(ack.err)
              );
          } catch (e) {
            console.log(e);
          }
        });
    });
  };
