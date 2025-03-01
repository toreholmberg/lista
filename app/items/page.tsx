import ItemsContainer from "@/components/items/items-container"

export default function ItemsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Items</h1>
      <ItemsContainer />
    </div>
  )
}

