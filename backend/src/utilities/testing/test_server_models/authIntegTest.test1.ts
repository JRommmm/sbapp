const { testServer } = require('../../index');
const gql = require('graphql-tag');

//const { startTestServer } = require('./testServer')
import {startTestServer} from './authIntegTest_S'

const { execute, toPromise } = require('apollo-link');


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
    const server = await startTestServer(testServer);
    stop = server.stop;
    graphql = server.graphql;
  });

  afterEach(() => stop());

  it('e2e init test', async () => {
    const res = await toPromise(
      graphql({
        query: CREATEFOLDER,
        variables: { title: "99999" },
      }),
    );

    expect(res).toMatchSnapshot();
  });

  it('e2e init test 2', async () => {
    const res = await toPromise(
      graphql({
        query: CREATEFOLDER,
        variables: { title: "99998" },
      }),
    );

    expect(res).toMatchSnapshot();
  });

});