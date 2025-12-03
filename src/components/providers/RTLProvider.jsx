"use client";
import { DirectionProvider } from "@radix-ui/react-direction";

export default function RTLProvider({ children }) {
  return <DirectionProvider dir="rtl">{children}</DirectionProvider>;
}
