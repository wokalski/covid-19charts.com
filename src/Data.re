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

let randomColor = index => {
  let random = 360. *. (Js.Int.toFloat(index) /. 100.);
  {j|hsla($random,70%,70%,0.8)|j};
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

let addAllRegionsLocations = (locations, data) => {
  let countriesWithMultipleRegions =
    Map.entries(locations)
    |> Js.Array.sortInPlaceWith(((_, {country: a}), (_, {country: b})) => {
         compare(a, b)
       })
    |> Js.Array.reduce(
         (acc, (locationId, {country})) => {
           switch (acc) {
           | [] => [(country, [locationId])]
           | [(prevCountry, current), ...tail] when country == prevCountry => [
               (country, [locationId, ...current]),
               ...tail,
             ]
           | tail => [(country, [locationId]), ...tail]
           }
         },
         [],
       )
    |> List.filter(((_, l)) => List.length(l) > 1);

  let allRegionsId = country => {
    country ++ " (All regions)";
  };

  List.iter(
    ((country, _)) => {
      let allRegionsId = allRegionsId(country);
      Map.set(
        locations,
        allRegionsId,
        {country, provinceOrState: None, name: allRegionsId},
      );
    },
    countriesWithMultipleRegions,
  );

  List.iter(
    ((country, locationIds)) => {
      let allRegionsId = allRegionsId(country);
      let mergedData = Map.empty();
      List.iter(
        locationId => {
          let dataPoints = Map.get(data, locationId);
          dataPoints
          |> Map.keys
          |> Js.Array.forEach(key => {
               let current = Map.get(dataPoints, key);
               switch (Map.get_opt(mergedData, key)) {
               | Some(x) => Map.set(mergedData, key, x + current)
               | None => Map.set(mergedData, key, current)
               };
             });
        },
        locationIds,
      );
      Map.set(data, allRegionsId, mergedData);
    },
    countriesWithMultipleRegions,
  );
};

let locations: Map.t(countryId, location) =
  require("../data/locations.json");
let days: array(day) = require("../data/days.json");
let data: Map.t(countryId, dataPoints) = require("../data/data.json");
addAllRegionsLocations(locations, data);
let countryIds = Map.keys(locations);

let dayToIndex =
  Js.Array.mapi((day, index) => {(day, index)}, days) |> Map.fromArray;
let colors =
  Map.keys(locations)
  |> Js.Array.mapi((location, index) => (location, randomColor(index)))
  |> Map.fromArray;

let calendar = {
  Js.Array.map(
    day => {
      let row = Js.Dict.empty();
      Js.Dict.set(row, "name", day);
      Js.Array.forEach(
        countryId => {
          if (countryId === "US (All regions)") {
            Js.log(Map.get(Map.get(data, countryId), day));
          };
          Js.Dict.set(
            row,
            Map.get(locations, countryId).name,
            Map.get(Map.get(data, countryId), day) |> Obj.magic,
          );
        },
        countryIds,
      );
      row;
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
        |> Js.Array.mapi((value, index) => {
             (Js.Int.toString(index), value)
           })
        |> Map.fromArray
      },
      data,
    );

  Array.init(
    Js.Array.length(days),
    day => {
      let row = Js.Dict.empty();
      let day = Js.Int.toString(day);
      Js.Dict.set(row, "name", day);
      Js.Array.forEach(
        countryId => {
          switch (Map.get_opt(Map.get(data, countryId), day)) {
          | Some(number) =>
            Js.Dict.set(
              row,
              Map.get(locations, countryId).name,
              Obj.magic(number),
            )
          | None => ()
          }
        },
        countryIds,
      );
      row;
    },
  );
};

let allLocations =
  Map.entries(locations)
  |> Js.Array.map(((label, value)) => {ReactSelect.label, value});
