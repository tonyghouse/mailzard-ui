'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { getTemplateApi } from '@/service/getTemplate'
import { getContactGroupsApi } from '@/service/contactGroupApi'

import { Template } from '@/model/Template'
import { Calendar, Clock, Users, Send, Loader2, Eye, ArrowLeft } from 'lucide-react'
import { scheduleCampaignApi } from '@/service/scheduleCampaignApi'
import { Campaign } from '@/model/Campaign'
import { toast } from 'sonner'


interface ContactGroup {
  id: number
  name: string
  description?: string
  contactCount?: number
}

export default function EmailCampaignPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateId = searchParams.get('templateId')
  const { getToken } = useAuth()

  const [template, setTemplate] = useState<Template | null>(null)
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [scheduling, setScheduling] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Form state
  const [campaignName, setCampaignName] = useState('')
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [error, setError] = useState('')
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [previewError, setPreviewError] = useState<string>('')
  const [previewLoading, setPreviewLoading] = useState(true)

  // Load template and contact groups
  useEffect(() => {
    const loadData = async () => {
      if (!templateId) {
        setError('No template ID provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const id = parseInt(templateId, 10)
        
        if (isNaN(id)) {
          throw new Error('Invalid template ID')
        }

        // Load template and contact groups in parallel
        const [templateData, groupsData] = await Promise.all([
          getTemplateApi(getToken, id),
          getContactGroupsApi(getToken)
        ])

        setTemplate(templateData)
        setContactGroups(groupsData)
        setCampaignName(`Campaign - ${templateData.name}`)
        
        // Set default date/time to current time
        const now = new Date()
        const dateStr = now.toISOString().split('T')[0]
        const timeStr = now.toTimeString().slice(0, 5)
        setScheduleDate(dateStr)
        setScheduleTime(timeStr)
        
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [templateId, getToken])

  // Convert MJML to HTML for preview
  useEffect(() => {
    if (!template) return

    const convertMjml = async () => {
      try {
        setPreviewLoading(true)
        const mjml2html = (await import('mjml-browser')).default

        const result = mjml2html(template.mjmlContent, {
          validationLevel: 'soft',
        })

        if (result.errors.length > 0) {
          setPreviewError(
            `MJML Errors: ${result.errors.map((e) => e.message).join(', ')}`
          )
        } else {
          setPreviewError('')
        }

        setHtmlContent(result.html)
      } catch (err) {
        setPreviewError(
          `Failed to parse MJML: ${
            err instanceof Error ? err.message : 'Unknown error'
          }`
        )
        setHtmlContent('')
      } finally {
        setPreviewLoading(false)
      }
    }

    convertMjml()
  }, [template])

  const handleGroupToggle = (groupId: number) => {
    setSelectedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const handleSchedule = async () => {
    // Validation
    if (!campaignName.trim()) {
      toast('Please enter a campaign name')
      return
    }

    if (selectedGroups.length === 0) {
      toast('Please select at least one contact group')
      return
    }

    if (!scheduleDate || !scheduleTime) {
      toast('Please select a date and time')
      return
    }

    try {
      setScheduling(true)

      // Combine date and time
      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`)

      const campaign : Campaign ={
        name: campaignName,
        templateId: template!.id,
        contactGroupIds: selectedGroups,
        scheduledAt: scheduledDateTime.toISOString()
      }
      // Call schedule API
      await scheduleCampaignApi(getToken, campaign);

      toast('Campaign scheduled successfully!')
      router.push('/campaigns') // Navigate to campaigns list
    } catch (err) {
      console.error('Schedule error:', err)
      toast(err instanceof Error ? err.message : 'Failed to schedule campaign')
    } finally {
      setScheduling(false)
    }
  }

  const handlePreview = () => {
    if (!template) return
    setShowPreview(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-card p-8 rounded-lg shadow-md max-w-md border border-border">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-card-foreground mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error || 'Template not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to templates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-accent rounded-md transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Schedule Email Campaign</h1>
                <p className="text-sm text-muted-foreground">Configure and schedule your email campaign</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Campaign Name */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
                className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Contact Groups */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Select Contact Groups</h3>
              </div>
              
              {contactGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No contact groups available</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {contactGroups.map((group) => (
                    <label
                      key={group.id}
                      className="flex items-start gap-3 p-3 rounded-md hover:bg-accent cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={() => handleGroupToggle(group.id)}
                        className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{group.name}</div>
                        {group.description && (
                          <div className="text-sm text-muted-foreground">{group.description}</div>
                        )}
                        {group.contactCount !== undefined && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {group.contactCount} contacts
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              {selectedGroups.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{selectedGroups.length}</span> group(s) selected
                  </p>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4">Schedule</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {scheduleDate && scheduleTime && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Campaign will be sent on{' '}
                    <span className="font-semibold text-foreground">
                      {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Schedule Button */}
            <button
              onClick={handleSchedule}
              disabled={scheduling || selectedGroups.length === 0}
              className="w-full px-6 py-4 text-base font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {scheduling ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scheduling Campaign...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Schedule Campaign
                </>
              )}
            </button>
          </div>

          {/* Right Column - Email Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-muted border-b border-border px-6 py-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Email Preview</h3>
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition"
                >
                  <Eye className="w-4 h-4" />
                  Full Preview
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-secondary rounded-md p-4">
                  <p className="text-sm text-muted-foreground mb-1">Template</p>
                  <p className="font-semibold text-foreground">{template.name}</p>
                </div>

                {previewError && (
                  <div className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2">
                    <p className="text-xs text-destructive">{previewError}</p>
                  </div>
                )}
                
                {previewLoading ? (
                  <div className="h-[400px] flex items-center justify-center border border-border bg-muted rounded-md">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Rendering preview...</p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-border rounded-md bg-white overflow-hidden">
                    <div className="relative h-[400px] w-full">
                      <iframe
                        srcDoc={htmlContent}
                        title={`Preview of ${template.name}`}
                        sandbox="allow-same-origin"
                        className="absolute inset-0 border-0"
                        style={{
                          transform: 'scale(0.6)',
                          transformOrigin: 'top left',
                          width: '166%',
                          height: '166%',
                        }}
                      />
                    </div>
                  </div>
                )}

                <details className="group">
                  <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                    View MJML source
                  </summary>
                  <pre className="mt-2 max-h-48 overflow-auto rounded-sm border border-border bg-background p-3 text-[11px] leading-relaxed text-foreground">
                    <code>{template.mjmlContent}</code>
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Full Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-4xl w-full h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Full Email Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-accent rounded-md transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-muted">
              {previewLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Rendering preview...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-border rounded-md h-full overflow-auto">
                  <iframe
                    srcDoc={htmlContent}
                    className="w-full h-full border-0"
                    title="Full Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}