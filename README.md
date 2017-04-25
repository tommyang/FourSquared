# Foursquared

[![Build Status](https://travis-ci.com/tommyang/FourSquared.svg?token=NysWAkA5dUSZU1rvMZtV&branch=master)](https://travis-ci.com/tommyang/FourSquared)
[![Code Climate](https://codeclimate.com/repos/58f17aefc17c0d026600049c/badges/50bb01546d5d3dbdddf9/gpa.svg)](https://codeclimate.com/repos/58f17aefc17c0d026600049c/feed)

## Get Started
- Install [Node.js](https://nodejs.org/en/download/package-manager/) and [Yarn](https://yarnpkg.com/en/docs/install).
  - Note the step to put this line in your shell profile `export PATH="$PATH:$(yarn global bin)"`.
- Clone this repo
  - If you previously cloned this repo when it was under Henry's account, run `git remote set-url origin git@github.com:tommyang/FourSquared.git` if you use SSH or `git remote set-url origin https://github.com/tommyang/FourSquared.git` if you use HTTPS.
- Install local dependencies `$ yarn`
- Install global dependencies (only needed when running end-to-end tests locally): `$ yarn global add gulp-cli phantomjs`.
- Install [Selenium Standalone Server](http://www.seleniumhq.org/download/) (only needed when running end-to-end tests locally).
- Write tests in `/test`, preferrably with the naming convention `test-xxx.js` for unit tests and `e2e-xxx.js` for end-to-end tests. See `test-foo.js` and `e2e-password.js` for examples.
- Write code. See `foo.js` for an example.
- To start the server locally, run `$ yarn start` and got to `http://localhost:3000`.
- To run the tests locally, make sure the server is not running, start Selenium Standalone Server, and run `$ yarn test`.
    - To run unit tests only, run `$ yarn unit`.
    - To run end-to-end tests only, make sure the server is not running, start Selenium Standalone Server, and run `$ yarn e2e`.
- Commit and push. Travis CI will run the tests using Mocha. Test coverage information is tracked by Code Climate. If tests return successfully, Travis will deploy this version to Heroku automatically.
  - If you are pushing commits with just "cosmetic changes" (such as updating this README file), include `[ci skip]` in the commit message to skip Travis CI.
- Check `#commits` Slack channel for Travis CI status report.
