"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ShoppingCart, Trash2 } from "lucide-react";
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

export default function ListsContainer() {
  const { lists, listItems, isLoading, error, addList, removeList } =
    useAppContext();
  const [newListName, setNewListName] = useState("");

  const handleAddList = () => {
    addList(newListName);
    setNewListName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddList();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  // Ensure lists is always an array
  const safeListsArray = Array.isArray(lists) ? lists : [];

  // Get item counts for each list
  const listItemCounts = safeListsArray.reduce(
    (counts, list) => {
      counts[list.id] = listItems.filter((li) => li.list_id === list.id).length;
      return counts;
    },
    {} as Record<string, number>,
  );

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
          <li className="text-center text-muted-foreground py-4">
            You have no lists. Create one to get started!
          </li>
        ) : (
          safeListsArray.map((list) => (
            <li key={list.id}>
              <div className="group flex items-center gap-2">
                <Link
                  href={`/list/${list.id}`}
                  className="flex-1 flex items-center gap-2 p-3 border rounded-md bg-card hover:bg-accent transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="flex-1">{list.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {listItemCounts[list.id]} items
                  </span>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete list</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete List</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{list.name}&quot;?
                        This will permanently remove the list, but the items
                        themselves will remain available for use in other lists.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeList(list.id)}
                        className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                      >
                        Delete List
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
