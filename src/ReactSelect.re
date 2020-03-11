type selectOption('a) = {
  value: 'a,
  label: string,
};

[@bs.module "react-select"] [@react.component]
external make:
  (
    ~styles: Js.t({..})=?,
    ~defaultValue: array(selectOption('a))=?,
    ~isMulti: bool=?,
    ~name: string=?,
    ~options: array(selectOption('a)),
    ~className: string=?,
    ~classNamePrefix: string=?,
    ~menuIsOpen: bool=?,
    ~maxMenuHeight: int=?,
    ~maxHeight: int=?,
    ~placeholder: string=?,
    ~isClearable: bool=?,
    ~onChange: Js.Nullable.t(array(selectOption('a))) => unit=?
  ) =>
  React.element =
  "default";

