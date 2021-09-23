# b64.space

## Motivation

b64.space is an attempt to build a decentralized, public microblogging platform (think Twitter or Tumblr)

## Core values

### Every user owns their data

Every user is fully in control of its data. Even though everything is public, b64 acts as a facilitator so users can find each other and send messages. The actual content is always stored under each user's namespace, and protected by their keys.

### Local-first

You can always post new content, even if you're offline. Once the connection is restored, data should sync.

## Tech involved

- Gun DB
- SQLite (via absurd-sql and sql.js)
- React and React MUI

## Architectural design

### Profiles

b64.space makes extensive use of what I like to call "namespaces". A namespace is created when you use `gun.user()`

In Gun, this is a convenience wrapper around the flow of signing and verifying the data you're storing using certain key pair. This means that, effectively, this namespace is a portion of the graph that can only be controlled by the person in control of this key pair. Everything stored inside this namespace is write protected and signed. This means autorship can be verified at any given point in time. Every profile in b64.space corresponds to a single namespace.

### Notifications

Gun enables a very interesting patter we usually call "Inbox pattern". This makes use of

The main b64 global graph acts as a relay: every user has an inbox that other users can write to. This means

#### Follows

#### Likes

#### Replies

## Roadmap to v1

- [x] Key based Auth (using GUN.sea keys)
- [x] Create posts
- [x] Public Profiles
- [x] Like posts
- [x] Local indexing via SQLite
- [x] Follow users
- [ ] Add followers
- [ ] Comment posts (one level)
- [ ] Reply to post (multi level)

## v2 and beyond

- [ ] Add media (images/videos, explore Pinata, SIA, base64, WebTorrent)
- [ ] E2EE 1-1 direct messages (explore iris)
- [ ] E2EE group chats (explore iris)

---

## Development

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
