export type Profile = {
  name?: string;
  epub?: string;
  pub?: string;
  inbox?: string;
  bio?: string;
};

export type PostIdx = {
  date: string;
  pub: string;
};

export type Post = {
  content: string;
  createdAt: string;
  nodeID?: string;
  likes?: Record<string, unknown>;
  name: string;
};

export type Message = {
  type: string;
  postId: string;
  reference: any;
  from: string;
  contents: string;
};

export type MessageListProps = {
  reactionsRef?: any;
  posts?: any;
  keys?: any;
  theirKeys?: any;
  epub?: string;
  pub?: string;
  inbox?: any;
  name?: string;
};

export type MessageProps = {
  nodeID: string;
  reactionsRef?: any;
  postsRef?: any;
  posts?: any;
  keys?: any;
  theirKeys?: any;
  inbox?: any;
};
