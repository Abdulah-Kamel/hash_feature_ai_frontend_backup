"use client";
import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatThread from "@/components/chat/ChatThread";
import ChatInput from "@/components/chat/ChatInput";
import { useParams, useRouter } from "next/navigation";
import { fetchFolderFiles } from "@/server/actions/files";
import { useFileStore } from "@/store/fileStore";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { Spinner } from "@/components/ui/spinner";
import FolderNav from "@/components/chat/FolderNav";
import { Card } from "@/components/ui/card";

export default function FolderLayout({ children }) {
  const [input, setInput] = React.useState("");
  const [chatOpen, setChatOpen] = React.useState(true);
  const { id } = useParams();
  const router = useRouter();
  const setFolderId = useFileStore((s) => s.setFolderId);
  const setFiles = useFileStore((s) => s.setFiles);
  const folderId = useFileStore((s) => s.folderId);
  const getSelectedIds = useFileStore((s) => s.getSelectedIds);
  const [messages, setMessages] = React.useState([
    {
      id: "m1",
      author: "assistant",
      initials: "SL",
      time: "10:25",
      outgoing: false,
      content: <p>اهلا بك انا مساعدك هاش, كيف يمكنني مساعدتك اليوم؟</p>,
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        author: "user",
        initials: "م",
        time: now,
        outgoing: true,
        content: <p>{input}</p>,
      },
    ]);
    const payload = {
      folderId: folderId || id,
      userPrompt: input,
      fileIds: getSelectedIds(),
    };
    const loadingId = `m-loading-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        author: "assistant",
        initials: "SL",
        time: now,
        outgoing: false,
        content: (
          <div className="flex items-center">
            <Spinner className="size-4" />
          </div>
        ),
      },
    ]);
    try {
      const res = await fetch(`/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      const answer = json?.data?.answer || json?.message || "";
      const at = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                id: `m-${Date.now()}`,
                author: "assistant",
                initials: "SL",
                time: at,
                outgoing: false,
                content: <p>{answer}</p>,
              }
            : m
        )
      );
    } catch {
      const at = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                id: `m-${Date.now()}`,
                author: "assistant",
                initials: "SL",
                time: at,
                outgoing: false,
                content: <p>تعذر الحصول على الرد الآن</p>,
              }
            : m
        )
      );
    }
    setInput("");
  };

  const loadFiles = React.useCallback(async () => {
    if (!id) return;
    setFolderId(id);
    const res = await fetchFolderFiles(id);
    if (res?.success) {
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      const normalized = items.map((it) => ({
        id: it._id,
        name: it.fileName,
      }));
      setFiles(normalized);
      
      // Auto-select all files
      if (normalized.length > 0) {
        useFileStore.getState().selectAll();
      }
    }
    if (res?.status) {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      console.error(res.status);
    }
  }, [id, setFolderId, setFiles, router]);

  // Set folderId immediately when id changes
  React.useEffect(() => {
    if (id) {
      setFolderId(id);
    }
  }, [id, setFolderId]);

  React.useEffect(() => {
    loadFiles();
    const fn = () => {
      console.log("files:refresh event received, reloading files...");
      loadFiles();
    };
    window.addEventListener("files:refresh", fn);
    return () => {
      window.removeEventListener("files:refresh", fn);
    };
  }, [loadFiles]);

  return (
    <SidebarInset className="min-h-screen">
      <ChatSidebar />
      <ChatHeader chatOpen={chatOpen} onToggle={() => setChatOpen((v) => !v)} />
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-[calc(100vh-64px)]">
        {chatOpen && (
          <div className="xl:col-span-2 max-h-[calc(100vh-64px)]">
            <div className="h-full shadow-sm overflow-hidden flex flex-col border-l">
              <ChatThread messages={messages} />
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
              />
            </div>
          </div>
        )}
        <div className={chatOpen ? "xl:col-span-2" : "xl:col-span-4"}>
          <Card className="bg-background rounded-lg p-4 h-full border-none flex flex-col overflow-y-auto">
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
