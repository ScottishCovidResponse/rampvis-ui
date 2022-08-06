FROM node:16.14.0 

# set working directory
RUN mkdir -p /usr/src/ui
WORKDIR /usr/src/ui

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/ui/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/ui/
COPY yarn.lock /usr/src/ui/
RUN yarn install --frozen-lockfile

# add app
COPY . /usr/src/app

# start app
CMD "yarn" "dev"