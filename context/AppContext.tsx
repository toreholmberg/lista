"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { Item, List, ListItem, Database } from "@/types";
import { toast } from "sonner";

interface AppContextType {
  lists: List[];
  items: Item[];
  listItems: ListItem[];
  isLoading: boolean;
  createItem: (name: string, listId?: string) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<void>;
  toggleItemCompleted: (itemId: string, listId: string) => Promise<void>;
  toggleItemEssential: (itemId: string) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  deleteItemFromList: (itemId: string, listId: string) => Promise<void>;
  createList: (name: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  findItemsByName: (query: string) => Item[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<List[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Load data on mount and when auth state changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get user's items
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .order("name");

        if (itemsError) throw itemsError;

        // Get user's lists
        const { data: listsData, error: listsError } = await supabase
          .from("lists")
          .select("*")
          .order("created_at", { ascending: false });

        if (listsError) throw listsError;

        // Get list items
        const { data: listItemsData, error: listItemsError } = await supabase
          .from("list_items")
          .select("*");

        if (listItemsError) throw listItemsError;

        setItems(itemsData || []);
        setLists(listsData || []);
        setListItems(listItemsData || []);
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Error loading data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Subscribe to realtime changes
    const itemsSubscription = supabase
      .channel("items_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        loadData,
      )
      .subscribe();

    const listsSubscription = supabase
      .channel("lists_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lists" },
        loadData,
      )
      .subscribe();

    const listItemsSubscription = supabase
      .channel("list_items_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "list_items" },
        loadData,
      )
      .subscribe();

    return () => {
      itemsSubscription.unsubscribe();
      listsSubscription.unsubscribe();
      listItemsSubscription.unsubscribe();
    };
  }, [supabase]);

  const createList = async (name: string) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        console.error("Not authenticated - no session");
        toast.error("Not authenticated");
        return;
      }

      // If name is empty, use today's date
      let finalName = name.trim();
      if (!finalName) {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const year = today.getFullYear();
        finalName = `${month}/${day}/${year}`;
      }

      // Check for duplicate names and append (n + 1) if needed
      const existingLists = lists.filter(
        (list) =>
          list.name === finalName || list.name.startsWith(`${finalName} (`),
      );

      if (existingLists.length > 0) {
        // Find the highest number in parentheses
        let maxNumber = 1;
        existingLists.forEach((list) => {
          const match = list.name.match(/\((\d+)\)$/);
          if (match) {
            const num = parseInt(match[1]);
            maxNumber = Math.max(maxNumber, num);
          }
        });
        finalName = `${finalName} (${maxNumber + 1})`;
      }

      const { data: list, error } = await supabase
        .from("lists")
        .insert({
          name: finalName,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Update local state immediately, maintaining sort order
      setLists((currentLists) => {
        const newLists = [...currentLists, list];
        return newLists.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      });

      // Add essential items to the new list
      const essentialItems = items.filter((item) => item.essential);
      if (essentialItems.length > 0) {
        const newListItems = essentialItems.map((item) => ({
          list_id: list.id,
          item_id: item.id,
          completed: false,
        }));

        const { data: listItemsData, error: listItemsError } = await supabase
          .from("list_items")
          .insert(newListItems)
          .select();

        if (listItemsError) throw listItemsError;

        // Update local state with new list items
        setListItems((currentListItems) => [
          ...currentListItems,
          ...(listItemsData || []),
        ]);
      }
    } catch (err) {
      console.error("Error adding list:", err);
      toast.error("Failed to add list");
    }
  };

  const createItem = async (name: string, listId?: string) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        console.error("Not authenticated - no session");
        toast.error("Not authenticated");
        return;
      }

      // trim name and check if it's empty
      const trimmedName = name.trim();

      if (!trimmedName) {
        toast.warning("Item name cannot be empty");
        return;
      }

      // eagerly check if item exists in local state
      const itemExists = items.some(
        (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (itemExists) {
        toast.warning("An item with this name already exists");
        return;
      }

      // insert item
      // TODO: check if item already exists in database
      const { data: item, error: itemError } = await supabase
        .from("items")
        .insert({
          name: trimmedName,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Update local items state immediately
      setItems((currentItems) => [...currentItems, item]);

      if (listId) {
        const { data: listItem, error: listItemError } = await supabase
          .from("list_items")
          .insert({
            list_id: listId,
            item_id: item.id,
            completed: false,
          })
          .select()
          .single();

        if (listItemError) throw listItemError;

        // Update local list items state immediately
        setListItems((currentListItems) => [...currentListItems, listItem]);
      }
    } catch (err) {
      console.error("Error adding item:", err);
      toast.error("Failed to add item");
    }
  };

  const toggleItemCompleted = async (itemId: string, listId: string) => {
    try {
      const { data: listItem } = await supabase
        .from("list_items")
        .select("completed")
        .match({ list_id: listId, item_id: itemId })
        .single();

      const { data: updatedListItem, error } = await supabase
        .from("list_items")
        .update({ completed: !listItem?.completed })
        .match({ list_id: listId, item_id: itemId })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setListItems((currentListItems) =>
        currentListItems.map((li) =>
          li.list_id === listId && li.item_id === itemId
            ? { ...li, completed: !li.completed }
            : li,
        ),
      );
    } catch (err) {
      console.error("Error toggling item completion:", err);
      toast.error("Failed to update item");
    }
  };

  const toggleItemEssential = async (itemId: string) => {
    try {
      const { data: item } = await supabase
        .from("items")
        .select("essential")
        .eq("id", itemId)
        .single();

      const { data: updatedItem, error } = await supabase
        .from("items")
        .update({ essential: !item?.essential })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setItems((currentItems) =>
        currentItems.map((i) =>
          i.id === itemId ? { ...i, essential: !i.essential } : i,
        ),
      );
    } catch (err) {
      console.error("Error toggling item essential status:", err);
      toast.error("Failed to update item");
    }
  };

  const deleteItemFromList = async (itemId: string, listId: string) => {
    try {
      const { error } = await supabase
        .from("list_items")
        .delete()
        .match({ list_id: listId, item_id: itemId });

      if (error) throw error;

      // Update local state
      setListItems((currentListItems) =>
        currentListItems.filter(
          (li) => !(li.list_id === listId && li.item_id === itemId),
        ),
      );
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  const renameItem = async (itemId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from("items")
        .update({ name: newName })
        .eq("id", itemId);

      if (error) throw error;

      // Update local state
      setItems((currentItems) =>
        currentItems.map((i) =>
          i.id === itemId ? { ...i, name: newName } : i,
        ),
      );
    } catch (err) {
      console.error("Error renaming item:", err);
      toast.error("Failed to rename item");
    }
  };

  const deleteList = async (listId: string) => {
    try {
      const { error } = await supabase.from("lists").delete().eq("id", listId);

      if (error) throw error;

      // Update local state
      setLists((currentLists) => currentLists.filter((l) => l.id !== listId));
      // Remove associated list items from local state
      setListItems((currentListItems) =>
        currentListItems.filter((li) => li.list_id !== listId),
      );
    } catch (err) {
      console.error("Error removing list:", err);
      toast.error("Failed to remove list");
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      // First remove all list_items references
      const { error: listItemsError } = await supabase
        .from("list_items")
        .delete()
        .eq("item_id", itemId);

      if (listItemsError) throw listItemsError;

      // Then remove the item itself
      const { error: itemError } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId);

      if (itemError) throw itemError;

      // Update local state
      setListItems((currentListItems) =>
        currentListItems.filter((li) => li.item_id !== itemId),
      );
      setItems((currentItems) => currentItems.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error("Error removing item completely:", err);
      toast.error("Failed to remove item");
    }
  };

  const findItemsByName = (query: string): Item[] => {
    const normalizedQuery = query.toLowerCase().trim();
    return items.filter((item) =>
      item.name.toLowerCase().includes(normalizedQuery),
    );
  };

  return (
    <AppContext.Provider
      value={{
        lists,
        items,
        listItems,
        isLoading,
        createList,
        createItem,
        toggleItemCompleted,
        toggleItemEssential,
        deleteItemFromList,
        deleteList,
        deleteItem,
        renameItem,
        findItemsByName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
