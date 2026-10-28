import { useEffect, useState } from "react";
import "./App.css";
import TwinLodgesBooking from "./components/TwinLodgeBooking.jsx";
import AdminDashboard from "./components/Admindashboard.jsx";

type Mode = "guest" | "admin";

const readMode = (): Mode =>
  window.location.hash.startsWith("#/admin") ? "admin" : "guest";

function App() {
  const [mode, setMode] = useState<Mode>(readMode);

  useEffect(() => {
    const onHashChange = () => setMode(readMode());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const switchTo = (next: Mode) => {
    window.location.hash = next === "admin" ? "#/admin" : "#/";
  };

  return (
    <>
      {mode === "admin" ? <AdminDashboard /> : <TwinLodgesBooking />}

      {/* Demo-only switcher: remove once you wire up real navigation */}
      <button
        onClick={() => switchTo(mode === "admin" ? "guest" : "admin")}
        className="fixed bottom-4 left-4 z-60 rounded-full bg-black px-4 py-2 text-xs font-bold text-white shadow-lg ring-2 ring-orange-500 hover:bg-orange-500"
      >
        {mode === "admin" ? "View guest site" : "View admin dashboard"}
      </button>
    </>
  );
}

export default App;
