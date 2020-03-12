open Data;

module App = {
  [@react.component]
  let make = () => {
    let (locations, setLocations) =
      React.useState(() =>
        [|"Germany", "Italy", "Japan", "China (Guangdong)", "Spain", "US (California)"|]
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
