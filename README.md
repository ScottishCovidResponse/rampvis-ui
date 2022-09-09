# About

RAMPVIS user interface implemented in React.

## Getting Started

- This is tested in Ubuntu 22.04 and WSL2
- Start the backend server; please visit https://github.com/ScottishCovidResponse/rampvis-api

### Stop & Clean (optional)

Following commands will stop the container and and clean the image.

```sh
docker-compose stop
docker-compose rm
docker rmi rampvis-ui-rampvis-ui
```

### Start Development Instance in Container

Start the server

```bash
docker-compose up -d

# see the log to check if the server has started
docker logs rampvis-ui
```

Navigate to [localhost:3000](localhost:3000) to open the UI.

### Start Development Instance Locally

Please make sure you have [Node.js](https://nodejs.org) (LTS version) and [Yarn](https://www.npmjs.com/package/yarn) (`npm install --global yarn`).

```sh
node --version
## should output ≥ 14.17

yarn --version
## should output ≥ 1.22
```

Install the dependencies and run the app in development mode using production APIs (you don’t need to start the development instances of the API endpoints).

```sh
yarn install
yarn dev
```

While the web server is running, you can open [http://localhost:3000](http://localhost:3000) in your browser to view the app.
To stop the server, press `CTRL+C` in the terminal.

If you want to use remote API endpoints instead of the local ones remove the `.env.local`.

---

The URLs may differ from the examples above depending on your server settings.

Note that you need to restart the server (`yarn dev`) for the changes to take effect.
See [Next.js docs → Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) for more info.

## Local production build

1.  Build the app

    ```sh
    yarn build
    ```

1.  Make sure that port 3000 is not used and launch a simple HTTP server for the just-created `out` directory.

    ```sh
    npx serve out
    ```

1.  Navigate to http://localhost:3000 in your browser.

## Deployment

Running `yarn build` produces a [static HTML export](https://nextjs.org/docs/advanced-features/static-html-export), which means that the app can be served without Node.js.
One of the options is to use [nginx](https://www.nginx.com) with the following example config: [`nginx.conf`](nginx.conf).
It maps URLs like `/my/page` to files like `/my/page.html`, removes trailing slashes and applies several output-specific optimisations.
As a result, production URLs match the ones we see during `yarn dev` and `npx serve out`.

It is possible to locally test `nginx.conf` after running `yarn build`.
This requires [Docker](https://www.docker.com/products/docker-desktop).

1.  Build the container (see [Dockerfile](./Dockerfile)):

    ```sh
    docker build . --tag=rampvis-ui:local
    ```

1.  Make sure that port 3000 is not used and start the container:

    ```sh
    docker run -p 3000:80 rampvis-ui:local
    ```

1.  Navigate to http://localhost:3000 in your browser.

## References

- Bootstrapped with [Next.js](https://github.com/vercel/next.js)
- Using [React MUI dashboard style](https://mui.com)

## Earlier Prototypes

- [v.0.1 - Angular](https://github.com/ScottishCovidResponse/rampvis-ui-0.1)
- [v.0.2 - Plain HTML/CSS](https://github.com/ScottishCovidResponse/rampvis-ui-0.2.git)
