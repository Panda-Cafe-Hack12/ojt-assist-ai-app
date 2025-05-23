'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

type ResFileMetaData = {
  files: FileMetaData[];
}

type FileMetaData = {
  id: string;
  name: string;
  mimeType: string;
  description: string;
  modifiedTime: string;
  size: number;
}

export default function DummyGdrivePage() {
  const [fileList, setFileList] = useState<FileMetaData[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [fetchFilesError, setFetchFilesError] = useState<string | null>(null);
  const [manualfolderPath, setManualFolderPath] = useState('');
  const [skillfolderPath, setSkillFolderPath] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [folderId, setFolderId] = useState('');
  const [files, setFiles] = useState<FileMetaData[]>([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const fetchMetaDatas = async () => {
    setLoadingFiles(true);
    setFetchFilesError(null);
    try {
      const response = await fetch('/api/gdrive/metadatas');
      if (!response.ok) {
        const errorData = await response.json();
        setFetchFilesError(errorData.error || 'ファイル情報の取得に失敗しました');
      } else {
        const data: ResFileMetaData = await response.json();
        console.log('取得ファイル一覧:');
        console.log(data);
        setFileList(data.files);
      }
    } catch (error: any) {
      setFetchFilesError(error.message || 'ファイル情報の取得中に予期せぬエラーが発生しました');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleManualFolderPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualFolderPath(event.target.value);
  };
  
  const handleSkillFolderPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSkillFolderPath(event.target.value);
  };

  const handleManualSyncButtonClick = async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);

    try {
      const response = await fetch('/api/vector-store/manual/sync-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderPath: manualfolderPath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSyncError(errorData.error || 'フォルダ同期に失敗しました。');
        return;
      }

      setSyncSuccess(true);
      setManualFolderPath(''); // 成功したらフォームをクリア
    } catch (error: any) {
      setSyncError(error.message || 'フォルダ同期中にエラーが発生しました。');
    } finally {
      setSyncing(false);
    }
  };

  const handleSkillKnowledgeSyncButtonClick = async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);
    console.log('スキルナレッジフォルダ同期開始');
    console.log(skillfolderPath);

    try {
      const response = await fetch('/api/vector-store/skill-knowledge/sync-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderPath: skillfolderPath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSyncError(errorData.error || 'フォルダ同期に失敗しました。');
        return;
      }

      setSyncSuccess(true);
      setSkillFolderPath(''); // 成功したらフォームをクリア
    } catch (error: any) {
      setSyncError(error.message || 'フォルダ同期中にエラーが発生しました。');
    } finally {
      setSyncing(false);
    }
  };

  const handleSpecifyFolderGetFiles = async () => {
    setError('');
    setFiles([]);

    if (!folderId) {
      setError('Folder ID is required.');
      return;
    }

    try {
      const response = await fetch(`/api/gdrive/specify-folder?folderId=${folderId}`);
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to fetch files.');
        return;
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Google Drive アクセステスト</h1>

      <div className="mb-6">
        <div className="mb-6 flex flex-col items-center"> 
          <h2 className="text-xl font-semibold mb-2">ファイル情報一覧</h2>
          <button
            onClick={fetchMetaDatas}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={loadingFiles}
          >
            {loadingFiles ? '取得中...' : 'ドライブ内の全ファイル情報を取得'}
          </button>
        </div>
        {fetchFilesError && <p className="text-red-500 mt-2">{fetchFilesError}</p>}
        {fileList.length > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="overflow-x-auto w-4/5"> {/* 追加: 幅を 80% に設定 */}
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">ID</th>
                  <th className="border border-gray-400 px-4 py-2">Name</th>
                  <th className="border border-gray-400 px-4 py-2">MIME Type</th>
                </tr>
              </thead>
              <tbody>
                {fileList.map((file: FileMetaData) => (
                  <tr key={file.id}>
                    <td className="border border-gray-400 px-4 py-2">{file.id}</td>
                    <td className="border border-gray-400 px-4 py-2">{file.name}</td>
                    <td className="border border-gray-400 px-4 py-2">{file.mimeType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
        {fileList.length === 0 && !loadingFiles && !fetchFilesError && <p className="mt-2">ファイルが見つかりませんでした。</p>}
      </div>
      <div className="mb-6 flex flex-col items-center w-full"> 
        <h2 className="text-xl font-semibold mb-2">マニュアルフォルダ同期</h2>
        <div className="flex items-center space-x-4 mb-4 w-4/5">
          <label htmlFor="manualFolderPath" className="block text-gray-700 text-sm font-bold">
            フォルダパス:
          </label>
          <input
            type="text"
            id="manualFolderPath"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={manualfolderPath}
            onChange={handleManualFolderPathChange}
            placeholder="同期するフォルダのパスを入力"
          />
          <button
            onClick={handleManualSyncButtonClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={syncing || !manualfolderPath}
          >
            {syncing ? '同期中...' : '同期'}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-2">スキルナレッジフォルダ同期</h2>
        <div className="flex items-center space-x-4 mb-4 w-4/5">
          <label htmlFor="skillFolderPath" className="block text-gray-700 text-sm font-bold">
            フォルダパス:
          </label>
          <input
            type="text"
            id="skillFolderPath"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={skillfolderPath}
            onChange={handleSkillFolderPathChange}
            placeholder="同期するフォルダのパスを入力"
          />
          <button
            onClick={handleSkillKnowledgeSyncButtonClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={syncing || !skillfolderPath}
          >
            {syncing ? '同期中...' : '同期'}
          </button>
        </div>
        {syncing ? '同期中...' : '同期'}
        {syncError && <p className="text-red-500 mt-2">{syncError}</p>}
        {syncSuccess && <p className="text-green-500 mt-2">フォルダの同期が完了しました。</p>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Enter Folder ID"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
        />
        <button onClick={handleSpecifyFolderGetFiles}>Get Files</button>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {files.length > 0 && (
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                <strong>{file.name}</strong> ({file.id})<br />
                Description: {file.description}<br />
                Last Modified: {new Date(file.modifiedTime).toLocaleString()}<br />
                Size: {file.size} bytes
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

