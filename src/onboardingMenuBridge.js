/* ==========================================================================
   Services-menu bridge for the guided tour.

   The tour step catalogosnig:add-map spotlights the "+ Mapa" services menu.
   That menu lives deep inside AddToMapButton, but the step's before/after hooks
   live in Main.jsx and hold no closure over it. This module bridges the two: the
   first result's AddToMapButton registers its open setter here, and the step
   hooks call openServicesMenu / closeServicesMenu.
   ========================================================================== */

const SEARCH_TIMEOUT_MS = 20000;

let setMenuOpen = null;
let getMenuButton = null;
let runSearchFn = null;
let showResultsTabFn = null;
let listShown = false;
let listWaiters = [];
let searchPending = false;

/**
 * Register the services menu of the tour record (the first result with a service): its open setter and its
 * button. Returns an unregister function for the effect cleanup. Only one menu registers at a time.
 */
export function registerServicesMenu(fn, getButton = null) {
  setMenuOpen = fn;
  getMenuButton = getButton;
  return () => {
    if (setMenuOpen === fn) {
      setMenuOpen = null;
      getMenuButton = null;
    }
  };
}

/** Scroll the tour record's "+ Mapa" button into view and open its services menu. No-op when none is registered. */
export function openServicesMenu() {
  const button = getMenuButton ? getMenuButton() : null;
  if (button && typeof button.scrollIntoView === 'function') button.scrollIntoView({ block: 'center' });
  if (setMenuOpen) setMenuOpen(true);
}

/** Register the search of the open catalogue. Returns an unregister function. */
export function registerRunSearch(fn) {
  runSearchFn = fn;
  return () => { if (runSearchFn === fn) runSearchFn = null; };
}

/** Register the setter that shows the results tab of the result list. Returns an unregister function. */
export function registerShowResultsTab(fn) {
  showResultsTabFn = fn;
  return () => { if (showResultsTabFn === fn) showResultsTabFn = null; };
}

/** Record if the result list is on screen, and wake the steps that wait for it. */
export function setListShown(shown) {
  listShown = shown;
  if (!shown) return;
  const waiters = listWaiters;
  listWaiters = [];
  waiters.forEach((done) => done(true));
}

/** Tell if a tour step runs the search, so the search step does not also move the tour on. */
export function isTourSearchPending() {
  return searchPending;
}

/** Resolve true when the result list shows, or false after the time limit. */
function waitForList(ms) {
  if (listShown) return Promise.resolve(true);
  return new Promise((resolve) => {
    const done = (value) => { clearTimeout(timer); resolve(value); };
    const timer = setTimeout(() => {
      listWaiters = listWaiters.filter((w) => w !== done);
      resolve(false);
    }, ms);
    listWaiters.push(done);
  });
}

/** Show the result list for a tour step: run the search when no list is on screen, then show the results tab. */
export async function showResults() {
  if (!listShown && runSearchFn) {
    searchPending = true;
    try {
      runSearchFn();
      await waitForList(SEARCH_TIMEOUT_MS);
    } finally {
      searchPending = false;
    }
  }
  if (showResultsTabFn) showResultsTabFn();
  await nextTwoFrames();
}

/** Close the first result's services menu. No-op when none is registered. */
export function closeServicesMenu() {
  if (setMenuOpen) setMenuOpen(false);
}

/**
 * Wait two animation frames. A step before hook calls this after it opens the
 * menu, so the Mantine dropdown mounts and positions and its TourTarget
 * registers before the controller lands the step and the overlay measures.
 * Two frames cover the React commit and the passive effects.
 */
export function nextTwoFrames() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}
