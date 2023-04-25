[![Build/Test Check](https://github.com/cs481-ekh/s23-martians/actions/workflows/ci.yml/badge.svg)](https://github.com/cs481-ekh/s23-martians/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Project Muldoon
A package for sifting meteorological data to look for and analyze vortex encounters

## Contributors
Project Sponsor: Brian Jackson, _Associate Professor of Physics at Boise State University_  
  
Spring 2023 - [Team Martians](https://cs481-ekh.github.io/s23-martians/), _Boise State Computer Science_  
Fall 2022 - [Team Dust Devils](https://cs481-ekh.github.io/f22-dust-devils/), _Boise State Computer Science_  

## Manifest
| Filename           | Description
| :---               | :---
| HtmlPage/          | Fall 2022 project website. (Fall 2022)
| docs/              | GitHub page. (Spring 2023)
| muldoon-webapp/    | Front-end web application for visualizing Mars 2020 MEDA data.
| muldoon/           | MEDA data analysis utility and API.
| nginx/             | Docker/Podman configuration files.
| tests/             | Test suite for analysis util.
| BSUREADME.md       |
| CONTRIBUTORS       | List of contributors.
| LICENSE            | MIT license.
| README.md          | This file.
| build.sh           | Build script for analysis util.
| clean.sh           | Clean script for analysis util.
| dependencies.sh    | Dependencies script for analysis util.
| docker-compose.yml | Docker/Podman yaml file for creating a muldoon-webapp container.
| requirements.txt   | Configuration file for analysis util; setup.py process.
| setup.py           | Python setup script for analysis util.
| test.sh            | Test script for analysis util.

## Development Environment
#### Required
- [Node.js](https://nodejs.org)

#### Recommended
- Code Editor - [Visual Studio Code](https://code.visualstudio.com)
  - Extension - [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
  - Extension - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

#### Container Requirements
- podman - [podman.io](https://podman.io)
- podman-compose

## Building muldoon-webapp
#### Installing node modules
Starting from the base project directory, execute the following commands within a terminal window. (If using Visual Studio Code, <kbd>Ctrl + `</kbd> opens a terminal window.)
```
$> cd muldoon-webapp
$> npm install
```
#### Live compilation of Sass
From the muldoon-webapp directory, execute the following command within a terminal window. (If using Visual Studio Code, <kbd>Ctrl + `</kbd> opens a terminal window.)
```
$> npm run compile:sass
```
#### Container Setup
From the base project directory, execute the following command within a terminal window.
```
$> podman-compose -f ./docker-compose.yml up -d
```
Once the command has successfully completed with _exit code: 0_, the muldoon-webapp should be accissbile at
[http://localhost:8100](http://localhost:8100) on the localhost.


## Testing muldoon-webapp
To run the testing that has been built for the muldoon-webapp you will need to run the following command on the terminal.
```
$> pytest tests/
```

