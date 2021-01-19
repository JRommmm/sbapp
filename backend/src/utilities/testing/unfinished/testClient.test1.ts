// attempting to use creatTestClient with authIntegTest_S

export{}
const { createTestClient } = require('apollo-server-testing');

// our first file that exports the function that creates a new apollo server
const createApolloServer = require('./testClient');

test('read a list of books name', async () => {
  // create a new instance of our server (not listening on any port)
  const server = createApolloServer();

  // apollo-server-testing provides a query function
  // in order to execute graphql queries on that server
  const { mutate } = createTestClient(server);

  // graphl query
  const CREATEFOLDER = `
  mutation addFolder($title: String!) {
    addFolder(title: $title)  {
      title
    }
  }
`;

  // act
  const response = await mutate({ mutation: CREATEFOLDER, variables: { title: "99999" } });

  // assert
  expect(response).toMatchSnapshot();
});

/*
test('read a list of books name', async () => {
  expect(1).toEqual(1);
})
*/