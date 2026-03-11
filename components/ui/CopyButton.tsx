"use client";
import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function CopyButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-full right-0 mb-3 bg-forest-900 text-white text-sm px-4 py-2 flex items-center rounded-xl shadow-xl whitespace-nowrap"
                    >
                        <Check className="w-4 h-4 mr-2 text-gold-400" /> Link copied!
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={handleCopy}
                className="w-14 h-14 bg-forest-600 rounded-full flex items-center justify-center text-white shadow-luxury hover:bg-forest-700 hover:scale-105 active:scale-95 transition-all"
                aria-label="Share page"
            >
                <Share2 className="w-6 h-6" />
            </button>
        </div>
    );
}
