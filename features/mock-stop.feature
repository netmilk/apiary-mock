@wip
Feature: CLI - Apiary Mock Stop

  Background:

  Given I have a following API description document saved in "apiary.apib":
  """
  # My Greetings API

  # POST /hello
  
  + Request (application/json)

          {"color": "green"}

  + Response 200 (text/plain)

          Hello green world!

  # POST /cheers

  + Request (application/json)

          {"name": "Adam"}

  + Response 200 (text/plain)

          Cheeeers Adam!

  """
  And I have exported the APIARY_API_KEY environment variable
  And I run "apiary publish --api-name mockcislot1 --path apiary.apib"
  And I run "apiary-mock start mockcislot1"

Scenario: All HTTP calls valid against the API Description document
  Given I make following "valid" HTTP request to the Mock URL:
  """
  POST /hello HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json
  Content-Type: application/json

  {"color": "green"}
  """

  And I make following "valid" HTTP request to the Mock URL:
  """
  POST /cheers HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json
  Content-Type: application/json

  {"name": "Adam"}
  """

  When I run "apiary-mock stop mockcislot1"
  Then the exit code is "0"
  And I can see text "passed" in the console
  And I can see the path to the HTML report in the console

  
Scenario: Some calls invalid
  Given I make following "invalid" HTTP request to the Mock URL:
  """
  POST /hello HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: text/plain
  Content-Type: application/json

  {"colour": "red"}
  """

  And I make following "valid" HTTP request to the Mock URL:
  """
  POST /cheers HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: text/plain
  Content-Type: application/json

  {"name": "Adam"}
  """
  When I run "apiary-mock stop mockcislot1"
  Then the exit code is "1"
  And I can see text "failed" in the console
  And I can see the path to the HTML report in the console

Scenario: Some calls undocumented
  Given I make following "valid" HTTP request to the Mock URL:
  """
  POST /baloons HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: text/plain
  Content-Type: application/json
  """

  And I make following "undocumented" HTTP request to the Mock URL:
  """
  PUT /hifive HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: text/plain
  Content-Type: application/json

  {"fingers": "5"}
  """
  When I run "apiary-mock stop mockcislot1"
  Then the exit code is "2"
  And I can see text "undocumented" in the console
  And I can see the path to the HTML report in the console


Scenario: No Calls
  When I run "apiary-mock stop mockcislot1"
  Then the exit code is "3"
  And I can see text "no API calls" in the console
  And I can see the path to the HTML report in the console
  
