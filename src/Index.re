module App = {
  let useLocations = (~default) => {
    let white = "#fff";
    let black = "#000";
    let fallbackColor = ("#878787", white);
    let colors = [|
      ("#a50026", white),
      ("#fdae61", black),
      ("#313695", white),
      ("#d73027", white),
      ("#fee090", black),
      ("#abd9e9", black),
      ("#f46d43", white),
      ("#74add1", white),
      ("#4575b4", white),
      fallbackColor,
    |];
    let colorMaxIndex = Belt.Array.length(colors) - 1;

    let (locations, setLocations) = React.useState(() => default);
    (
      Belt.Array.mapWithIndexU(
        locations,
        (. index, locationId) => {
          let (primaryColor, secondaryColor) =
            Belt.Array.getUnsafe(
              colors,
              Js.Math.min_int(index, colorMaxIndex),
            );
          {
            Location.primaryColor,

            secondaryColor,
            text: Data.Map.get(Data.locations, locationId).name,
            id: locationId,
          };
        },
      ),
      setLocations,
    );
  };

  [@react.component]
  let make = () => {
    let (locations, setLocations) =
      useLocations(
        ~default=[|
          "China (Guangdong)",
          "Germany",
          "Italy",
          "Japan",
          "Spain",
          "US (All regions)",
        |],
      );
    let scale = React.useState(() => Filters.Logarithmic);
    let timeline = React.useState(() => Filters.RelativeToThreshold);
    let threshold = React.useState(() => Some(17));
    let thresholdOr1 = Belt.Option.getWithDefault(threshold |> fst, 1);
    <div className="flex bg-white flex-col-reverse md:flex-row">
      <Filters
        locations
        setLocations
        allLocations=Data.allLocations
        scale
        timeline
        threshold
      />
      <Chart
        threshold=thresholdOr1
        timeline={timeline |> fst}
        locations
        scale={scale |> fst}
      />
    </div>;
  };
};

ReactDOMRe.renderToElementWithId(<App />, "index");
