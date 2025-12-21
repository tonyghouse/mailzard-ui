'use client';

import React, { useState, useRef } from 'react';
import { Copy, Type, Image, Layout, Minus, Mail, CheckCircle2, Trash2, GripVertical, Grid3x3, AlignLeft, AlignCenter, AlignRight, List } from 'lucide-react';

// Component types that can be dragged
const componentTypes = [
  { id: 'heading', label: 'Heading', icon: Type },
  { id: 'text', label: 'Text Block', icon: Layout },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'button', label: 'Button', icon: Mail },
  { id: 'divider', label: 'Divider', icon: Minus },
  { id: 'spacer', label: 'Spacer', icon: AlignCenter },
  { id: 'list', label: 'List', icon: List },
  { id: 'grid', label: 'Grid Layout', icon: Grid3x3 },
];

// Component interface
interface EditorComponent {
  id: string;
  type: string;
  content: Record<string, any>;
  children?: EditorComponent[];
}

export default function EmailEditor() {
  const [components, setComponents] = useState<EditorComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  // Add component to canvas
  const addComponent = (type: string, parentId?: string) => {
    const newComponent: EditorComponent = {
      id: `${type}_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      children: type === 'grid' ? [] : undefined,
    };

    if (parentId) {
      // Add to parent (grid)
      setComponents(prev => addToParent(prev, parentId, newComponent));
    } else {
      setComponents([...components, newComponent]);
    }
  };

  // Add component to parent
  const addToParent = (comps: EditorComponent[], parentId: string, newComp: EditorComponent): EditorComponent[] => {
    return comps.map(c => {
      if (c.id === parentId && c.children) {
        return { ...c, children: [...c.children, newComp] };
      }
      if (c.children) {
        return { ...c, children: addToParent(c.children, parentId, newComp) };
      }
      return c;
    });
  };

  // Get default content for component type
  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'heading':
        return { text: 'Your Heading Here', level: 'h1', size: '32px', color: '#000000', align: 'left', fontWeight: 'bold' };
      case 'text':
        return { text: 'Add your text content here. This is a paragraph block.', color: '#333333', align: 'left', fontSize: '16px', lineHeight: '1.6' };
      case 'image':
        return { url: 'https://via.placeholder.com/600x300', alt: 'Image description', width: '100%', align: 'center' };
      case 'button':
        return { text: 'Click Here', url: '#', bgColor: '#0066cc', textColor: '#ffffff', align: 'left', borderRadius: '4px', padding: '12px 30px' };
      case 'divider':
        return { color: '#cccccc', height: '1px', width: '100%' };
      case 'spacer':
        return { height: '40px' };
      case 'list':
        return { items: ['List item 1', 'List item 2', 'List item 3'], style: 'bullet', color: '#333333' };
      case 'grid':
        return { columns: 2, gap: '20px', columnRatio: '1:1' };
      default:
        return {};
    }
  };

  // Find component by ID
  const findComponent = (comps: EditorComponent[], id: string): EditorComponent | null => {
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponent(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Update component content
  const updateComponent = (id: string, content: Record<string, any>) => {
    const update = (comps: EditorComponent[]): EditorComponent[] => {
      return comps.map(c => {
        if (c.id === id) return { ...c, content };
        if (c.children) return { ...c, children: update(c.children) };
        return c;
      });
    };
    setComponents(update(components));
  };

  // Delete component
  const deleteComponent = (id: string) => {
    const remove = (comps: EditorComponent[]): EditorComponent[] => {
      return comps.filter(c => c.id !== id).map(c => {
        if (c.children) return { ...c, children: remove(c.children) };
        return c;
      });
    };
    setComponents(remove(components));
    if (selectedId === id) setSelectedId(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string, isGrid: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedId === id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    if (isGrid) {
      setDragOverPosition('inside');
    } else if (y < height / 3) {
      setDragOverPosition('before');
    } else if (y > (2 * height) / 3) {
      setDragOverPosition('after');
    } else {
      setDragOverPosition(null);
    }

    setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      setDragOverPosition(null);
      return;
    }

    const draggedComp = findComponent(components, draggedId);
    if (!draggedComp) return;

    // Remove from old position
    const removeComp = (comps: EditorComponent[]): EditorComponent[] => {
      return comps.filter(c => c.id !== draggedId).map(c => {
        if (c.children) return { ...c, children: removeComp(c.children) };
        return c;
      });
    };

    let newComponents = removeComp(components);

    // Add to new position
    const insertComp = (comps: EditorComponent[]): EditorComponent[] => {
      const result: EditorComponent[] = [];
      for (const comp of comps) {
        if (comp.id === targetId) {
          const targetComp = findComponent(components, targetId);
          if (dragOverPosition === 'inside' && targetComp?.type === 'grid') {
            result.push({ ...comp, children: [...(comp.children || []), draggedComp] });
          } else if (dragOverPosition === 'before') {
            result.push(draggedComp);
            result.push(comp);
          } else if (dragOverPosition === 'after') {
            result.push(comp);
            result.push(draggedComp);
          } else {
            result.push(comp);
          }
        } else {
          if (comp.children) {
            result.push({ ...comp, children: insertComp(comp.children) });
          } else {
            result.push(comp);
          }
        }
      }
      return result;
    };

    newComponents = insertComp(newComponents);
    setComponents(newComponents);
    setDraggedId(null);
    setDragOverId(null);
    setDragOverPosition(null);
  };

  // Generate HTML
  const generateHTML = () => {
    const generateComponentHTML = (comp: EditorComponent): string => {
      switch (comp.type) {
        case 'heading':
          return `<${comp.content.level} style="font-size: ${comp.content.size}; color: ${comp.content.color}; margin: 20px 0; font-weight: ${comp.content.fontWeight}; text-align: ${comp.content.align};">${comp.content.text}</${comp.content.level}>`;
        case 'text':
          return `<p style="font-size: ${comp.content.fontSize}; line-height: ${comp.content.lineHeight}; color: ${comp.content.color}; margin: 15px 0; text-align: ${comp.content.align};">${comp.content.text}</p>`;
        case 'image':
          return `<div style="text-align: ${comp.content.align}; margin: 20px 0;"><img src="${comp.content.url}" alt="${comp.content.alt}" style="width: ${comp.content.width}; height: auto; display: inline-block;" /></div>`;
        case 'button':
          return `<div style="text-align: ${comp.content.align}; margin: 20px 0;"><table cellpadding="0" cellspacing="0" border="0" style="display: inline-block;"><tr><td style="background-color: ${comp.content.bgColor}; padding: ${comp.content.padding}; border-radius: ${comp.content.borderRadius};"><a href="${comp.content.url}" style="color: ${comp.content.textColor}; text-decoration: none; font-weight: bold; font-size: 16px;">${comp.content.text}</a></td></tr></table></div>`;
        case 'divider':
          return `<hr style="border: none; border-top: ${comp.content.height} solid ${comp.content.color}; margin: 30px 0; width: ${comp.content.width};" />`;
        case 'spacer':
          return `<div style="height: ${comp.content.height};"></div>`;
        case 'list':
          const listType = comp.content.style === 'bullet' ? 'ul' : 'ol';
          const listItems = comp.content.items.map((item: string) => `<li style="margin: 8px 0;">${item}</li>`).join('');
          return `<${listType} style="color: ${comp.content.color}; padding-left: 20px; margin: 15px 0;">${listItems}</${listType}>`;
        case 'grid':
          const ratio = comp.content.columnRatio.split(':').map(Number);
          const total = ratio.reduce((a: number, b: number) => a + b, 0);
          const widths = ratio.map((r: number) => `${(r / total) * 100}%`);
          
          const gridColumns = widths.map((width: string, i: number) => {
            const columnContent = comp.children?.[i] ? generateComponentHTML(comp.children[i]) : '';
            return `<td style="width: ${width}; vertical-align: top; padding: 10px;">${columnContent}</td>`;
          }).join('');
          
          return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 20px 0;"><tr>${gridColumns}</tr></table>`;
        default:
          return '';
      }
    };

    const htmlParts = components.map(generateComponentHTML);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; padding: 40px;">
          <tr>
            <td>
              ${htmlParts.join('\n              ')}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    const html = generateHTML();
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render component
  const renderComponent = (comp: EditorComponent, level: number = 0) => {
    const isSelected = selectedId === comp.id;
    const isDragging = draggedId === comp.id;
    const isDragOver = dragOverId === comp.id;

    return (
      <div key={comp.id} className="relative">
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, comp.id)}
          onDragOver={(e) => handleDragOver(e, comp.id, comp.type === 'grid')}
          onDrop={(e) => handleDrop(e, comp.id)}
          onClick={(e) => { e.stopPropagation(); setSelectedId(comp.id); }}
          className={`group relative bg-background border-2 rounded-md p-4 cursor-move transition-all ${
            isDragging ? 'opacity-50' : ''
          } ${
            isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground'
          } ${
            isDragOver && dragOverPosition === 'before' ? 'border-t-4 border-t-primary' : ''
          } ${
            isDragOver && dragOverPosition === 'after' ? 'border-b-4 border-b-primary' : ''
          } ${
            isDragOver && dragOverPosition === 'inside' ? 'ring-2 ring-primary' : ''
          }`}
        >
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          {comp.type === 'heading' && (
            <div style={{ fontSize: comp.content.size, color: comp.content.color, textAlign: comp.content.align, fontWeight: comp.content.fontWeight }}>
              {comp.content.text}
            </div>
          )}
          {comp.type === 'text' && (
            <p style={{ color: comp.content.color, textAlign: comp.content.align, fontSize: comp.content.fontSize, lineHeight: comp.content.lineHeight }}>
              {comp.content.text}
            </p>
          )}
          {comp.type === 'image' && (
            <div style={{ textAlign: comp.content.align }}>
              <img src={comp.content.url} alt={comp.content.alt} style={{ width: comp.content.width }} className="h-auto" />
            </div>
          )}
          {comp.type === 'button' && (
            <div style={{ textAlign: comp.content.align }}>
              <button
                style={{ 
                  backgroundColor: comp.content.bgColor, 
                  color: comp.content.textColor,
                  borderRadius: comp.content.borderRadius,
                  padding: comp.content.padding
                }}
                className="font-semibold"
              >
                {comp.content.text}
              </button>
            </div>
          )}
          {comp.type === 'divider' && (
            <hr style={{ borderColor: comp.content.color, borderWidth: comp.content.height, width: comp.content.width }} />
          )}
          {comp.type === 'spacer' && (
            <div style={{ height: comp.content.height }} className="bg-muted/20 border border-dashed border-muted-foreground/30 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Spacer: {comp.content.height}</span>
            </div>
          )}
          {comp.type === 'list' && (
            <div style={{ color: comp.content.color }}>
              {comp.content.style === 'bullet' ? (
                <ul className="pl-5">
                  {comp.content.items.map((item: string, i: number) => (
                    <li key={i} className="my-2">{item}</li>
                  ))}
                </ul>
              ) : (
                <ol className="pl-5">
                  {comp.content.items.map((item: string, i: number) => (
                    <li key={i} className="my-2">{item}</li>
                  ))}
                </ol>
              )}
            </div>
          )}
          {comp.type === 'grid' && (
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <Grid3x3 className="w-3 h-3" />
                Grid ({comp.content.columns} columns)
              </div>
              <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${comp.content.columns}, 1fr)` }}>
                {Array.from({ length: comp.content.columns }).map((_, i) => (
                  <div key={i} className="min-h-[100px] border-2 border-dashed border-muted-foreground/30 rounded p-2">
                    {comp.children?.[i] ? (
                      renderComponent(comp.children[i], level + 1)
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center gap-2">
                        <Layout className="w-6 h-6 text-muted-foreground/50" />
                        <p className="text-xs text-muted-foreground">Drop component here</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedId(comp.id); }}
                          className="text-xs text-primary hover:underline"
                        >
                          Add Component
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const selectedComponent = findComponent(components, selectedId || '');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Email Template Editor</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag components to reorder • Click to select and edit</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Components Sidebar */}
          <div className="col-span-3">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-6">
              <h2 className="font-semibold text-foreground mb-4">Components</h2>
              <div className="space-y-2">
                {componentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        if (selectedComponent?.type === 'grid') {
                          addComponent(type.id, selectedComponent.id);
                        } else {
                          addComponent(type.id);
                        }
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
              {selectedComponent?.type === 'grid' && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
                  <p className="text-xs text-primary font-medium">
                    Grid selected: Components will be added to this grid
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="bg-muted/30 rounded-lg p-8 min-h-[600px]">
                {components.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Click on components to add them to your email</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {components.map((comp) => renderComponent(comp))}
                  </div>
                )}
              </div>

              {components.length > 0 && (
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setComponents([])}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy HTML'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Properties Sidebar */}
          <div className="col-span-3">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h2 className="font-semibold text-foreground mb-4">Properties</h2>
              {selectedComponent ? (
                <div className="space-y-4">
                  {selectedComponent.type === 'heading' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Text</label>
                        <input
                          type="text"
                          value={selectedComponent.content.text}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, text: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Heading Level</label>
                        <select
                          value={selectedComponent.content.level}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, level: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="h1">H1</option>
                          <option value="h2">H2</option>
                          <option value="h3">H3</option>
                          <option value="h4">H4</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Font Size</label>
                        <input
                          type="text"
                          value={selectedComponent.content.size}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, size: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Alignment</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={() => updateComponent(selectedComponent.id, { ...selectedComponent.content, align })}
                              className={`flex-1 px-3 py-2 border rounded-md transition-colors ${
                                selectedComponent.content.align === align 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'border-border hover:bg-accent'
                              }`}
                            >
                              {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                              {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                              {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                        <input
                          type="color"
                          value={selectedComponent.content.color}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, color: e.target.value })}
                          className="w-full h-10 border border-border rounded-md"
                        />
                      </div>
                    </>
                  )}
                  {selectedComponent.type === 'text' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Text</label>
                        <textarea
                          value={selectedComponent.content.text}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, text: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Font Size</label>
                        <input
                          type="text"
                          value={selectedComponent.content.fontSize}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, fontSize: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Line Height</label>
                        <input
                          type="text"
                          value={selectedComponent.content.lineHeight}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, lineHeight: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Alignment</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={() => updateComponent(selectedComponent.id, { ...selectedComponent.content, align })}
                              className={`flex-1 px-3 py-2 border rounded-md transition-colors ${
                                selectedComponent.content.align === align 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'border-border hover:bg-accent'
                              }`}
                            >
                              {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                              {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                              {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                        <input
                          type="color"
                          value={selectedComponent.content.color}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, color: e.target.value })}
                          className="w-full h-10 border border-border rounded-md"
                        />
                      </div>
                    </>
                  )}
                  {selectedComponent.type === 'image' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Image URL</label>
                        <input
                          type="text"
                          value={selectedComponent.content.url}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, url: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Alt Text</label>
                        <input
                          type="text"
                          value={selectedComponent.content.alt}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, alt: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Width</label>
                        <input
                          type="text"
                          value={selectedComponent.content.width}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, width: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          placeholder="e.g., 100%, 400px"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Alignment</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={() => updateComponent(selectedComponent.id, { ...selectedComponent.content, align })}
                              className={`flex-1 px-3 py-2 border rounded-md transition-colors ${
                                selectedComponent.content.align === align 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'border-border hover:bg-accent'
                              }`}
                            >
                              {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                              {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                              {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {selectedComponent.type === 'button' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Button Text</label>
                        <input
                          type="text"
                          value={selectedComponent.content.text}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, text: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">URL</label>
                        <input
                          type="text"
                          value={selectedComponent.content.url}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, url: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Alignment</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={() => updateComponent(selectedComponent.id, { ...selectedComponent.content, align })}
                              className={`flex-1 px-3 py-2 border rounded-md transition-colors ${
                                selectedComponent.content.align === align 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'border-border hover:bg-accent'
                              }`}
                            >
                              {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                              {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                              {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Background Color</label>
                        <input
                          type="color"
                          value={selectedComponent.content.bgColor}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, bgColor: e.target.value })}
                          className="w-full h-10 border border-border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Text Color</label>
                        <input
                          type="color"
                          value={selectedComponent.content.textColor}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, textColor: e.target.value })}
                          className="w-full h-10 border border-border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Border Radius</label>
                        <input
                          type="text"
                          value={selectedComponent.content.borderRadius}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, borderRadius: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          placeholder="e.g., 4px"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Padding</label>
                        <input
                          type="text"
                          value={selectedComponent.content.padding}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, padding: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          placeholder="e.g., 12px 30px"
                        />
                      </div>
                    </>
                  )}
                  {selectedComponent.type === 'divider' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                        <input
                          type="color"
                          value={selectedComponent.content.color}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, color: e.target.value })}
                          className="w-full h-10 border border-border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Height</label>
                        <input
                          type="text"
                          value={selectedComponent.content.height}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, height: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          placeholder="e.g., 1px"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Width</label>
                        <input
                          type="text"
                          value={selectedComponent.content.width}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, width: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          placeholder="e.g., 100%"
                        />
                      </div>
                    </>
                  )}
                  {selectedComponent.type === 'spacer' && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Height</label>
                      <input
                        type="text"
                        value={selectedComponent.content.height}
                        onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, height: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        placeholder="e.g., 40px"
                      />
                    </div>
                  )}
                  {selectedComponent.type === 'list' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">List Style</label>
                        <select
                          value={selectedComponent.content.style}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, style: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="bullet">Bullet Points</option>
                          <option value="numbered">Numbered</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">List Items (one per line)</label>
                        <textarea
                          value={selectedComponent.content.items.join('\n')}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, items: e.target.value.split('\n') })}
                          rows={5}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                        <input
                          type="color"
                          value={selectedComponent.content.color}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, color: e.target.value })}
                          className="w-full h-10 border border-border rounded-md"
                        />
                      </div>
                    </>
                  )}
                  {selectedComponent.type === 'grid' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Number of Columns</label>
                        <select
                          value={selectedComponent.content.columns}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, columns: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="2">2 Columns</option>
                          <option value="3">3 Columns</option>
                          <option value="4">4 Columns</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Column Ratio</label>
                        <input
                          type="text"
                          value={selectedComponent.content.columnRatio}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, columnRatio: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          placeholder="e.g., 1:1 or 2:1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Use ratio like 1:1, 2:1, or 1:2:1</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Gap Between Columns</label>
                        <input
                          type="text"
                          value={selectedComponent.content.gap}
                          onChange={(e) => updateComponent(selectedComponent.id, { ...selectedComponent.content, gap: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          placeholder="e.g., 20px"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t border-border space-y-2">
                    <button
                      onClick={() => deleteComponent(selectedComponent.id)}
                      className="w-full px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                    >
                      Delete Component
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a component to edit its properties</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}