import { boot } from 'quasar/wrappers';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { VueApolloComponents } from '@vue/apollo-components';
import VueApollo from '@vue/apollo-option';
import getApolloClientConfig from '../graphql/get-apollo-client-config';
import createApolloClient from '../graphql/create-apollo-client-ssr';
import {
  apolloProviderBeforeCreate,
  apolloProviderAfterCreate
} from 'src/apollo/apollo-provider-hooks';

export default boot(async ({ app, router, store, ssrContext, urlPath, redirect }) => {
 const cfg = await getApolloClientConfig({
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  // create an 'apollo client' instance
  const apolloClient = await createApolloClient({
    cfg,
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  const apolloProviderConfigObj = { defaultClient: apolloClient };

  // run hook before creating apollo provider instance
  await apolloProviderBeforeCreate({
    apolloProviderConfigObj,
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  //add apollo components  
  app.use(VueApolloComponents);
  // create an 'apollo provider' instance
  const apolloProvider = new VueApollo(apolloProviderConfigObj);

  // run hook after creating apollo provider instance
  await apolloProviderAfterCreate({
    apolloProvider,
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  // attach created 'apollo provider' instance to the app
  app.provide(DefaultApolloClient, apolloProvider);

  // when on server:
  if (ssrContext) {
    // This `rendered` hook is called when the app has finished rendering
    // https://ssr.vuejs.org/guide/data.html#final-state-injection
    ssrContext.rendered = () => {
      // when the app has finished rendering in the server, the graphql queries
      // are resolved and their results are ready to be attached to the ssr
      // context, these query results are then retrieved in the html template
      // and made available to the client via 'window.__APOLLO_STATE__'
      // https://apollo.vuejs.org/guide/ssr.html#server-entry
      // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr#Boot-Files
      ssrContext.apolloState = ApolloSSR.getStates(apolloProvider);
    };
  }
});
