'use client';

import { TileCard } from './TileCard';
import type { Tile } from '@/types';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface TileGridProps {
  tiles: Tile[];
  onReorder?: (tiles: Tile[]) => void;
  onEdit?: (tile: Tile) => void;
}

function SortableTile({ tile, onEdit }: { tile: Tile; onEdit?: (tile: Tile) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tile.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/tile">
      {/* 拖拽手柄 */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1 rounded opacity-0 group-hover/tile:opacity-100 hover:bg-white/10 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} className="text-[rgb(var(--muted-foreground))]" />
      </button>
      <div onClick={() => onEdit?.(tile)} className="cursor-pointer">
        <TileCard tile={tile} className={sizeToClass(tile.size)} />
      </div>
    </div>
  );
}

export function TileGrid({ tiles, onReorder, onEdit }: TileGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tiles.findIndex((t) => t.id === active.id);
    const newIndex = tiles.findIndex((t) => t.id === over.id);

    const reordered = [...tiles];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorder?.(reordered);
  };

  if (tiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[rgb(var(--muted-foreground))]">
        <p className="text-lg mb-2">还没有磁贴</p>
        <p className="text-sm">点击右上角 + 创建你的第一个磁贴</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tiles.map((t) => t.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] gap-4">
          {tiles.map((tile) => (
            <SortableTile key={tile.id} tile={tile} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function sizeToClass(size: string) {
  switch (size) {
    case 'large':
      return 'md:col-span-2 md:row-span-2';
    case 'medium':
      return 'md:col-span-2';
    default:
      return '';
  }
}
