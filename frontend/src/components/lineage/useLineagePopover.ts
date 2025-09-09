import { useState, useCallback, useEffect, useRef } from 'react';
import { LineageData, LineageNode, PopoverPosition } from './types';
import { useLineageClick } from './LineageClickContext';

export interface UseLineagePopoverReturn {
  selectedNode: LineageNode | null;
  popoverPosition: PopoverPosition | null;
  isPopoverVisible: boolean;
  showPopover: (nodeId: string) => void;
  hidePopover: () => void;
}

interface UseLineagePopoverProps {
  data: LineageData;
  enabled?: boolean;
}

/**
 * Hook to manage lineage node popover state and positioning
 */
export const useLineagePopover = ({
  data,
  enabled = true,
}: UseLineagePopoverProps): UseLineagePopoverReturn => {
  const { setClickPosition } = useLineageClick();
  const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const activeNodeIdRef = useRef<string | null>(null);
  const lastShowTimeRef = useRef<number>(0);
  const lastSelectedNodeRef = useRef<LineageNode | null>(null);

  const showPopover = useCallback(
    (nodeId: string) => {
      if (!enabled) return;

      // Find the node data
      const node = data.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      // Prevent duplicate calls for the same node
      if (activeNodeIdRef.current === nodeId && isPopoverVisible) {
        return;
      }

      // Debounce rapid calls
      const now = Date.now();
      if (now - lastShowTimeRef.current < 100) {
        return;
      }
      lastShowTimeRef.current = now;

      activeNodeIdRef.current = nodeId;

      // Since we're using triggerRef, we only need a dummy position
      const dummyPosition = { x: 0, y: 0 };

      setSelectedNode(node);
      setPopoverPosition(dummyPosition);
      setIsPopoverVisible(true);

      // Store the node for repositioning
      lastSelectedNodeRef.current = node;
    },
    [data.nodes, enabled, isPopoverVisible],
  );

  const hidePopover = useCallback(() => {
    activeNodeIdRef.current = null;
    setSelectedNode(null);
    setPopoverPosition(null);
    setIsPopoverVisible(false);
  }, []);

  /**
   * Finds the DOM element for a given node ID with enhanced selectors for zoom/pan scenarios
   */
  const findNodeElement = useCallback((nodeId: string): Element | null => {
    // Enhanced selectors to handle various DOM states during zoom/pan/drag
    const selectors = [
      `[data-id="${nodeId}"] rect.pill-background`,
      `[data-id="${nodeId}"] rect[class*="pill"]`,
      `[data-id="${nodeId}"] rect[class*="background"]`,
      `[data-id="${nodeId}"] rect[class*="Background"]`,
      // Fallback to any rect in the node
      `[data-id="${nodeId}"] rect`,
      // Try the node container itself
      `[data-id="${nodeId}"]`,
      `g[data-id="${nodeId}"]`,
      `g[data-id="${nodeId}"] rect`,
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Verify element is actually visible and has dimensions
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return element;
        }
      }
    }

    return null;
  }, []);

  /**
   * Gets the current screen position of a node element
   */
  const getNodeScreenPosition = useCallback(
    (nodeId: string): { x: number; y: number } | null => {
      const element = findNodeElement(nodeId);
      if (!element) return null;

      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    },
    [findNodeElement],
  );

  /**
   * Checks if two positions are significantly different
   */
  const hasPositionChanged = useCallback(
    (pos1: { x: number; y: number }, pos2: { x: number; y: number }, threshold = 5): boolean => {
      return Math.abs(pos1.x - pos2.x) > threshold || Math.abs(pos1.y - pos2.y) > threshold;
    },
    [],
  );

  /**
   * Updates the popover position using optimized hide/show cycle
   * This is the most reliable approach with PatternFly's Popover component
   */
  const updatePopoverPosition = useCallback(
    (nodeId: string, newPosition: { x: number; y: number }) => {
      const element = findNodeElement(nodeId);
      if (!element) return;

      // Optimized hide/show cycle - fastest approach for PatternFly
      setIsPopoverVisible(false);

      // Single requestAnimationFrame for minimal delay
      requestAnimationFrame(() => {
        // Update with fresh element reference
        setClickPosition({
          x: newPosition.x,
          y: newPosition.y,
          pillElement: element,
        });

        // Show immediately in the same frame
        setIsPopoverVisible(true);
      });
    },
    [findNodeElement, setClickPosition],
  );

  // Position tracking effect
  useEffect(() => {
    if (!selectedNode) return;

    let lastKnownPosition = { x: 0, y: 0 };
    let isRepositioning = false;

    const checkAndRepositionPopover = () => {
      if (isRepositioning) return;

      const nodeToReposition = lastSelectedNodeRef.current;
      if (!nodeToReposition) return;

      const currentPosition = getNodeScreenPosition(nodeToReposition.id);
      if (!currentPosition) return;

      // Only update if position changed significantly and we have a previous position
      if (lastKnownPosition.x !== 0 && hasPositionChanged(currentPosition, lastKnownPosition, 3)) {
        isRepositioning = true;
        updatePopoverPosition(nodeToReposition.id, currentPosition);

        // Reset repositioning flag immediately for real-time updates
        setTimeout(() => {
          isRepositioning = false;
        }, 16); // ~60fps
      }

      lastKnownPosition = currentPosition;
    };

    const svgContainer = document.querySelector('.pf-topology-visualization-surface');

    if (!svgContainer) return;

    let updateTimer: NodeJS.Timeout;

    const throttledCheck = () => {
      clearTimeout(updateTimer);
      updateTimer = setTimeout(checkAndRepositionPopover, 16); // ~60fps for smooth real-time updates
    };

    const immediateCheck = () => {
      clearTimeout(updateTimer);
      checkAndRepositionPopover();
    };

    // Listen for movement events (more responsive throttling)
    svgContainer.addEventListener('mousemove', throttledCheck, { passive: true });
    svgContainer.addEventListener('wheel', throttledCheck, { passive: true });

    // Listen for drag end events (immediate)
    document.addEventListener('mouseup', immediateCheck);
    svgContainer.addEventListener('mouseup', immediateCheck);
    svgContainer.addEventListener('mouseleave', immediateCheck);

    // Also check on any interaction end
    document.addEventListener('click', immediateCheck);

    // Add MutationObserver to watch for DOM changes during zoom/pan/drag
    const observer = new MutationObserver(() => {
      // DOM changed, check if we need to update position immediately
      immediateCheck();
    });

    observer.observe(svgContainer, {
      attributes: true,
      attributeFilter: ['transform', 'style', 'class'],
      subtree: true, // Watch all descendants
      childList: true, // Watch for added/removed nodes
    });

    // Initial position setup
    setTimeout(checkAndRepositionPopover, 100);

    return () => {
      clearTimeout(updateTimer);
      svgContainer.removeEventListener('mousemove', throttledCheck);
      svgContainer.removeEventListener('wheel', throttledCheck);
      svgContainer.removeEventListener('mouseup', immediateCheck);
      svgContainer.removeEventListener('mouseleave', immediateCheck);
      document.removeEventListener('mouseup', immediateCheck);
      document.removeEventListener('click', immediateCheck);
      observer.disconnect();
    };
  }, [selectedNode, getNodeScreenPosition, hasPositionChanged, updatePopoverPosition]);

  // Handle clicks outside the popover to close it
  useEffect(() => {
    if (!isPopoverVisible) return;

    const handleClickOutside = ({ target }: MouseEvent) => {
      if (!target || !(target instanceof Element)) {
        return;
      }

      // Check if click is on a lineage node (SVG elements)
      if (target.closest('g[class*="pf-topology"]') || target.closest('.pf-topology__graph')) {
        return; // Don't close on node clicks
      }

      // Check if click is inside popover
      if (target.closest('[role="dialog"]') || target.closest('.pf-c-popover')) {
        return; // Don't close on popover clicks
      }

      hidePopover();
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hidePopover();
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isPopoverVisible, hidePopover]);

  return {
    selectedNode,
    popoverPosition,
    isPopoverVisible,
    showPopover,
    hidePopover,
  };
};
