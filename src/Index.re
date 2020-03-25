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

    let (locations, setLocations) =
      UseQueryParam.hook(
        () => default,
        ~queryFragment="loc",
        ~coder=SerializeQueryParam.stringArray,
      );
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

  let useStringQueryParamState = (initial, ~queryFragment, ~encode, ~decode) => {
    UseQueryParam.hook(
      initial,
      ~queryFragment,
      ~coder={
        encode: x => {
          SerializeQueryParam.string.encode(encode(x));
        },
        decode: x =>
          SerializeQueryParam.string.decode(x)
          |> Js.Option.andThen((. x) => {decode(x)}),
      },
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
          "US",
        |],
      );
    let scale =
      useStringQueryParamState(
        () => Filters.Logarithmic,
        ~queryFragment="scale",
        ~encode=
          fun
          | Logarithmic => "log"
          | Linear => "linear",
        ~decode=
          fun
          | "log" => Some(Filters.Logarithmic)
          | "linear" => Some(Linear)
          | _ => None,
      );

    let timeline =
      useStringQueryParamState(
        () => Filters.RelativeToThreshold,
        ~queryFragment="timeline",
        ~encode=
          fun
          | RelativeToThreshold => "relative"
          | CalendarDates => "calendar",
        ~decode=
          fun
          | "relative" => Some(Filters.RelativeToThreshold)
          | "calendar" => Some(CalendarDates)
          | _ => None,
      );
    let chartType =
      useStringQueryParamState(
        () => Filters.NumberOfCases,
        ~queryFragment="chart",
        ~encode=
          fun
          | NumberOfCases => "cases_count"
          | PercentageGrowthOfCases => "percentage_growth_cases",
        ~decode=
          fun
          | "cases_count" => Some(NumberOfCases)
          | "percentage_growth_cases" => Some(Filters.PercentageGrowthOfCases)
          | _ => None,
      );
    let threshold =
      UseQueryParam.hook(
        () => Some(17),
        ~queryFragment="threshold",
        ~coder={
          encode: x => {
            Belt.Option.getWithDefault(x, 1) |> SerializeQueryParam.int.encode;
          },
          decode: x =>
            SerializeQueryParam.int.decode(x)
            |> Js.Option.map((. x) => Some(x)),
        },
      );
    let thresholdOr1 = Belt.Option.getWithDefault(threshold |> fst, 1);
    <div className="flex bg-white flex-col-reverse md:flex-row">
      <Filters
        locations
        setLocations
        allLocations=Data.allLocations
        scale
        timeline
        threshold
        chartType
      />
      <Chart
        chartType={chartType |> fst}
        threshold=thresholdOr1
        timeline={timeline |> fst}
        locations
        scale={scale |> fst}
      />
    </div>;
  };
};

ReactDOMRe.renderToElementWithId(<App />, "index");
