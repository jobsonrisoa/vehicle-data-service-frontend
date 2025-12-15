import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { CarsProvider } from "./hooks/useCars";
import { CarForm } from "./components/CarForm";
import { CarList } from "./components/CarList";

const client = new ApolloClient({
  uri: "/graphql", // MSW intercepts this
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <CarsProvider>
        <CarForm />
        <CarList />
      </CarsProvider>
    </ApolloProvider>
  );
}
