const { testServer } = require('../../index');
const gql = require('graphql-tag');

//const { startTestServer } = require('./testServer')
import {startTestServer} from './authIntegTest_Server'

const { execute, toPromise } = require('apollo-link');


const CREATEFOLDER = gql`
  mutation addFolder($title: String!) {
    addFolder(title: $title)  {
      title
    }
  }
`

describe('Basic Folder Functions - integration tests', () => {
  let stop, graphql;

  beforeEach(async () => {
    const server = await startTestServer(testServer);
    stop = server.stop;
    graphql = server.graphql;
  });

  afterEach(() => stop());
  afterAll(() => stop())

  it('Create Folder - 1', async () => {
    const res = await toPromise(
      graphql({
        query: CREATEFOLDER,
        variables: { title: "99999" },
      }),
    );

    expect(res).toMatchSnapshot();
  });

  it('Create Folder - 2 (repeat)', async () => {
    const res = await toPromise(
      graphql({
        query: CREATEFOLDER,
        variables: { title: "99998" },
      }),
    );

    expect(res).toMatchSnapshot();
  });

});