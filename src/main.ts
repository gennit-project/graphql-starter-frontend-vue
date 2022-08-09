import { createApp, h, provide } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./index.css"
import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApolloProvider } from '@vue/apollo-option'
import { onError } from '@apollo/client/link/error'
import { logErrorMessages } from "@vue/apollo-util";
import config from "./config";
// import 'v-tooltip/dist/v-tooltip.css';
// import {
// Directives
//   VTooltip
  // VClosePopper,
// Components
  // Dropdown,
  // Tooltip,
  // Menu
// } from 'v-tooltip'
// import VTooltipPlugin from 'v-tooltip'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import '@github/markdown-toolbar-element'
import 'highlight.js/styles/github-dark-dimmed.css'

const httpLink = createHttpLink({
  uri: config.graphqlUrl,
})

const networkErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const logErrorsLink = onError(error => {
  if (process.env.NODE_ENV !== 'production') {
    logErrorMessages(error)
  }
})

// Cache implementation
const cache = new InMemoryCache({
  typePolicies: {
    Tag: {
      keyFields: ["text"],
    },
    Post: {
      keyFields: ["id"],
      fields: {
        Tags: {
          merge: false
        },
      }
    },
    Query: {
      fields: {
        posts: {
          merge: false
        },
      },
    },
  },
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  cache,
  link: logErrorsLink.concat(networkErrorLink).concat(httpLink)
});

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app
  .use(router)
  .use(FloatingVue)
  .use(apolloProvider)
  .mount("#app");
