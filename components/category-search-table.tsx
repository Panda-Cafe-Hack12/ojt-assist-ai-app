import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CategorySearchTableProps {
  categories: {
    categoryName: string
    searchCount: number
  }[]
}

export function CategorySearchTable({ categories }: CategorySearchTableProps) {
  const totalSearches = categories.reduce((sum, category) => sum + category.searchCount, 0)

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>カテゴリー</TableHead>
            <TableHead className="text-right">検索回数</TableHead>
            <TableHead className="text-right">割合</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => {
            const isEven = index % 2 === 0
            return (
              <TableRow key={category.categoryName} className={isEven ? "bg-muted/20" : ""}>
                <TableCell className="font-medium">{category.categoryName}</TableCell>
                <TableCell className="text-right">{category.searchCount}回</TableCell>
                <TableCell className="text-right">
                  {Math.round((category.searchCount / totalSearches) * 100)}%
                </TableCell>
              </TableRow>
            )
          })}
          <TableRow className="bg-muted/30 font-medium">
            <TableCell className="font-bold">合計</TableCell>
            <TableCell className="text-right font-bold">{totalSearches}回</TableCell>
            <TableCell className="text-right font-bold">100%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
