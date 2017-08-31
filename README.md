# Apiary Mock CLI wrapper

> **DISCLAIMER:** This is not an official Apiary tool! Use it at your own risk. It might not work at all.
> This tool was created for the demonstration purposes of the contract driven API clients development only.

Use Apiary Mock programatically! Test API client requests aginst the API Blueprint or Swagger/OAS contract driven Apiary Validating HTTP mock in **continuous integration.**

Apiary Mock validates the requests sent from your client and breaks the build if the client breaks the contract.

## Requirements

- Node.js > 4 
- Public Apiary API project and its [name](https://help.apiary.io/faq/find-api-name/) e.g. `mockdemo11`

## Installation

```
$ npm install -g git+ssh://github.com/netmilk/apiary-mock
```

## Example

I'm developing API client for the integration with [API `mockdemo11` published in Apiary](http://docs.mockdemo11.apiary.io/). I want make sure I'm using the API as designed and documented. Often and automatically.

1. Start the mock.

  ```
  $ apiary-mock start mockdemo11
  Mock 'mockdemo11' created.
  Mock URL: http://private-anon-038e18312f-mockdemo11.apiary-mock.com
  ```

2. Develop the API client integration test suite.
  ```
  $ curl --include \
    --request POST \
    --header "Content-Type: application/json" \
    --data-binary "{\"color\": \"green\"}" \
    'https://private-038e18312f-mockdemo11.apiary-mock.com/hello'
  ```

3. Retrieve the validation status of all API reqeusts sent to mock.

  ```
  $ apiary-mock stop mockdemo11
  Contract validation passed. All API calls OK.
  Report URL: file:///local/path/to/mockdemo11.html
  $ echo $?
  0
  ```


## Usage

## `apiary-mock --help`
```
$ apiary-mock --help

  Usage: apiary-mock [options] [command]


  Commands:

    start <apiary-project-name>
    stop <apiary-project-name> 

  Options:

    -h, --help  output usage information
```


### `apiary-mock start <apiary-project-name>`

```
$ apiary-mock start <apiary-project-name>
Mock started at: http://xyz.apiary-mock.comk '<apiary-project-name>' created.
Mock URL: http://private-anon-a8a711d1bf-<apiary-project-name>.apiary-mock.com
```

See the [feature file](https://github.com/netmilk/apiary-mock/blob/master/features/mock-start.feature) for more details.

### `apiary-mock stop <apiary-project-name>`
```
$ apiary-mock-stop <apiary-project-name>
Contract validation passed. All API calls OK.
Report URL: file:///local/path/to/<apiary-project-name>.html
$ echo $?
0
```

See the [feature file](https://github.com/netmilk/apiary-mock/blob/master/features/mock-stop.feature) for more details.

## Use in Continuous Integration

The Mock URL isn't deterministic at this moment. It changes for every mock instance. You need to extract it from the actual session YAML file saved to `.apiary-mock-<apiary-project-name>` after `apiary-mock start`

```
$ cat .apiary-mock-<apiary-project-name> | grep '^url:' | awk '{print $2}' | tr -d "'"
http://private-anon-5a241cdc33-<apiary-project-name>.apiary-mock.com
```

## Travis CI example 
Beware! Very abstract and meta. Using [Dredd](https://github.com/apiaryio/dredd) as the API client. You should run your API client integration tests instead. At least Curl. lol :)

The possible Travis CI `.travis.yml` file could look like this: 
```
pre_install:
  - npm install -g dredd
  - npm install -g apiary-mock

before_script:
  - apiary-mock start <apiary-project-name>

script:
  - dredd http://docs.<apiary-project-name>.apiary.io/api-description-document `$(cat .apiary-mock-mockslot1 | grep '^url:' | awk '{print $2}' | tr -d "'" )`
  - apiary-mock stop <apiary-project-name>
```

The report in `apiary-mock-<apiary-project-name>.html` will end up being a local artifact in the build container. If you want to see it, you need to save it to the internet. See [Travis CI doc on artifacts](https://docs.travis-ci.com/user/uploading-artifacts/).

# Development

## Requirements

Apiary CLI and [Apiary API key](https://help.apiary.io/tools/apiary-cli/#generating-an-authentication-token)

```
$ gem install apiaryio
$ export APIARY_API_KEY=<apikey>
$ npm test
```

## BDD fs watching

Mocha
```
npm run watch-mocha
```

Cucumber
```
npm run watch-cucumber
```


## Cucumber suite debugging
```
$ export CUCUMBER_DEBUG=true
```
