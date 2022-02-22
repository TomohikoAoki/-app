import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import Top from "../pages/Top.vue";
import ShopManage from "../pages/ShopManage.vue";
import SystemError from "../pages/errors/System.vue";
import HomeMaster from "../pages/HomeMaster.vue";
import HomeLeader from "../pages/HomeLeader.vue";
import HomeUser from "../pages/HomeUser.vue";
import CreateUser from "../pages/CreateUser.vue";
import UserManage from "../pages/UserManager.vue";
import EditUser from "../pages/EditUser.vue";
import NotFound from '../pages/errors/NotFound.vue';

Vue.use(VueRouter);

const routes = [{
        path: "/",
        component: Top,
        meta: {
            isPublic: true,
        },
    },
    {
        path: "/shop-manage",
        component: ShopManage,
    },
    {
        path: "/home/master",
        component: HomeMaster,
    },
    {
        path: "/home/leader",
        component: HomeLeader,
    },
    {
        path: "/home/user",
        component: HomeUser,
    },
    {
        path: "/user-manage",
        component: UserManage,
    },
    {
        path: "/user-manage/create",
        component: CreateUser,
    },
    {
        path: "/user-manage/edit/:id",
        component: EditUser,
    },
    {
        path: "/500",
        component: SystemError,
    },
    {
        path: "/*",
        component: NotFound,
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});



export default router;