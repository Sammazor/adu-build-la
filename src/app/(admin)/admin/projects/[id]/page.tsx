import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { TypedProject } from "@/lib/data/projects";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } }).catch(() => null);
  if (!project) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>
        <a href={project.fullPath} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          View live
        </a>
      </div>

      <AdminHeader
        title={project.name}
        description={`${project.city} · ${project.projectType} · ${project.completedYear}`}
      />

      <ProjectForm project={project as unknown as TypedProject} />
    </div>
  );
}
