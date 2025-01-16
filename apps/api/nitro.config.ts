import { stripIndent } from "common-tags";

//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  compatibilityDate: '2025-01-11',
  preset: "netlify",
  experimental: {
    openAPI: true,
  },
  compressPublicAssets: true,
  openAPI: {
    production: "prerender",
    meta: {
      title: 'Tally API',
      description: stripIndent`
        Tally helps you collect ideas, count how many times they come up, then
        use this data to make decisions. The Tally API gives you access to
        operate on your tallies and related operational data.

        ## Authentication

        All requests to the Tally API must be authenticated using a Bearer
        token. You can obtain a token by signing up for a free account at
        https://tally.bot.

        ## Credits

        Made with ☕️ by [Chad McElligott](https://chadxz.dev).
      `,
    },
    ui: {
      swagger: false,
      scalar: {
        route: "/",
        theme: "moon",
        favicon: "favicon.ico",
      }
    }
  }
});
