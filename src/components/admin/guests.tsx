"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteAttendee } from "@/server/actions";
import type { GuestRow } from "@/types/guest";

export type { GuestRow };

export function GuestTable({ rows, initialQuery = "" }: { rows: GuestRow[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = rows.filter((row) => {
      const matchesQuery = !needle || `${row.name} ${row.email} ${row.phone} ${row.city} ${row.reference}`.toLowerCase().includes(needle);
      const matchesStatus = status === "all" || row.status === status;
      return matchesQuery && matchesStatus;
    });
    next.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "age") return a.age - b.age;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    return next;
  }, [rows, query, status, sort]);

  const pageSize = 12;
  const slice = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div>
      <div className="filters">
        <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Search name, email, city" aria-label="Search guests" />
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }} aria-label="Filter by status">
          <option value="all">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="waitlist">Waitlist</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
        </select>
        <a className="btn-fill" href="/api/admin/export">Export CSV</a>
      </div>
      {filtered.length === 0 ? (
        <div className="empty">
          <h2>No RSVPs yet.</h2>
          <p>Your guest list is waiting to begin.</p>
          <Link className="btn-fill" href="/" style={{ color: "#0c0b0a" }}>Share The Mingle</Link>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                {["Name", "Email", "Phone", "Age", "Gender", "Relationship", "City", "RSVP", "Payment", "Source", "Ticket", "Date"].map((heading) => (
                  <th key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link href={`/admin/attendees/${row.id}`}>{row.name}</Link>
                    {row.sample ? <div style={{ color: "#8d6e60", fontSize: "0.75rem" }}>Sample</div> : null}
                  </td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td>{row.age}</td>
                  <td>{row.gender || "—"}</td>
                  <td>{row.relationship || "—"}</td>
                  <td>{row.city || "—"}</td>
                  <td>{row.status}</td>
                  <td>{row.payment}</td>
                  <td>{row.source || "—"}</td>
                  <td>{row.ticket}</td>
                  <td>{row.createdAt.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row-actions">
            <button type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0}>Previous</button>
            <span>
              {page + 1} / {pages}
            </span>
            <button type="button" onClick={() => setPage((value) => Math.min(pages - 1, value + 1))} disabled={page + 1 >= pages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DeleteGuest({ id, name }: { id: string; name: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm(`Remove ${name} from the list?`)) void deleteAttendee(id);
      }}
    >
      Delete
    </button>
  );
}
