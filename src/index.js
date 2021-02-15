// function that will be used to extend quasar config (quasar.conf.js)
function extendConf (conf, api) {
  // select boot file depending on quasar mode
  // https://quasar.dev/quasar-cli/quasar-conf-js#The-basics
  const bootFile = api.ctx.mode.ssr ? 'apollo-ssr' : 'apollo'
  
  // if user confirmed to install components during app-ext install, do so
  const withComponents = api.prompts.installVueApolloComponents ? '-with-comps' : ''

  // register boot file
  conf.boot.push(`~@quasar/quasar-app-extension-apollo-v2/src/boot/${bootFile}${withComponents}`)

  // make sure app extension files get transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-apollo[\\/]src/)

  // allow overriding of graphql uri using an env variable
  // https://quasar.dev/quasar-cli/cli-documentation/handling-process-env#Adding-to-process.env
  conf.build.env.GRAPHQL_URI =
    api.getPackageVersion("@quasar/app") >= "2.0.0"
      ? process.env.GRAPHQL_URI // @quasar/app v2 already stringifies env properties
      : JSON.stringify(process.env.GRAPHQL_URI);
}

module.exports = function (api) {
  // quasar compatibility check
  api.compatibleWith('quasar', '^2.0.0-alpha.0')
  api.compatibleWith('@quasar/app', '^3.0.0-alpha.0')

  // extend quasar config
  api.extendQuasarConf(extendConf)
}
