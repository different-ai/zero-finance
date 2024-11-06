import { useFilterStore } from '@/renderer/stores/task-filter-store'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TaskFilters() {
  const { status, search, setStatus, setSearch } = useFilterStore()

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[200px]"
      />
      <Select
        value={status}
        onValueChange={(value: 'all' | 'open' | 'completed') => setStatus(value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 