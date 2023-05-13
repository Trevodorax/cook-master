import { useGetAllUsersQuery } from "@/store/services/cookMaster/api";

export const AdminDashboard = () => {
  const { data, error, isLoading } = useGetAllUsersQuery();

  return (
    <div>
      {error && `Error: ${JSON.stringify(error)}`}
      {isLoading && "Loading..."}
      {data && <pre>{JSON.stringify(data, null, 4)}</pre>}
    </div>
  );
};
