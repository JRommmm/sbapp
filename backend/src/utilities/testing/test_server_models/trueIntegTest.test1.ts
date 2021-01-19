const { server } = require('../../index');
const gql = require('graphql-tag');

//const { startTestServer } = require('./testServer')
import {startTestServer} from './trueIntegTest_S'

const { execute, toPromise } = require('apollo-link');

const testTypeDefs = gql`mutation createUser($newusername: String!, $newpassword: String!) {
    createUser(username: $newusername, password: $newpassword)  {
      username
    }
  }`;

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }`

const CREATEFOLDER = gql`
  mutation addFolder($title: String!) {
    addFolder(title: $title)  {
      title
    }
  }
`

describe('Server - e2e', () => {
  let stop, graphql;

  beforeEach(async () => {
    const testServer = await startTestServer(server);
    stop = testServer.stop;
    graphql = testServer.graphql;
  });

  afterEach(() => stop());

  it('e2e init test', async () => {
    const res = await toPromise(
      graphql({
        query: testTypeDefs,
        variables: { newusername: "99999",
        newpassword: "12345" },
      }),
    );

    expect(res).toMatchSnapshot();
  });

/*
  it('gets a single launch', async () => {
    const res = await toPromise(
      graphql({ query: GET_LAUNCH, variables: { id: 30 } }),
    );

    expect(res).toMatchSnapshot();
  });
  */
});