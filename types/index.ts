export type Item = {
  id: string
  name: string
  essential: boolean
  created_at: string
  created_by: string
}

export type List = {
  id: string
  name: string
  created_at: string
  created_by: string
}

export type ListItem = {
  list_id: string
  item_id: string
  completed: boolean
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      items: {
        Row: Item
        Insert: Omit<Item, 'id' | 'created_at'>
        Update: Partial<Omit<Item, 'id' | 'created_at' | 'created_by'>>
      }
      lists: {
        Row: List
        Insert: Omit<List, 'id' | 'created_at'>
        Update: Partial<Omit<List, 'id' | 'created_at' | 'created_by'>>
      }
      list_items: {
        Row: ListItem
        Insert: Omit<ListItem, 'created_at'>
        Update: Partial<Omit<ListItem, 'created_at'>>
      }
    }
  }
} 