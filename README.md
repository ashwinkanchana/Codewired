# Codewired

A real-time collaborative coding platform with Code sync, compiler, group video/audio call, whiteboard and chat.


[![JavaScript](https://camo.githubusercontent.com/aeddc848275a1ffce386dc81c04541654ca07b2c43bbb8ad251085c962672aea/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6a6176617363726970742d2532333332333333302e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d6a617661736372697074266c6f676f436f6c6f723d253233463744463145)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)[![MongoDB](https://camo.githubusercontent.com/c839570bc71901106b11b8411d9277a6a8356a9431e4a16d6c26db82caab7d62/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d6f6e676f44422d2532333465613934622e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d6d6f6e676f6462266c6f676f436f6c6f723d7768697465)](https://www.mongodb.com/)[![Express](https://camo.githubusercontent.com/8286a45a106e1a3c07489f83a38159981d888518a740b59c807ffc1b7b1e2f7b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f657870726573732e6a732d2532333430346435392e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d65787072657373266c6f676f436f6c6f723d253233363144414642)](https://expressjs.com/)
[![React](https://camo.githubusercontent.com/ab4c3c731a174a63df861f7b118d6c8a6c52040a021a552628db877bd518fe84/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f72656163742d2532333230323332612e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d7265616374266c6f676f436f6c6f723d253233363144414642)](https://reactjs.org/)[![Node](https://camo.githubusercontent.com/7d7b100e379663ee40a20989e6c61737e6396c1dafc3a7c6d2ada8d4447eb0e4/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652e6a732d3644413535463f7374796c653d666f722d7468652d6261646765266c6f676f3d6e6f64652e6a73266c6f676f436f6c6f723d7768697465)](https://nodejs.org/en/)[![Redux](https://camo.githubusercontent.com/9a7c7ebbabb2096c0ad0cac6f64bc9fe93f4954a3ae3f51d6f3e076ba462aab1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f72656475782d2532333539336438382e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d7265647578266c6f676f436f6c6f723d7768697465)](https://redux.js.org/)[![Socket.io](https://camo.githubusercontent.com/12f99969bfd98dd3c28625efb60232d5cbad3bc130063851ec04b4270369c633/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f536f636b65742e696f2d626c61636b3f7374796c653d666f722d7468652d6261646765266c6f676f3d736f636b65742e696f266261646765436f6c6f723d303130313031)](https://socket.io/)


## Features

- Realtime synced code editor (single cursor)
- Online compiler, currently supports 7 languages
- (C++, Java, Python, JavaScript, Go, C, PHP)
- Synced whiteboard for annotation 
- Group video/audio call 
- Chat messaging
- Code, Input and Chat history are persisted using MongoDB

##### Make sure app is running on `HTTPS` only and camera/mic permission is granted, for video/audio call to work.


## Installation

Codewired requires [Node.js](https://nodejs.org/) to run.
Install the dependencies and devDependencies and start the server and client.


## Environment vars

| Key                  | Value                                                               |
|----------------------|---------------------------------------------------------------------|
| APP_CERTIFICATE      | Agora app cert, [generate here](https://www.agora.io/en/)           |
| APP_ID               | Aroga id, [generate here](https://www.agora.io/en/)                 |
| MONGO_URI            | MongoDB [Atlas](https://www.mongodb.com/cloud/atlas/register)/local |
| NODE_ENV             | `dev`, `prod`                                                       |
| REACT_APP_AGORA_ID   | Agora id                                                            |
| REACT_APP_API_URL    | server endpoint with port                                           |
| REACT_APP_ENV        | `dev`, `prod`                                                       |
| SKIP_PREFLIGHT_CHECK | true                                                                |


