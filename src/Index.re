open Data;

module App = {
  let ordinalSuffix = i => {
    let j = i mod 10;
    let k = i mod 100;
    let i = Js.Int.toString(i);
    if (j == 1 && k != 11) {
      i ++ "st";
    } else if (j == 2 && k != 12) {
      i ++ "nd";
    } else if (j == 3 && k != 13) {
      i ++ "rd";
    } else {
      i ++ "th";
    };
  };

  [@react.component]
  let make = () => {
    let (locations, setLocations) =
      React.useState(() =>
        [|
          "Germany",
          "Italy",
          "Japan",
          "China (Guangdong)",
          "Spain",
          "US (All regions)",
        |]
        |> Js.Array.map(Map.get(locations))
        |> Js.Array.map(({name: label} as value) =>
             {ReactSelect.label, value}
           )
      );
    let scale = React.useState(() => Filters.Logarithmic);
    let timeline = React.useState(() => Filters.Day0);
    let threshold = React.useState(() => Some(17));
    let thresholdOr1 = Belt.Option.getWithDefault(threshold |> fst, 1);
    let (data, formatLabel) =
      switch (timeline |> fst) {
      | Filters.Day0 => (
          alignToDay0(thresholdOr1),
          (
            fun
            | "1" => "1 day since " ++ ordinalSuffix(thresholdOr1) ++ " case"
            | str =>
              str ++ " days since " ++ ordinalSuffix(thresholdOr1) ++ " case"
          ),
        )
      | Dates => (calendar, (str => str))
      };
    <div className="flex bg-gray-900 flex-col-reverse md:flex-row">
      <Filters locations setLocations allLocations scale timeline threshold />
      <Chart
        data
        color={Map.get(colors)}
        locations
        formatLabel
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
