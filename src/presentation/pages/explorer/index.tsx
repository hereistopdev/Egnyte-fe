import { Explorer } from '../../components/Explorer'
import { Directory } from '../../../domain/entities/Directory'
import { useFolderAdapter } from '../../../adapters/DirectoryAdapter'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FolderStatus } from '../../../domain/repositories/DirectoryState'

interface SideExplorerProps {
  workspace: Directory.FolderMetadata
}

export function ExplorerPage({ workspace }: SideExplorerProps) {
    
  // const { fetchFolderMetadata, folderStatus, folderMetadata } = useFolderAdapter(workspace)
  // useEffect(fetchFolderMetadata, [])

  if(workspace === undefined) {
    return <p>Loading...</p>
  }

  return (
    <Explorer workspace={workspace} />
  )
}