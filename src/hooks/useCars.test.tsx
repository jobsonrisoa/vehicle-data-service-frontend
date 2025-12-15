import { renderHook, waitFor } from "@testing-library/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { handlers } from "../mocks/handlers";
import { CarsProvider, useCars } from "./useCars";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function wrapper({ children }: { children: ReactNode }) {
  const client = new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <CarsProvider>{children}</CarsProvider>
    </ApolloProvider>
  );
}

describe("useCars", () => {
  it("loads cars from the GraphQL API", async () => {
    const { result } = renderHook(() => useCars(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeUndefined();
    expect(result.current.cars.length).toBeGreaterThan(0);
  });

  it("adds a local car that appears in the list", async () => {
    const { result } = renderHook(() => useCars(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCount = result.current.cars.length;

    result.current.addLocalCar({
      id: "local-1",
      make: "Test",
      model: "Model",
      year: 2025,
      color: "Black",
      mobile: "mobile-url",
      tablet: "tablet-url",
      desktop: "desktop-url",
    });

    await waitFor(() => {
      expect(result.current.cars.length).toBe(initialCount + 1);
    });
  });
});

