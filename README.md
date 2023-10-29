<span style="background-color: black; color: white; display: block; padding: 50px 50px 40px 50px">
  <span style="font-size: 60px; display: block;">
  eͤcͨhͪoͦ
  </span>
  <span style="font-size: 16px; font-style: italic;">
  A framework that echoes your events to multiple destinations and projections.
  </span>
</span>

---

!!! tip Viewing this README.md
    Recommend using vscode extension ==Markdown Preview Enhanced== to view this README.md

---

# Table Of Contents
- [Table Of Contents](#table-of-contents)
- [Overview](#overview)
  - [Intro](#intro)
  - [Framework](#framework)
  - [Domain APIs](#domain-apis)
  - [Stream Projectors](#stream-projectors)
  - [Query APIs](#query-apis)
- [Roadmap](#roadmap)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone Repo](#clone-repo)
  - [Open in VsCode](#open-in-vscode)
  - [Setup](#setup)
  - [Run](#run)
      - [Run Locally](#run-locally)
      - [Debug Locally](#debug-locally)
      - [Run In container](#run-in-container)
      - [Attach Debugger to a running Container](#attach-debugger-to-a-running-container)
      - [Container Links](#container-links)
  - [Calling "Poster" Domain API](#calling-poster-domain-api)
- [Solution Structure](#solution-structure)
- [Domain API](#domain-api)
  - [Glossary of Terms](#glossary-of-terms)
    - [Domain](#domain)
    - [Domain API](#domain-api-1)
    - [Aggregate](#aggregate)
    - [Domain Event](#domain-event)
    - [Command](#command)
        - [Create Command](#create-command)
        - [Update Command](#update-command)
        - [Upsert Command](#upsert-command)
    - [Command Validation](#command-validation)
    - [Command Rules](#command-rules)
        - [Command Auth Rule](#command-auth-rule)
        - [Command Rule](#command-rule)
        - [Aggregate Auth Rule](#aggregate-auth-rule)
        - [Aggregate Rule](#aggregate-rule)
        - [Index Rule](#index-rule)
    - [Command Handler](#command-handler)
  - [Concepts](#concepts)
    - [Command handling pipeline](#command-handling-pipeline)
    - [Evolvers](#evolvers)
    - [Basic Build Process](#basic-build-process)
  - [Project Structure](#project-structure)
- [Domain API Development](#domain-api-development)
  - [Creating/Updating Domain API](#creatingupdating-domain-api)
      - [Add Domain API](#add-domain-api)
      - [Add Aggregate to Domain](#add-aggregate-to-domain)
      - [Add Create Command to Aggregate](#add-create-command-to-aggregate)
      - [Add Update Command to Aggregate](#add-update-command-to-aggregate)
      - [Add Upsert Command to Aggregate](#add-upsert-command-to-aggregate)
      - [Add Event to Command](#add-event-to-command)
      - [Add Command Auth Rule to Command](#add-command-auth-rule-to-command)
      - [Add Command Rule to Command](#add-command-rule-to-command)
      - [Add Aggregate Auth Rule to Command](#add-aggregate-auth-rule-to-command)
      - [Add Aggregate Rule to Command](#add-aggregate-rule-to-command)
      - [Add Index Rule to Command](#add-index-rule-to-command)


---

# Overview
🆆🅾🆁🅺 🅸🅽 🅿🆁🅾🅶🆁🅴🆂🆂

## Intro
This is a POC framework to explore a simple event-sourcing framework, it aims to provide:
  - a CLI tool to create and manage APIs
  - an Event-Sourcing Domain API framework that supports an Aggregates, Commands, Events, Validation, Rules, etc
  - an Event Stream Projectors API framework that supports projecting events into a relation DB
  - a Query API backed by projected data
  - the ability Log in, and to secure Commands/Queries with JWT's

![Alt text](docs/overview.drawio.svg)


## Framework

Major technologies used and their purpose in the Framework:

| Tech           | Purpose                                                                                     |
|:---------------|:--------------------------------------------------------------------------------------------|
| Typescript     | Type safety is important :)                                                                 |
| Rushjs         | Allows management of the solution as a mono-repo                                            |
| pnpm           | Provides improvements (such as speed) over standard npm                                     |
| Commanderjs    | Used to create a Framework-wide CLI tool, where much of the code-generation is implemented  |
| Express        | Used to run Domain APIs                                                                     |
| EventstoreDB   | Used as the database for events raised by Domain APIs                                       |
| ELK stack      | API's log ElasticSearch via Logstash. Logs can be easily searched through in Kibana         |
| Docker Compose | Used to run the "service stack" (EventstoreDb, ELK)                                         |
| Docker         | Used to package each API for deployment                                                     |

!!! tip More detail found here: [Solution Structure](#solution-structure)


## Domain APIs

!!! abstract Disclaimers
    This framework POC is mixing various concepts from Event Sourcing, DDD and CQRS, and the patterns are heavily inspired by other people's work and thinking.

The framework is attempting to follow many of the core principles of Event Sourcing, DDD and CQRS while using more functional language techniques, and an extensive use of code generation, supported by opinionated folder and file naming conventions.

Instead of using Classes and Methods to model Aggregates and Commands, the framework decomposes this into a folder structure along the lines of:
```
📂<aggregate>                            // contains Aggregate & one or more Commands
 ├─📄<aggregate>.ts                      // Aggregate Shape      
 ├─📂<command>                           // One of the Commands to update the Aggregate 
 ┊  ├─📂commandRules
 ┊  ├─📂indexRules
 ┊  ├─📂aggregateRules
 ┊  ├─📄<command>.handle.ts               // Command handler
 ┊  ├─📄<command>.command.ts              // Command shape
 ┊  ├─📄<command>.validate.ts             // Command validator
 ┊  ├─📄<eventA>_V1.event.ts              // Event shape & builder
 ┊  └─📄<eventA>_V1.evolve.ts             // Evolve aggregate with this event
 ├─📂<command>     
 ├─📂<command>     
 └─📂...   
```
Code generation is used to parse these folder structures and produce a file that can be used to interact with the domain programmatically. Commands are processed in a consistent way applying: validation, rules, aggregate loading and command handling. 

Further code generation produces another file that allows interaction with the Domain through an API, by wrapping Domain Commands as Put/Post methods on an Express server. Hence this Framework naming these Domains as "Domain APIs".

The goal of this pattern is to enable a Development process keenly focused on only needing to write Business Logic in a simple standardised pattern, while code generation abstracts away Framework and API logic.  

!!! tip More detail found here: [Domain API](#domain-api)

## Stream Projectors

!!! bug Will be implemented in future

## Query APIs

!!! bug Will be implemented in future

---
---

# Roadmap

<pre style="line-height: 1.1;">
████████████████████████████████████████████████████████████
█▄─█▀▀▀█─▄█─▄▄─█▄─▄▄▀█▄─█─▄███▄─▄█▄─▀█▄─▄███████████████████
██─█─█─█─██─██─██─▄─▄██─▄▀█████─███─█▄▀─████████████████████
██▄▄▄█▄▄▄██▄▄▄▄█▄▄█▄▄█▄▄█▄▄███▄▄▄█▄▄▄██▄▄███████████████████
████████████████████████████████████████████████████████████
█▄─▄▄─█▄─▄▄▀█─▄▄─█─▄▄▄▄█▄─▄▄▀█▄─▄▄─█─▄▄▄▄█─▄▄▄▄█████████████
██─▄▄▄██─▄─▄█─██─█─██▄─██─▄─▄██─▄█▀█▄▄▄▄─█▄▄▄▄─█████████████
▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▀▀▄▄▀▀▄▄▀▀
</pre>

**Initial Scope**
  - [X] Improve debug experience in container 
  - [ ] cleanup (TODO's sprinkled in code)

  - [ ] domain operation metrics
  - [ ] ZOD integration
  - [ ] Improve Logger
  - [ ] refactor builder to have a single "source of truth" for:
    - [ ] folder structures
    - [ ] folder & file names

**Future Scope (major features)**
- [ ] Event Projector APIs
- [ ] Query APIs
- [ ] Event schema migration and synchronization

---
---

# Getting Started
## Prerequisites

!!! Warning OS support
    Only tested on Linux/WSL




<table>
  <tr style="background-color: #eee; font-weight: bold">
    <td></td>
    <td>Linux/WSL</td>
    <td>Windows</td>
    <td>MacOS</td>
  </tr>
  <tr>
    <td style="background-color: #eee; font-weight: bold">WSL</td>
    <td>n/a</td>
    <td><a href="https://learn.microsoft.com/en-us/windows/wsl/install">WSL</a></td>
    <td>n/a</td>
  </tr>
  <tr>
    <td style="background-color: #eee; font-weight: bold">Docker</td>
    <td><a href="https://docs.docker.com/engine/install">Docker Engine</a></td>
    <td><a href="https://docs.docker.com/desktop/install/windows-install">Docker Desktop</a></td>
    <td>TBD</td>
  </tr>
  <tr>
    <td style="background-color: #eee; font-weight: bold">node</td>
    <td colspan=3>
        <div>install node 20.5.0 (or higher) globally</div>
        <i>(recommend using <a href="https://github.com/nvm-sh/nvm">NVM</a> to install node)</i>
    </td>
  </tr>
  <tr>
    <td style="background-color: #eee; font-weight: bold">pnpm</td>
    <td colspan=3>
        <div>Install <a href="https://pnpm.io/installation">pnpm</a> globally</div>
        <i>or simply: <code>npm i -g pnpm</code></i>
    </td>
  </tr>
  <tr rowspan=2>
    <td style="background-color: #eee; font-weight: bold">rushjs</td>
    <td colspan=3>
        <div>Install <a href="https://rushjs.io/pages/intro/get_started">rushjs</a> globally</div>
        <i>or simply: <code>npm install -g @microsoft/rush</code></i>
    </td>
  </tr>
</table>

## Clone Repo
!!! bug todo
- `git clone git@github.com:Warpeeg/echo.git`
- `cd event-sourcing`

## Open in VsCode
- `vscode .`

!!! tip Use VSCode workspaces
    For an optimised view of the solution, highly recommend opening as a workspace:
     `File` > `Open workspace from File` > select `.code-workspace`

## Setup
- `rush install`

## Run

#### Run Locally
- `rush start-service-stack` (if not already running)
- `rush build`
- `cd api\domain-api-poster`
- `pnpm dev:start`
- _...when finished..._
- `rush stop-service-stack`

!!! tip if making code changes to `domain-api-poster`, no need to rebuild the entire solution, you can run `pnpm build` in `api\domain-api-poster`

#### Debug Locally
- `rush start-service-stack` (if not already running)
- `rush build`
- from VsCode "Run and Debug" tab, launch `local:launch (⭕api-domain-poster)`
- _...when finished..._
- `rush stop-service-stack`

!!! bug improve debugging experience
    🚩 ability debug project dependencies (e.g. lib-domain-api)

#### Run In container
- `rush start-service-stack` (if not already running)
- `rush package`
- `rush start-api-stack`
- _...when finished..._
- `rush stop-api-stack`
- `rush stop-service-stack`

#### Attach Debugger to a running Container
- from VsCode's "Run and Debug" tab, launch `docker:attach (⭕api-domain-poster)`

#### Container Links
| service           | link                     | description
| ---               | ---                      | ---
| domain-api-poster | http://localhost:4002    | "poster" domain api 
| eventstoreDB      | http://localhost:2113    | eventstoreDB
| logview           | http://localhost:5601    | kibana to view logs

## Calling "Poster" Domain API

!!! tip Use any API client that you like, this document assumes VSCode's "Rest Client"

!!! note JWTs
    Take note of commands that require JWT's
    In future there will be a login API, until then, the example `.http` files have pre-made JWT's.
    If wanting to use a different API Client, the required JWT structure is:
    ```
    {
      "sub": "Some GUID",
      "firstName": "Joe",
      "lastName": "Soap",
      "iat": 1516239022
    }
    ```

- Install VSCode extension "REST Client"
- Open `event-sourcing/api/domain-api-poster/__http__/userProfile.http`
- Run "Create a User Profile"
- Run "Change Name"
- Open `event-sourcing/api/domain-api-poster/__http__/post.http`
- Run "Create Post"
- Run "Publish Post"

!!! bug expand on this

!!! tip open EventstoreDB to view events http://localhost:2113/web/index.html#/streams

---
---


# Solution Structure
```
├─📂api
┊  ├─📂domain-api-poster          // example/POC Domain API
┊  └─📂<new domains>              // 🎯 new Domain APIs go here! (see Project Structure below)
├─📂builder                       // cli tool to add & update Domain API's
├─📂common                        // rushjs related files
┊  ├─..
┊  └─📂config
┊     └──📂rush
┊         ├─📄deploy.json         // builder updates with new Domain API's
┊         ├─📄command-line.json   // rush start-service-stack (etc) configured here 
┊         └─...
┊   
├─📂docs                          // supporting files for README.md
├─📂lib
┊  ├─📂lib-common                 // Common library for all projects
┊  ├─📂lib-domain-api             // Common library for Domain API's
┊  └─📂lib-domain-api-test        // Common library for Domain API test components
├─📂stack
┊  ├─📂api
┊  ┊  ├─🐳docker-compose.yml      // contains all Domain API's (updated by builder)
┊  ┊  ├─📄start.sh                // referenced by rush command-line.json
┊  ┊  └─📄stop.sh                 // referenced by rush command-line.json
┊  └─📂service
┊     ├─📂eventstore              // docker-compose managing EventstoreDB
┊     ├─📂logging                 // docker-compose managing ELK stack
┊     ├─📄start.sh                // referenced by rush command-line.json
┊     ├─📄stop.sh                 // referenced by rush command-line.json
┊     └─...
├─📄.code-workspace               // builder updates with new Domain API's
├─ ...
├─📄README.md                     // 📍you are here!
└─📄rush.json                     // builder updates with new Domain API's
```


---
---

# Domain API
## Glossary of Terms

### Domain
The subject area being modelled.

### Domain API
The solution-space representation of the Domain, expressed as an API.
_Usage: [Add Domain Api](#add-domain-api)_

### Aggregate
Represents a group of domain entities that should change together.
In event-sourcing an Aggregate is built up from a stream of Events.
_Usage: [Add Aggregate to Domain](#add-aggregate-to-domain)_

### Domain Event
Represents a record of changes to an Aggregate.
_Usage: [Add Event to Command](#add-event-to-command)_

### Command
Represents the intent to change a **single** Aggregate.

##### Create Command
A specific type of Command that results in the **creation** of an Aggregate.
_Usage: [Add Create Command to Aggregate](#add-create-command-to-aggregate)_

##### Update Command
A specific type of Command that results in the **change** of an Aggregate.

_Usage: [Add Update Command to Aggregate](#add-update-command-to-aggregate)_

##### Upsert Command
A specific type of Command that results in the **creation or change** of an Aggregate.
An Aggregate will be created if it does not exist.
If an Aggregate exists, it will be updated.

_Usage: [Add Upsert Command to Aggregate](#add-upsert-command-to-aggregate)_

!!! info 
    Where possible, prefer the use of Create or Update as they are both more efficient and safer, as the framework can do checking to ensure Aggregate existence for you.

### Command Validation
Logic to validate that the Command is syntactically valid.

### Command Rules
Business (semantic) Rules to ensure that the result of the Command will not put the Aggregate into an invalid state.

##### Command Auth Rule
A Rule with logic that only requires access to the Command body and Caller's credentials.
Called before standard Command Rules to ensure caller has required credentials before continuing.
_Usage: [Add Command Auth Rule to Command](#add-command-auth-rule-to-command)_

##### Command Rule
A Rule with logic that only requires access to the Command body itself. 
_Usage: [Add Command Rule to Command](#add-command-rule-to-command)_

##### Aggregate Auth Rule
A Rule with logic that only requires access to the Command body, Caller Credentials and Aggregate. 
Called before standard Aggregate Rules to ensure caller has required credentials before continuing.
_Usage: [Add Aggregate Auth Rule to Command](#add-aggregate-auth-rule-to-command)_

##### Aggregate Rule
A Rule with logic that only requires access to the Command body and Aggregate. 
_Usage: [Add Aggregate Rule to Command](#add-aggregate-rule-to-command)_

##### Index Rule
A Rule with logic that only requires access to the Command body and has the ability to query for the existence of other Aggregates by ID. 
_Usage: [Add Index Rule to Command](#add-index-rule-to-command)_

### Command Handler
Logic to update the Aggregate by raising an event.
The Command Handler will only be called if all Command Validation and available Command Rules succeeded.

---

## Concepts
### Command handling pipeline
!!! bug Expand on this

![Alt text](docs/command-processing.drawio.svg)

### Evolvers
!!! bug Expand on this

![Alt text](docs/evolvers.drawio.svg)

### Basic Build Process
!!! bug Expand on this

---

## Project Structure
```
├─...
├─🐳dockerfile                                    // used to build docker image of Domain API
├─📄package.json                                  // rush allows standardized scripts to run globally (e.g. rush build) 
├─📄tsconfig.build.json                           // tsconfig used for build
├─📄tsconfig.json                                 // tsconfig used for tests
├─📂.vscode                                       // vscode files to allow debugging etc
├─📂.deploy                                       // created on running `rush package`
├─📂.build                                        // created on running `rush build` or `pnpm build`
└─📂src
   ├─📄index.ts                                   // root file
   ├─📂_generated                                 // generated API & Domain files go here
   └─📂domain                                     // contains folders representing aggregates
      ├─📂...  
      ├─📂...  
      └─📂<aggregate>                             // contains Aggregate & Commands
         ├─📄<aggregate>.ts                       // Aggregate Shape
         ├─📂... 
         ├─📂...          
         └─📂<command>                            // A Command for Aggregate
            ├─📂commandAuthRules                  // Contains Command Auth Rules
            ┊  ├─📄<name>.commandAuthRule.ts
            ┊  └─...
            ├─📂commandRules                      // Contains Command Rules
            ┊  ├─📄<name>.commandRule.ts
            ┊  └─...
            ├─📂aggregateAuthRules                // Contains Aggregate Auth Rules
            ┊  ├─📄<name>.aggregateAuthRule.ts
            ┊  └─...
            ├─📂aggregateRules                    // Contains Aggregate Rules
            ┊  ├─📄<name>.aggregateRule.ts
            ┊  └─...
            ├─📂indexRules                        // Contains Index Rules
            ┊  ├─📄<name>.indexRule.ts
            ┊  └─...
            ├─📄<command>.handle.ts               // Command handler
            ├─📄<command>.command.ts              // Command shape
            ├─📄<command>.validate.ts             // Command validator
            ├─📄<eventA>_V1.event.ts              // Event shape & builder
            ├─📄<eventA>_V1.evolve.ts             // Evolve aggregate with this event
            ├─📄<eventA>_V2.event.ts              // V2 of this event
            ├─📄<eventA>_V2.evolve.ts
            ├─📄<eventB>_V2.event.ts              // Ability to raise more than one event is supported
            └─📄<eventB>_V2.evolve.ts
```

---

# Domain API Development

## Creating/Updating Domain API

#### Add Domain API
| **command**  | `builder api create my-api 4010` |
|:-------------|:---------------------------------|
| **run from** | **solution** root                |

#### Add Aggregate to Domain
| **command**      | `builder api domain add-aggregate User` |                 |
|:-----------------|:----------------------------------------|:----------------|
| **run from**     | project root                            |                 |
| **add code to:** | src/domain/user/User.ts               | aggregate shape |

#### Add Create Command to Aggregate
|**command**      | `builder api domain add-create-command User CreateUser` |                                   |
|:----------------|:--------------------------------------------------------|:----------------------------------|
|**run from**     | project root                                            |                                   |
|**add code to:** | _src/domain/user/createUser/CreateUser.command.ts_      | command shape                     |
|                 | _src/domain/user/createUser/CreateUser.validate.ts_     | command vaildation                |
|                 | _src/domain/user/createUser/CreateUser.handle.ts_       | handling command & raising events |

#### Add Update Command to Aggregate
|**command**      | `builder api domain add-update-command User ChangeUserName`       |                                   |
|:----------------|:------------------------------------------------------------------|:----------------------------------|
|**run from**     | project root                                                      |                                   |
|**add code to:** | _src/domain/user/changeUsername/ChangeUsername.update.command.ts_ | command shape                     |
|                 | _src/domain/user/changeUsername/ChangeUsername.validate.ts_       | command vaildation                |
|                 | _src/domain/user/changeUsername/ChangeUsername.handle.ts_         | handling command & raising events |

#### Add Upsert Command to Aggregate
|**command**      | `builder api domain add-upsert-command User ChangeUserName`       |                                   |
|:----------------|:------------------------------------------------------------------|:----------------------------------|
|**run from**     | project root                                                      |                                   |
|**add code to:** | _src/domain/user/changeUsername/ChangeUsername.upsert.command.ts_ | command shape                     |
|                 | _src/domain/user/changeUsername/ChangeUsername.validate.ts_       | command vaildation                |
|                 | _src/domain/user/changeUsername/ChangeUsername.handle.ts_         | handling command & raising events |

#### Add Event to Command
|**command**      | `builder api domain add-event User CreateUser UserCreated` |                                     |
|:-----------------|:-----------------------------------------------------------|:------------------------------------|
|**run from**     | project root                                               |                                     |
|**add code to:** | _src/domain/user/changeUsername/UserCreated_V1.event.ts_   | event shape                         |
|                 | _src/domain/user/changeUsername/UserCreated_V1.evolve.ts_  | evolve aggregate with event         |
|                 | _src/domain/user/changeUsername/UserCreated_V1.build.ts_   | build event **(do not change)**     |
|                 | _src/domain/user/changeUsername/UserCreated_V1.is.ts_      | event typeguard **(do not change)** |


#### Add Command Auth Rule to Command
| **command**      | `builder api domain add-command-auth-rule User CreateUser MustHaveRightsToChangeUser`       |                         |
|:-----------------|:--------------------------------------------------------------------------------------------|:------------------------|
| **run from**     | project root                                                                                |                         |
| **add code to:** | _src/domain/user/createUser/commandAuthRules/mustHaveRightsToChangeUser.commandAuthRule.ts_ | command auth rule logic |


#### Add Command Rule to Command
| **command**      | `builder api domain add-command-rule User ChangeUserName BusinessUserMustHavePassport`    |                    |
|:-----------------|:------------------------------------------------------------------------------------------|:-------------------|
| **run from**     | project root                                                                              |                    |
| **add code to:** | _src/domain/user/changeUserName/commandRules/businessUserMustHavePassport.commandRule.ts_ | command rule logic |


#### Add Aggregate Auth Rule to Command
| **command**       | `builder api domain add-aggregate-auth-rule Post PublishPost userMustOwnOfPost`         |                           |
|:------------------|:----------------------------------------------------------------------------------------|:--------------------------|
| **run from**      | project root                                                                            |                           |
| **applicable to** | Update & Upsert Commands **only**                                                       |                           |
| **add code to:**  | _src/domain/post/publishPost/aggregateAuthRules/userMustOwnOfPost.aggregateAuthRule.ts_ | aggregate auth rule logic |


#### Add Aggregate Rule to Command
| **command**       | `builder api domain add-aggregate-rule User ChangeUserName NewNameMustBeDifferent`      |                      |
|:------------------|:----------------------------------------------------------------------------------------|:---------------------|
| **run from**      | project root                                                                            |                      |
| **applicable to** | Update & Upsert Commands **only**                                                       |                      |
| **add code to:**  | _src/domain/user/changeUserName/aggregateRules/newNameMustBeDifferent.aggregateRule.ts_ | aggregate rule logic |


#### Add Index Rule to Command
| **command**      | `builder api domain add-index-rule User CreateUser MustHaveUniqueUserId`  |                  |
|:-----------------|:--------------------------------------------------------------------------|:-----------------|
| **run from**     | project root                                                              |                  |
| **add code to:** | _src/domain/user/createUser/indexRules/mustHaveUniqueUserId.indexRule.ts_ | index rule logic |


---
---