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

---

# Table Of Contents
- [Table Of Contents](#table-of-contents)
- [Overview](#overview)
- [Roadmap](#roadmap)
- [Concepts](#concepts)
- [Basic Usage](#basic-usage)
    - [Setup Solution](#setup-solution)
    - [Running Solution (in containers)](#running-solution-in-containers)
    - [Container Links](#container-links)
- [Development Usage](#development-usage)
  - [Creating/Updating Domain API](#creatingupdating-domain-api)
      - [Add API Domain](#add-api-domain)
      - [Add Aggregate to Domain](#add-aggregate-to-domain)
      - [Add Create Command to Aggregate](#add-create-command-to-aggregate)
      - [Add Update Command to Aggregate](#add-update-command-to-aggregate)
      - [Add Event to Command](#add-event-to-command)
      - [Add Index Rule to Command](#add-index-rule-to-command)
      - [Add Command Rule to Command](#add-command-rule-to-command)
      - [Add Aggregate Rule to Command](#add-aggregate-rule-to-command)
  - [Debugging Domain API](#debugging-domain-api)
      - [Debugging outside of container](#debugging-outside-of-container)
      - [Debugging inside of container](#debugging-inside-of-container)

---

# Overview
> // TODO

---

# Roadmap

- [ ] cleanup (TODO's sprinkled in code)
- [ ] domain queries
- [ ] domain operation metrics
- [ ] ZOD integration
- [ ] Improve Logger
- [ ] Improve debug experience in container 
- [ ] `🆆🅾🆁🅺 🅸🅽 🅿🆁🅾🅶🆁🅴🆂🆂...`

---
# Concepts
> // TODO


---

# Basic Usage
### Setup Solution
- install docker/docker-desktop
- install node 20.5.0 _**(recommend using nvm)**_
- install rush globally
- install pnpm globally
- `rush install`
- `rush build`
> // TODO: add detailed steps
### Running Solution (in containers)
- `rush build`
- `rush package`
- `rush start-service-stack` (if not already running)
- `rush start-api-stack`
- _once finished running_
- `rush stop-service-stack`
- `rush stop-api-stack`

### Container Links
| service       | link                     | description
| ---           | ---                      | ---
| logstash      | http://localhost:5000    | logstash
| logsearch     | http://localhost:9200    | elasticsearch
| logview       | http://localhost:5601    | kibana
| domain-api    | http://localhost:4001    | domain api

---

# Development Usage

## Creating/Updating Domain API

#### Add API Domain
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

#### Add Event to Command
|**command**      | `builder api domain add-event User CreateUser UserCreated` |                                     |
|:-----------------|:-----------------------------------------------------------|:------------------------------------|
|**run from**     | project root                                               |                                     |
|**add code to:** | _src/domain/user/changeUsername/UserCreated_V1.event.ts_   | event shape                         |
|                 | _src/domain/user/changeUsername/UserCreated_V1.evolve.ts_  | evolve aggregate with event         |
|                 | _src/domain/user/changeUsername/UserCreated_V1.build.ts_   | build event **(do not change)**     |
|                 | _src/domain/user/changeUsername/UserCreated_V1.is.ts_      | event typeguard **(do not change)** |

#### Add Index Rule to Command
|**command**      | `builder api domain add-index-rule User CreateUser MustHaveUniqueUserId`  |                  |
|:-----------------|:--------------------------------------------------------------------------|:-----------------|
|**run from**     | project root                                                              |                  |
|**add code to:** | _src/domain/user/createUser/indexRules/mustHaveUniqueUserId.indexRule.ts_ | index rule logic |

#### Add Command Rule to Command
|**command**      | `builder api domain add-command-rule User CreateUser BusinessUserMustHavePassport`  |                    |
|:-----------------|:------------------------------------------------------------------------------------|:-------------------|
|**run from**     | project root                                                                        |                    |
|**add code to:** | _src/domain/user/createUser/indexRules/businessUserMustHavePassport.commandRule.ts_ | command rule logic |

#### Add Aggregate Rule to Command
|**command**       | `builder api domain add-aggregate-rule User ChangeUserName NewNameMustBeDifferent` |                      |
|:------------------|:-----------------------------------------------------------------------------------|:---------------------|
|**run from**      | project root                                                                       |                      |
|**applicable to** | Update Commands **only**                                                           |                      |
|**add code to:**  | _src/domain/user/createUser/indexRules/newNameMustBeDifferent.aggregateRule.ts_    | aggregate rule logic |

## Debugging Domain API

#### Debugging outside of container
- `rush build` (if dependant projects are not up to date)
- `rush start-service-stack` (if not already running)
- `pnpm build`
- `pnpm start`
- _once finished running_
- `rush stop-service-stack`
#### Debugging inside of container
> // TODO: improve experience
- `rush build` (if dependant projects are not up to date)
- `rush package`
- `rush start-service-stack` (if not already running)
- `rush start-api-stack`
- _once finished running_
- `rush stop-service-stack`
- `rush stop-api-stack`

---

