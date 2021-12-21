import { asyncRouterHandle } from "@/utils/asyncRouter";

import { asyncMenu } from "@/api/menu";
import { ActionContext } from "vuex";
const routerList: {
  label: any;
  value: any;
}[] = [];
const keepAliveRouters: string[] = [];

interface State {
  asyncRouters: [];
  routerList: {
    label: any;
    value: any;
  }[];
  keepAliveRouters: string[];
}

const formatRouter = (routes: any[]) => {
  routes &&
    routes.forEach((item) => {
      if (
        (!item.children ||
          item.children.every((ch: { hidden: any }) => ch.hidden)) &&
        item.name !== "404" &&
        !item.hidden
      ) {
        routerList.push({ label: item.meta.title, value: item.name });
      }
      item.meta.hidden = item.hidden;
      if (item.children && item.children.length > 0) {
        formatRouter(item.children);
      }
    });
};

const KeepAliveFilter = (routes: any[]) => {
  routes &&
    routes.forEach((item) => {
      // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
      if (
        (item.children &&
          item.children.some(
            (ch: { meta: { keepAlive: any } }) => ch.meta.keepAlive
          )) ||
        item.meta.keepAlive
      ) {
        item.component().then((val: { default: { name: any } }) => {
          keepAliveRouters.push(val.default.name);
        });
      }
      if (item.children && item.children.length > 0) {
        KeepAliveFilter(item.children);
      }
    });
};

export const router = {
  namespaced: true,
  state: {
    asyncRouters: [],
    routerList: [],
    keepAliveRouters: keepAliveRouters,
  },
  mutations: {
    setRouterList(state: State, routerList: any) {
      state.routerList = routerList;
    },
    // 设置动态路由
    setAsyncRouter(state: State, asyncRouters: any) {
      state.asyncRouters = asyncRouters;
    },
    // 设置需要缓存的路由
    setKeepAliveRouters(state: State, keepAliveRouters: any) {
      state.keepAliveRouters = keepAliveRouters;
    },
  },
  actions: {
    // 从后台获取动态路由
    async SetAsyncRouter({ commit }: ActionContext<State, State>) {
      const baseRouter = [
        {
          path: "/layout",
          name: "layout",
          component: "view/layout/index.vue",
          meta: {
            title: "底层layout",
          },
          children: [],
          redirect: "",
        },
      ];
      const asyncRouterRes = await asyncMenu();
      const asyncRouter = asyncRouterRes.data.menus;
      asyncRouter.push({
        path: "404",
        name: "404",
        hidden: true,
        meta: {
          title: "迷路了*。*",
        },
        component: "view/error/index.vue",
      });
      formatRouter(asyncRouter);
      baseRouter[0].children = asyncRouter;
      baseRouter.push({
        path: "/:catchAll(.*)",
        name: "404",
        meta: {
          title: "",
        },
        component: "",
        redirect: "/layout/404",
        children: [],
      });
      asyncRouterHandle(baseRouter);
      KeepAliveFilter(asyncRouter);
      commit("setAsyncRouter", baseRouter);
      commit("setRouterList", routerList);
      commit("setKeepAliveRouters", keepAliveRouters);
      return true;
    },
  },
  getters: {
    // 获取动态路由
    asyncRouters(state: State) {
      return state.asyncRouters;
    },
    routerList(state: State) {
      return state.routerList;
    },
    keepAliveRouters(state: State) {
      return state.keepAliveRouters;
    },
  },
}
