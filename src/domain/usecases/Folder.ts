import { Dir } from "fs";
import { Directory } from "../entities/Directory";
import { DirectoryDatabase } from "../repositories/DirectoryDatabase";
import { DirectoryState, FolderStatus } from "../repositories/DirectoryState";
import { deleteFile } from "./File";
import Data from "./data.json";
import axiosInstance from "../../utils/axiosInstance";

export type createFolderParams = {
  name: Directory.FolderMetadata["name"];
  parentId?: Directory.FolderMetadata["parentId"];
  path: Directory.FolderMetadata["path"];
};

export const createFolder = async (
  params: createFolderParams,
  database: DirectoryDatabase,
  state: DirectoryState
): Promise<Directory.FolderMetadata> => {
  const folderId = String(Date.now());

  const folder: Directory.FolderMetadata = {
    type: Directory.NodeType.folder,
    id: folderId,
    name: params.name,
    parentId: params.parentId || Directory.RootNode.id,
    editedAt: Date.now(),
    createdAt: Date.now(),
    path: params.path + "/" + params.name,
  };

  state.setFolderMetadata(folder);
  state.setFolderStatus(folder, FolderStatus.Creating);
  await database.createFolderMetadata(folder);
  state.setFolderStatus(folder, FolderStatus.Default);

  return folder;
};

export const fetchFolderContent = async (
  folder: Pick<Directory.FolderMetadata, "id" | "path">,
  database: DirectoryDatabase,
  state: DirectoryState
): Promise<Directory.FolderContent> => {
  state.setFolderStatus(folder, FolderStatus.ContentLoading);

  const res = await axiosInstance.post(
    `https://egnyte-be.onrender.com/api/files`,
    {
      path: folder.path.slice(1),
    }
  );
  if (res && res.status == 200 && res.data) {
    const Data = res.data;
    const folder_nodes: Directory.FolderContent =
      Data?.folders?.map((item: any) => ({
        type: Directory.NodeType.folder,
        id: item.folder_id,
        name: item.name,
        parentId: folder.id,
        editedAt: 0,
        createdAt: 0,
        path: item.path,
      })) || [];
    const file_nodes: Directory.FolderContent =
      Data?.files?.map((item: any) => ({
        type: Directory.NodeType.file,
        id: item.entry_id,
        name: item.name,
        parentId: folder.id,
        editedAt: 0,
        createdAt: 0,
        path: item.path,
      })) || [];
    const nodes: Directory.FolderContent = [...folder_nodes, ...file_nodes];

    nodes.forEach((node) => {
      if (node.type === Directory.NodeType.file) state.setFileMetadata(node);
      else state.setFolderMetadata(node);
    });

    state.setFolderStatus(folder, FolderStatus.Default);

    return nodes;
  }

  return [];
};

export const deleteFolder = async (
  folder: Pick<Directory.FolderMetadata, "id" | "path">,
  database: DirectoryDatabase,
  state: DirectoryState
) => {
  state.setFolderStatus(folder, FolderStatus.Deleting);
  const nodes: Directory.FolderContent = await fetchFolderContent(
    folder,
    database,
    state
  );

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type == Directory.NodeType.folder) {
      await deleteFolder(node, database, state);
    } else {
      await deleteFile(node, database, state);
    }
  }

  await database.deleteFolderMetadata(folder);
  state.deleteFolderMetadata(folder);
  state.setFolderStatus(folder, FolderStatus.Deleted);
};

export const fetchAnsestors = async (
  node: Pick<Directory.Node, "id" | "path">,
  database: DirectoryDatabase,
  state: DirectoryState
): Promise<Directory.FolderMetadata[]> => {
  if (node.id === Directory.RootNode.id) return [];

  const parents: Directory.FolderMetadata[] = [];
  let parent: Directory.FolderMetadata;

  do {
    parent = await fetchParentMetadata(node, database, state);
    parents.push(parent);
    node = parent;
  } while (parent.id != Directory.RootNode.id);

  parents.reverse();

  return parents;
};

export const fetchParentMetadata = async (
  node: Pick<Directory.Node, "id" | "path">,
  database: DirectoryDatabase,
  state: DirectoryState
): Promise<Directory.FolderMetadata> => {
  if (node.path == Directory.RootNode.path) return Directory.RootNode;
  const parentMetadata = await fetchFolderMetadata(
    { id: node.id },
    database,
    state
  );
  return parentMetadata;
};

export const fetchFolderMetadata = async (
  folderMetadataPartial: Pick<Directory.FileMetadata, "id">,
  database: DirectoryDatabase,
  state: DirectoryState
): Promise<Directory.FolderMetadata> => {
  if (folderMetadataPartial.id === Directory.RootNode.id)
    return Directory.RootNode;

  state.setFolderStatus(folderMetadataPartial, FolderStatus.Loading);
  const folderMetadata = await database.fetchFolderMetadata(
    folderMetadataPartial
  );
  state.setFolderMetadata(folderMetadata);
  state.setFolderStatus(folderMetadataPartial, FolderStatus.Default);

  return folderMetadata;
};

export const saveFolderMetadata = async (
  folder: Directory.FolderMetadata,
  database: DirectoryDatabase,
  state: DirectoryState
): Promise<void> => {
  state.setFolderStatus(folder, FolderStatus.Loading);
  folder.editedAt = Date.now();
  await database.updateFolderMetadata(folder);
  state.setFolderMetadata(folder);
  state.setFolderStatus(folder, FolderStatus.Default);
};
