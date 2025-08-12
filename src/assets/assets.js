import { Coins, FunnelPlus, LayoutDashboard, List, Wallet } from 'lucide-react';
import login_bg from './login_bg.jpg';
import logo from './logo.png';
export const assets = {
    login_bg,
    logo
};

export const SIDE_BAR_DATA=[
    {   id:"01",
        title: "Dashboard",
        icon: LayoutDashboard,
        link: "/dashboard"
    },
    {  
        id:"02",
        title: "Category",
        icon: List,
        link: "/category"
    },
    {
        id:"03",
        title: "Income",
        icon: Wallet,
        link: "/income"
    },  
    {
       id:"04",
       title: "Expense",
       icon: Coins,
       link: "/expense"
    },
    {
        id:"05",
        title: "Filters",
        icon: FunnelPlus,
        link: "/filter"
    }
];
