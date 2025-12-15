import { render, screen, waitFor } from "@testing-library/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { handlers } from "../mocks/handlers";
import { CarList } from "./CarList";
import { CarsProvider } from "../hooks/useCars";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithApollo() {
  const client = new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
  });

  return render(
    <ApolloProvider client={client}>
      <CarsProvider>
        <CarList />
      </CarsProvider>
    </ApolloProvider>
  );
}

describe("CarList", () => {
  it("renders cars from the API", async () => {
    renderWithApollo();

    await waitFor(() => {
      expect(screen.getByText(/Audi Q5/i)).toBeInTheDocument();
    });
  });

  it("filters by model using the search field", async () => {
    renderWithApollo();

    await waitFor(() => {
      expect(screen.getByText(/Audi Q5/i)).toBeInTheDocument();
    });

    const input = screen.getByRole("textbox", { name: /model/i });

    await userEvent.clear(input);
    await userEvent.type(input, "A3");

    expect(screen.getByText(/Audi A3/i)).toBeInTheDocument();
    expect(screen.queryByText(/Audi Q5/i)).toBeNull();
  });
});

