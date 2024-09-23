export default async function ({ params }: { params: { tenant: string } }) {
  return (
    <div>
      <h1>Tenant page: {JSON.stringify(params)}</h1>
    </div>
  );
}
