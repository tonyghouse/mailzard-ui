"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import type { Contact } from "@/model/Contact";
import type { ContactGroup } from "@/model/ContactGroup";

import { ContactsTable } from "@/components/contacts/ContactsTable";
import { getContactGroupsApi } from "@/service/getContactGroupsApi";
import { getContactsApi } from "@/service/getContactsApi";
import { GroupsSidebar } from "@/components/contacts/GroupsSidebar";

export default function ContactsPage() {
  const { getToken } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ---------------- Groups ---------------- */
  useEffect(() => {
    getContactGroupsApi(getToken).then(setGroups);
  }, [getToken]);

  /* ---------------- Contacts ---------------- */
  useEffect(() => {
    setLoading(true);

    getContactsApi(getToken, page, selectedGroupId)
      .then((res) => {
        setContacts(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [getToken, page, selectedGroupId]);

  return (
    <div className="flex h-screen bg-studio">
      <GroupsSidebar
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelect={(groupId) => {
          setSelectedGroupId(groupId);
          setPage(1);
        }}
      />

      <div className="flex-1 overflow-auto">
        <ContactsTable contacts={contacts} loading={loading} />
      </div>
    </div>
  );
}