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

type value = {
  numberOfCases: int,
  growth: float,
};

let dataWithGrowth =
  Map.entries(data)
  |> Js.Array.map(((countryId, dataPoints)) => {
       let data =
         lazy({
           let countryDataWithGrowth = Map.empty();
           let _ =
             Js.Array.reduce(
               (prevNumberOfCases, day) => {
                 let numberOfCases = Map.get(dataPoints, day);
                 let numberOfCasesF = Js.Int.toFloat(numberOfCases);
                 let prevNumberOfCasesF = Js.Int.toFloat(prevNumberOfCases);
                 let growth =
                   prevNumberOfCases == 0
                     ? 0.
                     : (numberOfCasesF -. prevNumberOfCasesF)
                       /. prevNumberOfCasesF;
                 Map.set(
                   countryDataWithGrowth,
                   day,
                   {numberOfCases, growth},
                 );
                 numberOfCases;
               },
               0,
               days,
             );
           countryDataWithGrowth;
         });
       (countryId, data);
     })
  |> Belt.Map.String.fromArray;

type item = {
  x: xValue,
  index: int,
  values: countryId => option(value),
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
            lazy(
              Map.get(
                Belt.Map.String.getExn(dataWithGrowth, countryId)
                |> Lazy.force,
                day,
              )
            ),
          )
        },
        countryIds,
      );
      {
        x: Date(Js.Date.fromString(day)),
        index,
        values: countryId =>
          Belt.HashMap.String.get(values, countryId)
          |> Js.Option.map((. x) => Lazy.force(x)),
      };
    },
    days,
  );
};

let alignToDay0 = threshold => {
  let data =
    Belt.Map.String.mapU(dataWithGrowth, (. dataPoints) => {
      lazy({
        let dataPoints = Lazy.force(dataPoints);
        Map.entries(dataPoints)
        |> Js.Array.map(((date, value)) =>
             (Map.get(dayToIndex, date), value)
           )
        |> Js.Array.sortInPlaceWith((a, b) => {compare(a |> fst, b |> fst)})
        |> Js.Array.map(((_, value)) => value)
        |> Js.Array.filter(value => value.numberOfCases >= threshold)
        |> Js.Array.mapi((value, index) => {(index, value)})
        |> Belt.Map.Int.fromArray;
      })
    });

  Array.init(Js.Array.length(days), day => {
    {
      x: Day(day),
      index: day,
      values: countryId => {
        Belt.Map.String.get(data, countryId)
        |> Js.Option.andThen((. countryData) => {
             Belt.Map.Int.get(Lazy.force(countryData), day)
           });
      },
    }
  });
};

let allLocations =
  Map.entries(locations)
  |> Js.Array.map(((locationId, value)) =>
       {ReactSelect.label: value.name, value: locationId}
     );
