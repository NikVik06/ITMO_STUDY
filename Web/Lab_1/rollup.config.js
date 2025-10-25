export default {
  input: 'static/purs-entry.js',
  output: {
    file: 'static/app.js',
    format: 'iife',
    name: 'PursApp',
    sourcemap: true
  },
  treeshake: false
}