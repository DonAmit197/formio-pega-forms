/** @format */

import singlePage from './singlePage.json';
import liquidationStatement from './liquidation_statement.json';
import multiPageJSON from './multipage-JSON.json';
import csvToUI from './csvtoui-formio.json';
import pasteTable from './Paste Table_v2.01_20260522160758.json';

export type FormDefinition = {
  id: string;
  title: string;
  formJSON: any;
  description?: string;
};

export const formsRegistry: Record<string, FormDefinition> = {
  singlePage: {
    id: 'singlePage',
    title: 'Single Page Form',
    formJSON: singlePage,
  },
  liquidationStatement: {
    id: 'liquidationStatement',
    title: 'Liquidation Statement Form',
    formJSON: liquidationStatement,
  },
  multiPage: {
    id: 'multiPage',
    title: 'Multi Page Form',
    formJSON: multiPageJSON,
  },
  csvToUI: {
    id: 'csvToUI',
    title: 'CSV to UI Form',
    formJSON: csvToUI,
  },
  pasteTable: {
    id: 'pasteTable',
    title: 'Paste Table Form',
    formJSON: pasteTable,
  },
};

export function getFormDefinition(formKey: string): FormDefinition | null {
  return formsRegistry[formKey] || null;
}
