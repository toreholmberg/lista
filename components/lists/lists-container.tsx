"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/context/AppContext"

export default function ListsContainer() {
  const { lists, items, isLoading, error, addList } = useAppContext()
  const [newListName, setNewListName] = useState("")

  const handleAddList = () => {
    addList(newListName)
    setNewListName("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddList()
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    )
  }

  // Ensure lists is always an array
  const safeListsArray = Array.isArray(lists) ? lists : []

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="New list name..."
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleAddList} size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add list</span>
        </Button>
      </div>

      <ul className="space-y-2">
        {safeListsArray.length === 0 ? (
          <li className="text-center text-muted-foreground py-4">You have no lists. Create one to get started!</li>
        ) : (
          safeListsArray.map((list) => (
            <li key={list.id}>
              <Link
                href={`/list/${list.id}`}
                className="flex items-center gap-2 p-3 border rounded-md bg-card hover:bg-accent transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="flex-1">{list.name}</span>
                <span className="text-sm text-muted-foreground">
                  {Array.isArray(list.itemRefs) ? list.itemRefs.length : 0} items
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
} 