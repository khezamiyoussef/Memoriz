import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { CanvasItem as CanvasItemType } from '../../types/builder';
import { getTemplate } from '../../data/templates';
import TemplatePreview from './TemplatePreview';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  item: CanvasItemType;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function CanvasItemCard({ item, isSelected, onSelect, onDelete }: Props) {
  const { lang, t } = useLanguage();
  const template = getTemplate(item.templateId, lang);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.instanceId,
    data: { type: 'canvas-item' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!template) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border-2 transition-all bg-white shadow-sm ${
        isDragging ? 'opacity-40 shadow-xl scale-95' : 'opacity-100'
      } ${
        isSelected
          ? 'border-rose-400 shadow-rose-100 shadow-md'
          : 'border-gray-200 hover:border-rose-200 hover:shadow-md'
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        {/* Drag handle */}
        <button
          style={{ touchAction: 'none' }}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-2 md:p-0.5 -ml-1"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="w-5 h-5 md:w-4 md:h-4" />
        </button>

        <span className="text-sm">{template.icon}</span>
        <span className="text-xs font-semibold text-gray-700 flex-1">{template.name}</span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
          <button
            onClick={onSelect}
            className="p-1.5 hover:bg-rose-50 rounded-lg transition"
            title={t.canvasItem.edit}
          >
            <Pencil className="w-3.5 h-3.5 text-rose-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-50 rounded-lg transition"
            title={t.canvasItem.delete}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div onClick={onSelect} className="p-3 cursor-pointer">
        <TemplatePreview templateId={item.templateId} values={item.values} />
      </div>

      {/* Selected ring indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow" />
      )}
    </div>
  );
}
