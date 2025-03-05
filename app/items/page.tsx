import ItemView from "@/components/items/item-view"

export default function ItemsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Item library</h1>
      <p className="text-muted-foreground mb-6">Add, edit, and manage your items here.</p>
      <ItemView />
    </div>
  )
}

