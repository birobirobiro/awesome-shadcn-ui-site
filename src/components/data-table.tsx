'use client'

import { useState, useMemo } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExternalLink } from 'lucide-react'
import type { Resource } from '@/lib/github'

const columns: ColumnDef<Resource>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'link',
    header: '',
    cell: ({ row }) => (
      <a
        href={row.original.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center"
      >
        <ExternalLink className="h-4 w-4 text-zinc-400" />
      </a>
    ),
  },
]

export function DataTable({ data }: { data: Resource[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories')

  const filteredData = useMemo(() => {
    return data.filter(item => 
      selectedCategory === 'All Categories' || item.category === selectedCategory
    )
  }, [data, selectedCategory])

  const categories = ['All Categories', ...new Set(data.map(item => item.category).filter(category => category !== 'All Categories'))]

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Search all columns..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm bg-zinc-900 border-zinc-800 text-zinc-50"
        />
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-zinc-50">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-zinc-50">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border border-zinc-800">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-zinc-800 hover:bg-zinc-900">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-zinc-400">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-zinc-800 hover:bg-zinc-900 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-zinc-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-400">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-zinc-900 border-zinc-800 text-zinc-50 hover:bg-zinc-800"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-zinc-900 border-zinc-800 text-zinc-50 hover:bg-zinc-800"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

