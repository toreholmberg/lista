"use client";

import ItemList from "./item-list";
import SimpleInput from "../ui/simple-input";
import { useAppContext } from "@/context/AppContext";

export default function ItemLibrary() {
  const {
    items,
    isLoading,
    createItem,
    toggleItemEssential,
    deleteItem,
    renameItem,
  } = useAppContext();

  return (
    <div>
      <SimpleInput
        placeholder="Add new item..."
        label="Add item"
        onAdd={createItem}
      />

      <ItemList
        items={items}
        isLoading={isLoading}
        onToggleEssential={toggleItemEssential}
        onDelete={deleteItem}
        onRename={renameItem}
      />
    </div>
  );
}
