module.exports = function () {
  return [
    {
      // address of the graphql backend server
      // you can override this 'uri' by using an env variable when running
      // quasar commands, for example:
      // `GRAPHQL_URI=https://prod.example.com/graphql quasar build`
      // `GRAPHQL_URI=https://dev.example.com/graphql quasar dev`
      name: 'graphql_uri',
      type: 'input',
      required: false,
      message: 'GraphQL endpoint URI (You can skip it now and set it later)',
      default: 'http://api.example.com'
    },
    {
      // Ask the user if the Vue-Apollo components should also be installed
      name: 'installVueApolloComponents',
      type: 'confirm',
      message: 'Should the Vue-Apollo Components also be installed?',
      default: false // optional
    }
  ]
}
