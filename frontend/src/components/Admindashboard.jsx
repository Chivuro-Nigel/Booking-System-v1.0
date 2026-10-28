import { useMemo, useState } from "react";

/* ---------- Demo data (frontend only, lives in React state) ---------- */
const ROOM_TYPES = ["Presidential Suite", "Executive", "Standard"];
const ROOM_STATUSES = ["Available", "Occupied", "Under Maintenance"];
const BOOKING_STATUSES = ["Pending", "Checked-In", "Checked-Out"];

const SEED_ROOMS = [
  {
    id: "PS1",
    name: "Presidential Suite 1",
    type: "Presidential Suite",
    status: "Available",
    price: 80,
    amenities: "Bathtub, Shower, Mirror, AC, Wifi, TV",
  },
  {
    id: "SR1",
    name: "Standard room 1",
    type: "Standard",
    status: "Occupied",
    price: 40,
    amenities: "Shower, AC, Wifi, Fan",
  },
  {
    id: "ER1",
    name: "Executive room 1",
    type: "Executive",
    status: "Under Maintenance",
    price: 60,
    amenities: "Bathtub, Shower, AC, Wifi, TV",
  },
  {
    id: "SR3",
    name: "Standard room 3",
    type: "Standard",
    status: "Available",
    price: 40,
    amenities: "Shower, AC, Wifi, Fan",
  },
];

const SEED_BOOKINGS = [
  {
    id: 1,
    guest: "Mr. Chivuro",
    room: "Presidential Suite 1",
    status: "Checked-In",
    checkIn: "2026-10-27",
    checkOut: "2026-10-28",
    time: "1400",
  },
  {
    id: 2,
    guest: "Mr. Chimhanda",
    room: "Standard room 3",
    status: "Pending",
    checkIn: "2026-10-30",
    checkOut: "2026-10-31",
    time: "N/A",
  },
  {
    id: 3,
    guest: "Mrs. Doe",
    room: "Executive room 1",
    status: "Pending",
    checkIn: "2026-10-30",
    checkOut: "2026-10-31",
    time: "N/A",
  },
];

const MONTHS = ["2026-09", "2026-10", "2026-11", "2026-12"];
const monthLabel = (m) =>
  new Date(m + "-01T00:00").toLocaleString("en-GB", {
    month: "short",
    year: "numeric",
  });
const fmtDate = (d) =>
  new Date(d + "T00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_COLOR = {
  "Checked-In": "text-green-700",
  Available: "text-green-700",
  Pending: "text-orange-500",
  Occupied: "text-orange-500",
  "Checked-Out": "text-slate-500",
  "Under Maintenance": "text-red-900",
};

const STATUS_BADGE = {
  "Checked-In": "bg-green-100 text-green-800",
  Available: "bg-green-100 text-green-800",
  Pending: "bg-orange-100 text-orange-700",
  Occupied: "bg-orange-100 text-orange-700",
  "Checked-Out": "bg-slate-100 text-slate-600",
  "Under Maintenance": "bg-red-100 text-red-800",
};
const Badge = ({ status, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[status]} ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status}
  </span>
);

/* ---------- Icons ---------- */
const Svg = ({ children, className = "h-6 w-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);
const IHome = (p) => (
  <Svg {...p}>
    <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
  </Svg>
);
const ISearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-5-5" />
  </Svg>
);
const IChevron = (p) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
const IGrid = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </Svg>
);
const IList = (p) => (
  <Svg {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);
const ICal = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </Svg>
);
const IBed = (p) => (
  <Svg {...p}>
    <path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5" />
    <circle cx="7" cy="11" r="1.5" />
  </Svg>
);
const IUser = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </Svg>
);
const ILogout = (p) => (
  <Svg {...p}>
    <path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4M16 8l4 4-4 4M20 12H9" />
  </Svg>
);
const IMenu = (p) => (
  <Svg {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

const NAV = [
  { key: "calendar", label: "Master Calendar", Icon: ICal },
  { key: "rooms", label: "Rooms", Icon: IBed },
  { key: "inventory", label: "Inventory", Icon: IBed },
  { key: "guests", label: "Guest Directory", Icon: IUser },
  { key: "analytics", label: "Analytics", Icon: IBed },
];

/* ---------- Small shared pieces ---------- */
const PILL = "rounded-full bg-neutral-600 text-white text-sm font-semibold";
const INPUT =
  "w-full rounded border border-slate-400 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

function SearchBar({ value, onChange, placeholder }) {
  return (
    <label
      className={`${PILL} flex min-w-0 flex-1 basis-64 items-center gap-3 px-4 py-3`}
    >
      <ISearch className="h-5 w-5 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent placeholder-slate-200 outline-none"
      />
    </label>
  );
}

function PillSelect({ value, onChange, children }) {
  return (
    <div className={`${PILL} relative min-w-40 shrink-0`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent py-3 pl-4 pr-10 text-white outline-none pill-select"
      >
        {children}
      </select>
      <IChevron className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2" />
    </div>
  );
}

function ViewToggle({ mode, setMode }) {
  return (
    <button
      onClick={() => setMode(mode === "table" ? "cards" : "table")}
      aria-label={
        mode === "table" ? "Switch to card view" : "Switch to table view"
      }
      className="rounded p-2 hover:bg-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
    >
      {mode === "table" ? (
        <IGrid className="h-7 w-7" />
      ) : (
        <IList className="h-7 w-7" />
      )}
    </button>
  );
}

/* Generic table / card list. columns: [{label, render(row), center}] */
function DataList({ columns, rows, mode, onRowClick, empty }) {
  if (!rows.length)
    return <p className="mt-10 text-center text-slate-500">{empty}</p>;
  if (mode === "cards") {
    return (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((r, i) => (
          <div
            key={r.id}
            onClick={() => onRowClick?.(r)}
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition ${onRowClick ? "cursor-pointer hover:border-orange-300 hover:shadow-md" : ""}`}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
              #{i + 1}
            </p>
            {columns.map((c) => (
              <div
                key={c.label}
                className="flex justify-between gap-3 py-1 text-sm"
              >
                <span className="text-slate-500">{c.label}</span>
                <span className="text-right">{c.render(r, i)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="w-14 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-orange-500">
                #
              </th>
              {columns.map((c) => (
                <th
                  key={c.label}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr
                key={r.id}
                onClick={() => onRowClick?.(r)}
                className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-orange-50/60" : "hover:bg-slate-50"}`}
              >
                <td className="px-5 py-4 font-semibold text-slate-400">
                  {i + 1}
                </td>
                {columns.map((c) => (
                  <td key={c.label} className="px-5 py-4 text-slate-800">
                    {c.render(r, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-slate-500 hover:text-black"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const Labeled = ({ label, children }) => (
  <label className="block text-sm font-medium text-slate-800">
    {label}
    <div className="mt-1">{children}</div>
  </label>
);

/* ---------- Pages ---------- */
function MasterCalendar({ bookings, setBookings }) {
  const [q, setQ] = useState("");
  const [month, setMonth] = useState("2026-10");
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("table");

  const rows = useMemo(
    () =>
      bookings.filter(
        (b) =>
          (!month || b.checkIn.startsWith(month)) &&
          (!status || b.status === status) &&
          (!q ||
            `${b.guest} RES-${b.id}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [bookings, q, month, status],
  );

  const advance = (b) => {
    const next = BOOKING_STATUSES[BOOKING_STATUSES.indexOf(b.status) + 1];
    if (!next) return;
    const now = new Date();
    const time =
      next === "Checked-In"
        ? `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`
        : b.time;
    setBookings(
      bookings.map((x) => (x.id === b.id ? { ...x, status: next, time } : x)),
    );
  };

  const columns = [
    { label: "Guest Name", render: (b) => b.guest },
    { label: "Room", render: (b) => b.room },
    {
      label: "Status",
      render: (b) => {
        const next = BOOKING_STATUSES[BOOKING_STATUSES.indexOf(b.status) + 1];
        return (
          <button
            onClick={() => advance(b)}
            disabled={!next}
            title={next ? `Mark as ${next}` : "Completed"}
            className={`rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${next ? "cursor-pointer hover:brightness-95" : "cursor-default"}`}
          >
            <Badge status={b.status} />
          </button>
        );
      },
    },
    { label: "Check-in date", render: (b) => fmtDate(b.checkIn) },
    { label: "Check-out date", render: (b) => fmtDate(b.checkOut) },
    { label: "Time", render: (b) => b.time },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search Guest Name, or Reservation ID"
        />
        <PillSelect value={month} onChange={setMonth}>
          <option value="">All months</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m)}
            </option>
          ))}
        </PillSelect>
        <PillSelect value={status} onChange={setStatus}>
          <option value="">Status</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </PillSelect>
        <ViewToggle mode={mode} setMode={setMode} />
      </div>
      <p className="mt-4 text-sm italic text-slate-600">
        Click a booking's status to move it to the next stage.
      </p>
      <DataList
        columns={columns}
        rows={rows}
        mode={mode}
        empty="No bookings match these filters."
      />
    </>
  );
}

function RoomsPage({ rooms, setRooms }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("table");
  const [editing, setEditing] = useState(null);

  const rows = rooms.filter(
    (r) =>
      (!type || r.type === type) &&
      (!status || r.status === status) &&
      (!q ||
        `${r.id} ${r.name} ${r.type}`.toLowerCase().includes(q.toLowerCase())),
  );

  const columns = [
    {
      label: "Room ID",
      render: (r) => (
        <span className="flex items-center gap-3">
          <span className="h-9 w-9 shrink-0 rounded-full bg-linear-to-br from-slate-200 to-slate-300" />
          <span className="font-semibold">{r.id}</span>
        </span>
      ),
    },
    { label: "Type", render: (r) => r.type },
    { label: "Status", render: (r) => <Badge status={r.status} /> },
    {
      label: "Price ($) / night",
      render: (r) => <span className="font-semibold">${r.price}</span>,
    },
  ];

  const save = (e) => {
    e.preventDefault();
    setRooms(
      rooms.map((r) =>
        r.id === editing.id
          ? { ...editing, price: Number(editing.price) || 0 }
          : r,
      ),
    );
    setEditing(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search Room ID, Name, or Type"
        />
        <PillSelect value={type} onChange={setType}>
          <option value="">Room type</option>
          {ROOM_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </PillSelect>
        <PillSelect value={status} onChange={setStatus}>
          <option value="">Status</option>
          {ROOM_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </PillSelect>
        <ViewToggle mode={mode} setMode={setMode} />
      </div>
      <p className="mt-6 font-bold italic">
        Click to view and edit room details, pictures, amenities and price
      </p>
      <DataList
        columns={columns}
        rows={rows}
        mode={mode}
        onRowClick={(r) => setEditing({ ...r })}
        empty="No rooms match these filters."
      />

      {editing && (
        <Modal title={`Edit ${editing.id}`} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <Labeled label="Room name">
              <input
                className={INPUT}
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
            </Labeled>
            <Labeled label="Type">
              <select
                className={INPUT}
                value={editing.type}
                onChange={(e) =>
                  setEditing({ ...editing, type: e.target.value })
                }
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Labeled>
            <Labeled label="Status">
              <select
                className={INPUT}
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value })
                }
              >
                {ROOM_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Labeled>
            <Labeled label="Price ($) / night">
              <input
                type="number"
                min="0"
                className={INPUT}
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: e.target.value })
                }
              />
            </Labeled>
            <Labeled label="Amenities">
              <textarea
                rows="2"
                className={INPUT}
                value={editing.amenities}
                onChange={(e) =>
                  setEditing({ ...editing, amenities: e.target.value })
                }
              />
            </Labeled>
            <div className="flex h-20 items-center justify-center rounded border border-dashed border-slate-400 text-sm text-slate-500">
              Picture upload (demo placeholder)
            </div>
            <button className="w-full rounded-full bg-orange-500 py-2.5 font-bold text-white hover:bg-orange-600">
              Save changes
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

function GuestDirectory({ bookings }) {
  const guests = useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      const g = map.get(b.guest) ?? {
        id: b.guest,
        name: b.guest,
        stays: 0,
        last: b.checkIn,
      };
      g.stays += 1;
      if (b.checkIn > g.last) g.last = b.checkIn;
      map.set(b.guest, g);
    });
    return [...map.values()];
  }, [bookings]);
  const columns = [
    { label: "Guest Name", render: (g) => g.name },
    { label: "Bookings", render: (g) => g.stays },
    { label: "Latest check-in", render: (g) => fmtDate(g.last) },
  ];
  return (
    <>
      <h2 className="text-2xl font-bold">Guest Directory</h2>
      <DataList
        columns={columns}
        rows={guests}
        mode="table"
        empty="No guests yet."
      />
    </>
  );
}

function Analytics({ bookings, rooms }) {
  const occupied = rooms.filter((r) => r.status === "Occupied").length;
  const stats = [
    ["Total bookings", bookings.length],
    ["Pending", bookings.filter((b) => b.status === "Pending").length],
    ["Checked in", bookings.filter((b) => b.status === "Checked-In").length],
    ["Room occupancy", `${Math.round((occupied / rooms.length) * 100)}%`],
    [
      "Under maintenance",
      rooms.filter((r) => r.status === "Under Maintenance").length,
    ],
  ];
  return (
    <>
      <h2 className="text-2xl font-bold">Analytics</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

const Placeholder = ({ title }) => (
  <>
    <h2 className="text-2xl font-bold">{title}</h2>
    <p className="mt-4 text-slate-500">
      This section isn't part of the demo yet.
    </p>
  </>
);

/* ---------- New booking modal ---------- */
function NewBooking({ rooms, onSave, onClose }) {
  const [f, setF] = useState({
    guest: "",
    room: "",
    checkIn: "",
    checkOut: "",
  });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!f.guest.trim() || !f.room || !f.checkIn || !f.checkOut)
      return setErr("Fill in every field.");
    if (f.checkOut <= f.checkIn)
      return setErr("Check-out must be after check-in.");
    onSave({ ...f, guest: f.guest.trim() });
  };
  return (
    <Modal title="New Booking" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <Labeled label="Guest name">
          <input
            className={INPUT}
            placeholder="Eg. Mr. Moyo"
            value={f.guest}
            onChange={set("guest")}
          />
        </Labeled>
        <Labeled label="Room">
          <select className={INPUT} value={f.room} onChange={set("room")}>
            <option value="">Select room</option>
            {rooms
              .filter((r) => r.status !== "Under Maintenance")
              .map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name} (${r.price}/night)
                </option>
              ))}
          </select>
        </Labeled>
        <Labeled label="Check-in date">
          <input
            type="date"
            className={INPUT}
            value={f.checkIn}
            onChange={set("checkIn")}
          />
        </Labeled>
        <Labeled label="Check-out date">
          <input
            type="date"
            className={INPUT}
            min={f.checkIn}
            value={f.checkOut}
            onChange={set("checkOut")}
          />
        </Labeled>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-full bg-orange-500 py-2.5 font-bold text-white hover:bg-orange-600">
          Save booking
        </button>
      </form>
    </Modal>
  );
}

/* ---------- Shell ---------- */
export default function AdminDashboard() {
  const [page, setPage] = useState("calendar");
  const [rooms, setRooms] = useState(SEED_ROOMS);
  const [bookings, setBookings] = useState(SEED_BOOKINGS);
  const [navOpen, setNavOpen] = useState(() => window.innerWidth >= 768);
  const [userMenu, setUserMenu] = useState(false);
  const [booking, setBooking] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  if (loggedOut) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
        <p className="text-xl font-bold text-orange-500">TWIN LODGE RESORTS</p>
        <p>You have been logged out.</p>
        <button
          onClick={() => setLoggedOut(false)}
          className="rounded-full bg-orange-500 px-8 py-2 font-bold hover:bg-orange-600"
        >
          Log back in
        </button>
      </div>
    );
  }

  const go = (k) => {
    setPage(k);
    if (window.innerWidth < 768) setNavOpen(false);
  };

  const addBooking = (b) => {
    setBookings([
      ...bookings,
      {
        ...b,
        id: Math.max(0, ...bookings.map((x) => x.id)) + 1,
        status: "Pending",
        time: "N/A",
      },
    ]);
    setBooking(false);
    setPage("calendar");
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      <style>{`.pill-select option{background:#fff;color:#000}`}</style>
      {/* Sidebar */}
      <aside
        aria-hidden={!navOpen}
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-black text-white transition-all duration-300 md:static ${
          navOpen
            ? "translate-x-0 md:ml-0"
            : "-translate-x-full md:translate-x-0 md:-ml-64"
        }`}
      >
        <button
          onClick={() => setNavOpen(false)}
          aria-label="Close menu"
          className="absolute right-3 top-3 rounded p-1 text-2xl leading-none text-white hover:text-orange-400"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-1 px-4 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-lg font-bold">
            TL
          </div>
          <p className="text-sm font-bold text-orange-500">
            TWIN LODGE RESORTS
          </p>
        </div>
        <nav className="mt-10 flex-1 space-y-1 px-4">
          {NAV.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => go(key)}
              aria-current={page === key ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-lg hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${page === key ? "text-orange-500" : ""}`}
            >
              <Icon /> {label}
            </button>
          ))}
        </nav>
        <div className="mx-4 mb-6 border-t-2 border-white pt-4">
          <button
            onClick={() => setLoggedOut(true)}
            className="flex items-center gap-3 px-3 py-2 font-bold hover:text-orange-400"
          >
            <ILogout /> Logout
          </button>
        </div>
      </aside>
      {navOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="relative z-20 flex items-center justify-between bg-black px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNavOpen(!navOpen)}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              aria-expanded={navOpen}
              className="rounded p-1 text-white hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <IMenu />
            </button>
            <button
              onClick={() => go("calendar")}
              aria-label="Home"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black"
            >
              <IHome />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBooking(true)}
              className="rounded-full border-2 border-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-500"
            >
              + New Booking
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                aria-label="Account menu"
                className="flex items-center gap-1 text-white"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white">
                  <IUser />
                </span>
                <IChevron />
              </button>
              {userMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white py-1 text-sm shadow-lg">
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-orange-50"
                    onClick={() => setUserMenu(false)}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-orange-50"
                    onClick={() => setLoggedOut(true)}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {page === "calendar" && (
            <MasterCalendar bookings={bookings} setBookings={setBookings} />
          )}
          {page === "rooms" && <RoomsPage rooms={rooms} setRooms={setRooms} />}
          {page === "inventory" && <Placeholder title="Inventory" />}
          {page === "guests" && <GuestDirectory bookings={bookings} />}
          {page === "analytics" && (
            <Analytics bookings={bookings} rooms={rooms} />
          )}
        </main>
      </div>

      {booking && (
        <NewBooking
          rooms={rooms}
          onSave={addBooking}
          onClose={() => setBooking(false)}
        />
      )}
    </div>
  );
}
