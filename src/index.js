import React from 'react'
import styled from 'styled-components'
import tags from './tags'

const fnToNode = args => (
  args && args.map(arg =>
    typeof arg === `function` ? arg() : arg
  )
)

const createElement = tagName => (...args) => {
  const [props, ...children] = args
  const isObject = props !== null && typeof props === `object`
  const isArray = Array.isArray(props)
  const isFunction = typeof props === `function`
  const isNode = isObject && props.$$typeof
  const isString = typeof props === `string`
  const isProps = isObject && !isNode && !isArray

  if (!args.length) {
    return React.createElement(tagName)
  }
  if (isProps && !children.length) {
    return (...childs) => React.createElement(
      tagName, ...fnToNode([props, ...childs])
    )
  }
  if (isNode || isFunction || isString) {
    return React.createElement(
      tagName, null, ...fnToNode(args)
    )
  }
  if (isArray) {
    return React.createElement(
      tagName, null, fnToNode(props)
    )
  }

  return React.createElement(
    tagName, ...fnToNode(args)
  )
}

const styledOrComponent = comp => (...args) => {
  return args[0] && args[0].raw
    ? createElement(styled(comp)(...args))
    : createElement(comp)(...args)
}

const lambda = styledOrComponent

lambda.fragment = (...nodes) => (
  React.createElement(React.Fragment, null, nodes)
)

lambda.compose = (...fns) => arg => (
  fns.reverse().reduce(
    (acc, fn) => fn(acc), arg
  )
)

tags.forEach(tag =>
  lambda[tag] = styledOrComponent(tag)
)

export default lambda
