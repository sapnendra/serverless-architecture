import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    pending: { variant: "warning" as const, label: "Pending" },
    approved: { variant: "success" as const, label: "Approved" },
    rejected: { variant: "destructive" as const, label: "Rejected" },
  };

  const config = variants[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
