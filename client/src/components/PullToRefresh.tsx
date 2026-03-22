/**
 * PullToRefresh — Native-like pull-to-refresh gesture for mobile.
 * Shows a spinner when pulled down past threshold, then triggers a refresh.
 */
import { useState, useRef, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 80;

export default function PullToRefresh({
  children,
  onRefresh,
}: {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullY = useMotionValue(0);
  const spinnerOpacity = useTransform(pullY, [0, THRESHOLD * 0.5, THRESHOLD], [0, 0.5, 1]);
  const spinnerScale = useTransform(pullY, [0, THRESHOLD], [0.5, 1]);
  const spinnerRotate = useTransform(pullY, [0, THRESHOLD * 2], [0, 360]);

  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only activate if scrolled to top
    const scrollEl = document.scrollingElement || document.documentElement;
    if (scrollEl.scrollTop > 5) return;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || isRefreshing) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy < 0) { pullY.set(0); return; }
    // Rubber-band effect
    const dampened = Math.min(dy * 0.45, THRESHOLD * 1.5);
    pullY.set(dampened);
  }, [isRefreshing, pullY]);

  const handleTouchEnd = useCallback(async () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const currentPull = pullY.get();

    if (currentPull >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      pullY.set(THRESHOLD * 0.6);
      if (onRefresh) {
        await onRefresh();
      } else {
        // Default: reload page after short delay
        await new Promise(r => setTimeout(r, 800));
        window.location.reload();
      }
      setIsRefreshing(false);
    }
    pullY.set(0);
  }, [isRefreshing, onRefresh, pullY]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <motion.div
        style={{ opacity: spinnerOpacity, scale: spinnerScale, y: useTransform(pullY, [0, THRESHOLD], [-30, 10]) }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-30 pointer-events-none"
      >
        <motion.div
          style={{ rotate: isRefreshing ? undefined : spinnerRotate }}
          animate={isRefreshing ? { rotate: 360 } : {}}
          transition={isRefreshing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : {}}
          className="w-9 h-9 rounded-full bg-card shadow-lg border border-border/40 flex items-center justify-center"
        >
          <RefreshCw className={`w-4 h-4 text-sage ${isRefreshing ? "" : ""}`} />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div style={{ y: pullY }}>
        {children}
      </motion.div>
    </div>
  );
}
