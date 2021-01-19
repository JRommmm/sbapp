export{}
const { createTestClient } = require('apollo-server-testing');
const gql = require('graphql-tag');
// our first file that exports the function that creates a new apollo server
//const createApolloServer = require('./testClient');

const { testServer } = require('../../index');
//import { graphql } from 'graphql';
//const gql = require('graphql-tag');

//const { startTestServer } = require('./testServer')
import {startTestServer} from './structuredIntegration'


const { execute, toPromise } = require('apollo-link');


describe('Server - e2e', () => {
    let stop, graphql;
    
    beforeEach(async () => {
        console.log("before each 1");
        
        const server = await startTestServer(testServer);
        stop = server.stop;
        graphql = server.graphql


      
      console.log("before each 2");
 
      /* 
      /causes Error: listen EADDRINUSE: address already in use :::4000 error
      //maybe because index has to init a server?
      testServer.listen().then(({ url }) => {
        console.log(`Test server ready at ${url}`)
      })
      */

      console.log("before each 3");
      //const { mutate } = await createTestClient(testServer);
      console.log("before each 4");
      //stop = testServer.close();
      //stop2 = mutate.stop
      //graphql = testServer.graphql;
    });
  
    afterEach(() => stop())
    //stop2()
    ;
  
    it('structured auth test', async () => {
/*
        const testServer = await createApolloServer();
        const { mutate } = await createTestClient(createApolloServer());
        stop = testServer.stop;

        const CREATEFOLDER = `
        mutation addFolder($title: String!) {
          addFolder(title: $title)  {
            title
          }
        }
      `;
      
        // act
        const response = await mutate({ mutation: CREATEFOLDER, variables: { title: "99999" } });
        
        stop()
        // assert

        */
        //expect(response).toMatchSnapshot();
        //expect(1).toEqual(1);


        const CREATEFOLDER = gql`
        mutation addFolder($title: String!) {
          addFolder(title: $title)  {
            title
          }
        }
      `;
        const res = await toPromise(
            graphql({
              query: CREATEFOLDER,
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
