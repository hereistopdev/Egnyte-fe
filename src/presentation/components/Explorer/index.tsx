import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../../infrastructure/state/app/store";
import styles from "./index.module.scss";
import { ReactComponent as FolderIcon } from "../../icons/folder.svg";
import { ReactComponent as FileIcon } from "../../icons/file.svg";
import { ReactComponent as ChevronRightIcon } from "../../icons/chevron-right.svg";
import { ReactComponent as TrashIcon } from "../../icons/trash.svg";
import { ReactComponent as RenameIcon } from "../../icons/rename.svg";
import { ReactComponent as LinkExternalIcon } from "../../icons/link-external.svg";
import { ReactComponent as NewFileIcon } from "../../icons/new-file.svg";
import { ReactComponent as NewFolderIcon } from "../../icons/new-folder.svg";
import { ReactComponent as ClearAllIcon } from "../../icons/clear-all.svg";
import { ReactComponent as VMIcon } from "../../icons/vm.svg";
import { ReactComponent as DesktopDownloadIcon } from "../../icons/desktop-download.svg";
import { ReactComponent as AddIcon } from "../../icons/add.svg";
import { ReactComponent as LinkIcon } from "../../icons/link.svg";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ContextMenu, ContextMenuOptions } from "../ContextMenu";
import { NavLinkPersist } from "../../supports/Persistence";
import { Directory } from "../../../domain/entities/Directory";
import {
  useFileAdapter,
  useFolderAdapter,
} from "../../../adapters/DirectoryAdapter";
import {
  FolderStatus,
  DirectoryState,
} from "../../../domain/repositories/DirectoryState";
import { useReduxDirectoryState } from "../../../infrastructure/state/DirectoryState";
import { toggleExpansion } from "../../../infrastructure/state/sideExplorerSlice";
import { selectFolderContent } from "../../../infrastructure/state/DirectoryState";
import axiosInstance from "../../../utils/axiosInstance";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { DownCircleOutline } from "antd-mobile-icons";
import { DownCircleOutlined, DownloadOutlined } from "@ant-design/icons";

export interface ExplorerProps {
  workspace: Directory.FolderMetadata;
}

interface FolderProps {
  folder: Directory.FolderMetadata;
  showContextMenu: (
    event: React.MouseEvent<Element, MouseEvent>,
    item: string | ContextMenuOptions
  ) => void;
}

interface FileProps {
  folder: Directory.FolderMetadata;
  file: Directory.FileMetadata;
  showContextMenu: (
    event: React.MouseEvent<Element, MouseEvent>,
    item: string | ContextMenuOptions
  ) => void;
}

interface ExplorerItemsProps {
  folder: Directory.FolderMetadata;
  showContextMenu: (
    event: React.MouseEvent<Element, MouseEvent>,
    item: string | ContextMenuOptions
  ) => void;
}

const breadcrumbContextOptions: ContextMenuOptions = [
  { icon: LinkIcon, text: "Copy Link" },
  null,
  { icon: LinkExternalIcon, text: "Open in New Tab" },
  { icon: LinkExternalIcon, text: "Open in Editor" },
];

const folderContextOptions: ContextMenuOptions = [
  { icon: RenameIcon, text: "Rename Folder" },
  { icon: TrashIcon, text: "Delete Folder" },
  null,
  { icon: DownCircleOutline, text: "Download Folder" },
];

const deviceExplorerContextOptions: ContextMenuOptions = [
  {
    icon: AddIcon,
    text: "New Device",
  },
];

const deviceContextOptions: ContextMenuOptions = [
  {
    icon: ClearAllIcon,
    text: "Format Device",
  },
  {
    icon: TrashIcon,
    text: "Delete Device",
  },
  {
    icon: LinkExternalIcon,
    text: "Open Device in Editor",
  },
];

export function Explorer({ workspace }: ExplorerProps) {
  const { createFolder, fetchFolderContent, createFile } =
    useFolderAdapter(workspace);

  useEffect(fetchFolderContent, [workspace.id]);

  const [contextMenu, setContextMenu] = useState<ReactNode>();
  const containerRef = useRef(null);
  const itemsRef = useRef(null);

  const createNewFile = async () => {
    const fileName = prompt("Enter File Name");
    if (fileName === null) return;
    createFile({ name: fileName, path: workspace.path + `/${fileName}` });
  };

  const createNewFolder = async () => {
    const folderName = prompt("Enter Folder Name");
    if (folderName === null) return;
    createFolder({ name: folderName, path: workspace.path + `/${folderName}` });
  };

  const itemsExplorerContextOptions: ContextMenuOptions = [
    { icon: NewFileIcon, text: "New File", onClick: createNewFile },
    { icon: NewFolderIcon, text: "New Folder", onClick: createNewFolder },
  ];

  const showContextMenu = (
    event: React.MouseEvent<Element, MouseEvent>,
    item: string | ContextMenuOptions
  ) => {
    event.preventDefault();
    if (item === "items") {
      event.stopPropagation();
      const itemsElm: HTMLDivElement = itemsRef.current!;
      if (event.pageY >= itemsElm.offsetTop)
        setContextMenu(
          <ContextMenu
            options={itemsExplorerContextOptions}
            hide={hideContextMenu}
            event={event}
          />
        );
    } else if (item === "devices") {
      event.stopPropagation();
      const itemsElm: HTMLDivElement = itemsRef.current!;
      if (event.pageY >= itemsElm.offsetTop)
        setContextMenu(
          <ContextMenu
            options={deviceExplorerContextOptions}
            hide={hideContextMenu}
            event={event}
          />
        );
    } else if (item === "folder") {
      event.stopPropagation();
      setContextMenu(
        <ContextMenu
          options={folderContextOptions}
          hide={hideContextMenu}
          event={event}
        />
      );
    } else if (item === "device") {
      event.stopPropagation();
      setContextMenu(
        <ContextMenu
          options={deviceContextOptions}
          hide={hideContextMenu}
          event={event}
        />
      );
    } else if (item === "breadcrumb") {
      event.stopPropagation();
      setContextMenu(
        <ContextMenu
          options={breadcrumbContextOptions}
          hide={hideContextMenu}
          event={event}
        />
      );
    } else if (typeof item !== "string") {
      event.stopPropagation();
      setContextMenu(
        <ContextMenu options={item} hide={hideContextMenu} event={event} />
      );
    } else {
      throw new Error("[Explorer] Context Type Not Found!!");
    }
  };

  const hideContextMenu = () => {
    setContextMenu(<></>);
  };

  return (
    <>
      {contextMenu}
      <div
        ref={containerRef}
        className={styles.container}
        onContextMenu={(event) =>
          showContextMenu(event, itemsExplorerContextOptions)
        }
      >
        <BreadCrumbs folder={workspace} showContextMenu={showContextMenu} />
        <ToastContainer />
        <hr />
        <div ref={itemsRef}>
          <FolderItems folder={workspace} showContextMenu={showContextMenu} />
        </div>
      </div>
    </>
  );
}

/**
 *
 * @todo **ansestors** State Not Updating!!!
 */
export function BreadCrumbs({ folder, showContextMenu }: ExplorerItemsProps) {
  const dispatch: AppDispatch = useDispatch();
  const directoryState: DirectoryState = useReduxDirectoryState(dispatch);

  const { ansestors, fetchAnsestors } = useFolderAdapter(folder);
  useEffect(fetchAnsestors, [folder.id]);

  if (ansestors.length == 0) {
    return <div>Loading...</div>;
  }

  const handleClickBreadcrumTarget = (
    folder: Directory.FolderMetadata
  ): void => {
    directoryState.setActiveFolderMetadata(folder);
  };

  return (
    <div className={styles.breadcrumbs}>
      {ansestors.map((folder, index) => {
        // const breadcrumbTarget = folder.id === Directory.RootNode.id
        //   ? '/'
        //   : `/${folder.parentId}/${folder.id}`

        return (
          <React.Fragment key={folder.id}>
            <NavLinkPersist
              to={""}
              onClick={() => handleClickBreadcrumTarget(folder)}
              className={styles.breadcrumb}
              onContextMenu={(event) => showContextMenu(event, "breadcrumb")}
            >
              {folder.name}
            </NavLinkPersist>
            {index != ansestors.length - 1 ? <ChevronRightIcon /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function FolderItems({ folder, showContextMenu }: ExplorerItemsProps) {
  const { fetchFolderContent, folderContent, folderStatus } =
    useFolderAdapter(folder);

  const itemsRef = useRef(null);

  useEffect(fetchFolderContent, [folder.id]);

  if (
    folderStatus === FolderStatus.ContentLoading ||
    folderStatus === FolderStatus.Creating
  ) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.items} ref={itemsRef}>
      {folderContent.length === 0 && (
        <div className={styles.emptyFolderShowCase}>This Folder is Empty!</div>
      )}
      {folderContent.map((item) => {
        if (item.type === Directory.NodeType.folder) {
          return (
            <Folder
              key={item.id}
              folder={item}
              showContextMenu={showContextMenu}
            />
          );
        } else {
          return (
            <File
              key={item.id}
              folder={folder}
              file={item}
              showContextMenu={showContextMenu}
            />
          );
        }
      })}
    </div>
  );
}

export function File({ folder, file, showContextMenu }: FileProps) {
  const { deleteFile, renameFile, downloadFile } = useFileAdapter(file);

  const renameThisFile = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // commenting this line will hide context menu after button click
    // event.stopPropagation()
    event.preventDefault();
    const newName = prompt(`Enter New Name for file: ${file.name}`, file.name);
    if (newName) renameFile(newName);
    return true;
  };

  const fileContextOptions: ContextMenuOptions = [
    { icon: RenameIcon, text: "Rename File", onClick: renameThisFile },
    { icon: TrashIcon, text: "Delete File", onClick: deleteFile },
    null,
    { icon: DesktopDownloadIcon, text: "Download File", onClick: downloadFile },
  ];

  const downloadFileFromServer = async (path: string) => {
    axiosInstance
      .get(`https://egnyte-be.onrender.com/api/filedown?filePath=${path}`, {
        responseType: "blob",
      })
      .then((response) => {
        // Get the filename from the Content-Disposition header or set a default name
        const contentDisposition = response.headers["content-disposition"];
        let fileName = path.split("/").pop() || "downloaded file";

        if (
          contentDisposition &&
          contentDisposition.indexOf("attachment") !== -1
        ) {
          const matches = contentDisposition.match(/filename="?(.+)"?/);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }

        // Create a blob URL and trigger a download

        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers["content-type"] })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        // Append to the document body and trigger the download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`File Downloaded. ${fileName}`);
      })
      .catch((error) => {
        console.error("Error while downloading the file:", error);
      });
  };

  const handleFileClick = async (file: any) => {
    await downloadFileFromServer(file.path.slice(1));
  };

  return (
    <div className={styles.item} onClick={() => handleFileClick(file)}>
      <FileIcon />
      {`${file.name}`}
    </div>
  );
}

export function Folder({ folder, showContextMenu }: FolderProps) {
  const dispatch: AppDispatch = useDispatch();
  const directoryState: DirectoryState = useReduxDirectoryState(dispatch);

  const { deleteFolder, renameFolder } = useFolderAdapter(folder);
  const navigate = useNavigate();

  const renameThisFolder = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // commenting this line will hide context menu after button click
    // event.stopPropagation()
    event.preventDefault();
    const newName = prompt(
      `Enter New Name for file: ${folder.name}`,
      folder.name
    );
    if (newName) renameFolder(newName);
    return true;
  };

  const openFolderInEditor = async () => {
    // navigate(`/${folder.parentId}/${folder.id}`)

    // navigate(`/${folder.id}`)
    dispatch(toggleExpansion(folder));
    directoryState.setActiveFolderMetadata(folder);
  };

  const downloadFolderFromServer = async () => {
    const folderPath = folder.path;
    try {
      const response = await axiosInstance.get(
        "https://egnyte-be.onrender.com/api/folder-download",
        {
          params: { folderPath },
        }
      );

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${folderPath.split("/").pop()}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading folder:", error);
    }
  };

  const folderContextOptions: ContextMenuOptions = [
    { icon: RenameIcon, text: "Rename Folder", onClick: renameThisFolder },
    { icon: TrashIcon, text: "Delete Folder", onClick: deleteFolder },
    {
      icon: DownloadOutlined,
      text: "Download Folder",
      onClick: downloadFolderFromServer,
    },
    null,
    {
      icon: LinkExternalIcon,
      text: "Open Folder in Editor",
      onClick: openFolderInEditor,
    },
  ];

  return (
    <>
      <NavLinkPersist
        to={``}
        onClick={openFolderInEditor}
        className={styles.item}
        onContextMenu={(event) => showContextMenu(event, folderContextOptions)}
      >
        {folder.id === "root" ? <VMIcon /> : <FolderIcon />}
        {folder.name}
      </NavLinkPersist>
    </>
  );
}
