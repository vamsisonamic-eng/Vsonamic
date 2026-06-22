# Univer — Complete API Reference

**Repo:** https://github.com/dream-num/univer  
**Docs:** https://univer.ai  
**npm:** `@univerjs/*` — all packages must share the same version

---

## Architecture overview

```
Univer (core runtime)
  └── Plugin system (register before creating units)
        ├── Engine plugins  (render, formula)
        ├── UI plugins      (sheets-ui, docs-ui)
        └── Feature plugins (data-validation, comments, …)

Facade API (univerAPI)  ← primary developer interface
  ├── createUniverSheet()
  ├── createUniverDoc()
  ├── getActiveWorkbook()
  └── … all read/write operations
```

---

## Installation

```bash
# Preset mode (recommended — bundles common plugins)
npm install @univerjs/presets @univerjs/preset-sheets-core

# Manual / plugin mode (full control)
npm install @univerjs/core \
            @univerjs/engine-render \
            @univerjs/engine-formula \
            @univerjs/ui \
            @univerjs/sheets \
            @univerjs/sheets-ui \
            @univerjs/docs \
            @univerjs/docs-ui
```

> All packages must be at **identical semver versions**.

---

## Preset mode (recommended)

```ts
import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import UniverSheetsCorePresetEnUS from '@univerjs/preset-sheets-core/locales/en-US';

// CSS — required
import '@univerjs/presets/lib/styles/preset-sheets-core.css';

const { univerAPI } = createUniver({
  locale: LocaleType.EN_US,
  locales: { [LocaleType.EN_US]: UniverSheetsCorePresetEnUS },
  theme: defaultTheme,
  presets: [
    UniverSheetsCorePreset({
      container: 'app',  // DOM id or HTMLElement
    }),
  ],
});

// Create a blank workbook
univerAPI.createUniverSheet({ name: 'My Sheet' });
```

---

## Plugin mode (manual composition)

```ts
import { Univer, LocaleType, LogLevel } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverUIPlugin } from '@univerjs/ui';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';

// CSS
import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/docs-ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';

const univer = new Univer({
  locale: LocaleType.EN_US,
  logLevel: LogLevel.VERBOSE,
});

// Register engines first
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);

// UI
univer.registerPlugin(UniverUIPlugin, {
  container: 'app',
  header: true,
  footer: true,
});

// Document model plugins
univer.registerPlugin(UniverDocsPlugin, { hasScroll: false });
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);

// Get Facade API
import { FUniver } from '@univerjs/core';
const univerAPI = FUniver.newAPI(univer);

// Create workbook
univerAPI.createUniverSheet({ name: 'Sheet1' });
```

---

## Facade API — key methods

### Workbook / sheets

```ts
// Create workbook (returns FWorkbook)
const workbook = univerAPI.createUniverSheet({
  name: 'My Workbook',
  sheets: [{
    id: 'sheet1',
    name: 'Sheet 1',
    cellData: {
      0: { 0: { v: 'Hello', t: 1 }, 1: { v: 42, t: 2 } },
    },
  }],
});

// Get active workbook
const wb = univerAPI.getActiveWorkbook();

// Get active sheet (FWorksheet)
const ws = wb.getActiveSheet();

// Get sheet by name
const ws2 = wb.getSheetByName('Sheet 1');

// Get all sheets
const sheets = wb.getSheets();
```

### Reading cell data

```ts
const sheet = wb.getActiveSheet();

// Single cell
const cell = sheet.getRange('A1');
const value = cell.getValue();       // raw value
const display = cell.getDisplayValue(); // formatted string

// Range
const range = sheet.getRange('A1:C3');
const values = range.getValues();    // 2D array

// By row/col index (0-based)
const cell2 = sheet.getRange(0, 0);  // row 0, col 0 = A1
```

### Writing cell data

```ts
// Set value
sheet.getRange('A1').setValue('Hello');
sheet.getRange('B2').setValue(42);

// Set formula
sheet.getRange('C1').setFormula('=A1+B2');

// Set 2D array
sheet.getRange('A1:B2').setValues([
  ['Name', 'Score'],
  ['Alice', 95],
]);

// Set number format
sheet.getRange('B2').setNumberFormat('0.00%');

// Set style
sheet.getRange('A1').setFontWeight('bold').setFontColor('#00C8D7');
```

### Rows / columns

```ts
sheet.insertRowAfter(2);          // insert after row index 2
sheet.insertColumnBefore(1);      // insert before col index 1
sheet.deleteRows(3, 2);           // delete 2 rows starting at index 3
sheet.setRowHeight(0, 40);        // set row 0 height to 40px
sheet.setColumnWidth(0, 120);     // set col 0 width to 120px
```

### Events / hooks

```ts
univerAPI.addEvent(univerAPI.Event.SheetValueChange, (params) => {
  console.log('Cell changed:', params);
});

univerAPI.addEvent(univerAPI.Event.ActiveSheetChanged, (params) => {
  console.log('Sheet switched to:', params.activeSheet.getSheetName());
});
```

---

## Cell data model (IWorksheetData)

```ts
// Cell value types
const t = {
  1: 'string',
  2: 'number',
  3: 'boolean',
  4: 'force-string',  // treat number as text
};

// Full cell snapshot
interface ICellData {
  v?: string | number | boolean;  // value
  t?: 1 | 2 | 3 | 4;             // type
  f?: string;                      // formula e.g. "=SUM(A1:A10)"
  si?: string;                     // shared formula id
  p?: IDocumentData;               // rich text
  s?: IStyleData | string;         // style object or style id
}
```

---

## Feature plugins (optional)

```ts
// Data validation
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsDataValidationUIPlugin } from '@univerjs/sheets-data-validation-ui';
univer.registerPlugin(UniverSheetsDataValidationPlugin);
univer.registerPlugin(UniverSheetsDataValidationUIPlugin);

// Conditional formatting
import { UniverSheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui';

// Comments / threads
import { UniverThreadCommentPlugin } from '@univerjs/thread-comment';
import { UniverThreadCommentUIPlugin } from '@univerjs/thread-comment-ui';
import { UniverSheetsThreadCommentPlugin } from '@univerjs/sheets-thread-comment';

// Import / Export (xlsx)
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
```

---

## Node.js / headless (server-side)

```ts
import { Univer, LocaleType } from '@univerjs/core';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { FUniver } from '@univerjs/core';

// No UI or render engine in Node
const univer = new Univer({ locale: LocaleType.EN_US });
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverSheetsPlugin);

const univerAPI = FUniver.newAPI(univer);
const wb = univerAPI.createUniverSheet({ name: 'Report' });
const ws = wb.getActiveSheet();

ws.getRange('A1').setValue('Revenue');
ws.getRange('B1').setFormula('=SUM(B2:B13)');

// Read computed value after formula engine runs
const result = ws.getRange('B1').getValue();
```

> Node.js 18.17+ required. Node 22.18+ for development.

---

## Custom plugin skeleton

```ts
import { Plugin, Inject, Injector } from '@univerjs/core';

class MyPlugin extends Plugin {
  static override pluginName = 'MY_PLUGIN';

  constructor(
    private _config: { greeting: string },
    @Inject(Injector) protected readonly _injector: Injector,
  ) {
    super();
  }

  override onStarting() {
    // Register services, commands, etc.
    console.log(this._config.greeting);
  }
}

// Register
univer.registerPlugin(MyPlugin, { greeting: 'Hello from my plugin!' });
```

---

## Custom command

```ts
import { CommandType, ICommandService, Inject } from '@univerjs/core';

const MySetValueCommand = {
  id: 'my-plugin.set-value',
  type: CommandType.COMMAND,
  handler: async (accessor, params) => {
    const commandService = accessor.get(ICommandService);
    // dispatch mutations here
    return true;
  },
};

// In plugin onStarting():
const commandService = this._injector.get(ICommandService);
commandService.registerCommand(MySetValueCommand);
```

---

## React integration

```tsx
import { useEffect, useRef } from 'react';
import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import '@univerjs/presets/lib/styles/preset-sheets-core.css';

export function SpreadsheetEditor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      theme: defaultTheme,
      presets: [UniverSheetsCorePreset({ container: containerRef.current })],
    });

    univerAPI.createUniverSheet({ name: 'My Sheet' });

    return () => univerAPI.dispose();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
}
```

---

## Vite config (required for CSS handling)

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['@univerjs/presets', '@univerjs/preset-sheets-core'],
  },
  css: {
    preprocessorOptions: {
      less: { javascriptEnabled: true },
    },
  },
});
```

---

## Browser support

| Browser | Min version |
|---------|-------------|
| Chrome  | 70+         |
| Edge    | 70+         |
| Firefox | 63+         |
| Safari  | 12+         |
| Electron| 5+          |

Node.js runtime: 18.17+ (production), 22.18+ (development)

---

## Packages summary

| Package | Purpose |
|---------|---------|
| `@univerjs/core` | Runtime, DI, commands, data model, Facade entry |
| `@univerjs/engine-render` | Canvas rendering engine |
| `@univerjs/engine-formula` | Formula calculation engine |
| `@univerjs/ui` | Base UI shell (toolbar, sidebar, context menu) |
| `@univerjs/sheets` | Spreadsheet data model |
| `@univerjs/sheets-ui` | Spreadsheet UI layer |
| `@univerjs/docs` | Document (rich text) model |
| `@univerjs/docs-ui` | Document UI layer |
| `@univerjs/presets` | Preset factory (`createUniver`) |
| `@univerjs/preset-sheets-core` | Bundled sheets preset |
| `@univerjs/sheets-data-validation` | Data validation |
| `@univerjs/sheets-conditional-formatting` | Conditional formatting |
| `@univerjs/thread-comment` | Comments / threads |
| `@univerjs/sheets-filter` | Filtering |
