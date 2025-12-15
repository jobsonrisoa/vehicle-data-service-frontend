import { useQuery } from "@apollo/client";
import { GET_CAR_BY_FILTER } from "../graphql/queries";
import type { Car } from "./useCars";

type Variables = {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
};

type Result = {
  car: Car | null;
  loading: boolean;
  error: Error | undefined;
};

export function useCarByFilter(variables: Variables): Result {
  const { data, loading, error } = useQuery(GET_CAR_BY_FILTER, {
    variables,
  });

  return {
    car: (data?.car as Car | null) ?? null,
    loading,
    error: error as Error | undefined,
  };
}


