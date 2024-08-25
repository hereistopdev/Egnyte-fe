import {
  CloudDownloadOutlined,
  DeleteOutlined,
  FileAddOutlined,
  FolderAddOutlined,
  ExportOutlined,
} from "@ant-design/icons";

import { ReactComponent as ChevronRightIcon } from "../../icons/chevron-right.svg";
import { ReactComponent as FileIcon } from "../../icons/file.svg";
import style from "./index.module.scss";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../infrastructure/state/app/hooks";
import {
  selectFolderExpansionState,
  toggleExpansion,
} from "../../../infrastructure/state/sideExplorerSlice";
import { Directory } from "../../../domain/entities/Directory";
// import { fileStorageInteractor } from '../../../adapters/FileStorageAdapter'
import { useEffect } from "react";
// import { NavLinkPersist } from '../../supports/Persistence'
// import { useParams } from 'react-router-dom'
import {
  useFileAdapter,
  useFolderAdapter,
} from "../../../adapters/DirectoryAdapter";
import {
  FolderStatus,
  DirectoryState,
} from "../../../domain/repositories/DirectoryState";
import { Empty } from "antd";
import { useReduxDirectoryState } from "../../../infrastructure/state/DirectoryState";

interface FolderProps {
  folder: Directory.FolderMetadata;
}

interface FileProps {
  file: Directory.FileMetadata;
}

interface ExplorerItemsProps {
  folder: Directory.FolderMetadata;
}

interface SideExplorerProps {
  workspace: Directory.FolderMetadata;
}

export function SideExplorer({ workspace }: SideExplorerProps) {
  const { createFile, createFolder } = useFolderAdapter(workspace);
  const createNewFile = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    const fileName = prompt("Enter File Name");
    if (fileName === null) return;
    createFile({ name: fileName, path: workspace.path + `/${fileName}` });
  };

  const createNewFolder = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    const folderName = prompt("Enter Folder Name");
    if (folderName === null) return;
    createFolder({ name: folderName, path: workspace.path + `/${folderName}` });
  };
  return (
    <>
      <div className={style.workspaceName}>
        <div className={style.left}>
          <span>{workspace.name}</span>
        </div>
        <div className={style.right}>
          <FolderAddOutlined
            className={style.iconButton}
            title={`Create new folder in ${workspace.name}`}
            onClick={createNewFolder}
          />
          <FileAddOutlined
            className={style.iconButton}
            title={`Create new file in ${workspace.name}`}
            onClick={createNewFile}
          />
        </div>
      </div>

      <FolderItems folder={workspace} />
    </>
  );
}

export function FolderItems({ folder }: ExplorerItemsProps) {
  const { fetchFolderContent, folderContent, folderStatus } =
    useFolderAdapter(folder);

  useEffect(fetchFolderContent, []);

  if (folderStatus === FolderStatus.ContentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* {folderContent.length === 0 &&
      <Empty className={style.empty} description="Folder Empty" />
    } */}
      {folderContent.map((item) => {
        if (item.type === Directory.NodeType.file)
          return <File key={item.id} file={item} />;
        else return <Folder key={item.id} folder={item} />;
      })}
    </>
  );
}

export function File({ file }: FileProps) {
  const { deleteFile, downloadFile } = useFileAdapter(file);

  const deleteThisFile = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    const isConfirmedDelete = confirm(`Permanently Delete File: ${file.name}`);
    if (isConfirmedDelete === false) return;
    deleteFile();
  };

  const downloadThisFile = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    downloadFile();
  };

  return (
    <div className={style.file}>
      <div className={`${style.name} ${style.entry}`}>
        <div className={style.left}>
          <span className={style.icon}>
            <FileIcon />
          </span>
          <span>{file.name}</span>
        </div>
        <div className={style.right}>
          <DeleteOutlined
            className={style.iconButton}
            title={`Delete File: ${file.name}`}
            onClick={deleteThisFile}
          />
          {/* <FilePdfOutlined className={style.iconButton} title={`Download ${file.name} as PDF`} /> */}
          <CloudDownloadOutlined
            className={style.iconButton}
            title={`Download ${file.name}`}
            onClick={downloadThisFile}
          />
        </div>
      </div>
    </div>
  );
}

export function Folder({ folder }: FolderProps) {
  // const [isExpanded, toggleExpansion] = useState(false)
  const isExpanded = useAppSelector(selectFolderExpansionState(folder));
  const dispatch = useAppDispatch();
  const directoryState: DirectoryState = useReduxDirectoryState(dispatch);

  const { createFolder, createFile, deleteFolder } = useFolderAdapter(folder);

  const deleteThisFolder = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    const isConfirmedDelete = confirm(
      `Permanently Delete Folder: ${folder.name}`
    );
    if (isConfirmedDelete === false) return;
    deleteFolder();
  };

  const exportFolder = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    const isConfirmedDelete = confirm(
      `Export File lists would use huge API usage. Are you sure continue to export lists for ${folder.name}`
    );
    if (isConfirmedDelete === false) return;

    console.log("Export", folder);
  };

  const createNewFile = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    const fileName = prompt("Enter File Name");
    if (fileName === null) return;
    createFolder({ name: fileName, path: folder.path + `/${fileName}` });
  };

  const createNewFolder = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    const folderName = prompt("Enter Folder Name");
    if (folderName === null) return;
    createFolder({ name: folderName, path: folder.path + `/${folderName}` });
  };

  const handleFolderClick = () => {
    dispatch(toggleExpansion(folder));
    directoryState.setActiveFolderMetadata(folder);
  };

  return (
    <div className={style.folder}>
      <div
        className={`${style.name} ${style.entry}`}
        onClick={handleFolderClick}
      >
        <div className={style.left}>
          <span
            className={
              isExpanded ? `${style.icon} ${style.turn90}` : `${style.icon}`
            }
          >
            <ChevronRightIcon />
          </span>
          <span>{folder.name}</span>
        </div>
        <div className={style.right}>
          <ExportOutlined
            className={style.iconButton}
            title={`Export List: ${folder.name}`}
            onClick={exportFolder}
          />

          <DeleteOutlined
            className={style.iconButton}
            title={`Delete Folder: ${folder.name}`}
            onClick={deleteThisFolder}
          />
          <FolderAddOutlined
            className={style.iconButton}
            title={`Create new folder in ${folder.name}`}
            onClick={createNewFolder}
          />
          <FileAddOutlined
            className={style.iconButton}
            title={`Create new file in ${folder.name}`}
            onClick={createNewFile}
          />
        </div>
      </div>
      <div className={style.child}>
        {isExpanded ? <FolderItems folder={folder} /> : <></>}
      </div>
    </div>
  );
}
