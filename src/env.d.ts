/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface ImportMetaEnv {
  VITE_CLI_PORT: number;
  VITE_SERVER_PORT: number;
  VITE_BASE_API: string;
  VITE_BASE_PATH:string
}
