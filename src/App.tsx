import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { InventoryProvider } from "./contexts/InventoryContext";

function App() {
  return (
    <InventoryProvider>
      <Suspense fallback={<p>Carregando...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </InventoryProvider>
  );
}

export default App;
