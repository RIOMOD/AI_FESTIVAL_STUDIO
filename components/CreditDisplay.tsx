
import React, { useEffect, useState, useRef } from 'react';

// Mở rộng Window interface
declare global {
  interface Window {
    _credit?: number | string;
    CREDITS?: number | string;
  }
}

const CreditDisplay: React.FC = () => {
  const [credits, setCredits] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    
    // --- 1. LOGIC QUÉT URL (Backup - Phòng hờ) ---
    const extractCreditFromUrl = (urlString: string | undefined | null): number => {
        if (!urlString) return 0;
        try {
            const decoded = decodeURIComponent(urlString);
            const regex = /(?:[?&#]|^)(_?credit)=(\d+)/i;
            const match = decoded.match(regex);
            if (match && match[2]) {
                const val = parseInt(match[2], 10);
                if (!isNaN(val) && val > 0) return val;
            }
        } catch (e) {
            console.warn("Lỗi parse URL:", e);
        }
        return 0;
    };

    const scanAllSources = () => {
        let foundCredit = 0;
        // Các nguồn cần quét
        const sources = [
            window.location.href,
            window.location.hash,
            window.location.search,
            document.referrer,
        ];
        // Thử đọc parent nếu cùng domain
        try {
            if (window.parent && window.parent !== window) {
                sources.push(window.parent.location.href);
            }
        } catch (e) {}

        for (const source of sources) {
            const val = extractCreditFromUrl(source);
            if (val > 0) {
                foundCredit = val;
                break; 
            }
        }
        // Fallback global variable
        if (foundCredit === 0) {
            if (window._credit) foundCredit = parseInt(String(window._credit), 10);
        }

        if (foundCredit > 0) {
            setCredits(foundCredit);
        }
    };

    // Chạy quét URL định kỳ
    scanAllSources();
    intervalRef.current = window.setInterval(scanAllSources, 1000);


    // --- 2. LOGIC LẮNG NGHE POSTMESSAGE (CHÍNH - THEO YÊU CẦU APP MẸ) ---
    const handleMessage = (event: MessageEvent) => {
        const data = event.data;
        if (!data) return;

        // >> PROTOCOL CHÍNH: SYNC_CREDIT từ AI_STUDIO_PARENT
        if (data.type === 'SYNC_CREDIT' && data.source === 'AI_STUDIO_PARENT') {
            const creditReceived = parseInt(String(data.credit), 10);
            
            if (!isNaN(creditReceived)) {
                 console.log("✅ [App Con] Đã nhận được Credit từ App Mẹ:", creditReceived);
                 setCredits(creditReceived);
                 return; // Đã bắt đúng chuẩn thì dừng, không cần check kiểu cũ
            }
        }

        // >> PROTOCOL CŨ (Fallback - Hỗ trợ tương thích ngược)
        let val = 0;
        if (typeof data === 'object') {
            if (data._credit) val = data._credit;
            else if (data.credit) val = data.credit; // Dạng { credit: 10 } đơn giản
        }

        const num = parseInt(String(val), 10);
        if (!isNaN(num) && num > 0) {
            setCredits(num);
        }
    };

    // Đăng ký sự kiện
    window.addEventListener('message', handleMessage);

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    // Đã thêm class 'hidden' để ẩn giao diện theo yêu cầu (nhưng logic vẫn chạy)
    <div className="hidden fixed top-4 left-4 z-50 animate-fade-in-down">
      <div className="bg-slate-900/90 border border-yellow-500/50 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg backdrop-blur-sm select-none hover:bg-slate-800 transition-colors cursor-help" title="Số dư Credit hiện tại">
         <span className="text-xl">💎</span>
         <span className="text-yellow-400 font-bold text-lg">{credits}</span>
         <span className="text-xs text-slate-400 uppercase tracking-wide ml-1">Credits</span>
      </div>
    </div>
  );
};

export default CreditDisplay;
