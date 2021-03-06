import router from "@/router/index";
import { login, getUserInfo, setUserInfo } from "@/api/user";
import { jsonInBlacklist } from "@/api/jwt";
import { ElMessage } from "element-plus";
import { ActionContext } from "vuex";
import { RouteRecordRaw } from "vue-router";
interface userInfo {
  ID: number;
  uuid: string;
  nickName: string;
  headerImg: string;
  authority: [];
  sideMode: string;
  activeColor: string;
  baseColor: string;
}
interface State {
  userInfo: userInfo;
  token: string;
}
export const user = {
  namespaced: true,
  state: {
    userInfo: {
      ID: 0,
      uuid: "",
      nickName: "",
      headerImg: "",
      authority: [],
      sideMode: "dark",
      activeColor: "#4D70FF",
      baseColor: "#fff",
    },
    token: "",
  },
  mutations: {
    setUserInfo(state: State, userInfo: userInfo) {
      // 这里的 `state` 对象是模块的局部状态
      state.userInfo = userInfo;
    },
    setToken(state: State, token: string) {
      // 这里的 `state` 对象是模块的局部状态
      state.token = token;
    },
    NeedInit(state: State) {
      state.userInfo = {
        ID: 0,
        uuid: "",
        nickName: "",
        headerImg: "",
        authority: [],
        sideMode: "dark",
        activeColor: "#4D70FF",
        baseColor: "#fff",
      };
      state.token = "";
      sessionStorage.clear();
      router.push({ name: "Init", replace: true });
    },
    LoginOut(state: State) {
      state.userInfo = {
        ID: 0,
        uuid: "",
        nickName: "",
        headerImg: "",
        authority: [],
        sideMode: "dark",
        activeColor: "#4D70FF",
        baseColor: "#fff",
      };
      state.token = "";
      sessionStorage.clear();
      router.push({ name: "Login", replace: true });
      window.location.reload();
    },
    ResetUserInfo(state: State, userInfo = {}) {
      state.userInfo = { ...state.userInfo, ...userInfo };
    },
    ChangeSideMode: (state: State, val: string) => {
      state.userInfo.sideMode = val;
    },
  },
  actions: {
    async GetUserInfo({ commit }) {
      const res = await getUserInfo();
      if (res.code === 0) {
        commit("setUserInfo", res.data.userInfo);
      }
      return res;
    },
    async LoginIn({ commit, dispatch, rootGetters, getters }, loginInfo) {
      const res = await login(loginInfo);
      if (res.code === 0) {
        commit("setUserInfo", res.data.user);
        commit("setToken", res.data.token);
        await dispatch("router/SetAsyncRouter", {}, { root: true });
        const asyncRouters = rootGetters["router/asyncRouters"];
        asyncRouters.forEach((asyncRouter: RouteRecordRaw) => {
          router.addRoute(asyncRouter);
        });
        // const redirect = router.history.current.query.redirect
        // console.log(redirect)
        // if (redirect) {
        //     router.push({ path: redirect })
        // } else {
        router.push({ name: getters["userInfo"].authority.defaultRouter });
        // }
        return true;
      }
    },
    async LoginOut({ commit }) {
      const res = await jsonInBlacklist();
      if (res.code === 0) {
        commit("LoginOut");
      }
    },
    async changeSideMode({ commit, state }, data: string) {
      const res = await setUserInfo({ sideMode: data, ID: state.userInfo.ID });
      if (res.code === 0) {
        commit("ChangeSideMode", data);
        ElMessage({
          type: "success",
          message: "设置成功",
        });
      }
    },
  },
  getters: {
    userInfo(state: State) {
      return state.userInfo;
    },
    token(state: State) {
      return state.token;
    },
    mode(state: State) {
      return state.userInfo.sideMode;
    },
    sideMode(state: State) {
      if (state.userInfo.sideMode === "dark") {
        return "#191a23";
      } else if (state.userInfo.sideMode === "light") {
        return "#fff";
      } else {
        return state.userInfo.sideMode;
      }
    },
    baseColor(state: State) {
      if (state.userInfo.sideMode === "dark") {
        return "#fff";
      } else if (state.userInfo.sideMode === "light") {
        return "#191a23";
      } else {
        return state.userInfo.baseColor;
      }
    },
    activeColor(state: State) {
      if (
        state.userInfo.sideMode === "dark" ||
        state.userInfo.sideMode === "light"
      ) {
        return "#4D70FF";
      }
      return state.userInfo.activeColor;
    },
  },
};
