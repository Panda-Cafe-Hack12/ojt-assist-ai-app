import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

interface FileViewTableProps {
  files: {
    fileName: string
    goalLevel: number
    viewCount: number
    totalPages: number
    currentPage: number
  }[]
}

export function FileViewTable({ files }: FileViewTableProps) {
  // Function to get level badge color - more subtle
  const getLevelColor = (level: number) => {
    const colors = [
      "bg-blue-50 text-blue-700 border border-blue-200",
      "bg-green-50 text-green-700 border border-green-200",
      "bg-yellow-50 text-yellow-700 border border-yellow-200",
      "bg-orange-50 text-orange-700 border border-orange-200",
      "bg-red-50 text-red-700 border border-red-200",
    ]
    return colors[Math.min(level - 1, colors.length - 1)]
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>ファイル名</TableHead>
            <TableHead>レベル</TableHead>
            <TableHead>閲覧回数</TableHead>
            <TableHead>進捗</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => {
            const progress = (file.currentPage / file.totalPages) * 100
            return (
              <TableRow key={file.fileName} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                <TableCell className="font-medium">{file.fileName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={`${getLevelColor(file.goalLevel)} px-2 py-0.5 rounded-md text-xs font-medium`}>
                      レベル{file.goalLevel}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{file.viewCount}回</TableCell>
                <TableCell className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {file.currentPage}/{file.totalPages}ページ
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
