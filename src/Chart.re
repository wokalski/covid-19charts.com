open Recharts;
module R =
  Recharts.Make({
    type dataItem = Data.item;
    type yValue = int;
  });

type domain;
external int_to_domain: int => domain = "%identity";
external string_to_domain: string => domain = "%identity";
[@bs.get] external clientHeight: Dom.element => float = "clientHeight";

let calculateMaxValue = (locations, data) => {
  Js.Array.reduce(
    (maxValue, {Data.values}) => {
      Js.Array.reduce(
        (maxValue, location) => {
          switch (values(location.Location.id)) {
          | Some({Data.numberOfCases}) =>
            Js.Math.max_int(maxValue, numberOfCases)
          | None => maxValue
          }
        },
        maxValue,
        locations,
      )
    },
    1,
    data,
  );
};

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
let make =
    (
      ~timeline: Filters.timeline,
      ~locations,
      ~scale,
      ~threshold,
      ~chartType,
      ~startDate,
      ~endDate,
    ) => {
  let formatLabel =
    switch (timeline) {
    | Filters.RelativeToThreshold => (
        fun
        | "1" => "1 day since " ++ ordinalSuffix(threshold) ++ " case"
        | str => str ++ " days since " ++ ordinalSuffix(threshold) ++ " case"
      )
    | _ => (x => x)
    };
  let data =
    switch (timeline) {
    | Filters.RelativeToThreshold => Data.alignToDay0(threshold)
    | CalendarDates => Data.calendar(startDate, endDate)
    };
  let growthBaseline =
    switch (chartType, timeline, scale) {
    | (
        Filters.NumberOfCases,
        Filters.RelativeToThreshold,
        Filters.Logarithmic,
      ) =>
      let dailyGrowth = 1.33;
      let exponent = {
        let threshold = Js.Int.toFloat(threshold);
        let maxValue = calculateMaxValue(locations, data);
        log((maxValue |> Belt.Int.toFloat) /. threshold)
        /. log(dailyGrowth)
        |> Js.Math.ceil;
      };
      <R.Line
        dot={Dot.bool(false)}
        activeDot={Dot.bool(false)}
        name="daily-growth-indicator"
        _type=`monotone
        stroke=Colors.colors##black
        strokeWidth=2.
        strokeDasharray="3 3"
        dataKey={item =>
          if (item.Data.index <= exponent) {
            Js.Null.return(
              Js.Int.toFloat(threshold)
              *. Js.Math.pow_float(
                   ~base=dailyGrowth,
                   ~exp=item.Data.index |> Belt.Int.toFloat,
                 )
              |> int_of_float
              |> R.Line.int,
            );
          } else {
            Js.null;
          }
        }
      />;

    | _ => React.null
    };

  let divRef = React.useRef(Js.Nullable.null);
  let (dot, setDot) = React.useState(() => true);
  React.useEffect1(
    () => {
      let opt = divRef |> React.Ref.current |> Js.Nullable.toOption;
      switch (opt) {
      | Some(ref) => setDot(_ => clientHeight(ref) > 500.)
      | None => ()
      };
      None;
    },
    [||],
  );

  let (linkCopied, setLinkCopied) = React.useState(() => false);

  React.useEffect4(
    () => {
      setLinkCopied(_ => false);
      None;
    },
    (timeline, scale, locations, threshold),
  );

  <div
    ref={ReactDOMRe.Ref.domRef(divRef)}
    className="max-h-screen flex-1 flex flex-col justify-center flex-basis-100">
    <div className="flex-1 min-h-400 max-h-600 flex-basis-100">
      <R.ResponsiveContainer
        minHeight=400. height={pct(100.)} width={pct(100.)}>
        <R.LineChart
          margin={"top": 20, "right": 50, "bottom": 20, "left": 0} data>
          <R.CartesianGrid strokeDasharray="3 3" />
          growthBaseline
          {Js.Array.map(
             ({Location.id, primaryColor}) => {
               <R.Line
                 key=id
                 name=id
                 _type=`monotone
                 dataKey={item => {
                   switch (item.Data.values(id)) {
                   | Some(x) when x.Data.numberOfCases != 0 =>
                     switch (chartType) {
                     | Filters.NumberOfCases =>
                       Js.Null.return(R.Line.int(x.numberOfCases))
                     | Filters.PercentageGrowthOfCases =>
                       Js.Null.return(R.Line.float(x.growth))
                     }
                   | _ => Js.Null.empty
                   }
                 }}
                 stroke=primaryColor
                 strokeWidth=2.
                 dot={
                   dot
                     ? Dot.obj({
                         "r": 3,
                         "strokeWidth": 0,
                         "fill": primaryColor,
                       })
                     : Dot.bool(false)
                 }
                 activeDot={Dot.obj({
                   "strokeWidth": 2,
                   "fill": Colors.colors##white,
                   "stroke": primaryColor,
                 })}
               />
             },
             locations,
           )
           |> Js.Array.reverseInPlace
           |> React.array}
          <R.Tooltip
            content={({R.Tooltip.payload, label, separator}) => {
              switch (Js.Null.toOption(payload)) {
              | Some(payload) =>
                <div
                  className="tooltip flex flex-col bg-white shadow-lg border-solid border border-lightgrayblue rounded p-2">
                  <span className="text-base font-bold">
                    {React.string(formatLabel(label))}
                  </span>
                  {payload
                   |> Js.Array.filter(payload =>
                        payload.R.Tooltip.name !== "daily-growth-indicator"
                      )
                   |> Js.Array.map(payload => {
                        <span
                          className="text-base font-bold"
                          key={payload.R.Tooltip.name}>
                          <span
                            style={ReactDOMRe.Style.make(
                              ~color=payload.stroke,
                              (),
                            )}>
                            {React.string(payload.name)}
                          </span>
                          {switch (chartType) {
                           | Filters.NumberOfCases =>
                             let growthString =
                               (payload: R.Tooltip.payload).payload.Data.values(
                                 payload.R.Tooltip.name,
                               )
                               |> Js.Option.map((. {Data.growth}) => {
                                    " (+"
                                    ++ (growth *. 100. |> Js.Float.toFixed)
                                    ++ "%)"
                                  })
                               |> Js.Option.getWithDefault("");
                             <>
                               {React.string(
                                  separator
                                  ++ Js.Int.toString(
                                       R.Line.toInt(payload.value),
                                     ),
                                )}
                               <span className="text-base font-normal">
                                 {React.string(growthString)}
                               </span>
                             </>;
                           | Filters.PercentageGrowthOfCases =>
                             React.string(
                               separator
                               ++ "+"
                               ++ (
                                 R.Line.toFloat(payload.value)
                                 *. 100.
                                 |> Js.Float.toFixed
                               )
                               ++ "%",
                             )
                           }}
                        </span>
                      })
                   |> React.array}
                </div>
              | None => React.null
              }
            }}
          />
          <R.XAxis
            minTickGap=70.
            interval="preserveStartEnd"
            dataKey={item =>
              switch (item.Data.x) {
              | Day(int) => R.XAxis.int(int)
              | Date(date) =>
                R.XAxis.string(Js.Date.toLocaleDateString(date))
              }
            }
            padding={"left": 0, "right": 30}
            axisLine=false
            tickLine=false>
            {switch (timeline) {
             | Filters.RelativeToThreshold =>
               let value =
                 "Number of days since "
                 ++ ordinalSuffix(threshold)
                 ++ " case";
               <R.Label
                 style={"fontWeight": "bold", "fontSize": "14px"}
                 value
                 position="insideTop"
                 offset=30.
               />;
             | _ => React.null
             }}
          </R.XAxis>
          <R.YAxis
            axisLine=false
            tickLine=false
            _type=`number
            scale={
              switch (chartType, scale) {
              | (Filters.NumberOfCases, Filters.Logarithmic) => `log
              | _ => `linear
              }
            }
            domain=("dataMin" |> R.YAxis.string, "dataMax" |> R.YAxis.string)
            tickFormatter={x =>
              switch (chartType) {
              | Filters.NumberOfCases => Js.Int.toString(R.Line.toInt(x))
              | Filters.PercentageGrowthOfCases =>
                (R.Line.toFloat(x) *. 100. |> Js.Float.toFixed) ++ "%"
              }
            }
          />
        </R.LineChart>
      </R.ResponsiveContainer>
      <div className="pl-4">
        <button
          onClick={_ => {
            setLinkCopied(_ => true);
            CopyToClipboard.copy(Window.window.location.href);
          }}
          className={
            "border border-activeblue text-activeblue text-base px-2 py-1 rounded hover:bg-activeblue hover:text-white "
            ++ (linkCopied ? "text-white bg-activeblue" : "")
          }>
          {React.string(
             linkCopied
               ? "Link copied to clipboard" : "Copy link to current chart",
           )}
        </button>
      </div>
    </div>
  </div>;
};
