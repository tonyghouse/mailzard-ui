import { Contact } from "@/model/Contact";


export function ContactsTable({
  contacts,
  loading,
}: {
  contacts: Contact[];
  loading?: boolean;
}) {
  return (
    <div className="p-6">
      <div className="overflow-hidden rounded-lg border border-scale-500 bg-scale-200">
        <table className="w-full text-sm">
          <thead className="bg-scale-300 border-b border-scale-500">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-scale-1100 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-scale-1100 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-scale-1100 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-scale-1100 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-scale-200 divide-y divide-scale-500">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-scale-1000">
                  Loading...
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-scale-1000">
                  No contacts found
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-scale-300 transition-colors"
                >
                  <td className="px-6 py-4 text-scale-1200">{c.email}</td>
                  <td className="px-6 py-4 text-scale-1200">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.isSubscribed
                          ? "bg-brand-400 text-brand-1100"
                          : "bg-scale-500 text-scale-1100"
                      }`}
                    >
                      {c.isSubscribed ? "Subscribed" : "Unsubscribed"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}