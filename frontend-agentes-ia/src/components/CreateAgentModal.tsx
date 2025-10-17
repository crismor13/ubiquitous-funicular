// src/components/CreateAgentModal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAgent } from "@/services/api";
import { toast } from "sonner";

interface CreateAgentFormValues {
  name: string;
  prompt: string;
}

// El componente recibe una función para ser notificado cuando se cree un agente
interface CreateAgentModalProps {
  onAgentCreated: () => void;
}

export function CreateAgentModal({ onAgentCreated }: CreateAgentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAgentFormValues>();

  const onSubmit = async (data: CreateAgentFormValues) => {
    try {
      await createAgent(data);
      toast.success("Agente creado con éxito.");
      reset(); // Limpia el formulario
      setIsOpen(false); // Cierra el modal
      onAgentCreated(); // Llama a la función para refrescar la lista
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Hubo un error al crear el agente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Crear Nuevo Agente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Agente</DialogTitle>
          <DialogDescription>Dale un nombre y un propósito a tu nuevo agente de IA.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input id="name" className="col-span-3" {...register("name", { required: "El nombre es obligatorio" })} />
              {errors.name && <p className="col-span-4 text-red-500 text-sm text-right">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prompt" className="text-right">
                Prompt
              </Label>
              <Textarea
                id="prompt"
                className="col-span-3"
                {...register("prompt", { required: "El prompt es obligatorio" })}
              />
              {errors.prompt && <p className="col-span-4 text-red-500 text-sm text-right">{errors.prompt.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Agente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
