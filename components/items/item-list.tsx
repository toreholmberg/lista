"use client";

import { Star, StarOff, Trash2, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { Item } from "@/types";
import { BaseListButton } from "../ui/base-list";
import { BaseListEmpty, BaseListItem } from "../ui/base-list";
import BaseList from "../ui/base-list";
import Loader from "../ui/loader";

export default function ItemList({
  items,
  isLoading,
  onToggleEssential,
  onDelete,
  onRename,
}: {
  items: Item[];
  isLoading: boolean;
  onToggleEssential: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  onRename: (itemId: string, newName: string) => void;
}) {
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const handleRename = () => {
    if (renameValue.trim()) {
      onRename(renameId, renameValue.trim());
      setRenameValue("");
      setIsRenameOpen(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BaseList>
      {items.length === 0 ? (
        <BaseListEmpty>
          You have no items. Add one to get started!
        </BaseListEmpty>
      ) : (
        items.map((item) => (
          <BaseListItem key={item.id}>
            <span className="flex-1 p-3">{item.name}</span>
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
              <DialogTrigger asChild>
                <BaseListButton
                  onClick={() => {
                    setRenameId(item.id);
                    setRenameValue(item.name);
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="sr-only">Rename item</span>
                </BaseListButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename Item</DialogTitle>
                </DialogHeader>
                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="Enter new name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRename();
                    }
                  }}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRenameValue("");
                      setIsRenameOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleRename()}>Rename</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <BaseListButton onClick={() => onToggleEssential(item.id)}>
              {item.essential ? (
                <Star className="h-4 w-4 text-yellow-500" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle essential</span>
            </BaseListButton>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <BaseListButton>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete item</span>
                </BaseListButton>
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
                    onClick={() => onDelete(item.id)}
                    className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                  >
                    Delete Item
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
