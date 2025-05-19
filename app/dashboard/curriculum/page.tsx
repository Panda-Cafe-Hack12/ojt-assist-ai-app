'use client';

import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

interface Department {
  id: number;
  name: string;
  folder_id: string;
  folder_name: string;
}

interface File {
  id: string;
  name: string;
}

interface Goal {
  fileName: string;
  goalLevel: number;
}

interface Evaluation {
  goals: Goal[];
  message: string;
}

export default function CurriculumTemplateCreator() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [ojtDays, setOjtDays] = useState<string>('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    // 部署データの取得
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
      })
      .catch(error => console.error('部署データの取得に失敗しました:', error));
  }, []);

  // 部署が選択されたらファイル一覧を取得
  useEffect(() => {
    if (selectedDepartment) {
      const department = departments.find(d => d.name === selectedDepartment);
      if (department) {
        fetch(`/api/files?folderId=${department.folder_id}`)
          .then(res => res.json())
          .then(data => setFiles(data))
          .catch(error => console.error('ファイル一覧の取得に失敗しました:', error));
      }
    }
  }, [selectedDepartment, departments]);

  const handleGenerateCurriculum = async () => {
    try {
      const response = await fetch('/api/generate-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: selectedDepartment,
          files: selectedFiles,
          ojtDays: parseInt(ojtDays)
        })
      });
      const data = await response.json();
      setEvaluation(data);
    } catch (error) {
      console.error('カリキュラム生成に失敗しました:', error);
    }
  };

  const handleSave = async () => {
    if (!evaluation) return;

    try {
      await fetch('/api/save-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: selectedDepartment,
          selectedFiles,
          ojtDays: parseInt(ojtDays),
          goals: evaluation.goals
        })
      });
      alert('保存が完了しました');
    } catch (error) {
      console.error('テンプレートの保存に失敗しました:', error);
    }
  };

  const handleCheckboxChange = (fileId: string) => (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">カリキュラムテンプレート作成</h1>
      
      <div className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">部署を選択</option>
          {departments.map(dept => (
            <option key={dept.name} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        {files.length > 0 && (
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">ナレッジファイル</h3>
            <div className="space-y-2">
              {files.map(file => (
                <label key={file.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={handleCheckboxChange(file.id)}
                    className="rounded"
                  />
                  <span>{file.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-2">OJT期間（日数）</label>
          <input
            type="number"
            value={ojtDays}
            onChange={(e) => setOjtDays(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>

        <button
          onClick={handleGenerateCurriculum}
          disabled={!selectedDepartment || selectedFiles.length === 0 || !ojtDays}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          選択ファイルでカリキュラム作成
        </button>

        {evaluation && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold mb-2">評価結果</h3>
            <p className="mb-4 text-yellow-600">{evaluation.message}</p>
            
            <h4 className="font-bold mb-2">目標レベル</h4>
            <div className="space-y-2">
              {evaluation.goals.map((goal, index) => (
                <div key={index} className="flex justify-between">
                  <span>{goal.fileName}</span>
                  <span>レベル {goal.goalLevel}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 