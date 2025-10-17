"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Para redireccionar
import { getAgentDetails, chatWithAgent, uploadDocument, deleteDocument, deleteAgent } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, FileText, SendHorizontal, ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { EditAgentModal } from "@/components/EditAgentModal";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

// --- Tipos ---
interface Document {
  file_name: string;
  url: string;
  uploaded_at: string;
}
interface AgentDetails {
  _id: string;
  name: string;
  prompt: string;
  documents: Document[];
}
interface Message {
  id: number;
  sender: "user" | "agent";
  text: string;
  sources?: string[];
}

// --- Componente ---
export default function AgentDetailPage({ params }: { params: { agentId: string } }) {
  const { agentId } = params;
  const router = useRouter();
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchAgentDetails = async () => {
    if (!agentId) return;
    try {
      const response = await getAgentDetails(agentId);
      setAgent(response.data);
    } catch (error) {
      console.error("Error fetching agent details:", error);
      toast.error("No se pudieron cargar los detalles del agente.");
      setAgent(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAgentDetails();
  }, [agentId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatting) return;

    const userMessage: Message = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsChatting(true);

    try {
      const response = await chatWithAgent(agentId, input);
      const agentMessage: Message = {
        id: Date.now() + 1,
        sender: "agent",
        text: response.data.answer,
        sources: response.data.retrieved_sources,
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      toast.error("Error al contactar al agente.");
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsChatting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    toast("Subiendo documento...", { description: file.name });
    try {
      await uploadDocument(agentId, file);
      toast.success("Documento subido con éxito.");
      fetchAgentDetails();
    } catch (error) {
      toast.error("Error al subir el documento.");
    }
  };

  const handleDeleteDocument = async (fileName: string) => {
    setIsDeleting(true);
    try {
      await deleteDocument(agentId, fileName);
      toast.success(`Documento "${fileName}" eliminado.`);
      fetchAgentDetails();
    } catch (error) {
      toast.error("Error al eliminar el documento.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAgent = async () => {
    setIsDeleting(true);
    try {
      await deleteAgent(agentId);
      toast.success(`Agente "${agent?.name}" eliminado con éxito.`);
      router.push("/");
    } catch (error) {
      toast.error("Error al eliminar el agente.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando agente...</div>;
  }
  if (!agent) {
    return <div className="flex items-center justify-center h-screen">Agente no encontrado o error al cargar.</div>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a todos los agentes
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{agent.name}</CardTitle>
                  <CardDescription className="pt-2">{agent.prompt}</CardDescription>
                </div>
                <EditAgentModal agent={agent} onAgentUpdated={fetchAgentDetails}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </EditAgentModal>
              </div>
            </CardHeader>
            <CardFooter>
              <DeleteConfirmationDialog
                title="¿Estás seguro de que quieres eliminar este agente?"
                description={`Esta acción no se puede deshacer. Se eliminarán todos los documentos y la configuración de "${agent.name}".`}
                trigger={
                  <Button variant="destructive" className="w-full">
                    Eliminar Agente
                  </Button>
                }
                onConfirm={handleDeleteAgent}
                isDeleting={isDeleting}
              />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Base de Conocimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.docx,.xlsx,.pptx"
              />
              <Button onClick={() => fileInputRef.current?.click()} className="w-full mb-4">
                <Upload className="mr-2 h-4 w-4" /> Subir Documento
              </Button>
              <ul className="space-y-2">
                {agent.documents.map((doc) => (
                  <li key={doc.file_name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center truncate">
                      <FileText className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{doc.file_name}</span>
                    </div>
                    <DeleteConfirmationDialog
                      title="¿Eliminar documento?"
                      description={`¿Estás seguro de que quieres eliminar "${doc.file_name}"? Esta acción es irreversible.`}
                      trigger={
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      }
                      onConfirm={() => handleDeleteDocument(doc.file_name)}
                      isDeleting={isDeleting}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Chat con {agent.name}</CardTitle>
              <CardDescription>Haz una pregunta basada en los documentos.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div
                ref={chatContainerRef}
                className="flex-grow border rounded-md p-4 mb-4 overflow-y-auto h-96 bg-gray-50/50"
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    La conversación está vacía.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col mb-4 ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      {msg.sources && msg.sources.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Fuentes: {msg.sources.join(", ")}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  disabled={isChatting}
                  autoComplete="off"
                />
                <Button type="submit" disabled={isChatting}>
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
