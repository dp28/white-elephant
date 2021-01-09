# White Elephant

A gift exchange game where players can steal gifts from each other. Also known
as Yankee Swap or Dirty Santa. The production version of the game is [here](https://white-elephant.djpdev.com/).

## Development

This is a rough prototype, so has no tests and could benefit from some
restructuring. My aim with this project was to get something usable working in
a short time while learning about browser-to-browser communication, rather than
focusing on maintainablity. If this becomes useful longer term, it may need more
attention.

### Architecture

White Elephant is a peer-to-peer React and Redux app built on top of WebRTC
using [PeerJS](https://peerjs.com/). It also uses a simple PeerJS server to
broker initial communications between peers (browsers), but all other
information is sent directly from peer to peer.

To simplify the communication and to ensure a single source of truth for data,
one browser hosts the game and other browsers connect just with the host. A
subset of Redux actions are then sent from player browsers to the host. The host
then broadcasts the actions to all other players, ensuring all browsers are in
sync.

This app was built using `create-react-app`.

#### Why use peer-to-peer data transfer?

Several reasons:

- I'm interested in exploring peer-to-peer communication
- It's cheap - no need to pay for many servers
- It's scalable - computation is almost entirely client-side, and clients
  interact in small groups, while servers need to deal with all clients

Downsides:

- Image handling is awkward - permanent storage is difficult (so I avoided it)
- Users cannot join games unless the host is online, so game setup is slow

### Local development

To start the local server run:

```bash
make start_dev_Derver
```

Then, in a separate terminal, run the following to start the client:

```bash
make start
```

This will open a new browser tab pointing at your local client code. If you make
a change to code, the changes should be automatically reflected in the browser.
Any state saved in hooks will not be lost.

Local development of peer-to-peer features requires multiple browsers, or at
least a browser in private browsing mode in addition to a normal browser.

### Deployment

The client is hosted on S3 behind Cloudflare at
[https://white-elephant.djpdev.com/](https://white-elephant.djpdev.com/). To
deploy an update, run:

```bash
ENVIRONMENT=production make deploy
```

The server rarely changes and could easily be replaced with any other PeerJS
server. To deploy it, first ensure you have access to the heroku account for
the server, then run:

```bash
make deploy_server
```
