Test Models & respective servers
- record of models used, test type, and descriptions
- this is dead code, doesn't run

eg. trueIntegTest_S (server) & trueIntegTest.test1 (test) (note- .test1 ensures the test doesnt run)

------------------Descriptions------------------

--Test Models:

authIntegTest
- real integration test (with 1 exception: mocked context) with authentication
- limitations: context is mocked

trueIntegTest
- real integration test, tests actual server
- limitations: can't authenticate (need workaround)



--Reference models:

simpleQuery
- simpliest form of Apollo Server test:
    - resolvers, schema and data all internally defined in the test
- limitations: cant test the real code/modules