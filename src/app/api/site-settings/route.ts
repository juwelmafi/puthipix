import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { DEFAULT_SITE_CONTENT } from "@/data/defaultSiteContent";

export async function GET() {
  try {
    try {
      await connectToDatabase();
      const doc = await SiteSettings.findOne({ key: "global_site_settings" }).lean();
      if (doc && doc.content) {
        // Deep-merge stored content with default so newly introduced keys are never missing
        return NextResponse.json({
          success: true,
          content: {
            ...DEFAULT_SITE_CONTENT,
            ...doc.content,
            seo: { ...DEFAULT_SITE_CONTENT.seo, ...(doc.content.seo || {}) },
            header: { ...DEFAULT_SITE_CONTENT.header, ...(doc.content.header || {}) },
            hero: { ...DEFAULT_SITE_CONTENT.hero, ...(doc.content.hero || {}) },
            sections: { ...DEFAULT_SITE_CONTENT.sections, ...(doc.content.sections || {}) },
            footer: { ...DEFAULT_SITE_CONTENT.footer, ...(doc.content.footer || {}) },
            about: { ...DEFAULT_SITE_CONTENT.about, ...(doc.content.about || {}) },
          },
        });
      }
    } catch (dbErr) {
      console.warn("Using default site content due to DB latency:", dbErr);
    }

    return NextResponse.json({
      success: true,
      content: DEFAULT_SITE_CONTENT,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      content: DEFAULT_SITE_CONTENT,
    });
  }
}

