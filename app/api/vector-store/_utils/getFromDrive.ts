import mammoth from 'mammoth';
import convert  from 'mammoth';
import * as XLSX from 'xlsx';
// import pdfParse from "pdf-parse";
// import { toPdf } from 'office-to-pdf';
import fs from 'fs/promises';

export type RtnSkillContent = {
    content: string;
    pageCount: number;
}
// Google Drive からファイルの内容を取得する関数

export async function getFileContentFromDrive(drive: any, fileId: string, mimeType: string): Promise<string | null> {
    try {
      console.log("ファイルダウンロード...");

      if (mimeType === 'application/vnd.google-apps.document') {
        // ベクトルストア保存用にテキストとしてダウンロード
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

export async function getFileContentFromSkillDrive(drive: any, fileId: string, mimeType: string): Promise<RtnSkillContent | null> {
    try {
      console.log("ファイルダウンロード...");

      let pageCount = 0;
      let rtnSkillContent: RtnSkillContent = {
        content: '',
        pageCount: 0,
      };

      if (mimeType === 'application/vnd.google-apps.document') {
             
        // Googleドキュメントを一度PDFとしてエクスポート
        const exportResponse = await drive.files.export({
          fileId: fileId,
          mimeType: 'application/pdf',
        } as any);
        const pdfBuffer = Buffer.from(await exportResponse.data.arrayBuffer());
        // const pdfData = await pdfParse(pdfBuffer);
        const pdfData = "";
        // const pageCount = pdfData.numpages;
        const pageCount = 0;
        console.log('PDF ページ数:', pageCount);
        // pageCount = await calculatePdfPageCount(pdfBuffer);

        // 次はベクトルストア保存用にテキストとしてダウンロード
        const res = await drive.files.export({
            fileId: fileId,
            mimeType: 'text/plain',
        });

        rtnSkillContent.content = res.data as string;
        rtnSkillContent.pageCount = pageCount;
        return rtnSkillContent;
      } else if (
          mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          mimeType === 'application/msword'
      ) {
          // const res = await drive.files.get({
          //     fileId: fileId,
          //     mimeType: 'text/plain',
          // });
          // Wordファイルを一時ファイルに保存してPDF変換

        //   const resAsPdf = await drive.files.export({
        //     fileId: fileId,
        //     mimeType: 'application/pdf',
        // }, { responseType: 'arraybuffer' });
        // const pdfBuffer = Buffer.from(resAsPdf.data as ArrayBuffer);

        // const pdfData = await pdfParse(pdfBuffer);

        // const resAsMedia = await drive.files.get({
        //     fileId: fileId,
        //     alt: 'media',
        // } as any);
    //     const mediaBuffer = Buffer.from(resAsMedia.data as ArrayBuffer);
    //     const inputPath = path.join(TEMP_DIR, `${fileId}.docx`);
    //     const outputPath = path.join(TEMP_DIR, `${fileId}.pdf`);
    // await fs.writeFile(inputPath, mediaBuffer);

    // const pdfBuffer = await toPdf(inputPath);
    // await fs.writeFile(outputPath, pdfBuffer);
    // pageCount = await calculatePdfPageCount(pdfBuffer);

        const pdfData = "";
        // const pageCount = pdfData.numpages;
        const pageCount = 0;
        console.log('PDF ページ数:', pageCount);

        //   const pdfBuffer = await toPdf(inputPath);
        //     await fs.writeFile(outputPath, pdfBuffer);
        //     pageCount = await calculatePdfPageCount(pdfBuffer);

        //   const wordBuffer = await getFileBuffer(file.id);
        //   const inputPath = path.join(TEMP_DIR, `${file.id}.docx`);
        //   const outputPath = path.join(TEMP_DIR, `${file.id}.pdf`);
        //   await fs.writeFile(inputPath, wordBuffer);


        const res = await drive.files.get({
        fileId: fileId,
        alt: 'media',
        }, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(res.data as ArrayBuffer);
        const result = await mammoth.extractRawText({ buffer: buffer });
        const extractedText = result.value;
        console.log('Successfully extracted text from DOCX.');

        rtnSkillContent.content = extractedText;
        rtnSkillContent.pageCount = pageCount;
        return rtnSkillContent;
        //   return extractedText;
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

        rtnSkillContent.content = res.data as string;
        rtnSkillContent.pageCount = pageCount;
        return rtnSkillContent;
        //   return res.data as string;
      } else if (mimeType === 'text/plain') {
        const res = await drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' });
        let content = '';
        if (res && res.data) {
            for await (const chunk of res.data) {
                content += chunk.toString();
            }
        }
        rtnSkillContent.content = res.data as string;
        rtnSkillContent.pageCount = pageCount;
        return rtnSkillContent;
        // return content;
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


// async function getFileBuffer(fileId: string): Promise<Buffer> {
//   const response = await drive.files.get({
//     fileId: fileId,
//     alt: 'media',
//   } as any);
//   return Buffer.from(await response.data.arrayBuffer());
// }

// async function calculatePdfPageCount(pdfBuffer: Buffer): Promise<number> {
//   try {
//     const pdfData = await pdf(pdfBuffer);
//     return pdfData.numpages;
//   } catch (error: any) {
//     console.error('Error calculating PDF page count:', error.message);
//     return 0;
//   } finally {
//     // 一時ファイルの削除 (必要に応じて)
//   }
// }