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
import SimpleInput from "../ui/simple-input";
import Loader from "../ui/loader";
import ListsList from "./lists-list";
export default function ListContainer() {
  const { lists, listItems, isLoading, createList, deleteList } =
    useAppContext();

  // const handleAddList = () => {
  //   addList(newListName);
  //   setNewListName("");
  // };

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     handleAddList();
  //   }
  // };

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center py-8">
  //       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <div className="text-center text-red-500 py-4">{error}</div>;
  // }

  // // Ensure lists is always an array
  // const safeListsArray = Array.isArray(lists) ? lists : [];

  // // Get item counts for each list
  // const listItemCounts = safeListsArray.reduce(
  //   (counts, list) => {
  //     counts[list.id] = listItems.filter((li) => li.list_id === list.id).length;
  //     return counts;
  //   },
  //   {} as Record<string, number>,
  // );

  return (
    <div>
      <SimpleInput
        placeholder="New list name..."
        label="New list name"
        onAdd={createList}
      />

      <ListsList lists={lists} deleteList={deleteList} isLoading={isLoading} />
    </div>
  );
}
