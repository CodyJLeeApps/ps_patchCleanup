exports.config = {
  tests: 'tests/*.test.jsx',
  output: './output',
  helpers: {
    ChaiWrapper : {
      require: "codeceptjs-chai"
    },
    REST: {
      endpoint: 'http://localhost:8080',
      defaultHeaders: {
        "Content-Type": "application/json"
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'ps_patchCleanup',
}