# DecentNoobBot

[![pipeline status](https://git.bre4k3r.de/dev-bre4k3r/decentnoobbot/badges/master/pipeline.svg)](https://git.bre4k3r.de/dev-bre4k3r/decentnoobbot/commits/master)

Just a simple Discord-Bot written in TypeScript, running on NodeJS.

## System Dependencies

-   NodeJS

## Installation instructions

### Installation on Linux

**Via Terminal:**

```sh
# Node.js v11.x

# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_11.x | bash -
apt-get install -y nodejs

# Node.js v12.x

# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs
```

### Installation on macOS

**Via terminal:**

```sh
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

**Via Homebrew:**

```sh
brew install node
```

### Installation on Windows

**Download Binaries from:**

```http
https://nodejs.org/en/#download
```

## Setup

### Required

-   Create a file named `secret.json` in `src/config` containing the following information:

```json
{
    "bot_token": "YOUR_DISCORD_API_BOT_TOKEN",
    "api_token": "YOUR_DATABASE_API_TOKEN",
    "api": "YOUR_API_URL"
}
```

-   Edit the file `src/config/config.json` so it contains the wanted information.

-   Run the following command in the root-directory of the repository:

```sh
# This will install all needed dependencies
npm install
```

## Commands

#### Building

-   `npm run build`

#### Testing

-   `npm run dev` (starts bot via `ts-node-dev` - like `ts-node`, but it refreshes everytime you change a file)
-   `npm run test` (starts bot via `ts-node`)

#### Running (need to run `npm run build` first)

-   `npm start run`

#### Build & start

-   `npm run prod`
