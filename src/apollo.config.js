import config from '@/config'
module.exports = {
    client: {
      service: {
        name: 'graphql-vue-starter-frontend',
        // URL to the GraphQL API
        url: config.graphqlUrl,
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }