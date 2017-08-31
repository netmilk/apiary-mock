Feature: CLI - Apiary Mock Stop

  Background:

  Given I have a following API description document saved in "apiary.apib":
  """
  
  """
  And I run "apiary-mock start"

Scenario: All HTTP calls valid against the API Description document
  Given I make following "valid" call to the server:
  """
  POST /baloons HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json

  {"color": "red"}
  """

  And I make following "valid" call to the server:
  """
  GET /baloons HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json
  """

  When I run "mock stop"
  Then the exit code should be "0"
  And I see text "passed" in the console
  And I see the path to the HTML report in the console

Scenario: Some calls invalid
  Given I make following "invalid" call to the server:
  """
  POST /baloons HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json

  {"colour": "red"}
  """

  And I make following "valid" call to the server:
  """
  GET /baloons HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json
  """
  When I run "apiary-mock stop"
  Then the exit code should be "1"
  And I see text "failed" in the console
  And I see the path to the HTML report in the console


Scenario: Some calls undocumented
  Given I make following "valid" call to the server:
  """
  GET /baloons HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json
  """

  And I make following "undocumented" call to the server:
  """
  PUT /needle HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json
  {"balloonId": "1"}
  """
  When I run "mock stop"
  Then the exit code is "2"
  And I see text "undocumented" in the console


Scenario: No Calls
  When I run "mock stop"
  Then the exit code is "3"
  And I see text "no calls" in the console
