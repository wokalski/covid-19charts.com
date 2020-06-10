module App = {
  let useLocations = (~default) => {
    let (colors, setColors) =
      React.useState(() => ColorStack.make(~locations=default));

    let (locations, setLocations) =
      UseQueryParam.hook(
        () => default,
        ~queryFragment="loc",
        ~coder=SerializeQueryParam.stringArray,
      );
    (
      Belt.Array.mapU(
        locations,
        (. locationId) => {
          let (primaryColor, secondaryColor) =
            ColorStack.getColor(~location=locationId, colors);
          {
            Location.primaryColor,
            secondaryColor,
            text: Data.Map.get(Data.locations, locationId).name,
            id: locationId,
          };
        },
      ),
      updater => {
        setColors(colorStack =>
          ColorStack.updateColors(~locations=updater(locations), colorStack)
        );
        setLocations(updater);
      },
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
          "Italy",
          "Poland",
          "Spain",
          "Germany",
          "Canada (All regions)",
          "US",
          "China (All regions)",
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
        () => Filters.Number(Data.Confirmed),
        ~queryFragment="chart",
        ~encode=
          fun
          | Number(Data.Confirmed) => "cases_count"
          | Number(Data.Deaths) => "deaths_count"
          | PercentageGrowthOfCases => "percentage_growth_cases"
          | TotalMortalityRate => "total_mortality_rate",
        ~decode=
          fun
          | "cases_count" => Some(Number(Data.Confirmed))
          | "deaths_count" => Some(Number(Data.Deaths))
          | "percentage_growth_cases" => Some(Filters.PercentageGrowthOfCases)
          | "total_mortality_rate" => Some(Filters.TotalMortalityRate)
          | _ => None,
      );
    let threshold =
      UseQueryParam.hook(
        () => Some(5000),
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
    let startDate =
      UseQueryParam.hook(
        () => Data.startDate,
        ~queryFragment="since",
        ~coder=SerializeQueryParam.date,
      );
    let endDate =
      UseQueryParam.hook(
        () => Data.endDate,
        ~queryFragment="until",
        ~coder=SerializeQueryParam.date,
      );
    let resetDates =
      if (Data.isInitialRange(startDate |> fst, endDate |> fst)) {
        None;
      } else {
        Some(
          () => {
            let setStart = startDate |> snd;
            let setEnd = endDate |> snd;
            setStart(_ => Data.startDate);
            setEnd(_ => Data.endDate);
          },
        );
      };
    let thresholdOr1 = Belt.Option.getWithDefault(threshold |> fst, 1);
    <div className="flex bg-white flex-col-reverse md:flex-row">
      <Filters
        startDate
        endDate
        locations
        setLocations
        allLocations=Data.allLocations
        scale
        timeline
        threshold
        chartType
        resetDates
      />
      <Chart
        chartType={chartType |> fst}
        threshold=thresholdOr1
        timeline={timeline |> fst}
        locations
        scale={scale |> fst}
        startDate={startDate |> fst}
        endDate={endDate |> fst}
      />
    </div>;
  };
};

ReactDOMRe.renderToElementWithId(<App />, "index");
