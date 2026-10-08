import React, { useState, useRef } from 'react';
import i18next from 'i18next';
import { ActionIcon, LoadingOverlay, Paper, Text } from '@mantine/core';
import { IconQuestionCircle, TourTarget } from '@scalargis/ui';
import { MainMenuButton, useComponentTour } from '@scalargis/components';

import Catalogs from './Catalogs';
import CatalogSNIG from './CatalogSNIG';
import { openServicesMenu, closeServicesMenu, nextTwoFrames } from './onboardingMenuBridge';

import './style.css';

/* ==========================================================================
   Onboarding: the self path.

   CatalogoSNIG ships its own tour steps. The base help catalog does not hold
   them. Each step id namespaces on the component slug. The step targets an
   element inside the component's own panel, wrapped with <TourTarget> below
   and in CatalogSNIG.jsx / MetadataList / MetatadataRecord. Core.jsx reads
   this export into its self-step registry and merges it with the base steps.

   The copy ships here, in the component repo, not in the viewer help base. It
   registers into the i18next "common" namespace, the same namespace the base
   onboarding copy uses, so t("onboarding.catalogosnig.*") follows the locale.
   ========================================================================== */

const CATALOGOSNIG_ONBOARDING_PT = {
  onboarding: {
    catalogosnig: {
      launcher: {
        tour: 'Visita guiada',
      },
      intro: {
        title: 'Catálogo SNIG',
        content: 'Pesquise o catálogo de metadados do SNIG e leve temas para o mapa.',
      },
      search: {
        title: 'Filtros e pesquisa',
        content: 'Defina o tema e a área, depois carregue em Pesquisar. Os resultados aparecem logo a seguir.',
      },
      results: {
        title: 'Resultados',
        content: 'Veja os registos. Use a agregação para refinar a pesquisa.',
      },
      addMap: {
        title: 'Adicionar ao mapa',
        content: 'Nos registos com serviço, o botão "+ Mapa" abre esta lista de serviços. Escolha um serviço para juntar o tema ao mapa do visualizador.',
      },
    },
  },
};

const CATALOGOSNIG_ONBOARDING_EN = {
  onboarding: {
    catalogosnig: {
      launcher: {
        tour: 'Guided tour',
      },
      intro: {
        title: 'SNIG catalogue',
        content: 'Search the SNIG metadata catalogue and bring themes to the map.',
      },
      search: {
        title: 'Filters and search',
        content: 'Set the theme and the area, then press Search. The results show right after.',
      },
      results: {
        title: 'Results',
        content: 'Browse the records. Use the aggregation to refine the search.',
      },
      addMap: {
        title: 'Add to map',
        content: 'For records with a service, the "+ Mapa" button opens this list of services. Choose a service to add the theme to the viewer map.',
      },
    },
  },
};

let onboardingRegistered = false;
function registerCatalogosnigOnboarding() {
  if (onboardingRegistered) return;
  // addResourceBundle(lng, ns, resources, deep=true, overwrite=true). Deep
  // merge, so it adds onboarding.catalogosnig without touching the base keys.
  i18next.addResourceBundle('pt', 'common', CATALOGOSNIG_ONBOARDING_PT, true, true);
  i18next.addResourceBundle('en', 'common', CATALOGOSNIG_ONBOARDING_EN, true, true);
  onboardingRegistered = true;
}
registerCatalogosnigOnboarding();

const tr = (key) => i18next.t(key);

const TOUR_FLOW = 'catalogosnig';

/**
 * Self onboarding steps for CatalogoSNIG. Optional named export next to
 * default/actions/reducers. Orders start at 200, above the base range, so the
 * catalogue steps run after the base tools. Each step is in the catalogosnig
 * flow of the panel tour button and in the viewer flow of the topbar Help.
 * title/content use the function form so the popover follows the live locale.
 * The engine and Core.jsx sort the merged list by order.
 */
export const onboardingSteps = [
  {
    id: 'catalogosnig:intro',
    order: 200,
    flow: [TOUR_FLOW, 'viewer'],
    title: () => tr('onboarding.catalogosnig.intro.title'),
    content: () => tr('onboarding.catalogosnig.intro.content'),
  },
  {
    // Filters and search are one step now. The TourTarget in
    // CatalogSNIG.jsx wraps the filter block and the Pesquisar button together.
    // The step does not set advanceOnTargetClick: the search is async and swaps
    // the panel to the results list, so CatalogSNIG advances the tour from a
    // panel-transition effect (panel === 'list'), not from the raw click. That
    // reacts to the real state change, so the advance is reliable.
    id: 'catalogosnig:search',
    order: 210,
    flow: [TOUR_FLOW, 'viewer'],
    title: () => tr('onboarding.catalogosnig.search.title'),
    content: () => tr('onboarding.catalogosnig.search.content'),
  },
  {
    id: 'catalogosnig:results',
    order: 230,
    flow: [TOUR_FLOW, 'viewer'],
    // The search runs async and swaps the panel to the results list. Wait two
    // frames so that list mounts and its TourTarget registers before the
    // controller lands here and the overlay measures.
    before: async () => { await nextTwoFrames(); },
    title: () => tr('onboarding.catalogosnig.results.title'),
    content: () => tr('onboarding.catalogosnig.results.content'),
  },
  {
    // One "Adicionar ao mapa" step. The "+ Mapa" button and its services menu
    // are a single card now: the before hook opens the menu and waits for the
    // dropdown to mount and register (the step spotlights the open menu), the
    // after hook closes it on leave. Dismiss (pause) keeps the menu open.
    id: 'catalogosnig:add-map',
    order: 240,
    flow: [TOUR_FLOW, 'viewer'],
    before: async () => { openServicesMenu(); await nextTwoFrames(); },
    after: () => { closeServicesMenu(); },
    title: () => tr('onboarding.catalogosnig.addMap.title'),
    content: () => tr('onboarding.catalogosnig.addMap.content'),
  },
];

/**
 * Main menu component
 */
export function MainMenu({ className, config, actions, record }) {

  const title = record?.title || "Catálogo de Metadados"

  if (record && record.target === 'mainmenu') {

      if (record?.config_json?.btn_image) {
        return (
          <MainMenuButton
            title={title}
            className={`${className || ''} catalog-snig-main-menu-btn`.trim()}
            style={{ backgroundImage: `url("${record.config_json.btn_image}")` }}
            onClick={e => config.dispatch(actions.viewer_set_selectedmenu(record.id))}
          >
            <span />
          </MainMenuButton>
        )
      }

      return (
          <MainMenuButton
            title={title}
            className={className}
            icon={record?.config_json?.btn_icon ? record.config_json.btn_icon : "pi pi-book"}
            onClick={e => config.dispatch(actions.viewer_set_selectedmenu(record.id))}
          />
      )
    } else {
      return null;
    }
}

export default function Main(props) {

  const {as, core, config, actions, record, utils} = props;
  const { viewer, mainMap } = config;

  const component_cfg = record.config_json || {};
  const header = component_cfg.header;

  const ref = useRef(null);
  const [blockedPanel, setBlockedPanel] = useState(false);

  const tour = useComponentTour({ viewer, type: record?.type, flow: TOUR_FLOW });

  const className = config?.classname ? `catolog-snig ${config?.classname}` : 'catolog-snig';

  function renderContent() {

    if (Array.isArray(component_cfg?.catalogs) || component_cfg?.catalogs?.url) {
      return (
        <Catalogs
          core={core}
          config={config}
          actions={actions}
          viewer={viewer}
          mainMap={mainMap}
          record={record?.config_json}
          utils={utils}
          componentId={record?.id}
          blockPanel={setBlockedPanel}
        />
      )
    }

    return (
      <CatalogSNIG
        core={core}
        config={config}
        actions={actions}
        viewer={viewer}
        mainMap={mainMap}
        catalog={record?.config_json}
        utils={utils}
        componentId={record?.id}
        blockPanel={setBlockedPanel}
      />
    )
  }

  if (as === 'panel') return (
    <TourTarget id="catalogosnig:intro">
      <div ref={ref} style={{height: 'calc(100%)', position: 'relative'}}>
        <LoadingOverlay visible={blockedPanel} zIndex={1003}
          loaderProps={{ size: 50 }} overlayProps={{ blur: 1 }} />
        <Paper className={className} p="xs" withBorder pos="relative">
          { tour.available && <ActionIcon
            variant="subtle"
            radius="xl"
            pos="absolute"
            top={8}
            right={8}
            className="catalog-snig-tour-btn"
            title={tr('onboarding.catalogosnig.launcher.tour')}
            aria-label={tr('onboarding.catalogosnig.launcher.tour')}
            onClick={e => { e.preventDefault(); tour.start(); }}
          >
            <IconQuestionCircle />
          </ActionIcon> }
          { header && <Text fw={600} mb="sm" pr={tour.available ? 'xl' : undefined}>{header}</Text> }
          { renderContent() }
        </Paper>
      </div>
    </TourTarget>
  )

  // Render component
  return renderContent()
}
