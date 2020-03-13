open BsRecharts;

type domain;
external int_to_domain: int => domain = "%identity";
external string_to_domain: string => domain = "%identity";
[@bs.get] external clientHeight: Dom.element => float = "clientHeight";
external castData: array('a) => array(Js.Dict.t(int)) = "%identity";

let calculateMaxValue = (locations, data) => {
  Js.Array.reduce(
    (maxValue, row) => {
      Js.Array.reduce(
        (maxValue, location) => {
          switch (Js.Dict.get(row, location.ReactSelect.label)) {
          | Some(x) => Js.Math.max_int(maxValue, x)
          | None => maxValue
          }
        },
        maxValue,
        locations,
      )
    },
    1,
    castData(data),
  );
};

[@react.component]
let make = (~data, ~color, ~locations, ~scale, ~threshold, ~formatLabel) => {
  let divRef = React.useRef(Js.Nullable.null);
  let domain =
    Some([|
      if (threshold === 0) {
        1 |> int_to_domain;
      } else {
        threshold |> int_to_domain;
      },
      calculateMaxValue(locations, data) |> int_to_domain,
    |]);
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
  <div ref={ReactDOMRe.Ref.domRef(divRef)} className="max-h-screen flex-1">
    <ResponsiveContainer minHeight=400 height={Prc(100.)} width={Prc(100.)}>
      <LineChart
        margin={"top": 20, "right": 50, "bottom": 20, "left": 0} data>
        {Js.Array.map(
           ({ReactSelect.label: dataKey}) =>
             <Line
               key=dataKey
               _type=`monotone
               dataKey
               stroke={color(dataKey)}
               strokeWidth=2
               dot
             />,
           locations,
         )
         |> React.array}
        <Tooltip
          content={data => {
            switch (Js.Null.toOption(data##payload)) {
            | Some(payload) =>
              <div
                className="tooltip flex flex-col border-solid border border-gray-800 rounded p-2">
                <span className="text-gray-200 font-bold"> {React.string(formatLabel(data##label))} </span>
                {Js.Array.map(
                   payload => {
                     <span className="tooltip-label" key=payload##dataKey>
                       <span
                         style={ReactDOMRe.Style.make(
                           ~color=payload##stroke,
                           (),
                         )}>
                         {React.string(payload##name)}
                       </span>
                       {React.string(data##separator ++ payload##value)}
                     </span>
                   },
                   payload,
                 )
                 |> React.array}
              </div>
            | None => React.null
            }
          }}
        />
        <XAxis dataKey="name" padding={"left": 0, "right": 30} />
        <YAxis _type=`number scale ?domain />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  </div>;
};
