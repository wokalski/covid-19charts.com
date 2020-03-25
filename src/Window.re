type location = {
  search: string,
  href: string,
};
type locationState;

type history = {replaceState: (. locationState, string, string) => unit};

type window = {
  history,
  location,
};

[@bs.val] external window: window = "window";
