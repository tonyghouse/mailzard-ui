'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Template } from '@/model/Template'
import { useAuth } from '@clerk/nextjs'
import { getTemplateApi } from '@/service/getTemplate'
import { Menu, X, Eye, Save, Monitor, Tablet, Smartphone, Plus, Loader2 } from 'lucide-react'
import { createUserTemplateApi } from '@/service/saveUserTemplate'
import { toast } from "sonner";
import 'grapesjs/dist/css/grapes.min.css';

export default function EditPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateId = searchParams.get('templateId')
  const { getToken } = useAuth()
  
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [using, setUsing] = useState(false)
  const [error, setError] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePanel, setActivePanel] = useState('blocks')
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [saveAction, setSaveAction] = useState<'save' | 'use' | null>(null)
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!templateId) {
      setError('No template ID provided')
      setLoading(false)
      return
    }

    const loadTemplate = async () => {
      try {
        setLoading(true)
        const id = parseInt(templateId, 10)
        
        if (isNaN(id)) {
          throw new Error('Invalid template ID')
        }
        
        const data = await getTemplateApi(getToken, id)
        setTemplate(data)
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template')
      } finally {
        setLoading(false)
      }
    }

    loadTemplate()
  }, [templateId, getToken])

  useEffect(() => {
    if (!template || !containerRef.current) return

    const initEditor = async () => {
      const grapesjs = (await import('grapesjs')).default
      const grapesJsMjml = (await import('grapesjs-mjml')).default
      
      // await import('grapesjs/dist/css/grapes.min.css')

      editorRef.current = grapesjs.init({
        container: containerRef.current!,
        height: '100%',
        width: '100%',
        storageManager: false,
        plugins: [grapesJsMjml],
        pluginsOpts: {
          [grapesJsMjml as any]: {}
        },
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Tablet',
              width: '768px',
              widthMedia: '992px',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '480px',
            },
          ]
        },
        canvas: {
          styles: [],
          scripts: [],
        },
        blockManager: {
          appendTo: '#blocks',
        },
        layerManager: {
          appendTo: '#layers',
        },
        traitManager: {
          appendTo: '#traits',
        },
        selectorManager: {
          appendTo: '#styles',
        },
        styleManager: {
          appendTo: '#styles',
          sectors: [
            {
              name: 'Dimension',
              open: false,
              buildProps: ['width', 'height', 'max-width', 'min-height', 'padding', 'margin'],
            },
            {
              name: 'Typography',
              open: false,
              buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align'],
            },
            {
              name: 'Decorations',
              open: false,
              buildProps: ['background-color', 'border-radius', 'border', 'box-shadow'],
            },
          ],
        },
        panels: {
          defaults: [],
        },
      })

      editorRef.current.setComponents(template.mjmlContent)
    }

    initEditor()

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
      }
    }
  }, [template])

  const handleSave = () => {
    setSaveAction('save')
    setTemplateName('')
    setShowNameDialog(true)
  }

  const handleUse = () => {
    setSaveAction('use')
    setTemplateName('')
    setShowNameDialog(true)
  }

const executeAction = async () => {
  if (!editorRef.current || !templateName.trim()) {
    toast('Please enter a template name')
    return
  }

  // ⛔ Validate templateId BEFORE doing anything else
  if (templateId == null) {
    toast('Template ID is missing')
    return
  }

  const parsedTemplateId = Number(templateId)

  if (Number.isNaN(parsedTemplateId)) {
    toast('Invalid Template ID')
    return
  }

  try {
    if (saveAction === 'save') {
      setSaving(true)
    } else {
      setUsing(true)
    }

    setShowNameDialog(false)

    const mjml = editorRef.current.getHtml()


    const newTemplate: Template = {
      id: parsedTemplateId, // ✅ guaranteed number
      name: templateName.trim(),
      mjmlContent: mjml,
      type: template?.type || 'USER',
      userId: template?.userId,
    }

    const savedTemplate = await createUserTemplateApi(getToken, newTemplate)

    if (saveAction === 'save') {
      router.push(`/edit?templateId=${savedTemplate.id}`)
      toast('Template saved successfully!')
    } else {
      router.push(`/email?templateId=${savedTemplate.id}`)
    }
  } catch (err) {
    console.error(`${saveAction} error:`, err)
    toast(err instanceof Error ? err.message : `Failed to ${saveAction} template`)
  } finally {
    setSaving(false)
    setUsing(false)
    setSaveAction(null)
  }
}


  const handlePreview = () => {
    if (!editorRef.current) return
    
    const html = editorRef.current.runCommand('mjml-get-code').html
    const previewWindow = window.open('', '_blank')
    if (previewWindow) {
      previewWindow.document.write(html)
      previewWindow.document.close()
    }
  }

  const setDevice = (device: string) => {
    if (editorRef.current) {
      editorRef.current.setDevice(device)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading template...</p>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-card p-8 rounded-lg shadow-md max-w-md border border-border">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-card-foreground mb-2">Error Loading Template</h2>
          <p className="text-muted-foreground mb-4">{error || 'Template not found'}</p>
          <a href="/" className="text-primary hover:underline">← Back to templates</a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <style jsx global>{`
        /* Force light mode for all GrapesJS elements */
        .gjs-one-bg,
        .gjs-two-bg,
        .gjs-three-bg,
        .gjs-four-bg,
        #gjs {
          background: white !important;
          color: hsl(var(--foreground)) !important;
        }
        
        /* Canvas Area */
        .gjs-cv-canvas {
          background-color: hsl(var(--muted)) !important;
          width: 100%;
          height: 100%;
        }
        
        .gjs-frame {
          border: none !important;
          background: white !important;
        }
        
        /* Blocks */
        #blocks .gjs-block {
          width: auto;
          height: auto;
          min-height: 50px;
          padding: 10px;
          margin-bottom: 8px;
          background: white !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: var(--radius);
          transition: all 0.2s;
          color: hsl(var(--foreground)) !important;
        }
        
        #blocks .gjs-block:hover {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 2px 8px hsl(var(--primary) / 0.15);
        }
        
        .gjs-block__media {
          margin-bottom: 4px;
        }
        
        .gjs-block-label {
          font-size: 12px;
          color: hsl(var(--foreground)) !important;
        }
        
        /* Layers */
        .gjs-layer-wrapper,
        .gjs-layers {
          background: white !important;
        }
        
        .gjs-layer {
          background: white !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          color: hsl(var(--foreground)) !important;
        }
        
        .gjs-layer:hover {
          background: hsl(var(--accent)) !important;
        }
        
        .gjs-layer-title {
          color: hsl(var(--foreground)) !important;
        }
        
        .gjs-layer-vis,
        .gjs-layer-caret {
          color: hsl(var(--muted-foreground)) !important;
        }
        
        /* Traits */
        .gjs-trt-traits {
          background: white !important;
        }
        
        .gjs-trt-trait {
          background: white !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          padding: 8px 0;
        }
        
        .gjs-label {
          color: hsl(var(--foreground)) !important;
        }
        
        .gjs-traits-label {
          color: hsl(var(--muted-foreground)) !important;
          font-weight: 500;
        }
        
        .gjs-field,
        .gjs-field input,
        .gjs-field select,
        .gjs-field textarea {
          background: hsl(var(--input)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: var(--radius);
        }
        
        .gjs-field input:focus,
        .gjs-field select:focus,
        .gjs-field textarea:focus {
          border-color: hsl(var(--primary)) !important;
          outline: none;
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
        }
        
        /* Style Manager */
        .gjs-sm-sectors {
          background: white !important;
        }
        
        .gjs-sm-sector {
          background: white !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
        }
        
        .gjs-sm-sector .gjs-sm-title {
          background: hsl(var(--muted)) !important;
          color: hsl(var(--foreground)) !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          padding: 8px 12px;
          font-weight: 600;
        }
        
        .gjs-sm-properties {
          background: white !important;
        }
        
        .gjs-sm-property {
          background: white !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          padding: 8px 0;
        }
        
        .gjs-sm-label {
          color: hsl(var(--muted-foreground)) !important;
          font-weight: 500;
        }
        
        .gjs-sm-field {
          background: hsl(var(--input)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        
        .gjs-sm-field input,
        .gjs-sm-field select {
          background: hsl(var(--input)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        
        /* Selector Manager */
        .gjs-clm-tags {
          background: white !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        
        .gjs-clm-tag {
          background: hsl(var(--secondary)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        
        /* Buttons */
        .gjs-btn-prim {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border: none !important;
        }
        
        .gjs-btn-prim:hover {
          background: hsl(var(--primary) / 0.9) !important;
        }
        
        /* General Override - Force light backgrounds everywhere */
        .gjs-editor,
        .gjs-pn-panels,
        .gjs-pn-views,
        .gjs-pn-views-container,
        .gjs-blocks-c,
        .gjs-cv-canvas__frames {
          background: white !important;
          color: hsl(var(--foreground)) !important;
        }
        
        /* All text elements */
        .gjs-editor * {
          color: hsl(var(--foreground)) !important;
        }
        
        /* Icons */
        .gjs-editor svg {
          fill: hsl(var(--foreground)) !important;
        }
        
        /* Scrollbars */
        .gjs-layers::-webkit-scrollbar,
        .gjs-sm-sectors::-webkit-scrollbar,
        .gjs-blocks-c::-webkit-scrollbar {
          width: 8px;
        }
        
        .gjs-layers::-webkit-scrollbar-track,
        .gjs-sm-sectors::-webkit-scrollbar-track,
        .gjs-blocks-c::-webkit-scrollbar-track {
          background: hsl(var(--muted));
        }
        
        .gjs-layers::-webkit-scrollbar-thumb,
        .gjs-sm-sectors::-webkit-scrollbar-thumb,
        .gjs-blocks-c::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 4px;
        }
        
        .gjs-layers::-webkit-scrollbar-thumb:hover,
        .gjs-sm-sectors::-webkit-scrollbar-thumb:hover,
        .gjs-blocks-c::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>

      {/* Header */}
      <header className="bg-card border-b border-border px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-accent rounded-md transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <a href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm">
            ← <span className="hidden sm:inline">Back</span>
          </a>
          <div className="border-l border-border pl-2 md:pl-4">
            <h1 className="text-base md:text-lg font-semibold text-foreground truncate max-w-[150px] md:max-w-none">
              {template.name}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePreview}
            className="px-3 py-2 text-sm text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-2 text-sm text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </button>

          <button 
            onClick={handleUse}
            disabled={using}
            className="px-3 py-2 text-sm text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {using ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Using...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Use</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <div 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:relative
            inset-y-0 left-0
            w-64 md:w-72
            bg-card border-r border-border
            flex flex-col
            shadow-lg lg:shadow-none
            transition-transform duration-300 ease-in-out
            z-40
            mt-[57px] lg:mt-0
          `}
        >
          {/* Panel Switcher */}
          <div className="flex border-b border-border bg-muted p-1 gap-1">
            <button
              onClick={() => setActivePanel('blocks')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded transition ${
                activePanel === 'blocks'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Components
            </button>
            <button
              onClick={() => setActivePanel('layers')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded transition ${
                activePanel === 'layers'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Layers
            </button>
            <button
              onClick={() => setActivePanel('traits')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded transition ${
                activePanel === 'traits'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActivePanel('styles')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded transition ${
                activePanel === 'styles'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Styles
            </button>
          </div>
          
          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            <div className={`p-3 ${activePanel === 'blocks' ? 'block' : 'hidden'}`}>
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                Components
              </h3>
              <div id="blocks"></div>
            </div>
            
            <div className={`p-3 ${activePanel === 'layers' ? 'block' : 'hidden'}`}>
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                Layers
              </h3>
              <div id="layers"></div>
            </div>
            
            <div className={`p-3 ${activePanel === 'traits' ? 'block' : 'hidden'}`}>
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                Settings
              </h3>
              <div id="traits"></div>
            </div>
            
            <div className={`p-3 ${activePanel === 'styles' ? 'block' : 'hidden'}`}>
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                Styles
              </h3>
              <div id="styles"></div>
            </div>
          </div>
        </div>
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-[57px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Device Toolbar */}
          <div className="bg-card border-b border-border p-2 flex gap-1 justify-center">
            <button
              onClick={() => setDevice('Desktop')}
              className="p-2 hover:bg-accent rounded transition"
              title="Desktop View"
            >
              <Monitor className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => setDevice('Tablet')}
              className="p-2 hover:bg-accent rounded transition"
              title="Tablet View"
            >
              <Tablet className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => setDevice('Mobile')}
              className="p-2 hover:bg-accent rounded transition"
              title="Mobile View"
            >
              <Smartphone className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          
          {/* Canvas */}
          <div ref={containerRef} className="flex-1 overflow-auto"></div>
        </div>
      </div>

      {/* Name Dialog Modal */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {saveAction === 'save' ? 'Save Template' : 'Use Template'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enter a name for your template
            </p>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  executeAction()
                } else if (e.key === 'Escape') {
                  setShowNameDialog(false)
                  setSaveAction(null)
                }
              }}
              placeholder="e.g., My Email Template"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowNameDialog(false)
                  setSaveAction(null)
                  setTemplateName('')
                }}
                className="flex-1 px-4 py-2 text-sm text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                disabled={!templateName.trim()}
                className="flex-1 px-4 py-2 text-sm text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveAction === 'save' ? 'Save' : 'Use'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}