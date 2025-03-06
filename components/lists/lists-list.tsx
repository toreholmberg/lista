import { List } from "@/types";
import Link from "next/link";

import { Trash2 } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import Loader from "../ui/loader";
import { Button } from "../ui/button";
import BaseList, {
  BaseListButton,
  BaseListEmpty,
  BaseListItem,
  BaseListLink,
} from "../ui/base-list";
export default function ListList({
  lists,
  deleteList,
  isLoading,
}: {
  lists: List[];
  deleteList: (id: string) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <BaseList>
      {lists.length === 0 ? (
        <BaseListEmpty>
          You have no lists. Add one to get started!
        </BaseListEmpty>
      ) : (
        lists.map((list) => (
          <BaseListItem key={list.id}>
            <BaseListLink href={`/list/${list.id}`}>{list.name}</BaseListLink>
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
  );
}
