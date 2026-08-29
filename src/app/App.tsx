import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Cv from "./pages/Cv";
import Home from "./pages/Home";
import Experiences from "./pages/Experiences";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/cv" element={<Cv />} />
      </Routes>
    </AppLayout>
  );
}
