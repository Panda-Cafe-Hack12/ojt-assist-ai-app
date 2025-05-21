"use client"

import type React from "react"

import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchInputProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearSearch: () => void
  onSearch: () => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  searchTerm,
  onSearchChange,
  onClearSearch,
  onSearch,
  placeholder = "検索...",
  className = "",
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onSearch()
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={searchTerm}
          onChange={onSearchChange}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            aria-label="検索をクリア"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button size="sm" className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white" onClick={onSearch}>
        検索
      </Button>
    </div>
  )
}
