import React from "react";
import { WidgetTheme } from "../../../../shared/types";
import { DEFAULT_WIDGET_PROPS } from "./defaults";

export function buildThemeVars(theme?: WidgetTheme): React.CSSProperties {
  const t = { ...DEFAULT_WIDGET_PROPS.theme, ...theme };

  return {
    "--rrn-ref-primary": t.primaryColor,
    "--rrn-ref-bg": t.backgroundColor,
    "--rrn-ref-text": t.textColor,
    "--rrn-ref-muted": t.mutedTextColor,
    "--rrn-ref-accent": t.accentColor,
    "--rrn-ref-border": t.borderColor,
    "--rrn-ref-code": t.codeBoxColor,
    "--rrn-ref-success": t.successColor,
    "--rrn-ref-radius": t.borderRadius,
    "--rrn-ref-font": t.fontFamily,
    // Add global feedback variables
    "--rrn-clr-primary": t.primaryColor,
    "--rrn-clr-50": t.backgroundColor,
    "--rrn-clr-900": t.textColor,
    "--rrn-clr-600": t.mutedTextColor,
    "--rrn-clr-200": t.borderColor,
    "--rrn-clr-radius": t.borderRadius,
    "--rrn-clr-font": t.fontFamily,
  } as React.CSSProperties;
}
