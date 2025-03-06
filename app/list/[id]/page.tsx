"use client";

import React from "react";
import { useParams } from "next/navigation";

import ListView from "@/components/lists/list-view";
import { useAppContext } from "@/context/AppContext";
import Loader from "@/components/ui/loader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function ListPage() {
  // Use the useParams hook to get the route parameters
  const params = useParams();
  const listId = params.id as string;

  const { getList, isLoading } = useAppContext();
  const list = getList(listId);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to lists
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-2">{list.name}</h1>
      <p className="text-muted-foreground mb-6">
        Add, edit, and manage your items here.
      </p>
      <ListView listId={listId} />
    </div>
  );
}
