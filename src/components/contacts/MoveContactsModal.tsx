"use client";

import { useState } from "react";
import { ContactGroup } from "@/model/ContactGroup";
import { X } from "lucide-react";

interface MoveContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetGroupId: number) => Promise<void>;
  groups: ContactGroup[];
  currentGroupId: number;
  selectedCount: number;
}

export function MoveContactsModal({
  isOpen,
  onClose,
  onMove,
  groups,
  currentGroupId,
  selectedCount,
}: MoveContactsModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableGroups = groups.filter((g) => g.id !== currentGroupId);

  const handleMove = async () => {
    if (!selectedGroupId) {
      setError("Please select a group");
      return;
    }

    try {
      setIsMoving(true);
      setError(null);
      await onMove(selectedGroupId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move contacts");
    } finally {
      setIsMoving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md mx-4 rounded-md border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Move Contacts
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Move {selectedCount} contact{selectedCount !== 1 ? "s" : ""} to:
          </p>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {availableGroups.length === 0 ? (
            <div className="rounded-md border border-border bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
              No other groups available. Create a new group first.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableGroups.map((group) => (
                <label
                  key={group.id}
                  className={`flex items-start gap-3 rounded-md border px-3 py-2 cursor-pointer transition ${
                    selectedGroupId === group.id
                      ? "border-ring bg-accent"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="group"
                    value={group.id}
                    checked={selectedGroupId === group.id}
                    onChange={() => setSelectedGroupId(group.id)}
                    className="mt-1 h-4 w-4 text-primary focus:ring-1 focus:ring-ring"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {group.name}
                    </div>
                    {group.description && (
                      <div className="text-xs text-muted-foreground">
                        {group.description}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isMoving}
              className="flex-1 rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/70 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMove}
              disabled={
                isMoving || availableGroups.length === 0 || !selectedGroupId
              }
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMoving ? "Moving..." : "Move"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
