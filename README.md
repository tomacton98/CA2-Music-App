
## Installation Instructions

Open the root directory in a terminal (Git Bash) and the backend directory in a separate terminal window

In the ```/backend``` directory run the following to install and run the backend

- ```npm install```
- ```npm run watch```

In the root directory run the following to install and run the frontend

- ```npm install```
- ```npm start```

Go to ```http://localhost:4000/``` to test the backend (use a REST Client)

In Chrome, go to ```http://localhost:3000/``` to test the frontend

With the above setup you will be connected to the default MongoDB cluster on Atlas. To connect to your own cluster, modify the ```ATLAS_URI``` URI in ```/backend/.env``` to your cluster's URI
