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
    <ul className="space-y-2">
      {lists.length === 0 ? (
        <li className="text-center text-muted-foreground py-4">
          You have no lists. Add one to get started!
        </li>
      ) : (
        lists.map((list) => (
          <li
            key={list.id}
            className="flex justify-between   items-center gap-3"
          >
            <Link
              href={`/list/${list.id}`}
              className="flex items-center flex-grow gap-3 p-3 border rounded-md bg-card hover:bg-accent transition-colors"
            >
              <span className="flex-1">{list.name}</span>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive cursor-pointer"
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
                    onClick={() => deleteList(list.id)}
                    className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                  >
                    Delete List
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        ))
      )}
    </ul>
  );
}
