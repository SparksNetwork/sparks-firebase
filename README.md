# sparks-firebase

## development

### initial setup

Gotta do this to get the code and tools.

#### getting ze code

check out the code
`$ git clone ...`

#### installing global requirements

you need this stuff on your dev machine:

`$ npm install -g firebase-functions gcloud`

### new project

create a new firebase project as a personal dev environment, use your initials as an identifier.
note that this also creates a google cloud project with the same name.
For Bob Dobbs, that would be:

`sparks-development-bd`

(what other things need to be turned on for dev... OAuth with google and/or firebase)

### configure your local to use a development project

Once you have a dev project set up, you need to tell your `gcloud` and `firebase` tools what projects you will be deploying to.

#### Firebase

edit the .firebaserc that comes with the repo to add your project...

```
{
  "projects": {
    "default": "sparks-staging-v3",
    "production": "sparks-production-3",
    "dev-bd": "sparks-development-vd"
  }
}
```

use the CLI to make it the active project.  any commands issued through `firebase` CLI will use this project until you `use` another one.

`$ firebase use dev-bd`

Clone the config settings from either production or staging, note this is the full firebase project name, not the alias from `.firebaserc`.

`$ firebase functions:config:clone --from sparks-production-3`

#### GCloud

The `gcloud config` commands let you describe different project settings that the `gcloud` tool will use when you run it to do things.

WARNING: If you have a `FIREBASE_TOKEN` env var set, make sure you `unset FIREBASE_TOKEN` before you do anything with the glcoud tool.  The presence of a `FIREBASE_TOKEN` env var overrides any `gcloud auth` you do.  Many bothans died to bring us this information. [http://i.imgur.com/KPgzfpQ.jpg]

`$ gcloud config configurations create dev-bd`

Should create it for you, and then

`$ gcloud config configurations list`

Will confirm that it exists and it is the active project.

`$ gcloud init`

Will ask you a few questions and then set the correct values in your newly created gcloud config.

Pick configuration to use: 1 (re-initialize)
Choose the account: Pick your @sparks.network account
Pick cloud project: Pick the sparks-development-** project you created

Any time you need those vars, just `$ source {PATH TO YOUR FILE}`

### copy the production database

`$ firebase database:get / -P production > dump.json`
`$ cat dump.json | firebase database:set / -y -P dev-bd`

## deployment

From the `./functions` directory:

`$ npm run deploy`

Will compile the src/*.ts to dist/ and deploy the functions to your currently selected firebase project.

### deploying to development

### deploying to production


#### sparks-cyclejs

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

# structure

Most everything lives in `/functions` because `firebase-functions` will only let me deploy from that folder and everything below it.

Within `/functions` is what you would expect from a normal javascript/typescript project:

a `package.json` is where all the npm stuff is defined
the `tsconfig.json` tells the typescript compiler what to do
of course the `/node_modules` is where npm installs things
`/src` contains the important shit
`/dest` is where it gets built to

# npm run

## start

Only runs the local appengine server, which is the thing that watches the firebase queue.

If you haven't deployed the `firebase-functions` then half the app isn't going to work.

WARNING: If you `npm start` and have a deployed google app engine server, you are going to be in a world of pain: both your local server and the GAE server will process the firebase queue, and half of the shit you try will work, and half of it won't.

TODO: instruct how to turn off the fucking GAE server for your project, or make sure the dev doesn't deploy a GAE server and just runs it locally

## deploy

Runs deploy:functions and deploy:gae

# project layout

```
  /
    index.ts: the file that firebase-functions uses to deploy its bloody functions
    serve.ts: the target of `npm start` that google app engine uses to start a node flexible environment server
    /domain
      /$FOO - some vertical slice of functionality
        handlers.ts
          Things that respond as ff or fbq wokers
            FooBarHandler
        functions.ts
          Exported firebase-functions using handlers
        workers.ts
          Exported fbq workers using handlers
        models.ts:
          Foos exported Collection object
            read: Promise-based methods that return collections of objects
            write: Promise-based methods that let you do things to collection members
        topics.ts: 
          BarMessage interface for topic payload
          BarTopic exported Topic object
            read: give firebase-functions a name to listen to
            write: give anything a pubsub to publish to
    /lib: things we ought to move into separate npm projects but havent yet
      EERY BIT OF CODE IN HERE SHOULD BE INDEPENDENT OF PROJECT
```

## /index.ts :: firebase-functions
export * from './domain/profiles/functions'
export * from './domain/sms/functions'
...

## /index.ts :: firebase-functions
import * as functions from 'firebase-functions'
import { fooHandler } from './domain/profiles/handlers'
import { barTopic } from './domain/profiles/topics'
import { bazHandler } from './domain/sms/handlers'
import { bozHandler, bozBizHandler } from './domain/boz/handlers'
import { Bozs } from './domain/boz/models'
...

export const fooFunction = functions.https
  .onRequest('/foo', httpHandler(fooHandler))

export const bazFunction = functions.pubsub
  .topic(barTopic.name).onPublish(pubsubHandler(bazHandler))

export const bozFunction = functions.database
  .ref('/${Bozs.key}/{key}').onWrite(databaseHandler(bozBizHandler))
...

## /serve.ts :: npm start / gae
import { database } from 'environment'
import { fooHandler } from './domain/profiles/handlers'
import { barHandler } from './domain/projects/handlers'
...

FBQ(database.child('!queue', handle([
  foo,
  bar,
  ...,
]))

FBQ(database.child('!queue', handle({
  'Foo.faz': workerHandler(fooHandler),
  'Bar.faf': workerHandler(barHandler),
  ...,
}))

## /domain/sms/service.ts

## /domain/sms/functions.ts
import * as functions from 'firebase-functions'
import { config } from '../config'
import { smsRequestTopic } from './topics'
import { send } from './service'

export const sendSMS =
  functions.pubsub.topic(smsRequestTopic.name)
    .onPublish(pubSubContext(sendSMSHandler))

### fs
/domain
  /sms
    topics.ts
    functions.ts
    models.ts
  /scheduled
  /opps
