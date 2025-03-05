"use client";

import { useState } from "react";
import { Plus, Star, StarOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppContext } from "@/context/AppContext";
import type { Item } from "@/types";

export default function ItemsContainer() {
  const {
    items,
    isLoading,
    error,
    addItem,
    toggleItemEssential,
    removeItemCompletely,
  } = useAppContext();
  const [newItemName, setNewItemName] = useState("");

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItem(newItemName);
      setNewItemName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Ensure items is always an array
  const safeItemsArray = Array.isArray(items) ? items : [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleAddItem} size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add item</span>
        </Button>
      </div>

      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      <ul className="space-y-2">
        {safeItemsArray.length === 0 ? (
          <li className="text-center text-muted-foreground py-4">
            You have no items. Add one to get started!
          </li>
        ) : (
          safeItemsArray.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 border rounded-md bg-card"
            >
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete item completely</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{item.name}&quot;?
                      This will permanently remove the item from all lists where
                      it is used. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => removeItemCompletely(item.id)}
                      className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                    >
                      Delete Item
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
