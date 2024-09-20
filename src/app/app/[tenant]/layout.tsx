export default async function ({ params, children }: { params: { tenant: string }; children: React.ReactNode }) {
  return (
    <div>
      <h1>Layout page: {JSON.stringify(params)}</h1>
      {children}
    </div>
  );
}
