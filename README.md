# Apiary mock CLI wrapper

Very WIP TODO:
- Code coverage
- CI
- Cucumber to the test command
- Start
  - Fetching
  - Session saving
  - Session checking
  - Exit status streamlining
- Stop
  - Session retrieving
  - Session destroying
  - Exit status streamlining
- Cucumber HTTP parsing
- After cucumber cleanup
- Readme gardening

Test your API clients aginst the API Blueprint or Swagger/OAS based Apiary HTTP mock locally and in *continuous integration.

Mock validates the requests sent from your client and breaks the build in case of breaking the API contract.

## Requirements

- Node.js > 4 
- Apiary account credentils
- Apiary API key
- Public Apiary API project
- Apiary CLI (`gem install apiaryio`)

## Installation

```
$ npm install -g apiary-mock
$ apiary-mock init
Apiary user name:
Apiary password:
Apiary API key:
Apiary API project:
```

## Usage

'''
$ apiary-mock start
Mock started at: http://xyz.apiary-mock.com
$ <your integration tests here>
$ apiary-mock stop --allow-undocumented
1 passed
0 failed
1 undocumented
See report /tmp/report-xyz.html
$ echo $?
0
'''


Apiary mock session found, run 'apiary-mock stop' to release it

.apiarymocksession.yml

'''
api-project: domain
cookies:
'''




