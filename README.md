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
| muldoon/           |
| tests/             |
| BSUREADME.md       |
| CONTRIBUTORS.md    |
| LICENSE            |
| README.md          | This file.
| build.sh           |
| clean.sh           |
| dependencies.sh    |
| docker-compose.yml | Docker/podman yaml file for creating a muldoon-webapp container.
| requirements.txt   |
| setup.py           |
| test.sh            |

## Development Environment
#### Required
* [Node.js](https://nodejs.org)
#### Recommended
- Code Editor - [Visual Studio Code](https://code.visualstudio.com)
  - Extension - [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
  - Extension - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

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

## Testing
