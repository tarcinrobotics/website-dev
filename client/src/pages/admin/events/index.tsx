import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { DataTable, DataColumn } from "@/components/admin/DataTable";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import EventForm from "./EventForm";
import { Badge } from "@/components/ui/badge";
import DocumentHead from "@/components/DocumentHead";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  registrationLink?: string;
  image?: string;
  isUpcoming: boolean;
}

export default function EventsManagement() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  
  // Fetch events
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/cms/events'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/cms/events/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/events'] });
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const columns: DataColumn[] = [
    { key: "title", title: "Title", type: "longText" },
    { 
      key: "date", 
      title: "Date", 
      type: "date",
      width: "120px",
    },
    { 
      key: "location", 
      title: "Location", 
      width: "150px" 
    },
    { 
      key: "isUpcoming", 
      title: "Status", 
      width: "100px",
      formatFn: (value) => value ? 
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Upcoming</Badge> : 
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Past</Badge>
    },
  ];

  const handleCreate = () => {
    setCurrentEvent(null);
    setFormOpen(true);
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setFormOpen(true);
  };

  const handleDelete = (event: Event) => {
    deleteMutation.mutate(event.id);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setCurrentEvent(null);
  };

  return (
    <>
      <DocumentHead
        title="Events Management - Tarcin Robotic Admin"
        description="Manage events for the Tarcin Robotic website."
      />
      
      <AdminLayout title="Events">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Manage Events</h1>
            <p className="text-muted-foreground">
              Create, edit, and delete event listings for the website.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Button>
        </div>

        <DataTable
          data={events}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {formOpen && (
          <EventForm
            event={currentEvent}
            isOpen={formOpen}
            onClose={handleFormClose}
          />
        )}
      </AdminLayout>
    </>
  );
}