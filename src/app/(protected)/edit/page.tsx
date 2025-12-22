'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Template } from '@/model/Template'
import { useAuth } from '@clerk/nextjs'
import { getTemplateApi } from '@/service/getTemplate'

export default function EditPage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  const { getToken } = useAuth()
  
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
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
      // Dynamically import GrapesJS and MJML plugin
      const grapesjs = (await import('grapesjs')).default
      const grapesJsMjml = (await import('grapesjs-mjml')).default

      // Initialize editor
      editorRef.current = grapesjs.init({
        container: containerRef.current!,
        height: '100%',
        width: '100%',
        storageManager: false,
        plugins: [grapesJsMjml],
        pluginsOpts: {
          [grapesJsMjml as any]: {
            // Enable all blocks
          }
        },
        blockManager: {
          appendTo: '.blocks-container',
        },
        layerManager: {
          appendTo: '.layers-container',
        },
        traitManager: {
          appendTo: '.traits-container',
        },
        selectorManager: {
          appendTo: '.styles-container',
        },
        styleManager: {
          appendTo: '.styles-container',
          sectors: [{
            name: 'General',
            open: true,
            buildProps: ['width', 'height', 'background-color', 'color', 'font-size', 'font-family', 'font-weight', 'text-align', 'padding', 'margin'],
          }],
        },
        panels: {
          defaults: [
            {
              id: 'basic-actions',
              el: '.panel__basic-actions',
              buttons: [
                {
                  id: 'visibility',
                  active: true,
                  className: 'btn-toggle-borders',
                  label: '<i class="fa fa-clone"></i>',
                  command: 'sw-visibility',
                },
              ],
            },
            {
              id: 'devices',
              el: '.panel__devices',
              buttons: [
                {
                  id: 'device-desktop',
                  label: '<i class="fa fa-desktop"></i>',
                  command: 'set-device-desktop',
                  active: true,
                  togglable: false,
                },
                {
                  id: 'device-mobile',
                  label: '<i class="fa fa-mobile"></i>',
                  command: 'set-device-mobile',
                  togglable: false,
                },
              ],
            },
          ],
        },
      })

      // Load the template content
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
    if (!editorRef.current) return
    
    const mjml = editorRef.current.getHtml()
    const html = editorRef.current.runCommand('mjml-get-code').html
    
    console.log('MJML:', mjml)
    console.log('HTML:', html)
    
    // TODO: Call your save API here
    alert('Save functionality - check console for MJML and HTML output')
  }

  const handlePreview = () => {
    if (!editorRef.current) return
    
    const html = editorRef.current.runCommand('mjml-get-code').html
    const previewWindow = window.open('', '_blank')
    previewWindow?.document.write(html)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading template...</p>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Template</h2>
          <p className="text-gray-600 mb-4">{error || 'Template not found'}</p>
          <a href="/" className="text-blue-600 hover:underline">← Back to templates</a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            ← Back
          </a>
          <div className="border-l border-gray-300 pl-4">
            <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePreview}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            👁️ Preview
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            💾 Save Changes
          </button>
        </div>
      </header>

      {/* GrapesJS Editor Container */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar - Blocks */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3">Components</h3>
            <div className="blocks-container"></div>
          </div>
          <div className="p-4 border-t">
            <h3 className="text-sm font-semibold mb-3">Layers</h3>
            <div className="layers-container"></div>
          </div>
        </div>
        
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          <div className="panel__devices bg-white border-b p-2 flex gap-2"></div>
          <div className="panel__basic-actions bg-white border-b p-2"></div>
          <div ref={containerRef} className="flex-1" id="gjs"></div>
        </div>
        
        {/* Right Sidebar - Styles & Traits */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3">Traits</h3>
            <div className="traits-container"></div>
          </div>
          <div className="p-4 border-t">
            <h3 className="text-sm font-semibold mb-3">Styles</h3>
            <div className="styles-container"></div>
          </div>
        </div>
      </div>
    </div>
  )
}