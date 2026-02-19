import { Home, Wallet, Gamepad2, User, Settings, HelpCircle, History } from "lucide-react";

export const navItems = [
    {
        name: "Início",
        href: "/dashboard",
        icon: Home,
    },
    {
        name: "Jogar",
        href: "/dashboard/play",
        icon: Gamepad2,
    },
    {
        name: "Carteira",
        href: "/dashboard/wallet",
        icon: Wallet,
    },
    {
        name: "Histórico",
        href: "/dashboard/history",
        icon: History,
    },
    {
        name: "Suporte",
        href: "/dashboard/support",
        icon: HelpCircle,
    },
];
