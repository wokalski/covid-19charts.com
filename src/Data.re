module Map: {
  type t('key, 'value) constraint 'key = string;

  let keys: t('key, 'value) => array('key);
  let get: (t('key, 'value), 'key) => 'value;
  let get_opt: (t('key, 'value), 'key) => option('value);
  let map: ((. 'value) => 'b, t('key, 'value)) => t('key, 'b);
  let entries: t('key, 'value) => array(('key, 'value));
  let fromArray: array(('key, 'value)) => t('key, 'value);
  let set: (t('key, 'value), 'key, 'value) => unit;
  let empty: unit => t('key, 'value);
} = {
  type t('key, 'value) = Js.Dict.t('value) constraint 'key = string;
  let keys = Js.Dict.keys;
  let get = Js.Dict.unsafeGet;
  let get_opt = Js.Dict.get;
  let map = Js.Dict.map;
  let entries = Js.Dict.entries;
  let fromArray = Js.Dict.fromArray;
  let set = Js.Dict.set;
  let empty = Js.Dict.empty;
};

[@bs.val] external require: string => 'a = "require";

type countryId = string;
type location = {
  country: string,
  provinceOrState: option(string),
  name: string,
};
type day = string;
type dataPoints = Map.t(day, int);

let locations: Map.t(countryId, location) =
  require("../data/locations.json");
let days: array(day) = require("../data/days.json");
let data: Map.t(countryId, dataPoints) = require("../data/data.json");
let countryIds = Map.keys(locations);

let dayToIndex =
  Js.Array.mapi((day, index) => {(day, index)}, days) |> Map.fromArray;

type xValue =
  | Date(Js.Date.t)
  | Day(int);

type item = {
  x: xValue,
  index: int,
  values: Belt.HashMap.String.t(int),
};

type t = array(item);

let calendar: t = {
  Js.Array.mapi(
    (day, index) => {
      let values =
        Belt.HashMap.String.make(~hintSize=Js.Array.length(countryIds));
      Js.Array.forEach(
        countryId => {
          Belt.HashMap.String.set(
            values,
            Map.get(locations, countryId).name,
            Map.get(Map.get(data, countryId), day),
          )
        },
        countryIds,
      );
      {x: Date(Js.Date.fromString(day)), index, values};
    },
    days,
  );
};

let alignToDay0 = threshold => {
  let data =
    Map.map(
      (. dataPoints) => {
        Map.entries(dataPoints)
        |> Js.Array.map(((date, value)) =>
             (Map.get(dayToIndex, date), value)
           )
        |> Js.Array.sortInPlaceWith((a, b) => {compare(a |> fst, b |> fst)})
        |> Js.Array.map(((_, value)) => value)
        |> Js.Array.filter(value => value >= threshold)
        |> Js.Array.mapi((value, index) => {(index, value)})
        |> Belt.Map.Int.fromArray
      },
      data,
    );

  Array.init(
    Js.Array.length(days),
    day => {
      let values =
        Belt.HashMap.String.make(~hintSize=Js.Array.length(countryIds));
      Js.Array.forEach(
        countryId => {
          switch (Belt.Map.Int.get(Map.get(data, countryId), day)) {
          | Some(number) =>
            Belt.HashMap.String.set(
              values,
              Map.get(locations, countryId).name,
              number,
            )
          | None => ()
          }
        },
        countryIds,
      );
      {x: Day(day), index: day, values};
    },
  );
};

let allLocations =
  Map.entries(locations)
  |> Js.Array.map(((locationId, value)) =>
       {ReactSelect.label: value.name, value: locationId}
     );
