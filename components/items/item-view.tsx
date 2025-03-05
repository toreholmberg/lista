"use client"

import { useState } from "react"
import ItemInput from "./item-input"
import ItemList from "./item-list"
import { Item } from "@/types"

const mockItems: Item[] = [
    {
      id: "1",
      name: "Milk",
      essential: true,
      created_at: new Date().toISOString(),
      created_by: "John Doe",
    },
    {
      id: "2",
      name: "Bread",
      essential: false,
      created_at: new Date().toISOString(),
      created_by: "John Doe",
    },
    {
      id: "3",
      name: "Eggs",
      essential: true,
      created_at: new Date().toISOString(),
      created_by: "John Doe",
    },
    {
      id: "4",
      name: "Coffee",
      essential: false,
      created_at: new Date().toISOString(),
      created_by: "John Doe",
    },
    {
      id: "5",
      name: "Sugar",
      essential: false,
      created_at: new Date().toISOString(),
      created_by: "John Doe",
    },
  ]
  
  export default function ItemView() {
    const [items, setItems] = useState<Item[]>(mockItems);

    // const handleExistingItem = (itemId: string) => {
    //     const newItem = items.find(item => item.id === itemId);

    //     const isDuplicate = listItems.some(listItem => listItem.id  === newItem?.id)

    //      if (isDuplicate) return;

    //     if (newItem) {
    //         setListItems([...listItems, newItem]);
    //     }
    // }

    const handleNewItem = (value: string) => {

        const trimmedValue = value.trim();
        if (!trimmedValue) return;

        const isDuplicate = items.some(
            item => item.name.toLowerCase() === trimmedValue.toLowerCase()
        )

        if (isDuplicate) return;

        const newItem = {
            id: (items.length + 1).toString(),
            name: trimmedValue,
            essential: false,
            created_at: new Date().toISOString(),
            created_by: "John Doe",
        }

        setItems([...items, newItem]);
    }   

    const handleToggleEssential = (itemId: string) => {
        const updatedItems = items.map(item => 
            item.id === itemId ? { ...item, essential: !item.essential } : item
        )

        setItems(updatedItems);
    }

    const handleDelete = (itemId: string) => {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
    }

    const handleRename = (itemId: string, newName: string) => {     
        const updatedItems = items.map(item => 
            item.id === itemId ? { ...item, name: newName } : item
        )

        setItems(updatedItems);
    }

    return (
      <div>
        <ItemInput items={items} showExistingItems={false} onNewItem={handleNewItem} /> 
        <ItemList items={items} onToggleEssential={handleToggleEssential} onDelete={handleDelete} onRename={handleRename} />
      </div>
    )
  }