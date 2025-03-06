"use client";

import { useAppContext } from "@/context/AppContext";
import SimpleInput from "../ui/simple-input";
import { BaseListButton } from "../ui/base-list";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import BaseList, { BaseListItem, BaseListLink } from "../ui/base-list";
import { AlertDialog } from "../ui/alert-dialog";
import { BaseListEmpty } from "../ui/base-list";
import { Trash2 } from "lucide-react";
import Loader from "../ui/loader";

export default function ListIndex() {
  const { lists, isLoading, createList, deleteList } = useAppContext();

  return (
    <div>
      <SimpleInput
        placeholder="New list name..."
        label="New list name"
        onAdd={createList}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <BaseList>
          {lists.length === 0 ? (
            <BaseListEmpty>
              You have no lists. Add one to get started!
            </BaseListEmpty>
          ) : (
            lists.map((list) => (
              <BaseListItem key={list.id}>
                <BaseListLink href={`/list/${list.id}`}>
                  {list.name}
                </BaseListLink>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <BaseListButton>
                      <Trash2 className="h-4 w-4" />
                    </BaseListButton>
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
                        onClick={() => deleteList(list.id)}
                        className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                      >
                        Delete List
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </BaseListItem>
            ))
          )}
        </BaseList>
      )}
    </div>
  );
}
