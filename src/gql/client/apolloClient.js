import ApolloClient from 'apollo-client';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { useAuthToken } from '../../hooks/useAuthToken';

const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });

const authMiddleware = (authToken) =>
  new ApolloLink((operation, forward) => {
    if (authToken) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
    }

    return forward(operation);
  });

const cache = new InMemoryCache({});

export const useAppApolloClient = () => {
  const [authToken] = useAuthToken();

  return new ApolloClient({
    link: authMiddleware(authToken).concat(httpLink),
    cache,
  });
};