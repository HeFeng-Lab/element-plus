const _bem = (prefixedName, blockSuffix, element, modifier) => {
  if (blockSuffix) {
    prefixedName += `-${blockSuffix}`
  }
  if (element) {
    prefixedName += `__${element}`
  }
  if (modifier) {
    prefixedName += `--${modifier}`
  }
  return prefixedName
}

function createBEM(prefixedName: string) {
  const b = (blockSuffix = "") => _bem(prefixedName, blockSuffix, "", "")
  const e = (element = "") => (element ? _bem(prefixedName, "", element, "") : "")
  const m = (modifier = "") => (modifier ? _bem(prefixedName, "", "", modifier) : "")
  const be = (blockSuffix = "", element = "") => (blockSuffix && element ? _bem(prefixedName, blockSuffix, element, "") : "")
  const em = (element, modifier) => (element && modifier ? _bem(prefixedName, "", element, modifier) : "")
  const bm = (blockSuffix, modifier) => (blockSuffix && modifier ? _bem(prefixedName, blockSuffix, "", modifier) : "")
  const bem = (blockSuffix, element, modifier) => (blockSuffix && element && modifier ? _bem(prefixedName, blockSuffix, element, modifier) : "")
  const is = (name, state?) => (state ? `is-${name}` : "")

  return {
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
  }
}

export function createNamespace(name: string) {
  const prefixedName = `el-${name}`
  return createBEM(prefixedName)
}

// const ns = createNamespace("button")

// console.log(ns.b())
// console.log(ns.b("box"))
// console.log(ns.e("element"))
// console.log(ns.m("modifier"))
// console.log(ns.be("box", "element"))
// console.log(ns.bm("box", "modifier"))
// console.log(ns.em("element", "modifier"))
// console.log(ns.bem("box", "element", "modifier"))

// console.log(ns.is("checked", true))

// $ tsc ./create.ts && node ./create.js
// el-button
// el-button-box
// el-button__element
// el-button--modifier
// el-button-box__element
// el-button-box--modifier
// el-button__element--modifier
// el-button-box__element--modifier
// is-checked
