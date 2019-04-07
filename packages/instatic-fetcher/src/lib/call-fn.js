const callFn = (fn, ...args) =>
  typeof fn === 'function'
    ? fn(...args)
    : null

export default callFn
