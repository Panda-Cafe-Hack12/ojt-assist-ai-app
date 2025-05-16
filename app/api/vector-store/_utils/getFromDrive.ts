import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Google Drive からファイルの内容を取得する関数

export async function getFileContentFromDrive(drive: any, fileId: string, mimeType: string): Promise<string | null> {
    try {
      console.log("ファイルダウンロード...");

      if (mimeType === 'application/vnd.google-apps.document') {
          const res = await drive.files.export({
              fileId: fileId,
              mimeType: 'text/plain',
          });
          return res.data as string;
      } else if (
          mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          mimeType === 'application/msword'
      ) {
          // const res = await drive.files.get({
          //     fileId: fileId,
          //     mimeType: 'text/plain',
          // });
          const res = await drive.files.get({
            fileId: fileId,
            alt: 'media',
          }, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(res.data as ArrayBuffer);
          const result = await mammoth.extractRawText({ buffer: buffer });
          const extractedText = result.value;
          console.log('Successfully extracted text from DOCX.');

          return extractedText;
      } else if (
          mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          mimeType === 'application/vnd.ms-excel'
      ) {
        // Excel ファイルの場合
        // まだ未完成
      const getResponse = await drive.files.get({
        fileId: fileId,
        alt: 'media',
      }, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(getResponse.data as ArrayBuffer);
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      // for (const sheetName of workbook.SheetNames) {
      //   const worksheet = workbook.Sheets[sheetName];
      //   const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        // 各行をテキスト化してベクトル DB に保存 (例)
      //   jsonData.forEach((row, rowIndex) => {
      //     const text = row.join(' '); // セルの値をスペースで結合
      //     const metadata = {
      //       fileName: fileName,
      //       sheetName: sheetName,
      //       row: rowIndex + 1,
      //     };
      //     saveToVectorDB(text, metadata);
      //   });
      // }
      // return res.status(200).json({ message: `Excel file "${fileName}" processed and saved to vector DB.` });

          const res = await drive.files.get({
              fileId: fileId,
              mimeType: 'text/csv',
          });
          return res.data as string;
      } else if (mimeType === 'text/plain') {
          const res = await drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' });
          let content = '';
          if (res && res.data) {
              for await (const chunk of res.data) {
                  content += chunk.toString();
              }
          }
          return content;
      }
        else {
          console.warn(`MIME タイプ "${mimeType}" のファイルは処理をスキップします。`);
          return null;
      }
    } catch (error: any) {
        console.error(`ファイル "${fileId}" の内容取得中にエラー:`, error.message);
        return null;
    }
}