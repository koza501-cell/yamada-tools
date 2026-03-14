'use client';

import { useEffect } from 'react';

export default function CopyCodeButton() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((pre) => {
      // Skip if already has button
      if (pre.querySelector('.copy-btn')) return;
      
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      
      // Create button
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerHTML = 'コピー';
      btn.style.cssText = 'position:absolute;top:8px;right:8px;padding:4px 12px;background:#3b82f6;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;opacity:0.9;transition:opacity 0.2s;';
      
      btn.onmouseenter = () => btn.style.opacity = '1';
      btn.onmouseleave = () => btn.style.opacity = '0.9';
      
      btn.onclick = async () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent || '';
        await navigator.clipboard.writeText(code);
        btn.innerHTML = 'コピー完了!';
        btn.style.background = '#22c55e';
        setTimeout(() => {
          btn.innerHTML = 'コピー';
          btn.style.background = '#3b82f6';
        }, 2000);
      };
      
      wrapper.appendChild(btn);
    });
  }, []);
  
  return null;
}
