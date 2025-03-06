"use client";

import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";
import AutocompleteInput from "../ui/autocomplete-input";
import BaseList, {
  BaseListButton,
  BaseListEmpty,
  BaseListItem,
} from "../ui/base-list";
import Loader from "../ui/loader";
import { cn } from "@/lib/utils";

interface ListViewProps {
  listId: string;
}

export default function ListView({ listId }: ListViewProps) {
  const {
    items,
    isLoading,
    createItem,
    addItemToList,
    toggleItemCompleted,
    getListItems,
    deleteItemFromList,
  } = useAppContext();

  const currentListItems = getListItems(listId);

  const sortedListItems = currentListItems.sort((a, b) => {
    // First sort by completion status (uncompleted first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then sort by name for items with the same completion status
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <AutocompleteInput
        items={items}
        showExistingItems={true}
        onExistingItem={(itemId) => {
          addItemToList(itemId, listId);
        }}
        onNewItem={(value) => {
          createItem(value, listId);
        }}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <BaseList>
          {sortedListItems.length === 0 ? (
            <BaseListEmpty>No items in this list</BaseListEmpty>
          ) : (
            sortedListItems.map((item) => (
              <BaseListItem key={item.id}>
                <Checkbox
                  id={item.id}
                  checked={item.completed}
                  onCheckedChange={() => toggleItemCompleted(item.id, listId)}
                  className="m-3 cursor-pointer"
                />
                <label
                  htmlFor={item.id}
                  className={cn(
                    "flex-grow",
                    "cursor-pointer",
                    item.completed && "line-through text-muted-foreground",
                  )}
                >
                  {item.name}
                </label>
                <BaseListButton
                  onClick={() => deleteItemFromList(item.id, listId)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove from list</span>
                </BaseListButton>
              </BaseListItem>
            ))
          )}
        </BaseList>
      )}
    </div>
  );
}
