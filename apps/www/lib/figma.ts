/**
 * The ArloUI Figma library — the published Community file.
 *
 * Every Figma link on the site is built from this one key, so moving the file
 * is a one-line change. Node ids are the file's page and component-set ids;
 * they survive publishing, so a link opens the file on that page or component.
 */
export const FIGMA_FILE_KEY = 'zoopBam4dC975x8E1xrrPt';

export const FIGMA_FILE_URL = `https://www.figma.com/design/${FIGMA_FILE_KEY}/Arlo-UI`;

/** Link to a node in the library, e.g. `figmaNode('266:4982')`. */
export function figmaNode(id: string): string {
  return `${FIGMA_FILE_URL}?node-id=${id.replace(':', '-')}`;
}

/** Pages and component sets the docs link to. */
export const FIGMA_NODES = {
  // Foundations
  color: '16:2033',
  typography: '74:4376',
  icons: '97:1713',
  spacing: '226:1271',
  effects: '238:2275',
  // Components
  button: '266:4982',
  input: '533:2959',
  textArea: '875:2658',
  toggle: '2198:123',
  checkbox: '2201:143',
  radio: '2200:131',
  stepper: '2400:538',
  badge: '2125:3365',
  chip: '2185:107',
  tabBar: '2157:1701',
  datePicker: '2229:2300',
  gallery: '2238:419',
  carousel: '2241:402',
  sheet: '2319:719',
  card: '2354:2',
  list: '2357:4',
  spinner: '2377:59',
  toast: '2377:5720',
  tabs: '2383:2',
  chart: '2392:2',
} as const;
