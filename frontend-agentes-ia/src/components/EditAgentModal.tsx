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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateAgent } from "@/services/api";
import { toast } from "sonner";
import { Edit } from "lucide-react";

interface EditAgentFormValues {
  name: string;
  prompt: string;
}

interface EditAgentModalProps {
  agent: { _id: string; name: string; prompt: string };
  onAgentUpdated: () => void;
  children: React.ReactNode; // Para usar un botón personalizado como trigger
}

export function EditAgentModal({ agent, onAgentUpdated, children }: EditAgentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditAgentFormValues>({
    defaultValues: {
      name: agent.name,
      prompt: agent.prompt,
    },
  });

  const onSubmit = async (data: EditAgentFormValues) => {
    try {
      await updateAgent(agent._id, data);
      toast.success("Agente actualizado con éxito.");
      setIsOpen(false);
      onAgentUpdated();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Hubo un error al actualizar el agente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* El trigger será el botón que pasemos como children */}
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Agente</DialogTitle>
          <DialogDescription>Modifica el nombre y/o el prompt de "{agent.name}".</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name-edit" className="text-right">
                Nombre
              </Label>
              <Input
                id="name-edit"
                className="col-span-3"
                {...register("name", { required: "El nombre es obligatorio" })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prompt-edit" className="text-right">
                Prompt
              </Label>
              <Textarea
                id="prompt-edit"
                className="col-span-3"
                {...register("prompt", { required: "El prompt es obligatorio" })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
