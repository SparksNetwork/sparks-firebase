# sparks-firebase

New backend services for the sparks.network.

# Overview

This repo contains code for two environments:

* A Google App Engine server that runs FirebaseQueue to handle client commands (omg replace this soon plskthx)
* A Firebase Functions file that contains handlers that get hooked up to http URLs, Google PubSub Topics, and Firebase Database writes.

# Development Setup

To start hacking on this, follow these instructions.

## Install Global Requirements

you need this stuff on your dev machine:

* Google Cloud SDK: https://cloud.google.com/sdk/docs/#install_the_latest_cloud_tools_version_cloudsdk_current_version
* Firebase CLI: `npm install -g firebase-tools`

## Clone & Install Repo

Check out the code!  Make sure you create a working branch before you start doing anything to the codebase.

`$ git clone ... && cd ...`

Most of what you'd expect in a project root actually lives in the `/functions` directory.
That's where the `package.json` lives.

```
cd functions
npm install
```

## Firebase Project

To use the backend services in a separate development environment, you need to have a Firebase Project.
Note that creating a Google Cloud Project automatically creates a Firebase Project, and vice-versa.

### Create Firebase Project

Through the firebase web console https://console.firebase.google.com, create a new project as a personal dev environment.
Use your initials as an identifier.
Note that this also creates a google cloud project with the same name.

If your name was "Bob Dobbs", use "bd" as the identifier, so you would create:

`sparks-development-bd`

### Configure Authentication for Firebase Project

You also need to set up Authentication for the project:

```
Firebase Console > Authentication > Sign-in Method:
  Enable Google, Email/Password
  (dont enable Facebook as you have to get extra creds)
```

### Add Firebase CLI Shortcut

Finally, you need to update the repo's .firebaserc file to give you a shortcut to your new project.
Again, if your name is "Bob Dobbs" you would add a line like the last one shown here:

```
{
  "projects": {
    "default": "sparks-staging-v3", // STAGING
    "production": "sparks-production-3", // PRODUCTION
    "dev-jb": "sparks-development-jb" // JOE'S PROJECT
    "dev-bd": "sparks-development-bd" // <-- ADD THIS LINE
  }
}
```

### Select Firebase Project with CLI

Finally finally, you use the firebase CLI tool to point at your new project.
Once you do that, any `firebase` CLI commands will be run against your new project.

`$ firebase use dev-bd`

### Copy Firebase Functions Cloud Config

Really finally finally, you need to copy some cloud-based application settings over to your new project.
These are used by firebase-functions in lieu of `process.env` or other configuration methods.

`$ firebase functions:config:clone --from sparks-staging-v3`

You can see what those config settings are by using:

`$ firebase functions:config:get`

### Copy Staging/Production Database to your Firebase Project

If you do not have access to `production`, then use `default` instead to copy the staging database.
Again, this is assuming you are named "Bob Dobbs" and your Firebase Project shortcut name is `dev-bd`

```
$ firebase database:get / -P production > dump.json
$ cat dump.json | firebase database:set / -y -P dev-bd
```

Because windows is a bastard, you have to do:

```
$ firebase database:get /// -P production > dump.json
$ firebase database:set /// ./dump.json -y -P dev-bd
```

## GCloud Project

Creating a Firebase Project automagically gives you a GCloud Project with the same name.
However you still need to tell the GCloud CLI about this new project.

### Create GCloud CLI Project Config

The `gcloud config` commands let you describe different project settings that the `gcloud` tool will use when you run it to do things.

WARNING: If you have a `FIREBASE_TOKEN` env var set, make sure you `unset FIREBASE_TOKEN` before you do anything with the glcoud tool.  The presence of a `FIREBASE_TOKEN` env var overrides any `gcloud auth` you do.  Many bothans died to bring us this information. [http://i.imgur.com/KPgzfpQ.jpg]

`$ gcloud config configurations create dev-bd`

Should create it for you, and then

`$ gcloud init`

Will ask you a few questions and then set the correct values in your newly created gcloud config.

* Pick configuration to use: 1 (re-initialize)
* Choose the account: Pick your @sparks.network account
* Pick cloud project: Pick the sparks-development-** project you created

`$ gcloud config configurations list`

Will confirm that your new project exists and it is the active project.

# Running Services

To have a fully functioning backend, you need to have the Firebase Functions deployed and a Google App Engine server running.

* Firebase Functions handle a variety of cron jobs, pubsub message processing, and database triggers.
* The GAE Server runs a FirebaseQueue and processes commands from the client.

## Running Firebase Functions

To test 'live' execution, you need to compile and deploy the functions, from the `/functions` directory:
There is no way to locally run the Firebase Functions (this is under development by Firebase, keep an eye out).
Keep in mind if you don't have a GAE Server running (either locally in in the cloud), then half the app isn't going to work.

`$ npm run deploy:functions`

This will compile the src/*.ts to dist/ and deploy the functions to your currently selected firebase project.

## Running GAE Server

WARNING: If you `npm start` and you also have a GAE server deployed in the cloud, you are going to be in a world of pain.
Both your local server and the cloud server will process the same firebase queue,
and you won't realize that's why you're not seeing half the log messages you expect to see.

### Locally

You can run a 'live' server on your local machine.  It's just node!
Again, if you haven't deployed the Firebase Functions, then half the app isn't going to work.

`$ npm run start:dev`

### In Cloud

TODO: how to deploy GAE to cloud

TODO: instruct how to turn off the fucking GAE server for your project, or make sure the dev doesn't deploy a GAE server and just runs it locally

# Project Layout

Most everything lives in `/functions` because `firebase-functions` will only let me deploy from that folder and everything below it.

## /functions layout

Within `/functions` is what you would expect from a normal javascript/typescript project:

Because firebase-functions requires us to deploy from a /functions directory with a package.json and an index.js,
for all intents and purposes, this is the root of the project.  Do all your `npm`ing and `gcloud`ing and `firebase`ing from here.

```
/functions
  index.js:
    bootstrapper for firebase-functions that re-exports everything from /dist/index.js
  package.json:
    used by firebase-functions and GAE to load deps in cloud and locally
  tsconfig.json:
    used in build process to compile typescript
  /src:
    source typescript
  /dist:
    distribution javascript
  /node_modules:
    note this is not in the root of the project
```

## /src layout

```
/functions/src
  index.ts: TODO: rename to functions.ts
    the file that firebase-functions uses to deploy its bloody functions
    simply re-exports the functions from /domain/FOO/functions
  serve.ts:
    the target of `npm start` that google app engine uses to start a node flexible environment server
    or by you to launch a GAE Server locally
    launches a FirebaseCommandQueue to watch for client commands
  workers.ts:
    re-exports all the FirebaseCommandQueue workers from the domains
  /domain:
    contains vertical slices of functionality for different parts of the domain
  /bin:
    command-line utilities for developers and support engineers
  /lib: things we ought to move into separate npm projects but havent yet
    EVERY BIT OF CODE IN HERE SHOULD BE INDEPENDENT OF PROJECT
```

## /domain slice layout
```
/functions/src/domain/$FOO
  handlers.ts
    Things that respond as ff or fbq wokers
      FooBarHandler
  functions.ts
    Exported firebase-functions using handlers
  workers.ts
    Exported fbq workers using handlers
  models.ts:
    Foos exported FirebaseCollection object
      read: Promise-based methods that return collections of objects
      write: Promise-based methods that let you do things to collection members
  topics.ts: 
    BarMessage interface for topic payload
    BarTopic exported Topic object
      read: give firebase-functions a name to listen to
      write: give anything a pubsub to publish to
```

# Example Implementations

## /domain/sms/functions.ts

```
import * as functions from 'firebase-functions'
import { config } from '../config'
import { smsRequestTopic } from './topics'
import { send } from './service'

export const sendSMS =
  functions.pubsub.topic(smsRequestTopic.name)
    .onPublish(pubSubContext(sendSMSHandler))
```

# DOCS TODO --

## switching projects

why, how

### deploying to development

### deploying to production

### FIX: local env

Get credentials.json from gcloud console
Only need: GOOGLE_APPLICATION_CREDENTIALS
Any time you need those vars, just `$ source {PATH TO YOUR FILE}`

#### FIX: sparks-cyclejs

To configure a local copy of sparks-cyclejs to point to your development project...

Create a `dev-bd.env` OUTSIDE of the cloned project.  This will have secure credentials that you do NOT want to accidentally commit and share with the world.  Get the correct FIREBASE_API_KEY values from the firebase project console: use the Gear menu next to Overview, Project Settings, Web API Key. Then make a file like:

```
export
export FIREBASE_DATABASE_URL=https://sparks-development-bd.firebaseio.com
export FIREBASE_AUTH_DOMAIN=sparks-devevelopment-bd.firebaseapp.com
export FIREBASE_API_KEY={FROM FIREBASE PROJECT CONSOLE}

# Webpack
export BUILD_ENV=development
export PORT=4000
```
