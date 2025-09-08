import ClientGuard from "@/components/client-guard";

export default function ClienteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ClientGuard>{children}</ClientGuard>;
}
