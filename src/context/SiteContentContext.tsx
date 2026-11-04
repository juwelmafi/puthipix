"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteContent, DEFAULT_SITE_CONTENT } from "@/data/defaultSiteContent";

interface SiteContentContextType {
  content: SiteContent;
  loading: boolean;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: DEFAULT_SITE_CONTENT,
  loading: false,
  refreshContent: async () => {},
});

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/site-settings");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.content) {
          setContent(data.content);
        }
      }
    } catch {
      // Graceful fallback to default
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteContentContext.Provider
      value={{
        content,
        loading,
        refreshContent: fetchSettings,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
