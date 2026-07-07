import React from "react";
import { ReferralTheme } from "./types";
import { DEFAULT_WIDGET_PROPS } from "./defaults";

export type StyleMap = {
  popup: React.CSSProperties;
  codeBox: React.CSSProperties;
  copyBtnSuccess: React.CSSProperties;
  primaryBtn: React.CSSProperties;
  outlineBtn: React.CSSProperties;
  link: React.CSSProperties;
  mutedText: React.CSSProperties;
  backdrop: React.CSSProperties;
};

export function buildStyles(theme?: ReferralTheme): StyleMap {
  const t = { ...DEFAULT_WIDGET_PROPS.theme, ...theme };

  return {
    popup: {
      backgroundColor: t.backgroundColor,
      color: t.textColor,
      borderRadius: t.borderRadius,
      fontFamily: t.fontFamily,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      border: `1px solid ${t.borderColor}`,
    },
    codeBox: {
      backgroundColor: t.codeBoxColor,
      color: t.textColor,
      borderRadius: "6px",
      border: `1px solid ${t.borderColor}`,
    },
    copyBtnSuccess: {
      backgroundColor: t.successColor,
      color: "#ffffff",
    },
    primaryBtn: {
      backgroundColor: t.primaryColor,
      color: "#ffffff",
      borderRadius: "6px",
    },
    outlineBtn: {
      backgroundColor: "transparent",
      color: t.textColor,
      border: `1px solid ${t.borderColor}`,
      borderRadius: "6px",
    },
    link: {
      color: t.accentColor,
    },
    mutedText: {
      color: t.mutedTextColor,
    },
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.4)", // or backdropColor
    },
  };
}
