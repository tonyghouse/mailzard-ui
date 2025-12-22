"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPaginatedTemplatesApi } from "@/service/getPaginatedTemplates";
import type { Template } from "@/model/Template";

import { useAuth } from "@clerk/nextjs";
import { Calendar, Loader2, AlertCircle, RefreshCw } from "lucide-react";

import { Pagination } from "@/components/generic/pagination";
import TemplateCard from "@/components/templates/TemplateCard";




const REFRESH_INTERVAL = 30 * 1000; // 30 seconds

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken } = useAuth();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisibleRef = useRef(true);
  const needsRefreshRef = useRef(false);

  const loadTemplates = useCallback(async (page: number, isManualRefresh = false) => {
    if (loading && !isManualRefresh) return;

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      const res = await getPaginatedTemplatesApi(
        getToken,
        page - 1,
      );

      setTemplates(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
      setLastRefresh(new Date());
      needsRefreshRef.current = false;
    } catch (e) {
      console.error("Error fetching  templates", e);
      setError("Unable to load  templates. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [getToken, loading]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Manual refresh
  const handleManualRefresh = () => {
    loadTemplates(currentPage, true);
  };

  // Setup auto-refresh
  useEffect(() => {
    const startAutoRefresh = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      refreshIntervalRef.current = setInterval(() => {
        if (isPageVisibleRef.current) {
          loadTemplates(currentPage, true);
        } else {
          needsRefreshRef.current = true;
        }
      }, REFRESH_INTERVAL);
    };

    startAutoRefresh();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [currentPage, loadTemplates]);

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;

      if (!document.hidden && needsRefreshRef.current) {
        loadTemplates(currentPage, true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentPage, loadTemplates]);

  // Load templates when page changes
  useEffect(() => {
    loadTemplates(currentPage);
  }, [currentPage]);

  // const formatLastRefresh = () => {
  //   const now = new Date();
  //   const diffMs = now.getTime() - lastRefresh.getTime();
  //   const diffSecs = Math.floor(diffMs / 1000);
  //   const diffMins = Math.floor(diffSecs / 60);

  //   if (diffMins < 1) return "Just now";
  //   if (diffMins === 1) return "1 minute ago";
  //   return `${diffMins} minutes ago`;
  // };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                   Templates
                </h1>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex items-center gap-3"> 
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="h-9 w-9 rounded-lg bg-secondary hover:bg-secondary/80 
                  disabled:opacity-50 transition-all flex items-center justify-center
                  group"
                title="Refresh templates"
              >
                <RefreshCw 
                  className={`h-4 w-4 text-muted-foreground group-hover:text-foreground 
                    transition-all ${isRefreshing ? "animate-spin" : ""}`} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={() => loadTemplates(currentPage)}
                className="text-xs underline mt-1 hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Loading  templates...</p>
          </div>
        ) : templates.length > 0 ? (
          <>
            {/* Templates Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              No  templates yet
            </h3>

            <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
              Your  templates will appear here. Start planning your content!
            </p>

            <button
              onClick={() => router.push("/editor")}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground 
                hover:opacity-90 transition-all shadow-sm font-medium text-sm"
            >
              Create Your First Template
            </button>
          </div>
        )}
      </div>
    </main>
  );
}