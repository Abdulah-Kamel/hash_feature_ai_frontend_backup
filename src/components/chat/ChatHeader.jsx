"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Lock, PanelRight, PanelLeft, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

function ChatHeader({ chatOpen, onToggle }) {
  const { toggleSidebar, open: sidebarOpen } = useSidebar();
  
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-3">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-lg cursor-pointer" 
          onClick={toggleSidebar}
          title={sidebarOpen ? "إخفاء الشريط الجانبي" : "إظهار الشريط الجانبي"}
        >
          {sidebarOpen ? <PanelLeftClose className="size-5" /> : <PanelLeftOpen className="size-5" />}
        </Button>
        <Button variant="ghost" className="rounded-lg cursor-pointer" onClick={onToggle}>
          <span className="ml-1 text-sm">{chatOpen ? <PanelRight className="size-5" /> : <PanelLeft className="size-5" />}</span>
          الشات
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-lg">
          <MoreHorizontal className="size-5" />
        </Button>
        <Lock className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export default ChatHeader;