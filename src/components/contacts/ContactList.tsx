"use client";

import { useState, useEffect } from "react";
import { Contact, CreateContactRequest } from "@/model/Contact";
import { ContactGroup } from "@/model/ContactGroup";
import {
  copyContactsApi,
  createContactApi,
  deleteContactsApi,
  getContactsApi,
  moveContactsApi,
  PaginatedContacts,
  updateContactApi,
} from "@/service/contactsApi";
import { Pagination } from "../generic/pagination";
import { ContactFormModal } from "./ContactFormModal";
import { CopyContactsModal } from "./CopyContactsModal";
import { MoveContactsModal } from "./MoveContactsModal";

interface ContactsListProps {
  groupId: number;
  groupName: string;
  groups: ContactGroup[];
  getToken: () => Promise<string | null>;
}

export function ContactsList({
  groupId,
  groupName,
  groups,
  getToken,
}: ContactsListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
    setSelectedContacts(new Set());
  }, [groupId, currentPage]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: PaginatedContacts = await getContactsApi(
        getToken,
        currentPage - 1,
        groupId
      );
      setContacts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleContactSelection = (contactId: number) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedContacts.size === contacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(contacts.map((c) => c.id)));
    }
  };

  const handleAddContact = async (data: CreateContactRequest) => {
    await createContactApi(getToken, data);
    await loadContacts();
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditModalOpen(true);
  };

  const handleEditContact = async (data: CreateContactRequest) => {
    if (!editingContact) return;
    await updateContactApi(getToken, editingContact.id, data);
    await loadContacts();
    setEditingContact(null);
  };

  const handleDeleteContacts = async () => {
    if (selectedContacts.size === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedContacts.size} contact${
        selectedContacts.size !== 1 ? "s" : ""
      }?`
    );

    if (!confirmed) return;

    try {
      await deleteContactsApi(getToken, Array.from(selectedContacts));
      setSelectedContacts(new Set());
      await loadContacts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete contacts");
    }
  };

  const handleMoveContacts = async (targetGroupId: number) => {
    if (selectedContacts.size === 0) return;

    try {
      await moveContactsApi(
        getToken,
        Array.from(selectedContacts),
        groupId,
        targetGroupId
      );
      setSelectedContacts(new Set());
      await loadContacts();
    } catch (err) {
      throw err;
    }
  };

  const handleCopyContacts = async (targetGroupId: number) => {
    if (selectedContacts.size === 0) return;

    try {
      await copyContactsApi(
        getToken,
        Array.from(selectedContacts),
        groupId,
        targetGroupId
      );
      setSelectedContacts(new Set());
    } catch (err) {
      throw err;
    }
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">
          Loading contacts…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={loadContacts}
          className="mt-2 text-xs underline text-destructive"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {groupName}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {totalElements} {totalElements === 1 ? "contact" : "contacts"}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition"
        >
          + Add Contact
        </button>
      </div>

      {/* Selection Actions */}
      {selectedContacts.size > 0 && (
        <div className="bg-muted border border-border rounded-md px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">
            {selectedContacts.size} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCopyModalOpen(true)}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-xs hover:bg-muted transition"
            >
              Copy
            </button>
            <button
              onClick={() => setIsMoveModalOpen(true)}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-xs hover:bg-muted transition"
            >
              Move
            </button>
            <button
              onClick={handleDeleteContacts}
              className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-md text-xs hover:opacity-90 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      {contacts.length === 0 ? (
        <div className="bg-card rounded-md border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No contacts in this group yet
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            + Add First Contact
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      contacts.length > 0 &&
                      selectedContacts.size === contacts.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className={`transition ${
                    selectedContacts.has(contact.id)
                      ? "bg-accent"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedContacts.has(contact.id)}
                      onChange={() => toggleContactSelection(contact.id)}
                      className="w-4 h-4 rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {contact.firstName || contact.lastName
                      ? `${contact.firstName || ""} ${
                          contact.lastName || ""
                        }`.trim()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {contact.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        contact.isSubscribed
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {contact.isSubscribed ? "Subscribed" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEditClick(contact)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals */}
      <ContactFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddContact}
        currentGroupId={groupId}
      />

      <ContactFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleEditContact}
        contact={editingContact}
        currentGroupId={groupId}
      />

      <MoveContactsModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onMove={handleMoveContacts}
        groups={groups}
        currentGroupId={groupId}
        selectedCount={selectedContacts.size}
      />

      <CopyContactsModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        onCopy={handleCopyContacts}
        groups={groups}
        currentGroupId={groupId}
        selectedCount={selectedContacts.size}
      />
    </div>
  );
}
