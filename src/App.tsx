import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // useQuery,
} from "@apollo/client";
import { TaskList } from "./components/TaskList";

const client = new ApolloClient({
  uri: "/graphql", // MSW intercepts this
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <TaskList />
    </ApolloProvider>
  );
}
