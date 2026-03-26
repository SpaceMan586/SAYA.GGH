import { Suspense } from "react";
import ProjectClient from "./ProjectClient";

export default function ProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ProjectClient />
    </Suspense>
  );
}
