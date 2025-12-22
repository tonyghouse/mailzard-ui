"use client";
import { cn } from "@/lib/utils";
import { ContactGroup } from "@/model/ContactGroup";

export function GroupsSidebar({
  groups,
  selectedGroupId,
  onSelect,
}: {
  groups: ContactGroup[];
  selectedGroupId: number | null;
  onSelect: (groupId: number | null) => void;
}) {
  return (
    <aside className="w-64 border-r border-scale-500 bg-scale-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-scale-1100 uppercase tracking-wider">
          Contact Groups
        </h2>
      </div>

      <nav className="px-3 pb-4">
        <ul className="space-y-1">
          <li
            onClick={() => onSelect(null)}
            className={cn(
              "cursor-pointer rounded px-3 py-2 text-sm transition-colors",
              "hover:bg-scale-300",
              selectedGroupId === null
                ? "bg-scale-400 text-scale-1200 font-medium"
                : "text-scale-1100"
            )}
          >
            All Contacts
          </li>

          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => onSelect(group.id)}
              className={cn(
                "cursor-pointer rounded px-3 py-2 text-sm transition-colors",
                "hover:bg-scale-300",
                selectedGroupId === group.id
                  ? "bg-scale-400 text-scale-1200 font-medium"
                  : "text-scale-1100"
              )}
            >
              {group.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}