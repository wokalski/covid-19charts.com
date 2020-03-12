open BsRecharts;

type domain;
external int_to_domain: int => domain = "%identity";
external string_to_domain: string => domain = "%identity";

[@react.component]
let make = (~data, ~color, ~locations, ~scale, ~threshold) => {
  let domain =
    switch (scale) {
    | `log =>
      Some([|
        if (threshold === 0) {
          "dataMin" |> string_to_domain;
        } else {
          threshold |> int_to_domain;
        },
        "dataMax" |> string_to_domain,
      |])
    | _ => None
    };
  <div className="flex-1">
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
             />,
           locations,
         )
         |> React.array}
        <Tooltip
          content={data => {
            <div
              className="tooltip flex flex-col border-solid border border-gray-800 rounded p-2">
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
                 data##payload,
               )
               |> React.array}
            </div>
          }}
        />
        <XAxis dataKey="name" padding={"left": 0, "right": 30} />
        <YAxis scale ?domain />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  </div>;
};
