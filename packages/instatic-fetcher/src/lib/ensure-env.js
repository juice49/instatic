const ensureEnv = requiredEnv => {
  requiredEnv.forEach(key => {
    if (typeof process.env[key] === 'undefined') {
      throw new Error(`Missing environment variable \`${key}\`.`)
    }
  })
}

export default ensureEnv
