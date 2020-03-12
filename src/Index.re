module Map: {
  type t('key, 'value) constraint 'key = string;

  let keys: t('key, 'value) => array('key);
  let get: (t('key, 'value), 'key) => 'value;
  let get_opt: (t('key, 'value), 'key) => option('value);
  let map: ((. 'value) => 'b, t('key, 'value)) => t('key, 'b);
  let entries: t('key, 'value) => array(('key, 'value));
  let fromArray: array(('key, 'value)) => t('key, 'value);
} = {
  type t('key, 'value) = Js.Dict.t('value) constraint 'key = string;
  let keys = Js.Dict.keys;
  let get = Js.Dict.unsafeGet;
  let get_opt = Js.Dict.get;
  let map = Js.Dict.map;
  let entries = Js.Dict.entries;
  let fromArray = Js.Dict.fromArray;
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

let locations: Map.t(countryId, location) = require("../data/locations.json");
let days: array(day) = require("../data/days.json");
let data: Map.t(countryId, dataPoints) = require("../data/data.json");
let countryIds = Map.keys(locations);
let dayToIndex =
  Js.Array.mapi((day, index) => {(day, Js.Int.toString(index))}, days)
  |> Map.fromArray;
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
          Js.Dict.set(
            row,
            Map.get(locations, countryId).name,
            Js.Int.toString(Map.get(Map.get(data, countryId), day)),
          )
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
             (Map.get(dayToIndex, date) |> int_of_string, value)
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
              Js.Int.toString(number),
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

module App = {
  [@react.component]
  let make = () => {
    let (locations, setLocations) =
      React.useState(() =>
        [|"Germany", "Italy", "Japan", "China (Guangdong)", "Spain"|]
        |> Js.Array.map(Map.get(locations))
        |> Js.Array.map(({name: label} as value) =>
             {ReactSelect.label, value}
           )
      );
    let scale = React.useState(() => Filters.Logarithmic);
    let timeline = React.useState(() => Filters.Day0);
    let threshold = React.useState(() => Some(17));
    let thresholdOr1 = Belt.Option.getWithDefault(threshold |> fst, 1);
    let data =
      switch (timeline |> fst) {
      | Filters.Day0 => alignToDay0(thresholdOr1)
      | Dates => calendar
      };
    <div className="flex bg-gray-900 flex-col-reverse md:flex-row">
      <Filters locations setLocations allLocations scale timeline threshold />
      <Chart
        data
        color={Map.get(colors)}
        locations
        scale={
          switch (scale |> fst) {
          | Filters.Logarithmic => `log
          | Linear => `linear
          }
        }
        threshold=thresholdOr1
      />
    </div>;
  };
};

ReactDOMRe.renderToElementWithId(<App />, "index");
