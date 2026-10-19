import { useRef, ChangeEvent } from 'react';
import { X, Trash2, Upload, Image } from 'lucide-react';
import YouTubeField from './YouTubeField';
import { CanvasItem, FieldDef } from '../../types/builder';
import { getTemplate, MAX_IMAGES } from '../../data/templates';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  item: CanvasItem;
  onUpdate: (instanceId: string, values: Record<string, string>) => void;
  onDelete: (instanceId: string) => void;
  onClose: () => void;
  /** Pictures used across the whole canvas, for the MAX_IMAGES limit */
  imageCount: number;
}

export default function ElementEditor({ item, onUpdate, onDelete, onClose, imageCount }: Props) {
  const { lang, t } = useLanguage();
  const template = getTemplate(item.templateId, lang);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  // Latest values, so results that arrive later (e.g. a YouTube search) don't undo newer edits
  const itemRef = useRef(item);
  itemRef.current = item;

  if (!template) return null;

  const patchValues = (patch: Record<string, string>) => {
    const current = itemRef.current;
    const values = { ...current.values, ...patch };
    // Several patches can land before the next render (e.g. all songs' searches at once)
    itemRef.current = { ...current, values };
    onUpdate(current.instanceId, values);
  };

  const handleFieldChange = (fieldId: string, value: string) => patchValues({ [fieldId]: value });

  const handleImageUpload = (fieldId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    // Replacing an existing picture is fine; adding a new one must stay within the limit
    if (!item.values[fieldId] && imageCount >= MAX_IMAGES) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      handleFieldChange(fieldId, result);
    };
    reader.readAsDataURL(file);
  };

  const renderField = (field: FieldDef) => {
    const value = item.values[field.id] ?? field.defaultValue;

    if (field.type === 'image') {
      return (
        <div key={field.id} className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600">{field.label}</label>
          {value ? (
            <div className="relative group">
              <img src={value} alt={field.label} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
              <button
                onClick={() => handleFieldChange(field.id, '')}
                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-md opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : imageCount >= MAX_IMAGES ? (
            <div className="w-full h-20 border-2 border-dashed border-amber-200 bg-amber-50 rounded-lg flex items-center justify-center px-3 text-center">
              <span className="text-[11px] leading-snug text-amber-700">{t.editor.photoLimitReached(MAX_IMAGES)}</span>
            </div>
          ) : (
            <div
              onClick={() => fileRefs.current[field.id]?.click()}
              className="w-full h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition"
            >
              <Image className="w-5 h-5 text-gray-300" />
              <span className="text-xs text-gray-400">{t.editor.clickToUpload}</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={(el) => { fileRefs.current[field.id] = el; }}
            onChange={(e) => handleImageUpload(field.id, e)}
          />
          {value && (
            <button
              onClick={() => fileRefs.current[field.id]?.click()}
              className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 transition"
            >
              <Upload className="w-3 h-3" />
              {t.editor.changeImage}
            </button>
          )}
        </div>
      );
    }

    if (field.type === 'number') {
      const min = field.min ?? 0;
      const max = field.max ?? 9999;
      return (
        <div key={field.id} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-600">{field.label}</label>
            <span className="text-[10px] text-gray-400">{min}–{max}</span>
          </div>
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            onBlur={(e) => {
              const num = parseInt(e.target.value, 10);
              const clamped = isNaN(num) ? min : Math.min(max, Math.max(min, num));
              handleFieldChange(field.id, String(clamped));
            }}
            className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent transition"
          />
        </div>
      );
    }

    if (field.type === 'color') {
      return (
        <div key={field.id} className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600">{field.label}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#e11d48'}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-10 h-8 rounded border border-gray-200 cursor-pointer p-0.5"
            />
            <span className="text-xs text-gray-500">{value || '#e11d48'}</span>
          </div>
        </div>
      );
    }

    if (field.type === 'youtube') {
      return (
        <YouTubeField
          key={`${item.instanceId}-${field.id}`}
          field={field}
          values={item.values}
          onPatch={patchValues}
        />
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.id} className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600">{field.label}</label>
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent resize-none transition"
          />
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">{field.label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent transition"
        />
      </div>
    );
  };

  return (
    <div className="w-full md:w-72 bg-white md:border-l border-gray-100 flex flex-col h-full md:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">{template.icon}</span>
            <span className="text-sm font-semibold text-gray-800">{template.name}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{t.editor.subtitle}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {template.fields.some((f) => f.type === 'image') && (
          <p className={`text-[11px] ${imageCount >= MAX_IMAGES ? 'text-amber-600' : 'text-gray-400'}`}>
            {t.editor.photoCount(imageCount, MAX_IMAGES)}
          </p>
        )}
        {template.fields.map(renderField)}
      </div>

      {/* Delete */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={() => onDelete(item.instanceId)}
          className="flex items-center gap-2 w-full justify-center py-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {t.editor.remove}
        </button>
      </div>
    </div>
  );
}
