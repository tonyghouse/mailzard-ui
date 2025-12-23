"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

import { ContactGroup } from "@/model/ContactGroup";
import {
  createContactGroupApi,
  deleteContactGroupApi,
  getContactGroupsApi,
} from "@/service/contactGroupApi";
import { ContactsList } from "@/components/contacts/ContactList";

export default function ContactsPage() {
  const { getToken } = useAuth();
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedGroups = await getContactGroupsApi(getToken);
      setGroups(fetchedGroups);

      if (fetchedGroups.length > 0 && !selectedGroupId) {
        setSelectedGroupId(fetchedGroups[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const newGroup = await createContactGroupApi(getToken, {
        name: newGroupName,
        description: newGroupDescription,
      });

      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setNewGroupDescription("");
      setIsAddingGroup(false);
      setSelectedGroupId(newGroup.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create group");
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    try {
      await deleteContactGroupApi(getToken, groupId);
      const updatedGroups = groups.filter((g) => g.id !== groupId);
      setGroups(updatedGroups);

      if (selectedGroupId === groupId) {
        setSelectedGroupId(updatedGroups.length ? updatedGroups[0].id : null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete group");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Loading contact groups…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-sidebar flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold tracking-tight">
            Contact Groups
          </h2>
        </div>

        {/* Group List */}
        <div className="flex-1 overflow-y-auto p-2">
          {error && (
            <div className="mb-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {groups.length === 0 ? (
            <div className="px-3 py-4 text-xs text-muted-foreground">
              No groups yet. Create one to get started.
            </div>
          ) : (
            groups.map((group) => {
              const isActive = selectedGroupId === group.id;

              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={[
                    "group flex items-center justify-between gap-2 rounded-md px-3 py-2 mb-1 cursor-pointer transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted/60 text-foreground",
                  ].join(" ")}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {group.name}
                    </div>
                    {group.description && (
                      <div className="truncate text-xs text-muted-foreground">
                        {group.description}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 rounded p-1 hover:bg-destructive/10 transition"
                    title="Delete group"
                  >
                    <svg
                      className="h-4 w-4 text-destructive"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Add Group */}
        <div className="border-t border-border p-3">
          {!isAddingGroup ? (
            <button
              onClick={() => setIsAddingGroup(true)}
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              + Add Group
            </button>
          ) : (
            <form onSubmit={handleAddGroup} className="space-y-2">
              <input
                type="text"
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                autoFocus
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingGroup(false);
                    setNewGroupName("");
                    setNewGroupDescription("");
                  }}
                  className="flex-1 rounded-md border border-border bg-muted px-3 py-2 text-sm hover:bg-muted/70"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background p-6 overflow-y-auto pb-20">

        {selectedGroupId ? (
          <ContactsList
            groupId={selectedGroupId}
            groupName={
              groups.find((g) => g.id === selectedGroupId)?.name || ""
            }
            groups={groups}
            getToken={getToken}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium">
                No group selected
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Select or create a group to view contacts
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
