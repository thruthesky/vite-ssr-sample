import "./index.css";
import App from "./App.vue";
import routes from "./route";
import viteSSR, { ClientOnly } from "vite-ssr";
import { createHead } from "@vueuse/head";

export default viteSSR(
  App,
  { routes },
  ({ app, router, isClient, url, initialState, initialRoute, request }) => {
    const head = createHead();
    app.use(head);

    app.component(ClientOnly.name, ClientOnly);

    app.provide("initialState", initialState);

    router.beforeEach(async (to: any, from: any, next: any) => {
      if (!!to.meta.state) {
        return next();
      }

      const baseUrl = isClient ? "" : url.origin;

      try {
        // 패치, 원본 소스에는 /api/getProps?... 와 같이 되어져 있는데, 그 URL 이 존재하지 않아서, 로딩이 상당히 느리다.
        // 패치, 실제 DB 로 부터 데이터를 가져와 SEO 로 넣어 줘야 하는 것 같다.
        const res = await fetch(
          `${baseUrl}/api/data.json?path=${encodeURIComponent(to.path)}&name=${
            to.name
          }&client=${isClient}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        to.meta.state = await res.json();
      } catch (error) {
        console.error(error);
        // redirect to error route
      }

      next();
    });

    return { head };
  }
);
