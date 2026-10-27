import { useEffect, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Search, Plus } from 'lucide-react';
import { TemplateDef } from '../../types/builder';
import { getTemplates, CATEGORIES } from '../../data/templates';
import { useLanguage } from '../../i18n/LanguageContext';

interface TemplateCardProps {
  template: TemplateDef;
  onAdd: (id: string) => void;
  draggable: boolean;
}

// Click/tap adds the template at the end of the canvas; on desktop it can also
// be dragged onto a specific spot (the Dashboard's DragOverlay follows the pointer).
function TemplateCard({ template, onAdd, draggable }: TemplateCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${template.id}`,
    data: { type: 'template', templateId: template.id },
    disabled: !draggable,
  });

  // A drag that ends back over the card would also fire a click; don't add twice
  const wasDragged = useRef(false);
  useEffect(() => {
    if (isDragging) {
      wasDragged.current = true;
      return;
    }
    // The stray click (if any) fires right after the drop; clear the flag after
    // it so a drop elsewhere doesn't swallow the next real click.
    const timer = setTimeout(() => { wasDragged.current = false; }, 50);
    return () => clearTimeout(timer);
  }, [isDragging]);

  const { t } = useLanguage();
  const categoryColor = CATEGORIES.find((c) => c.id === template.category)?.color ?? '';

  const add = () => {
    if (wasDragged.current) {
      wasDragged.current = false;
      return;
    }
    onAdd(template.id);
  };

  return (
    <div
      ref={setNodeRef}
      {...(draggable ? listeners : {})}
      {...attributes}
      onClick={add}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onAdd(template.id);
        }
      }}
      aria-label={t.leftPanel.add(template.name)}
      className={`group flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
        draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer active:scale-[0.98]'
      } ${isDragging ? 'opacity-30' : ''}`}
    >
      <div className="text-2xl leading-none mt-0.5 shrink-0">{template.icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-gray-800 leading-tight">{template.name}</div>
        <div className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-snug">{template.description}</div>
        <span className={`inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${categoryColor}`}>
          {t.categories[template.category]}
        </span>
      </div>
      <span
        aria-hidden="true"
        className="shrink-0 w-7 h-7 bg-rose-500 text-white rounded-lg flex items-center justify-center group-hover:bg-rose-600 transition mt-0.5"
      >
        <Plus className="w-4 h-4" />
      </span>
    </div>
  );
}

interface LeftPanelProps {
  onAdd: (templateId: string) => void;
  /** Drag onto the canvas (desktop). On mobile the canvas is another tab, so tap only. */
  draggable?: boolean;
}

export default function LeftPanel({ onAdd, draggable = true }: LeftPanelProps) {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = getTemplates(lang).filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside data-tour="templates" className="w-full md:w-72 bg-gray-50 md:border-r border-gray-100 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 bg-white">
        <h2 className="text-sm font-bold text-gray-800 mb-3">{t.leftPanel.title}</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.leftPanel.search}
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 bg-gray-50"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition ${
              !activeCategory ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t.leftPanel.all}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition ${
                activeCategory === cat.id ? 'bg-gray-800 text-white' : `${cat.color} hover:opacity-80`
              }`}
            >
              {t.categories[cat.id]}
            </button>
          ))}
        </div>
      </div>

      {/* Template list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-8">{t.leftPanel.noResults}</div>
        ) : (
          filtered.map((template) => (
            <TemplateCard key={template.id} template={template} onAdd={onAdd} draggable={draggable} />
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-400 text-center">
          {draggable ? t.leftPanel.dragHint : t.leftPanel.tapToAdd}
        </p>
      </div>
    </aside>
  );
}
