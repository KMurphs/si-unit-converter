import * as definitions from "./definitions.db"
import * as conversions from "./conversions"

import * as _types from "./types"
import * as _prefixes from "./prefixes"
const types = {..._types, ..._prefixes}

import { Prefix } from "./prefixes"
import { Relation } from "./definitions.db"


export { definitions, conversions, types, Prefix, Relation }