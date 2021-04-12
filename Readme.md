#### Simple Graphql subscription based jwt auth chat app + context api with Apollo server and client

`env` structure at project root

```sh
NODE_ENV=development
PORT=4000
DB='mongodb://localhost:27017/chatApp'
CLIENT_URL=http://localhost:3000
SECRET=jwt_secret
```

`env` structure at project root/client/

```sh
REACT_APP_APOLLO_URI=http://localhost:4000
REACT_APP_APOLLO_WS_URI=ws://localhost:4000
```

see package.json for how to install and run.