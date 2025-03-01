"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Star, StarOff, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/context/AppContext"
import type { Item } from "@/types"

export default function ItemsContainer() {
  const { items, isLoading, error, addItem, toggleItemEssential, findItemsByName } = useAppContext()
  const [newItemName, setNewItemName] = useState("")
  const [suggestions, setSuggestions] = useState<Item[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Update suggestions when input changes
  useEffect(() => {
    if (newItemName.trim()) {
      const matches = findItemsByName(newItemName)
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
      setSelectedSuggestionIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [newItemName, findItemsByName])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleAddItem = () => {
    if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
      // If a suggestion is selected, we don't need to add it again
      // Just clear the input and close suggestions
      setNewItemName("")
      setShowSuggestions(false)
      return
    }
    
    // Use the input text
    addItem(newItemName)
    setNewItemName("")
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem()
    } else if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: Item) => {
    // We don't need to add the item again since it already exists
    setNewItemName("")
    setShowSuggestions(false)
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

  // Ensure items is always an array
  const safeItemsArray = Array.isArray(items) ? items : []

  return (
    <div className="space-y-4">
      <div className="flex gap-2 relative">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Add item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => newItemName.trim() && setSuggestions(findItemsByName(newItemName))}
            className="flex-1"
          />
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.length > 0 ? (
                <ul className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={suggestion.id}
                      className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${
                        index === selectedSuggestionIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>{suggestion.name}</span>
                      {suggestion.essential && (
                        <Star className="h-4 w-4 text-yellow-500 ml-auto" />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-2 text-muted-foreground">No matches found</div>
              )}
            </div>
          )}
        </div>
        <Button onClick={handleAddItem} size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add item</span>
        </Button>
      </div>

      <ul className="space-y-2">
        {safeItemsArray.length === 0 ? (
          <li className="text-center text-muted-foreground py-4">You have no items. Add one to get started!</li>
        ) : (
          safeItemsArray.map((item) => (
            <li key={item.id} className="flex items-center gap-3 p-3 border rounded-md bg-card">
              <span className="flex-1">{item.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleItemEssential(item.id)}
              >
                {item.essential ? (
                  <Star className="h-4 w-4 text-yellow-500" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle essential</span>
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
} 