Feature: CLI - Apiary Mock Start

Background:
  Given I have a following API description document saved in "apiary.apib":
  """
  # My API

  # GET /hello

  + Response 200 (text/plain)

          Hello world

  """
  And I push it to Apiary to domain "mockcislot1"
@wip
Scenario: No existing session
  When I run "apiary-mock start mockcislot1"
  Then the exit code is "0"
  And I see the mock URL in the console
  And the session file ".apiary-mock" was saved

Scenario: Session already exists
  When I run "apiary-mock start"
  And I run "apiary-mock start"
  Then the exit code is  "4"
  And I see text "session exists" in the console
  And I see text "apiary-mock stop" in the console
  And I see the mock URL in the console
