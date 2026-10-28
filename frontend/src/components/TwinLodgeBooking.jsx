import { useMemo, useState } from "react";

/* ---------- Demo data (no backend) ---------- */
// Set to a real image URL/path in your project to replace the green gradient hero.
const HERO_IMAGE = "";

const GROUPS = [
  {
    key: "Standard",
    title: "Standard Rooms",
    price: 40,
    badge: "Standard Room",
  },
  {
    key: "Executive",
    title: "Executive Rooms",
    price: 70,
    badge: "Executive Room",
  },
  {
    key: "Presidential",
    title: "Presidential Suite",
    price: 150,
    badge: "Presidential Suite",
  },
];

const ROOMS = GROUPS.flatMap((g) =>
  [1, 2, 3].map((n) => ({
    id: `${g.key}-${n}`,
    group: g.key,
    name:
      g.key === "Presidential"
        ? `Presidential Suite ${n}`
        : `${g.key} Room ${n}`,
    badge: g.badge,
    price: g.price,
    features: ["1 bed", "shower", "wifi", "air cond."],
    overview:
      g.key === "Standard"
        ? "Queen sized bed, self contained room equipped with a shower, Wifi, Air conditioner, Fan."
        : g.key === "Executive"
          ? "King sized bed, spacious self contained room with a bathtub, Wifi, Air conditioner, TV and a work desk."
          : "Our finest suite: king sized bed, lounge area, bathtub, Wifi, Air conditioner, TV and a private patio.",
    amenities: ["Bathtub", "Shower", "Mirror", "AC", "Wifi", "TV"],
  })),
);

const ADD_ONS = [
  { id: "breakfast", label: "Breakfast (per stay)", cost: 10 },
  { id: "transfer", label: "Airport transfer", cost: 15 },
  { id: "extra-bed", label: "Extra bed", cost: 20 },
];

const ORANGE = "bg-orange-500 hover:bg-orange-600 text-white";

/* ---------- Shared hero ---------- */
function Hero({ title, onReturn, tall }) {
  return (
    <header
      className={`relative flex flex-col items-center justify-center text-center text-white bg-green-800 bg-cover bg-center ${
        tall ? "h-72 md:h-96" : "h-64 md:h-80"
      }`}
      style={{
        backgroundImage: HERO_IMAGE
          ? `url(${HERO_IMAGE})`
          : "linear-gradient(135deg,#14532d 0%,#3f6212 45%,#7c4a2d 100%)",
      }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 font-bold">
        TL
      </div>
      <button
        onClick={onReturn}
        className="absolute right-4 top-4 rounded-full border border-orange-400 px-5 py-1 text-xs font-semibold text-orange-300 hover:bg-orange-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        RETURN
      </button>
      <p className="relative text-lg font-semibold text-orange-400">
        Twin Lodges Resort
      </p>
      <h1 className="relative text-4xl font-bold tracking-wide md:text-6xl">
        {title}
      </h1>
    </header>
  );
}

/* ---------- View 1: Booking home ---------- */
function BookingHome({ onSelect }) {
  return (
    <div className="min-h-screen bg-white">
      <Hero
        title="ROOM BOOKING"
        onReturn={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        <p className="text-center text-sm font-bold text-orange-500">
          ACCOMODATION
        </p>
        {GROUPS.map((g) => (
          <section key={g.key} className="mt-2">
            <h2 className="my-6 text-center text-3xl font-bold text-black">
              {g.title}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {ROOMS.filter((r) => r.group === g.key).map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelect(r)}
                  className="group flex h-60 flex-col justify-end rounded-3xl bg-slate-300 p-4 text-left transition hover:ring-4 hover:ring-orange-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500"
                >
                  <span className="rounded-2xl bg-white/90 px-4 py-2">
                    <span className="block font-semibold text-slate-900">
                      {r.name}
                    </span>
                    <span className="text-sm text-slate-600">
                      ${r.price} / night
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

/* ---------- View 2: Room details ---------- */
const FIELD =
  "w-full rounded-sm border border-black bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="text-lg text-slate-900">
        {label}
        {required && " *"}
      </span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </label>
  );
}

function nightsBetween(a, b) {
  if (!a || !b) return 0;
  const n = Math.round((new Date(b) - new Date(a)) / 86400000);
  return n > 0 ? n : 0;
}

function RoomDetails({ room, onBack }) {
  const [shot, setShot] = useState(0);
  const [form, setForm] = useState({
    first: "",
    last: "",
    title: "",
    phone: "",
    email: "",
    addOn: "",
    checkIn: "",
    checkOut: "",
    early: false,
    late: false,
  });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const nights = nightsBetween(form.checkIn, form.checkOut);
  const addOnCost = ADD_ONS.find((a) => a.id === form.addOn)?.cost ?? 0;
  const total = nights * room.price + (nights ? addOnCost : 0);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.first.trim()) err.first = "Enter your first name.";
    if (!form.last.trim()) err.last = "Enter your surname.";
    if (!form.title) err.title = "Select a title.";
    if (!/^[0-9+\s-]{7,}$/.test(form.phone))
      err.phone = "Enter a valid phone number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Enter a valid email address.";
    if (!form.checkIn) err.checkIn = "Select a check-in date.";
    if (!form.checkOut) err.checkOut = "Select a check-out date.";
    else if (!nights) err.checkOut = "Check-out must be after check-in.";
    setErrors(err);
    if (Object.keys(err).length === 0) setDone(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero title="ROOM DETAILS" onReturn={onBack} tall />
      <main className="mx-auto max-w-6xl px-4 py-4">
        {/* Gallery */}
        <div className="grid grid-cols-3 gap-3 md:grid-cols-[repeat(2,7rem)_1fr]">
          <div className="order-2 col-span-3 grid grid-cols-6 gap-3 md:order-1 md:col-span-2 md:grid-cols-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                aria-label={`Photo ${i + 1}`}
                onClick={() => setShot(i)}
                className={`aspect-square rounded-2xl bg-slate-300 focus:outline-none ${
                  shot === i
                    ? "ring-4 ring-orange-500"
                    : "hover:ring-2 hover:ring-orange-300"
                }`}
              />
            ))}
          </div>
          <div className="order-1 col-span-3 flex h-64 items-end rounded-3xl bg-slate-300 p-4 md:order-2 md:col-span-1 md:h-auto md:min-h-104">
            <span className="rounded-full bg-white/80 px-3 py-1 text-sm text-slate-700">
              Photo {shot + 1} of 6
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-700 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-black">{room.name}</h2>
                <span
                  className={`rounded-full px-5 py-2 text-xs font-semibold ${ORANGE}`}
                >
                  {room.badge}
                </span>
              </div>
              <p className="mt-4 text-3xl text-slate-900">
                $ {room.price} <span className="text-lg">/ night</span>
              </p>
              <hr className="my-4 border-black" />
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-slate-900">
                {room.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-slate-300" /> {f}
                  </li>
                ))}
              </ul>
            </section>

            <section className="px-2">
              <h3 className="text-2xl text-slate-900">Overview</h3>
              <p className="mt-3 text-slate-800">{room.overview}</p>
            </section>

            <section className="rounded-2xl border border-slate-700 p-5">
              <h3 className="text-2xl font-bold text-black">Room Amenities</h3>
              <p className="mt-3 text-slate-800">
                Designed for your comfort and convenience. Explore the full list
                of in-room features, premium essentials, and complimentary
                services included with your stay.
              </p>
              <ul className="mt-5 grid grid-cols-3 gap-y-5 text-slate-900">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-sm bg-slate-400" /> {a}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Booking form */}
          <form
            onSubmit={submit}
            noValidate
            className="rounded-2xl border border-slate-700 p-5"
          >
            {done ? (
              <div className="py-16 text-center">
                <h3 className="text-2xl font-bold text-black">
                  Booking request sent
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-slate-700">
                  Thank you, {form.title} {form.last}. {room.name} is requested
                  for {nights} night
                  {nights > 1 && "s"} ({form.checkIn} to {form.checkOut}).
                  Total: ${total.toFixed(2)}.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Demo only: nothing was saved or sent.
                </p>
                <button
                  type="button"
                  onClick={onBack}
                  className={`mt-6 rounded-full px-8 py-3 font-semibold ${ORANGE}`}
                >
                  Back to rooms
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-2xl text-slate-900">Book Room</h3>
                <Field label="First Name" required error={errors.first}>
                  <input
                    className={FIELD}
                    placeholder="Eg. Jaden"
                    value={form.first}
                    onChange={set("first")}
                  />
                </Field>
                <Field label="Surname" required error={errors.last}>
                  <input
                    className={FIELD}
                    placeholder="Eg. Doe"
                    value={form.last}
                    onChange={set("last")}
                  />
                </Field>
                <Field label="Title" required error={errors.title}>
                  <select
                    className={FIELD}
                    value={form.title}
                    onChange={set("title")}
                  >
                    <option value="">Select Title</option>
                    {["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <input
                    className={FIELD}
                    type="tel"
                    placeholder="Eg. 0781234567"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    className={FIELD}
                    type="email"
                    placeholder="Eg. jaden@example.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </Field>
                <Field label="Add-Ons">
                  <select
                    className={FIELD}
                    value={form.addOn}
                    onChange={set("addOn")}
                  >
                    <option value="">Select additional requirements</option>
                    {ADD_ONS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} (+${a.cost})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Check-in Date" required error={errors.checkIn}>
                  <input
                    className={FIELD}
                    type="date"
                    min={today}
                    value={form.checkIn}
                    onChange={set("checkIn")}
                  />
                </Field>
                <Field label="Check-out Date" required error={errors.checkOut}>
                  <input
                    className={FIELD}
                    type="date"
                    min={form.checkIn || today}
                    value={form.checkOut}
                    onChange={set("checkOut")}
                  />
                </Field>

                <p className="pt-1 text-xs text-slate-800">
                  Notify us if you would require an Early or Late check-in
                </p>
                <div className="flex justify-between text-xs text-slate-800">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.early}
                      onChange={set("early")}
                    />{" "}
                    Early Check-in
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.late}
                      onChange={set("late")}
                    />{" "}
                    Late Check-in
                  </label>
                </div>

                <div className="flex items-baseline justify-between pt-2 text-lg text-slate-900">
                  <span>Total</span>
                  <span className="font-medium">
                    $ {total.toFixed(2)}
                    {nights > 0 && (
                      <span className="ml-2 text-xs text-slate-500">
                        {nights} night{nights > 1 && "s"}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  type="submit"
                  className={`w-full rounded-full py-3 text-sm font-bold ${ORANGE}`}
                >
                  Book Now ➔
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

/* ---------- App: simple state-based view switching ---------- */
export default function TwinLodgesBooking() {
  const [room, setRoom] = useState(null);
  const open = (r) => {
    setRoom(r);
    window.scrollTo({ top: 0 });
  };
  return room ? (
    <RoomDetails key={room.id} room={room} onBack={() => setRoom(null)} />
  ) : (
    <BookingHome onSelect={open} />
  );
}
