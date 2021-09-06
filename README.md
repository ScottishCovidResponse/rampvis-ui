# About

RAMPVIS user interface implemented in React.

## Getting Started

### Prerequisites

Please make sure you have [Node.js](https://nodejs.org) (LTS version) and [Yarn](https://www.npmjs.com/package/yarn) (`npm install --global yarn`).

```sh
node --version
## should output ≥ 14.17

yarn --version
## should output ≥ 1.22
```

### Start Development Instance

Install the dependencies.

```sh
yarn install
```

Run the app in development mode using production APIs (you don’t need to start the development instances of the API endpoints).

```sh
yarn dev
```

While the web server is running, you can open [http://localhost:5000](http://localhost:5000) in your browser to view the app.
To stop the server, press `CTRL+C` in the terminal.

---

If you want to use local API endpoints instead of the default remote ones, create a new file called `.env.local` with the following contents:

```ini
NEXT_PUBLIC_API_JS=http://localhost:2000/api/v1
NEXT_PUBLIC_API_PY=http://localhost:3000/stat/v1
```

The URLs may differ from the examples above depending on your server settings.

Note that you need to restart the server (`yarn dev`) for the changes to take effect.
See [Next.js docs → Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) for more info.

## References

- Bootstrapped with [Next.js](https://github.com/vercel/next.js)
- Using [React material dashboard style](https://material-ui.com)
