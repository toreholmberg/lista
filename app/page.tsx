import ListIndex from "@/components/lists/list-index";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Lists</h1>
      <ListIndex />
    </div>
  );
}
