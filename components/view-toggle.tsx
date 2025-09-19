"use client"
import { GridIcon, ListIcon, MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ViewType = "grid" | "list" | "map"

interface ViewToggleProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={currentView === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="h-8 px-3"
      >
        <GridIcon className="w-4 h-4 mr-1" />
        Grid
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className="h-8 px-3"
      >
        <ListIcon className="w-4 h-4 mr-1" />
        List
      </Button>
      <Button
        variant={currentView === "map" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("map")}
        className="h-8 px-3"
      >
        <MapIcon className="w-4 h-4 mr-1" />
        Map
      </Button>
    </div>
  )
}
