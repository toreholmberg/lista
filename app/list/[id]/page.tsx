"use client"

import React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import ListView from "@/components/lists/list-view"

export default function ListPage() {
  // Use the useParams hook to get the route parameters
  const params = useParams();
  const listId = params.id as string;
  
  return (
    <div className="container mx-auto py-8">
      <ListView listId={listId} />
    </div>
  )
}

