import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div>
      <AdminHeader
        title="Settings"
        description="Configure site identity, SEO defaults, and business information."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
