# Overview
> TODO


# Setup
> TODO


# Domain
> TODO

#### Add Aggregate
> TODO

#### Add Command
`cd domain-api`
`node ../builder/.dist/index.js command create changeTitleOfPost post`



#### Add Command Rule
> TODO

#### Add Command Event
`cd domain-api`
`node ../builder/.dist/index.js event create postTitleChanged changeTitleOfPost post`


#### Generate code for all Commands
`cd domain-api`
`node ../builder/.dist/index.js domain generate`
> note: this is automatically done by package.json on build