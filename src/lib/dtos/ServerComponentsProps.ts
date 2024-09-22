export type ServerComponentsProps = {
  params?: { [key: string]: string };
  searchParams?: NextSearchParams;
};

export type NextSearchParams = {
  [key: string]: string | string[] | undefined;
};

export interface IServerAction {
  actionData: any;
  action: (form: FormData) => void;
  pending: boolean;
}
