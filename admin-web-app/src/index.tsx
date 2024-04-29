import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Set up the HTTP link
const httpLink = new HttpLink({
  uri: 'http://backend.localhost/graphql', // Replace with your actual GraphQL server URI
});

// Set up the WebSocket link
const wsLink = new WebSocketLink({
  uri: 'ws://backend.localhost/graphql', // Replace with your actual GraphQL server WebSocket URI
  options: {
    reconnect: true,
  },
});

// Use split to send data to each link based on the kind of operation
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Set up the Apollo Client instance
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Wrap the App component with ApolloProvider
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();