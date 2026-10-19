import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { LayoutTemplate, MousePointer2, Lock } from 'lucide-react';
import { CanvasItem } from '../../types/builder';
import CanvasItemCard from './CanvasItem';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  items: CanvasItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  selectionLabel?: string;
  onGoToTemplates?: () => void;
}

export default function Canvas({ items, selectedId, onSelect, onDelete, selectionLabel, onGoToTemplates }: Props) {
  const { t } = useLanguage();
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 relative">
      {/* Canvas header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">{t.canvas.title}</span>
          {items.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {t.canvas.elementCount(items.length)}
            </span>
          )}
        </div>
        {selectedId && (
          <span className="text-xs text-rose-500 flex items-center gap-1">
            <MousePointer2 className="w-3 h-3" />
            {selectionLabel ?? t.canvas.selectionLabel}
          </span>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`min-h-[calc(100vh-120px)] p-6 transition-colors ${
          isOver ? 'bg-rose-50' : 'bg-gray-100'
        }`}
      >
        {items.length === 0 ? (
          // Empty state
          <div
            onClick={onGoToTemplates}
            className={`h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${
              isOver ? 'border-rose-400 bg-rose-50' : 'border-gray-300 bg-white'
            } ${onGoToTemplates ? 'cursor-pointer hover:border-rose-300 hover:bg-rose-50' : ''}`}
          >
            <div className="text-4xl">{isOver ? '✨' : '🎨'}</div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                {isOver ? t.canvas.releaseToAddElement : t.canvas.dragHere}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {onGoToTemplates
                  ? t.canvas.tapToBrowse
                  : t.canvas.selectFromLeft}
              </p>
            </div>
          </div>
        ) : (
          <SortableContext items={items.map((i) => i.instanceId)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 max-w-2xl mx-auto">
              {items.map((item) => (
                <CanvasItemCard
                  key={item.instanceId}
                  item={item}
                  isSelected={selectedId === item.instanceId}
                  onSelect={() => onSelect(item.instanceId)}
                  onDelete={() => onDelete(item.instanceId)}
                />
              ))}

              {/* Drop indicator at bottom */}
              {items.length < 10 ? (
                <div
                  onClick={onGoToTemplates}
                  className={`h-16 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${
                    isOver ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-transparent'
                  } ${onGoToTemplates ? 'cursor-pointer hover:border-rose-300 hover:bg-rose-50' : ''}`}
                >
                  <span className="text-xs text-gray-400">
                    {isOver ? t.canvas.releaseToAdd : t.canvas.dropMore}
                  </span>
                </div>
              ) : (
                <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 px-5 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{t.canvas.maxReached}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.canvas.maxReachedDesc}</p>
                  </div>
                </div>
              )}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
