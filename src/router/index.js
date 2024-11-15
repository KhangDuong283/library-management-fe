import { createWebHistory, createRouter } from "vue-router";

import LoginUser from "@/components/LoginUser.vue";
import LoginAdmin from "@/components/LoginAdmin.vue";
import Register from "@/components/Register.vue";
import AuthPage from "@/views/AuthPage.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import HomePage from "@/views/HomePage.vue";
import DocgiaManagement from "@/views/DocgiaManagement.vue";
import SachManagement from "@/views/SachManagement.vue";
import MuonManagement from "@/views/MuonManagement.vue";
import MuonHistory from "@/views/MuonHistory.vue";

const routes = [
    {
        path: "/auth",
        name: "auth",
        component: AuthPage,
        children: [
            {
                path: "login-user",
                name: "login-user",
                component: LoginUser,
            },
            {
                path: "login-admin",
                name: "login-admin",
                component: LoginAdmin,
            },
            {
                path: "register",
                name: "register",
                component: Register,
            },
            {
                path: "forgot-password",
                name: "forgot-password",
                component: ForgotPassword,
            }
        ]
    },
    {
        path: "/",
        name: "home",
        component: HomePage,
        children: [
            {
                path: "muon-management",
                name: "muon-management",
                component: MuonManagement,
            },
            {
                path: "sach-management",
                name: "sach-management",
                component: SachManagement,
            },
            {
                path: "docgia-management",
                name: "docgia-management",
                component: DocgiaManagement,
            },
            {
                path: "muon-history",
                name: "muon-history",
                component: MuonHistory,

            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
