# NOCLI - Notion CLI Tool for Sorting Multi-Select

A simple yet powerful command-line interface (CLI) tool for sorting multiple-select property fields in Notion database entries. This utility can be extremely useful for organizing and managing data in your Notion databases.

## Prerequisites

- Node v19.6.0 or higher
- npm v9.4.0 or higher
- Notion API key (also known as an "integration token")

## Installation

1. Clone this repository and navigate to the project directory:

```sh
git clone https://github.com/albznw/notion-cli
cd notion-cli
```

2. Run `npm install` to install dependencies

```sh
npm install
```

3. Create the `.env` file in the root directory of the project by renaming the `example.env` file and entering your details in the file

At this point you can run the project by compiling the TypeScript files and running the `index.js` file:

```sh
tsc
node ./dist/nocli.js
```

However, you can also package it into a single executable file using [pkg](https://www.npmjs.com/package/pkg) and run it from anywhere on your system:

First, install `pkg` globally:

```sh
npm install -g pkg
```

Then, run the following command to build the executable file:

```sh
npm run build
```

If the build is successful, you should see a `nocli` executable file in the root of the projects directory. Move this file somewhere in your system's `PATH` and you can run it from anywhere. For example, on macOS, you can move the file to `/usr/local/bin`:

```sh
mv nocli /usr/local/bin
```

If the build was unsuccessful, you may need to set the `pkg` options manually. Refer to pkg's [documentation](https://github.com/vercel/pkg#readme) for more information.

# Usage

# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

# License

[MIT](./LICENSE)

```

```
