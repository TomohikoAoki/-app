import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import Top from "../pages/Top.vue";
import ShopManage from "../pages/ShopManage.vue";
import SystemError from "../pages/errors/System.vue";
import HomeMaster from "../pages/HomeMaster.vue";
import HomeUser from "../pages/HomeUser.vue";
import CreateUser from "../pages/CreateUser.vue";
import UserManage from "../pages/UserManager.vue";
import EditUser from "../pages/EditUser.vue";
import NotFound from "../pages/errors/NotFound.vue";
import TaskManage from "../pages/TaskManager.vue";
import PointManage from "../pages/PointManager.vue";
import CategoryManage from "../pages/ManageCategories.vue"

Vue.use(VueRouter);

const routes = [{
        path: "/",
        component: Top,
        meta: {
            isPublic: true,
        },
    },
    {
        path: "/home/master",
        component: HomeMaster,
    },
    {
        path: "/home/user",
        component: HomeUser,
    },
    {
        path: "/shop-manage",
        component: ShopManage,
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
        path: "/category-manage",
        component: CategoryManage,
    },
    {
        path: "/task-manage",
        component: TaskManage,
        //props: route => {
        //  const page = route.query.page;
        //  return { page: /^[1-9][0-9]*$/.test(page) ? page * 1 : 1 };
        //  },
    },
    {
        path: "/point-manage",
        component: PointManage,
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
