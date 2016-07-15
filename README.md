# jdi
Just Do It - Online text pasting system using node.js

How to use:
- setup mongodb
- use command: node server.js

current route:
localhost:3000/ -> redirect to /login
localhost:3000/login -> still bug, should be use to authenticate
localhost:3000/edit -> able to submit the note
localhost:3000/(:link) -> able to show the note somehow i.e. localhost:3000/abcdefgh
localhost:3000/link -> still unimplemented, it should be able to change the link name in the future
