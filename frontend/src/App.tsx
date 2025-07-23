import React from "react";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <header>
        <nav>
          <ul style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/users/login">Login</Link>
            </li>
            <li>
              <Link to="/users/register">Registro</Link>
            </li>
          </ul>
        </nav>
      </header>
      <hr />
      <main>
        {/* O Outlet é o placeholder onde as páginas (Login, Register, Dashboard) serão renderizadas */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
