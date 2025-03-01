"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { Item, ListData, ListItemReference } from "@/types"

// Helper functions for localStorage
const getStoredLists = (): ListData[] => {
  try {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem("lists")
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error("Error loading lists:", error)
    return []
  }
}

const getStoredItems = (): Item[] => {
  try {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem("items")
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error("Error loading items:", error)
    return []
  }
}

const storeLists = (lists: ListData[]) => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem("lists", JSON.stringify(lists))
  } catch (error) {
    console.error("Error storing lists:", error)
  }
}

const storeItems = (items: Item[]) => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem("items", JSON.stringify(items))
  } catch (error) {
    console.error("Error storing items:", error)
  }
}

interface AppContextType {
  lists: ListData[]
  setLists: React.Dispatch<React.SetStateAction<ListData[]>>
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  isLoading: boolean
  error: string | null
  addList: (name: string) => void
  addItem: (name: string, listId?: string) => void
  toggleItemCompleted: (itemId: string, listId: string) => void
  toggleItemEssential: (itemId: string) => void
  removeItem: (itemId: string, listId: string) => void
  findItemsByName: (query: string) => Item[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<ListData[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data on mount
  useEffect(() => {
    try {
      const storedLists = getStoredLists()
      const storedItems = getStoredItems()
      
      // Ensure itemRefs exists on each list
      const validatedLists = storedLists.map(list => ({
        ...list,
        itemRefs: Array.isArray(list.itemRefs) ? list.itemRefs : []
      }))
      
      setLists(validatedLists)
      setItems(storedItems)
    } catch (err) {
      console.error("Error in initial data load:", err)
      setError("Failed to load data. Please refresh the page.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sync with localStorage whenever lists or items change
  useEffect(() => {
    if (!isLoading && lists) {
      storeLists(lists)
    }
  }, [lists, isLoading])

  useEffect(() => {
    if (!isLoading && items) {
      storeItems(items)
    }
  }, [items, isLoading])

  const generateListName = () => {
    const today = new Date()
    const dateString = today.toISOString().split("T")[0]

    const existingLists = lists.filter((list) => list.name.startsWith(dateString))
    if (existingLists.length === 0) {
      return dateString
    } else {
      return `${dateString} (${existingLists.length + 1})`
    }
  }

  const addList = (name: string) => {
    let listName = name.trim()
    if (listName === "") {
      listName = generateListName()
    }

    const essentialItemRefs: ListItemReference[] = items
      .filter((item) => item.essential)
      .map((item) => ({
        itemId: item.id,
        completed: false,
      }))

    const newList: ListData = {
      id: Date.now().toString(),
      name: listName,
      itemRefs: essentialItemRefs,
    }

    const updatedLists = [...lists, newList]
    setLists(updatedLists)
  }

  // Fuzzy search function to find items by name
  const findItemsByName = (query: string): Item[] => {
    if (!query.trim()) return []
    
    const normalizedQuery = query.toLowerCase().trim()
    
    return items.filter(item => {
      const normalizedName = item.name.toLowerCase()
      
      // Exact match gets highest priority
      if (normalizedName === normalizedQuery) return true
      
      // Contains the query
      if (normalizedName.includes(normalizedQuery)) return true
      
      // Simple fuzzy match - check if characters appear in sequence
      let queryIndex = 0
      for (let i = 0; i < normalizedName.length && queryIndex < normalizedQuery.length; i++) {
        if (normalizedName[i] === normalizedQuery[queryIndex]) {
          queryIndex++
        }
      }
      
      return queryIndex === normalizedQuery.length
    })
  }

  const addItem = (name: string, listId?: string) => {
    const itemName = name.trim()
    if (!itemName) return

    // Try to find existing item with fuzzy search
    const matchingItems = findItemsByName(itemName)
    let itemId: string
    
    // If we found a matching item, use it
    if (matchingItems.length > 0) {
      itemId = matchingItems[0].id
    } else {
      // Create new item if no match found
      const newItem: Item = {
        id: Date.now().toString(),
        name: itemName,
        essential: false
      }
      
      // Add to items list
      const updatedItems = [...items, newItem]
      setItems(updatedItems)
      itemId = newItem.id
    }

    // If listId is provided, add reference to that list
    if (listId) {
      // Check if the item is already in the list
      const list = lists.find(l => l.id === listId)
      const itemRefs = Array.isArray(list?.itemRefs) ? list.itemRefs : []
      const isItemInList = itemRefs.some(ref => ref.itemId === itemId)
      
      // Only add if not already in the list
      if (!isItemInList) {
        const updatedLists = lists.map(l => {
          if (l.id === listId) {
            return {
              ...l,
              itemRefs: [...itemRefs, { itemId, completed: false }]
            }
          }
          return l
        })
        setLists(updatedLists)
      }
    }
  }

  const toggleItemCompleted = (itemId: string, listId: string) => {
    const updatedLists = lists.map(l => {
      if (l.id === listId && Array.isArray(l.itemRefs)) {
        return {
          ...l,
          itemRefs: l.itemRefs.map(ref => 
            ref.itemId === itemId ? { ...ref, completed: !ref.completed } : ref
          )
        }
      }
      return l
    })
    setLists(updatedLists)
  }

  const toggleItemEssential = (itemId: string) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, essential: !item.essential } : item
    )
    setItems(updatedItems)
  }

  const removeItem = (itemId: string, listId: string) => {
    const updatedLists = lists.map(l => {
      if (l.id === listId && Array.isArray(l.itemRefs)) {
        return {
          ...l,
          itemRefs: l.itemRefs.filter(ref => ref.itemId !== itemId)
        }
      }
      return l
    })
    setLists(updatedLists)
  }

  return (
    <AppContext.Provider
      value={{
        lists,
        setLists,
        items,
        setItems,
        isLoading,
        error,
        addList,
        addItem,
        toggleItemCompleted,
        toggleItemEssential,
        removeItem,
        findItemsByName
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
} 