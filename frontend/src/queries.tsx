import { gql  } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const CREATEUSER = gql`
  mutation createUser($newusername: String!, $newpassword: String!) {
    createUser(username: $newusername, password: $newpassword)  {
      username
    }
  }
`

export const CREATEFOLDER = gql`
  mutation addFolder($title: String!) {
    addFolder(title: $title)  {
      title
    }
  }
`

export const GETFOLDERS = gql`
  query {
    allFolders{
      title
      id
      user{
        username
      }
      rootFolder
      generation
      folders{
        title
        id
        user{
          username
        }
        rootFolder
        generation
        folders{
          title
          id
          user{
            username
          }
          rootFolder
          generation
          folders{
            title
            id
            user{
              username
            }
            rootFolder
            generation
            folders{
              title
              id
              user{
                username
              }
              rootFolder
              generation
            }
          }
        }
      }
    }
  }
`

//when we get folders, we should be able to get ids  (among other information)
export const DELETEFOLDER = gql`
mutation deleteFolder($id: String!) {
  deleteFolder(id: $id)  {
    id
  }
}
`

export const UPDATEFOLDER = gql`
mutation editFolderTitle($id: String!, $title: String!) {
  editFolderTitle(id: $id, title: $title)  {
    id
  }
}
`

export const MOVEFOLDER = gql`
mutation moveFolder($parentFolder: String!, $folder: String!){
  moveFolder(parentFolder: $parentFolder, folder: $folder) {
    id
  }
}
`