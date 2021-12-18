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
