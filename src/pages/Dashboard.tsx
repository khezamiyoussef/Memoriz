import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Save, Eye, CheckCircle, Layers, LayoutDashboard, SlidersHorizontal, Globe, Loader2, ExternalLink, QrCode, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import memorizLogo from '../assets/memoriz-logo.svg';
import { CanvasItem } from '../types/builder';
import { getTemplate, countImages } from '../data/templates';
import { useIsMobile } from '../hooks/use-mobile';
import LeftPanel from '../components/builder/LeftPanel';
import Canvas from '../components/builder/Canvas';
import ElementEditor from '../components/builder/ElementEditor';
import TemplatePreview from '../components/builder/TemplatePreview';
import PreviewModal from '../components/builder/PreviewModal';
import PublishDialog from '../components/builder/PublishDialog';
import ShareDialog from '../components/builder/ShareDialog';
import { getMySite, saveDraft, publicSiteUrl, MySite } from '../lib/sites';
import { logoutUser, authErrorMessage } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';

// Drafts used to live only in localStorage; picked up once if the user has no site in the database yet.
const LEGACY_STORAGE_KEY = 'saas_canvas_items';
type MobileTab = 'templates' | 'canvas' | 'edit';

function loadLegacyItems(): CanvasItem[] {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { lang, setLang, t } = useLanguage();
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [site, setSite] = useState<MySite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('templates');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragId(null);

      if (!over) return;

      const activeData = active.data.current;

      if (activeData?.type === 'template') {
        const template = getTemplate(activeData.templateId, lang);
        if (!template) return;

        const newItem: CanvasItem = {
          instanceId: `${template.id}-${Date.now()}`,
          templateId: template.id,
          values: Object.fromEntries(template.fields.map((f) => [f.id, f.defaultValue])),
        };

        setCanvasItems((prev) => {
          if (prev.length >= 10) return prev;
          const overIndex = prev.findIndex((i) => i.instanceId === over.id);
          if (overIndex >= 0) {
            const updated = [...prev];
            updated.splice(overIndex + 1, 0, newItem);
            return updated;
          }
          return [...prev, newItem];
        });
        setSelectedId(newItem.instanceId);
      } else if (activeData?.type === 'canvas-item') {
        const oldIndex = canvasItems.findIndex((i) => i.instanceId === active.id);
        const newIndex = canvasItems.findIndex((i) => i.instanceId === over.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          setCanvasItems((prev) => arrayMove(prev, oldIndex, newIndex));
        }
      }
    },
    [canvasItems, lang]
  );

  const updateItem = useCallback((instanceId: string, values: Record<string, string>) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, values } : item))
    );
  }, []);

  const deleteItem = useCallback(
    (instanceId: string) => {
      setCanvasItems((prev) => prev.filter((i) => i.instanceId !== instanceId));
      if (selectedId === instanceId) setSelectedId(null);
    },
    [selectedId]
  );

  useEffect(() => {
    let cancelled = false;
    getMySite()
      .then((mySite) => {
        if (cancelled) return;
        setSite(mySite);
        setCanvasItems(mySite ? mySite.content : loadLegacyItems());
      })
      .catch(() => {
        if (!cancelled) toast.error(t.dashboard.loadError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
    // Load once; `t` changing language must not reload the canvas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      setSite(await saveDraft(canvasItems, lang));
      try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch { /* ignore */ }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error(t.dashboard.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTemplate = useCallback((templateId: string) => {
    const template = getTemplate(templateId, lang);
    if (!template || canvasItems.length >= 10) return;
    const newItem: CanvasItem = {
      instanceId: `${template.id}-${Date.now()}`,
      templateId: template.id,
      values: Object.fromEntries(template.fields.map((f) => [f.id, f.defaultValue])),
    };
    setCanvasItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.instanceId);
    setMobileTab('canvas');
  }, [canvasItems.length, lang]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    if (isMobile) setMobileTab('edit');
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && mobileTab === 'edit' && !selectedId) {
      setMobileTab('canvas');
    }
  }, [isMobile, mobileTab, selectedId]);

  const selectedItem = canvasItems.find((i) => i.instanceId === selectedId) ?? null;

  const activeDragTemplate =
    activeDragId?.startsWith('template-')
      ? getTemplate(activeDragId.replace('template-', ''), lang)
      : null;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      toast.error(authErrorMessage(err, t));
    }
  };

  const liveUrl = site?.slug && site.published_at ? publicSiteUrl(site.slug) : null;

  const header = (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-4 shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-2">
        <img src={memorizLogo} alt="Memoriz" className="w-7 h-7 object-contain" />
        <span className="font-bold text-gray-800 text-sm tracking-tight">Memoriz</span>
      </div>

      <div className="flex-1" />

      <div
        role="group"
        aria-label={t.dashboard.language}
        className="flex items-center rounded-lg bg-gray-100 p-0.5 text-[11px] font-semibold"
      >
        {(['en', 'fr'] as Lang[]).map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`px-2 py-1 rounded-md uppercase transition ${
              lang === code ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      {!isMobile && liveUrl && site?.slug && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 max-w-[16rem] text-xs text-green-700 hover:underline"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          <span className="font-medium">{t.dashboard.live}:</span>
          <span className="truncate">/{site.slug}</span>
        </a>
      )}

      {!isMobile && liveUrl && (
        <button
          onClick={() => setShowShare(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition"
        >
          <QrCode className="w-3.5 h-3.5" />
          {t.share.button}
        </button>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
          saved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {saved ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            {t.dashboard.saved}
          </>
        ) : (
          <>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {t.dashboard.save}
          </>
        )}
      </button>

      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition"
      >
        <Eye className="w-3.5 h-3.5" />
        {t.dashboard.preview}
      </button>

      <button
        onClick={() => setShowPublish(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition"
      >
        <Globe className="w-3.5 h-3.5" />
        {t.publish.button}
      </button>

      {/* RequireAuth sees the sign-out and redirects to /login */}
      <button
        onClick={handleLogout}
        title={t.dashboard.logout}
        aria-label={t.dashboard.logout}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
      >
        <LogOut className="w-4 h-4" />
      </button>

      <PublishDialog
        open={showPublish}
        onOpenChange={setShowPublish}
        items={canvasItems}
        site={site}
        onPublished={setSite}
      />

      {liveUrl && site?.slug && (
        <ShareDialog open={showShare} onOpenChange={setShowShare} url={liveUrl} slug={site.slug} />
      )}
    </header>
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        {header}

        {/* No room in the phone header, so the live link gets its own bar */}
        {liveUrl && (
          <div className="shrink-0 flex items-center gap-2 pl-4 pr-2 py-1.5 bg-green-50 border-b border-green-100 text-xs text-green-800">
            <a href={liveUrl} target="_blank" rel="noreferrer" className="flex min-w-0 flex-1 items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
              <span className="font-semibold shrink-0">{t.dashboard.live}</span>
              <span className="truncate text-green-700">{liveUrl.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-green-600" />
            </a>
            <button
              onClick={() => setShowShare(true)}
              className="flex shrink-0 items-center gap-1 rounded-md bg-white px-2.5 py-1 font-medium text-green-700 shadow-sm ring-1 ring-green-200"
            >
              <QrCode className="w-3.5 h-3.5" />
              {t.share.button}
            </button>
          </div>
        )}

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={`h-full ${mobileTab === 'templates' ? 'flex flex-col' : 'hidden'}`}>
              <LeftPanel onAdd={handleAddTemplate} draggable={false} />
            </div>

            <div className={`h-full ${mobileTab === 'canvas' ? 'flex flex-col' : 'hidden'}`}>
              <Canvas
                items={canvasItems}
                selectedId={selectedId}
                onSelect={handleSelect}
                onDelete={deleteItem}
                selectionLabel={t.dashboard.mobileSelectionLabel}
                onGoToTemplates={() => setMobileTab('templates')}
              />
            </div>

            <div className={`h-full overflow-y-auto ${mobileTab === 'edit' ? 'flex flex-col' : 'hidden'}`}>
              {selectedItem ? (
                <ElementEditor
                  item={selectedItem}
                  imageCount={countImages(canvasItems)}
                  onUpdate={updateItem}
                  onDelete={(id) => { deleteItem(id); setMobileTab('canvas'); }}
                  onClose={() => { setSelectedId(null); setMobileTab('canvas'); }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                  <span className="text-4xl">👆</span>
                  <p className="text-sm text-gray-500">{t.dashboard.mobileEditEmpty}</p>
                </div>
              )}
            </div>

            {showPreview && (
              <PreviewModal items={canvasItems} onClose={() => setShowPreview(false)} />
            )}
          </DndContext>
        </div>

        {/* Bottom tab bar */}
        <nav className="h-16 border-t border-gray-100 bg-white flex items-center justify-around shrink-0 px-2 safe-area-bottom">
          <button
            onClick={() => setMobileTab('templates')}
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
              mobileTab === 'templates' ? 'text-rose-500' : 'text-gray-400'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.dashboard.tabTemplates}</span>
          </button>

          <button
            onClick={() => setMobileTab('canvas')}
            className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
              mobileTab === 'canvas' ? 'text-rose-500' : 'text-gray-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.dashboard.tabCanvas}</span>
            {canvasItems.length > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {canvasItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => selectedItem && setMobileTab('edit')}
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
              mobileTab === 'edit' ? 'text-rose-500' : selectedItem ? 'text-gray-400' : 'text-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.dashboard.tabEdit}</span>
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {header}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <LeftPanel onAdd={handleAddTemplate} />

          <Canvas
            items={canvasItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={deleteItem}
          />

          {selectedItem && (
            <ElementEditor
              item={selectedItem}
              imageCount={countImages(canvasItems)}
              onUpdate={updateItem}
              onDelete={deleteItem}
              onClose={() => setSelectedId(null)}
            />
          )}

          {showPreview && (
            <PreviewModal items={canvasItems} onClose={() => setShowPreview(false)} />
          )}

          <DragOverlay>
            {activeDragTemplate && (
              <div className="bg-white border-2 border-rose-300 rounded-xl px-3 py-2 shadow-xl flex items-center gap-2 opacity-90 pointer-events-none">
                <span className="text-xl">{activeDragTemplate.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{activeDragTemplate.name}</span>
              </div>
            )}
            {activeDragId && !activeDragId.startsWith('template-') && (() => {
              const item = canvasItems.find((i) => i.instanceId === activeDragId);
              if (!item) return null;
              const tpl = getTemplate(item.templateId, lang);
              if (!tpl) return null;
              return (
                <div className="bg-white border-2 border-rose-300 rounded-xl p-3 shadow-xl w-64 opacity-90 pointer-events-none">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{tpl.icon}</span>
                    <span className="text-xs font-semibold text-gray-700">{tpl.name}</span>
                  </div>
                  <TemplatePreview templateId={item.templateId} values={item.values} />
                </div>
              );
            })()}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
