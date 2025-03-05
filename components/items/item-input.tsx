"use client"

import * as React from "react"
import { Item } from "@/types"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function ItemInput({ items = [], showExistingItems = true, onExistingItem, onNewItem }: { items: Item[], showExistingItems: boolean, onExistingItem?: (id: string) => void, onNewItem: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [filteredItems])

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (open && filteredItems.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(filteredItems[selectedIndex].id)
        } else if (inputValue.trim()) {
          onNewItem(inputValue.trim())
          setInputValue("")
          setOpen(false)
        }
      }
    } else if (e.key === "Enter" && inputValue.trim()) {
      onNewItem(inputValue.trim())
      setInputValue("")
      setOpen(false)
    }
    
    if (e.key === "Escape") {
      setOpen(false)
      setSelectedIndex(-1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // Filter items based on input
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredItems(filtered)
    setOpen(value.length > 0)
  }

  const handleSelect = (selectedValue: string) => {
    if (onExistingItem) {
      onExistingItem(selectedValue)
    }
    
    setInputValue("")
    setOpen(false)
    setSelectedIndex(-1)
  }

  return (
    <div className="flex gap-2 mb-8" ref={wrapperRef}>
      <div className="flex-1 relative">
        <Input
          placeholder="Add item..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full"
        />
        
        {open && showExistingItems && (
          <div className="absolute w-full mt-1 py-1 bg-popover rounded-md border shadow-md z-50">
            {filteredItems.length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                No results found, hit enter to add new item!
              </div>
            ) : (
              <div className="max-h-[300px] overflow-auto">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground cursor-default",
                      selectedIndex === index && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
