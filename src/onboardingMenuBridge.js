/* ==========================================================================
   Services-menu bridge for the guided tour (improvement 03).

   The tour step catalogosnig:add-map-services spotlights the "+ Mapa" services
   menu. That menu lives deep inside AddToMapButton, but the step's before/after
   hooks live in Main.jsx and hold no closure over it. This module bridges the
   two: the first result's AddToMapButton registers its open setter here, and the
   step hooks call openServicesMenu / closeServicesMenu.
   ========================================================================== */

let setMenuOpen = null;

/**
 * Register the first result's menu open setter. Returns an unregister function
 * for the effect cleanup. Only one menu registers at a time (the first result).
 */
export function registerServicesMenu(fn) {
  setMenuOpen = fn;
  return () => {
    if (setMenuOpen === fn) setMenuOpen = null;
  };
}

/** Open the first result's services menu. No-op when none is registered. */
export function openServicesMenu() {
  if (setMenuOpen) setMenuOpen(true);
}

/** Close the first result's services menu. No-op when none is registered. */
export function closeServicesMenu() {
  if (setMenuOpen) setMenuOpen(false);
}

/**
 * Wait two animation frames. A step before hook calls this after it opens the
 * menu, so the Mantine dropdown mounts and positions and its TourTarget
 * registers before the controller lands the step and the overlay measures
 * (engine D12). Two frames cover the React commit and the passive effects.
 */
export function nextTwoFrames() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}
