# First stage: compile things.
FROM node:12 AS build
WORKDIR /usr/src/app

# (Install OS dependencies; include -dev packages if needed.)

# Install the Javascript dependencies, including all devDependencies.
COPY package.json .
RUN npm install

# Copy the rest of the application in and build it.
COPY . .
# RUN npm build
RUN npx tsc -p ./tsconfig.json

# Now /usr/src/app/lib has the built files.

# Second stage: run things.
FROM node:12
WORKDIR /usr/src/app

# (Install OS dependencies; just libraries.)

# Install the Javascript dependencies, only runtime libraries.
COPY package.json .
RUN npm install --production
RUN npm install pm2 -g

# Copy the dist tree from the first stage.
COPY --from=build /usr/src/app/lib /usr/src/app/lib

# Create the data location in the app folder
RUN mkdir -p /usr/src/app/data

# Run the built application when the container starts.
EXPOSE 13338
CMD ["pm2-runtime","./lib/src/index.js"]
