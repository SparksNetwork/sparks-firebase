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

#### sparks-cyclejs

To configure a local copy of sparks-cyclejs to point to your development project...

Create a `dev-bd.env` OUTSIDE of the cloned project.  This will have secure credentials that you do NOT want to accidentally commit and share with the world.  Get the correct FIREBASE_API_KEY values from the firebase project console: use the Gear menu next to Overview, Project Settings, Web API Key. Then make a file like:

```
export FIREBASE_DATABASE_URL=https://sparks-development-bd.firebaseio.com
export FIREBASE_AUTH_DOMAIN=sparks-devevelopment-bd.firebaseapp.com
export FIREBASE_API_KEY={FROM FIREBASE PROJECT CONSOLE}

# Webpack
export BUILD_ENV=development
export PORT=4000
```

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

