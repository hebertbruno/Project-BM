# Unique Kangaroo Frontend

### Coding

#### Commits
Commits to this repository should follow the
[conventional commits](https://conventionalcommits.org/) convention. Specially
the angular convention.

#### Workflow

Code in the `master` branch is code ready to production, the `dev` branch is a
buffer of code to be tested before it's ready to be merged into `master`.

Production deploys need to create a release first. But the staging environment
can be used to test `dev` code.

This project has a custom javascript linter. Make sure your code is passing
the project's linter. Before pushing new code. It can be done by using a linter
plugin in your text editor or by running the `lint` script in `package.json`.

To code, you should get a branch from the `dev` (make sure it's updated with
the `master` branch), and then make a pull request back into the `dev` branch.
If possible request for a reviewer.

Hotfixes can be made directly into `master` branch. But still need to generate
a new release before deploys.

#### Deploys

To deploy a production image you should:

1. make sure the changes are working
2. merge `dev` into `master`, or commit hotfixes in `master`
3. update the version in `package.json`
4. update `CHANGELOG.md` with the `changelog` script
5. commit `CHANGELOG.md` and `package.json`
5. create a tag `v<version>`, where `<version>` is the new version
6. push changes into `master`, and also push the new tag
7. rebase `dev` with `master`, and push it too
8. run `make deploy VERSION=<version>`


### Requirements

You will need to install [docker](https://www.docker.com/community-edition),
and you will also need an env file with environment variables called `dev.env`.
This file should contain the following variables:

- **PORT**: the app will listen to this port
- **MONGO_URL**: the mongo url connection
- **NODE_ENV**: e.g., `production` or `development`
- **API_HOST**: the host address and port of the api
- **API_USER**: user used for the api authentication, i.e., if the requester
  will be authorized to access the unique kangaroo api
- **API_PASSWORD**: password for the user

Example `dev.env` file:

```
NODE_ENV=development
MONGO_URL=mongodb://mongofront/kangaroo
PORT=9999
API_HOST=http://api:7777
API_USER=unique-kangaroo-front
API_PASSWORD=244466666
```

### Local development

#### Recommended environment

I recommend using [atom](https://atom.io/) editor with the plugins

- [eslint](https://atom.io/packages/linter-eslint): this works with the
  `.eslintrc` file in the project
- [jsonlint](https://atom.io/packages/linter-jsonlint)


#### Running the code

To make the initial setup run (this only needs to run **once**):

```
$ make bootstrap
```

After the bootstrap is done, you can always run the api with:

```
$ make run
```

It should build the apis's docker image, and run the mongo and the api services.
After `docker-compose` finishes initializing the service the api will be
accessible in the `localhost:<PORT>` address.

Any changes made locally will reflect in the docker container automatically.

There are more functionalities in the `makefile`, you can check it out.
