export namespace Directory {

  export type NodeId = string

  export enum NodeType {
    folder = 'folder',
    file = 'file',
  }

  export interface Node {
    id: NodeId
    name: string
    /** Parent ID is Null when Node is the root */
    parentId: NodeId
    type: NodeType
    editedAt: EpochTimeStamp
    createdAt: EpochTimeStamp
    path: string
  }

  export interface FileMetadata extends Node {
    type: NodeType.file
  }

  export interface FolderMetadata extends Node {
    type: NodeType.folder
  }

  export interface FileContent {
    id: FileMetadata['id']
    content: string
    path: string
  }

  export type FileType = FileMetadata & FileContent
  export type FolderContent = (Directory.FileMetadata | Directory.FolderMetadata)[]

  // export const RootNode: FolderMetadata = {
  //   type: NodeType.folder,
  //   id: 'home',
  //   name: 'Home',
  //   parentId: 'root',
  //   editedAt: 0,
  //   createdAt: 0,
  //   path: '/'
  // }

    export const RootNode: FolderMetadata = {
      type: NodeType.folder,
      id: '5fa91ab9-ab48-4199-9129-2558d19709b5',
      name: 'Root',
      parentId: '',
      editedAt: 0,
      createdAt: 0,
      path: '/'
    }

}