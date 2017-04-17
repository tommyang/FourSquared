# Foursquared

[![Build Status](https://travis-ci.com/tommyang/FourSquared.svg?token=NysWAkA5dUSZU1rvMZtV&branch=master)](https://travis-ci.com/tommyang/FourSquared)
[![Code Climate](https://codeclimate.com/repos/58f17aefc17c0d026600049c/badges/50bb01546d5d3dbdddf9/gpa.svg)](https://codeclimate.com/repos/58f17aefc17c0d026600049c/feed)

## Get Started
- Install [Node.js](https://nodejs.org/en/download/package-manager/) and [Yarn](https://yarnpkg.com/en/docs/install). 
  - Note the step to put this line in your shell profile `export PATH="$PATH:$(yarn global bin)"`. 
- Clone this repo
  - If you previously cloned this repo when it was under Henry's account, `git remote set-url origin git@github.com:tommyang/FourSquared.git`
- Install dependencies `$ yarn install`
- Install Gulp CLI: `$ yarn global add gulp-cli`. 
- Write tests in `/test`, preferrably with the naming convention `test-xxx.js`. See `test-foo.js` for an example. 
- Write code. See `foo.js` for an example. 
- Commit and push. Travis CI will lint the code using Gulp and plugins and run the test using Mocha. Test coverage information is tracked by Code Climate. 
- Check `#commits` Slack channel for Travis CI status report. 
