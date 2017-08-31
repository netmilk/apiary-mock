Feature: CLI - Apiary Mock Start

Background:
  Given I have a following API description document saved in "apiary.apib":
  """
  # My API

  # POST /hello  
  
  + Request (application/json)

          {"color": "green"}

  + Response 200 (text/plain)

          Hello green world!
  """
  And I have exported the APIARY_API_KEY environment variable
  And I run "apiary publish --api-name mockcislot1 --path apiary.apib"


Scenario: No existing session
  When I run "apiary-mock start mockcislot1"
  Then the exit code is "0"
  And I can see the mock URL in the console
  But I can't see text "session exists" in the console

Scenario: Session already exists
  When I run "apiary-mock start mockcislot1"
  And I run "apiary-mock start mockcislot1"
  Then the exit code is "4"
  And I can see text "already exists" in the console
  And I can see the mock URL in the console

