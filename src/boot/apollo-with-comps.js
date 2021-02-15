import { boot } from 'quasar/wrappers';
import { DefaultApolloClient } from '@vue/apollo-composable';
import  * as VueApolloComponents from '@vue/apollo-components';
import VueApollo from '@vue/apollo-option';
import getApolloClientConfig from '../graphql/get-apollo-client-config';
import createApolloClient from '../graphql/create-apollo-client';
import {
  apolloProviderBeforeCreate,
  apolloProviderAfterCreate
} from 'src/apollo/apollo-provider-hooks';

export default boot(async ({ app, router, store, urlPath, redirect }) => {
  const cfg = await getApolloClientConfig({ app, router, store, urlPath, redirect });

  // create an 'apollo client' instance
  const apolloClient = await createApolloClient({
    cfg,
    app,
    router,
    store,
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
    urlPath,
    redirect
  });

  // create an 'apollo provider' instance
  const apolloProvider = new VueApollo(apolloProviderConfigObj);

  // run hook after creating apollo provider instance
  await apolloProviderAfterCreate({
    apolloProvider,
    app,
    router,
    store,
    urlPath,
    redirect
  });
  //add apollo components  
  app.use(VueApolloComponents);

  // attach created 'apollo provider' instance to the app
  app.provide(DefaultApolloClient, apolloProvider);
});
