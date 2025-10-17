// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // <-- Añade useCallback
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAgents } from "@/services/api";
import Link from "next/link";
import { CreateAgentModal } from "@/components/CreateAgentModal"; // <-- Importa el modal

interface Agent {
  _id: string;
  name: string;
  document_count: number;
}

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Hacemos que la función de carga sea reutilizable ---
  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAgents();
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando agentes...</div>;
  }

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Agentes de IA</h1>
        {/* --- Reemplaza el botón con el componente del modal --- */}
        <CreateAgentModal onAgentCreated={fetchAgents} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Link href={`/agents/${agent._id}`} key={agent._id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{agent.document_count} documento(s) en la base de conocimiento.</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
