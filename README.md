# jdi
Just Do It - Online text pasting system using node.js

How to use:
- setup mongodb
- use command: node server.js

current route usage:

- localhost:3000/ -> redirect to /login
- localhost:3000/login -> authenticate page
- localhost:3000/add/(:link) ->  able to change detail, link name
- localhost:3000/(:link) -> able to show the note somehow i.e. localhost:3000/abcdefgh

link name need 7 characters or more to be added. 
If you input less than that, the link will be generated with 6 characters.
If it is repeated, you have to submit again.