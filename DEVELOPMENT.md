# How to Develop Lavd

The development of Lavd requires [Node.js][nodejs] (use either the LTS version
or the current version) and Python >= 3.6.

## Yarn

[Yarn][yarn] is used for everything related to Node.js: Installing dependencies,
building, linting, etc. And for convenience, the Python tasks, such as linting,
can also be run through it (defined as `scripts` in `package.json`).

The simplest way to install it, is with npm (shipped with Node.js):

```sh
npm install -g yarn
```

Yarn 2 has been released, which changed the dependency management entirely,
getting rid of `node_modules` and supporting a zero-install mode. Unfortunately,
not everything works with that yet, in particular [Parcel][parcel], the bundler
used to bundle up the frontend, therefore Yarn 1 is still used. If you have Yarn
2 (berry) installed, it will work automatically, as it's using `v1.22.0`, which
is pinned in this repository.

## Installing Dependencies

The Node.js dependencies can be installed with yarn:

```sh
yarn install
```

For Python all dev dependencies are listed in `requirements.txt` and can be
installed with pip.

```sh
pip install --user -r requirements.txt
```

Optionally, you can create a virtual environment first, if you'd like to
separate the dependencies from other projects. Whether you use virtualenv,
pipenv, conda or something else is entirely up to you.

## Frontend

The frontend is written in [TypeScript][typescript] and all sources are in the
`js/` directory.

[React][react] is the frontend library of choice and all React
components are in `*.tsx` files, since they use JSX and TypeScript requires the
specific extension. All components are functional components (no classes), if
you are not familiar with hooks, you can have a look at
[React - Introducing Hooks][react-hooks]. Consider installing the React Devtools
extensions for your browser ([Chrome][react-chrome], [Firefox][react-firefox]),
it provides fantastic information for the mounted components.

### CSS

Styling is done with CSS-in-JS, that means there are no CSS files.
[Emotion][emotion] is used for this purpose, which creates the CSS classes and
injects them into the `<style>` tags, which also automatically adds vendor
prefixes, to make it work in all browsers. Usually, the styles are in
`*.styles.ts` files, which have the same name as the file that uses them, for
example `Header.styles.ts` contains the styles for `Header.tsx`. The object
style is preferred over the tagged template literals. For that, the CSS property
names are converted to camelCase, e.g. `font-size` becomes `fontSize`. CSS
classes (created with `css({...})`) should not be created dynamically, this
includes merging classes with `cx(class1, class2)`, hence every creation should
reside in the `*.styles.ts` files. The structure allows you to
`import * as styles from "./Header.styles"` and then use the classes in
a component with `className={styles.active}`. This also means that you do not
have to worry about any name collision, and for example the `active` class can
be different for `Header` and `Sidebar`, since it's used in a different context
and therefore it will be defined differently.

_Note: In production mode the CSS classes are not editable in devtools due to
using [CSSStyleSheet.insertRule()][css-insert-rule], which bypasses the DOM and
inserts the rules directly into the CSSOM for better performance. You can still
overwrite the styles by adding the same class again in devtools (clicking on the
`+` button while having selected the DOM node with the given class) as
a workaround._

### Building

#### With Fixtures

If you'd like to only work on the frontend without the backend at all, there are
some fixtures that can be used instead of the actual API calls. Unfortunately,
that's not integrated directly, since that shouldn't end up the final bundle,
but you can achieve that by changing `js/api.ts` as follows:

```diff
diff --git a/js/api.ts b/js/api.ts
index f11976c..b5ca988 100644
--- a/js/api.ts
+++ b/js/api.ts
@@ -1,11 +1,9 @@
 import { DataMap } from "./data";
+import { data } from "./fixture";

 export async function fetchData(): Promise<DataMap> {
   try {
-    const response = await fetch("/api/all");
-    const data = await response.json();
-    const dataMap = new Map(Object.entries(data));
-    return dataMap;
+    return data;
   } catch (e) {
     return new Map();
   }
```

Then you can run the Parcel server with:

```sh
yarn start
```

This creates a server on `http://localhost:1234` that will automatically reload
when you change something.

#### With the Backend Running

If the backend is running, you can and have to use actual data. The server will
serve the current version of the frontend, to automatically update the bundle
you can use the watch mode of Parcel, which will place the bundled files into
the servers directory, instead of launching a separate server.

```sh
yarn watch
```

Unfortunately, the automatic reload doesn't work quite well, because the file
size of the bundles change and the browser will complain, so you do have to
reload manually.

#### Production Build

To create the production build run:

```sh
yarn build
```

This will write the bundled files into `py/lavd/static/`, which are used by the
server (watch does the same thing, but for a development build).

## Backend

The backend is the actual Python package located in `py/lavd/`, besides the
server, it also contains a logger to log the desired data to be picked up by the
server.

### Building

> Yarn is used as a task runner to run any scripts for Python, purely for
> convenience.

Building the Python package is required, at least once, to run the server, since
the `version.py` is generated by the build process in order to keep the version
number and git hash up to date. Additionally, the frontend needs to be built
(located in `py/lavd/static/`), if you want to actually use the server.

```sh
yarn build-python
# Or if you want to build to whole package, including the frontend (production)
yarn build-package
```

### Running the Server

To run the server, `py.lavd.server` can be run as a python module
(i.e. `python -m py.lavd.server`, not `python py/lavd/server.py`). The `--debug`
flag can be specified, which automatically reloads the server when any source
file changes. This also exists in the distributed version. For convenience, it
can be run with:

```sh
yarn watch-python path/to/log
```

## Code Quality

Various tools are used to ensure code quality, most of them are intentionally
used with their default values to not impose any personal preference and make it
easy to adapt (if you want to add it to your project, all you need to do, is
install the tool). Most tools have very good defaults anyway.

- [ESLint][eslint]: Linting JavaScript/TypeScript — `yarn lint`, and `yarn fix`
  to automatically fix some problems.
- [Prettier][prettier]: Formatting JavaScript/TypeScript — integrated into
  ESLint, therefore `yarn fix` will automatically format all files.
- [TypeScript][typescript]: Type checking TypeScript — `yarn type-check`
- [ruff][ruff]: Linting Python — `yarn lint-python`
- [Black][black]: Formatting Python — `yarn fmt-check-python`, and
  `yarn fix-python` to automatically fix/format Python files.
- [Mypy][mypy]: Type checking Python — `yarn type-check-python`

Make sure that all checks listed above pass (CI will verify that).

```sh
# Runs all the checks
yarn check-all
```

[black]: https://github.com/psf/black
[css-insert-rule]: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
[emotion]: https://emotion.sh/
[eslint]: https://eslint.org/
[ruff]: https://github.com/astral-sh/ruff
[mypy]: https://github.com/python/mypy
[nodejs]: https://nodejs.org/en/
[parcel]: https://parceljs.org/
[prettier]: https://prettier.io/
[react]: https://reactjs.org/
[react-chrome]: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en
[react-firefox]: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
[react-hooks]: https://reactjs.org/docs/hooks-intro.html
[typescript]: https://www.typescriptlang.org/
[yarn]: https://yarnpkg.com/
