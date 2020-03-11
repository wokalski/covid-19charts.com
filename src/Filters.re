module Input = {
  type typ =
    | Float(option(float))
    | Number(option(int))
    | Text(string);
  [@react.component]
  let make = (~id, ~value, ~onBlur, ~onChange, ~label) => {
    <input
      className="appearance-none leading-tight focus:outline-none placeholder-dimmed bg-gray-800 rounded-lg overflow-hidden border border-solid border-gray-700 p-2 text-gray-400 text-sm font-light"
      id
      type_={
        switch (value) {
        | Float(_)
        | Number(_) => "number"
        | Text(_) => "text"
        }
      }
      onBlur
      onChange
      value={
        switch (value) {
        | Float(float) =>
          float
          |> Js.Option.map((. int) => Js.Float.toString(int))
          |> Js.Option.getWithDefault("")
        | Number(int) =>
          int
          |> Js.Option.map((. int) => Js.Int.toString(int))
          |> Js.Option.getWithDefault("")
        | Text(text) => text
        }
      }
      placeholder=label
    />;
  };
};

module SegmentedControl = {
  type value('a) = {
    label: string,
    value: 'a,
  };
  module Button = {
    [@react.component]
    let make = (~text, ~isSelected, ~onClick) =>
      <button
        onClick={event => {
          onClick();
          ReactEvent.Mouse.preventDefault(event);
        }}
        className={
          (
            isSelected
              ? "bg-gray-700 text-gray-400" : "bg-gray-800 text-gray-500"
          )
          ++ " text-sm flex-1 py-1 font-light"
        }>
        {React.string(text)}
      </button>;
  };
  [@react.component]
  let make = (~allValues, ~selectedIndex, ~onChange) => {
    <div
      className="flex bg-gray-800 rounded-lg overflow-hidden border border-solid border-gray-700">
      {allValues
       |> Js.Array.mapi(({label, value}, index) =>
            <Button
              key=label
              isSelected={selectedIndex === index}
              onClick={() => onChange(value, index)}
              text=label
            />
          )
       |> React.array}
    </div>;
  };
};

module Header = {
  [@react.component]
  let make = (~title) => {
    <div className="pt-2 pb-1">
      <span className="text-gray-600 text-sm"> {React.string(title)} </span>
    </div>;
  };
};

module Title = {
  [@react.component]
  let make = () => {
    <div>
      <h2 className="text-gray-300 pb-1">
        {React.string("Number of COVID-19 cases per location.")}
      </h2>
      <span className="text-gray-300 text-md pt-3">
        {React.string(
           "The single most important chart to help you understand the COVID-19 outlook for your location.",
         )}
      </span>
    </div>;
  };
};

module Footer = {
  module A = {
    [@react.component]
    let make = (~href, ~str) => {
      <a className="font-bold" href> {React.string(str)} </a>;
    };
  };
  [@react.component]
  let make = () => {
    <div className="py-3 overflow-scroll">
      <div>
        <span className="text-gray-400 text-sm">
          {React.string("Created by ")}
          <A href="https://twitter.com/wokalski" str="Wojtek Czekalski" />
        </span>
      </div>
      <div>
        <span className="text-gray-400 text-sm">
          {React.string("Data provided by ")}
          <A
            href="https://github.com/CSSEGISandData/COVID-19"
            str="CSSE at Johns Hopkins University"
          />
        </span>
      </div>
      <div>
        <span className="text-gray-400 text-sm">
          {React.string("Contribute on ")}
          <A href="https://github.com/wokalski/COVID-19charts" str="Github" />
          {React.string(" or contact the author at: ")}
          <br />
          {React.string("me (at) wczekalski.com")}
        </span>
      </div>
    </div>;
  };
};

type scale =
  | Logarithmic
  | Linear;

type timeline =
  | Day0
  | Dates;

[@react.component]
let make =
    (
      ~locations,
      ~allLocations,
      ~setLocations,
      ~scale as (scale, setScale),
      ~timeline as (timeline, setTimeline),
      ~threshold as (threshold, setThreshold),
    ) => {
  <div className="w-64 p-4">
    <Title />
    <Header title="Locations" />
    <ReactSelect
      defaultValue=locations
      isMulti=true
      name="Locations"
      options=allLocations
      placeholder="Select"
      isClearable=false
      onChange={newSelection => {
        switch (Js.Nullable.toOption(newSelection)) {
        | Some(newSelection) => setLocations(_ => {newSelection})
        | None => setLocations(_ => [||])
        }
      }}
    />
    <Header title="Scale" />
    <SegmentedControl
      allValues=[|
        {SegmentedControl.label: "Logarithmic", value: Logarithmic},
        {SegmentedControl.label: "Linear", value: Linear},
      |]
      selectedIndex={
        switch (scale) {
        | Logarithmic => 0
        | Linear => 1
        }
      }
      onChange={(value, _) => setScale(_ => value)}
    />
    <Header title="Timeline" />
    <SegmentedControl
      allValues=[|
        {SegmentedControl.label: "Align to day 0", value: Day0},
        {SegmentedControl.label: "Dates", value: Dates},
      |]
      selectedIndex={
        switch (timeline) {
        | Day0 => 0
        | Dates => 1
        }
      }
      onChange={(value, _) => setTimeline(_ => value)}
    />
    {switch (timeline) {
     | Day0 =>
       <>
         <Header title="Threshold (# of cases)" />
         <Input
           id="nr_of_cases"
           value={Input.Number(threshold)}
           onBlur=ignore
           onChange={ev => {
             let value =
               ReactEvent.Form.target(ev)##value |> int_of_string_opt;
             setThreshold(_ => value);
           }}
           label="Threshold"
         />
       </>
     | Dates => React.null
     }}
    <Footer />
  </div>;
};
