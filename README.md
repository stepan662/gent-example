### Gent - Library for easy business processes implementation

# Gent example project

This is gent example project, it uses [gent-core](https://github.com/stepan662/gent/tree/master/gent-core) and [gent-diagram](https://github.com/stepan662/gent/tree/master/gent-diagram) packages to demonstrate how to use them.

## Basic setup

### Prerequisites:

- `node.js` installed locally
- `yarn` installed locally

### Instructions:

- Clone this repo
- Start server in `/process` folder
  - `yarn install`
  - `yarn server:local` to start on port 8080
- Start frontend in `/frontend` folder
  - `yarn install`
  - `yarn dev` to start on port 3000
- Open browser on `http://localhost:3000`

This setup will start server in development mode, with data stored in memory. Data will be erased with every server restart.

## Setup with mongo db

If you want to use persistent storage, you can use prepared demo with mongodb.

In `/process` folder:

- Store mongo access url into `.env` (check `.env-sample` for exact format) and make sure db instance is accessible.

- Run `yarn mongo:init` to create collections needed for processes.

- Run `yarn server:mongo` instead of `yarn server:local`
