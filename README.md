# DecentNoobBot

[![pipeline status](https://git.bre4k3r.de/dev-bre4k3r/decentnoobbot/badges/master/pipeline.svg)](https://git.bre4k3r.de/dev-bre4k3r/decentnoobbot/commits/master)

Just a simple Discord-Bot written in TypeScript, running on NodeJS.

It uses a modular, event-based component system, which allows the possibility of adding new features and modules later on.

## System Dependencies

-   NodeJS

## Installation instructions

### Installation on Linux

**Via Terminal:**

```sh
# Node.js v13.x

# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_13.x | bash -
apt-get install -y nodejs
```

### Installation on macOS

**Via [Homebrew](https://brew.sh/index_de) (recommended):**

```sh
brew install node
```

**Via terminal:**

```sh
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

### Installation on Windows

**Download Binaries from:**

```http
https://nodejs.org/en/#download
```

## Setup

### Required

-   Create a file named `.env` in the root folder of the project containing the following information:

```env
BOT_TOKEN=<YOUR_BOT_TOKEN>
API_URL=<BASE_URL_OF_API>
AUTH_TOKEN=<TOKEN_FOR_THE_API>
```

-   Run the following command in the root-directory of the repository:

```sh
npm install # install all needed dependencies
```

## Commands

#### Building

-   `npm run build`

#### Running (need to run `npm run build` first)

-   `npm start run`

#### Build & start

-   `npm run build:start`
