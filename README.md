# Quizzes

[![CircleCI](https://circleci.com/gh/rage/quizzes/tree/master.svg?style=svg)](https://circleci.com/gh/rage/quizzes/tree/master)

To run locally

At the project root

```bash
nvm use
npm ci
```

To start the server:
```bash
cd packages/backend
nvm use
npm ci
npm run build
npm start
```

To start the server (V2):
```bash
cd packages/backendv2
nvm use
npm ci
npm run dev
```

To start the dashboard:

```bash
cd packages/dashboard
npm ci
npm start
```

To load widget in playground:
```bash
cd packages/moocfi-quizzes
npm ci
cd example
npm ci
npm start
```
