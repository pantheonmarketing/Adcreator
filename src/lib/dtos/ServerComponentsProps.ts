export type IServerComponentsProps = {
  params?: { [key: string]: string };
  searchParams?: ISearchParams;
  children?: React.ReactNode;
};

export type ISearchParams = {
  [key: string]: string | string[] | undefined;
};

export interface IServerAction {
  actionData: any;
  action: (form: FormData) => void;
  pending: boolean;
}
