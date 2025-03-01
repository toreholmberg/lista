export type Item = {
  id: string
  name: string
  essential: boolean
}

export type ListItemReference = {
  itemId: string
  completed: boolean
}

export type ListData = {
  id: string
  name: string
  itemRefs: ListItemReference[]
} 