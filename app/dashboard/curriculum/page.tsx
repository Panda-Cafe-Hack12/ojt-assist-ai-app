'use client';

import { randomInt } from 'crypto';
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
  description: string;
  modifiedTime: string;
  size: number;
}

interface Goal {
  fileId: string;
  fileName: string;
  goalLevel: number;
  pageCount: number;
  difficulty: string;
}

interface Evaluation {
  id: string;
  goals: Goal[];
  message: string;
}

interface EvaluationDetail {
  folderId: string;
  goals: Goal[];
  message: string;
}

interface Document {
  fileId: string;
  fileName: string;
  level: number | null;
  difficulty: string | null;
  message: string | null;
  pageCount: number | null;
  description: string | null;
}

export default function CurriculumTemplateCreator() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [ojtDays, setOjtDays] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

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
        (async () => {
          try {
            const res = await fetch(`/api/gdrive/specify-folder?folderId=${department.folder_id}`);
            const data = await res.json();
            if (data.files && data.files.length > 0) {
              setFiles(data.files);
            } else {
              setFiles([]);
              alert('ファイルを取得できませんでした');
            }
          } catch (error) {
            console.error('ファイル一覧の取得に失敗しました:', error);
            setFiles([]);
            alert('ファイルを取得できませんでした');
          }
        })().catch(error => {
          console.error('ファイル一覧の取得に失敗しました:', error);
          setFiles([]);
          alert('ファイルを取得できませんでした');
        });
      }
    }
  }, [selectedDepartment, departments]);

  const handleGenerateCurriculum = async () => {
    try {
      setIsFormDisabled(true);  // フォームを無効化
      const response = await fetch('/api/dummy-generate-curriculum', {
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
      setIsFormDisabled(false);
    }
  };

  const handleEvaluateCurriculum = async () => {
    try {
      setIsFormDisabled(true);  // フォームを無効化
      const department = departments.find(d => d.name === selectedDepartment);
      const response = await fetch('/api/gdrive/evaluate-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: department?.folder_id,
          fileIds: selectedFiles,
          period: parseInt(ojtDays)
        })
      });
      const data: {documents: Document[], overallEvaluation: string} = await response.json();
      const goals: Goal[] = [];
      data.documents.map((doc) => {
        const goal: Goal = {
          fileId: doc.fileId,
          fileName: doc.fileName,
          goalLevel: doc.level ? doc.level : 0,
          pageCount: doc.pageCount ? doc.pageCount : 0,
          difficulty: doc.difficulty ? doc.difficulty : "",
        }; 
        goals.push(goal);
      });
      const evaluation: EvaluationDetail = {
        folderId: department?.folder_id ? department?.folder_id: "" ,
        goals: goals,
        message: data.overallEvaluation
      };
      setEvaluation(evaluation);
    } catch (error) {
      console.error('カリキュラム生成に失敗しました:', error);
      setIsFormDisabled(false);
    }
  };
  
  const handleReset = () => {
    setIsFormDisabled(false);
  };

  const handleSave = async () => {
    if (!evaluation) return;

    try {
      await fetch('/api/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedDepartment + '_' + parseInt(ojtDays) + 'Days plan',
          department_id: departments.find(d => d.name === selectedDepartment)?.id,
          period: parseInt(ojtDays)
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
          disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                    checked={selectedFiles.includes(file.id)}
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
            disabled={isFormDisabled}
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleEvaluateCurriculum}
            disabled={!selectedDepartment || selectedFiles.length === 0 || !ojtDays || isFormDisabled}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            選択ファイルでカリキュラム作成
          </button>

          {isFormDisabled && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              再設定
            </button>
          )}
        </div>

        {evaluation && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold mb-2">評価結果</h3>
            <p className="mb-4 text-yellow-600">{evaluation.message}</p>
            
            <h4 className="font-bold mb-2">目標レベル</h4>
            {/* <div className="space-y-2">
              {evaluation.goals.map((goal, index) => (
                <div key={index} className="flex justify-between">
                  <span>{goal.fileName}</span>
                  <span>level: {goal.goalLevel}</span>
                  <span>{goal.pageCount}ページ</span>
                </div>
              ))}
            </div> */}

            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ファイル名
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      レベル
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      難易度
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ページ数
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evaluation.goals.map((goal, index) => (
                    <tr key={index}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {goal.fileName}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {goal.goalLevel}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {goal.difficulty}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {goal.pageCount} ページ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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