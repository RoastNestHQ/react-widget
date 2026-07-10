# Graph Report - .  (2026-07-10)

## Corpus Check
- Corpus is ~11,374 words - fits in a single context window. You may not need a graph.

## Summary
- 268 nodes · 503 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `ReferralAPI` - 24 edges
2. `compilerOptions` - 16 edges
3. `ReferralStorage` - 14 edges
4. `useRoastnestContext()` - 13 edges
5. `ITransport` - 12 edges
6. `EventQueue` - 10 edges
7. `ReferralEventPayload` - 9 edges
8. `ReferralConfig` - 8 edges
9. `ReferralData` - 8 edges
10. `ReferralWidgetProps` - 8 edges

## Surprising Connections (you probably didn't know these)
- `FeedbackForm()` --calls--> `useRoastnestContext()`  [EXTRACTED]
  src/features/feedback/components/FeedbackForm/index.tsx → src/core/hooks/useRoastnestContext.tsx
- `ReferralAPIDependencies` --references--> `ReferralStorage`  [EXTRACTED]
  src/features/referral/ReferralAPI.ts → src/features/referral/core/ReferralStorage.ts
- `ReferralAPI` --references--> `ReferralStorage`  [EXTRACTED]
  src/features/referral/ReferralAPI.ts → src/features/referral/core/ReferralStorage.ts
- `Provider()` --calls--> `getBackgroundColor()`  [EXTRACTED]
  src/core/RoastnestProvider/index.tsx → src/utils/getBackgroundColor.ts
- `useRoastnest()` --calls--> `useRoastnestContext()`  [EXTRACTED]
  src/core/hooks/useRoastnest.tsx → src/core/hooks/useRoastnestContext.tsx

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (16): ConversionEvent, QueuedEvent, ReferralConfig, ReferralData, ReferralEventPayload, EventQueue, ReferralDetector, SessionManager (+8 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (46): author, dependencies, clsx, @floating-ui/react, html2canvas-pro, react-device-detect, description, devDependencies (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (22): defaultRoastnestConfig, RoastnestContext, useRoastnest(), useRoastnestContext(), FeedbackPopper(), WidgetOverlay(), WidgetTriggerButton(), FeedbackWidgetProps (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (18): Person, PersonManager, FeedbackForm(), TextareaProps, getDefaultIcon(), toast, ToastContext, ToastContextType (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (24): initialSelectedValue, Provider(), TODO: Handle errors in screenshot capture, RoastnestProvider(), FeedbackWidget(), BaseRoastnestProviderProps, FormDataProps, FormSubmitHandler (+16 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (16): ReferralButton(), ReferralButtonProps, ReferralCardProps, ReferralLifecycle(), ReferralPopup(), ReferralPopupProps, DEFAULT_WIDGET_PROPS, ReferralWidget() (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+9 more)

## Knowledge Gaps
- **74 isolated node(s):** `version`, `name`, `description`, `main`, `module` (+69 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ReferralAPI` connect `Community 0` to `Community 5`, `Community 7`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `ReferralStorage` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `ApiInstance` connect `Community 3` to `Community 4`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `version`, `name`, `description` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0861952861952862 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09059233449477352 - nodes in this community are weakly interconnected._