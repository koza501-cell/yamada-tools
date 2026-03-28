"use client"
import { useEffect } from "react"

export function JsonLdDedup({ scriptId }: { scriptId: string }) {
  useEffect(() => {
    const sel = `script#${scriptId}[type="application/ld+json"]`
    const scripts = document.querySelectorAll(sel)
    if (scripts.length > 1) {
      for (let i = 1; i < scripts.length; i++) {
        scripts[i].parentNode?.removeChild(scripts[i])
      }
    }
  }, [scriptId])
  return null
}
