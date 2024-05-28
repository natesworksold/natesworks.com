// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Natesworks Blog";
export const SITE_DESCRIPTION =
  "Welcome to Natesworks Blog, where we discuss C++, C#, Python, and the development of SwiftOS Next. Dive into coding topics, language insights, and SwiftOS Next updates..";
export const TWITTER_HANDLE = "@natesworks";
export const MY_NAME = "Natesworks";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
