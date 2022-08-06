import { createApp, h, provide } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./index.css"
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApolloProvider } from '@vue/apollo-option'
import config from "./config";
import 'v-tooltip/dist/v-tooltip.css';
// import {
// Directives
//   VTooltip
  // VClosePopper,
// Components
  // Dropdown,
  // Tooltip,
  // Menu
// } from 'v-tooltip'
import VTooltipPlugin from 'v-tooltip'
import '@github/markdown-toolbar-element'
import 'highlight.js/styles/github-dark-dimmed.css'

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
  uri: config.graphqlUrl,
  cache,
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
  .use(VTooltipPlugin)
  .use(apolloProvider)
  .mount("#app");
