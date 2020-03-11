let pathToDataCsv = Sys.argv[1];

let csv = Csv.load(pathToDataCsv);

let createId = (country, provinceOrState) =>
  if (String.length(provinceOrState) === 0) {
    country;
  } else {
    country ++ " (" ++ provinceOrState ++ ")";
  };

let locations =
  Csv.sub(~r=1, ~c=0, ~cols=2, ~rows=Csv.lines(csv) - 1, csv)
  |> Csv.to_array
  |> Array.map(
       fun
       | [|provinceOrState, country|]
           when String.length(provinceOrState) === 0 => {
           let id = createId(country, provinceOrState);
           (
             id,
             `Assoc([
               ("country", `String(country)),
               ("name", `String(id)),
             ]),
           );
         }
       | [|provinceOrState, country|] => {
           let id = createId(country, provinceOrState);
           (
             id,
             `Assoc([
               ("country", `String(country)),
               ("provinceOrState", `String(provinceOrState)),
               ("name", `String(id)),
             ]),
           );
         }
       | _ => invalid_arg("Unknown format"),
     );

Yojson.Basic.to_file(Sys.argv[2], `Assoc(locations |> Array.to_list));

let days = {
  (
    Csv.sub(~r=0, ~c=4, ~cols=Csv.columns(csv) - 4, ~rows=1, csv)
    |> Csv.to_array
  )[0]
  |> Array.map(x => `String(x));
};

Yojson.Basic.to_file(Sys.argv[3], `List(days |> Array.to_list));

let data = {
  Csv.Rows.load(~has_header=true, pathToDataCsv)
  |> List.map(row =>
       switch (Csv.Row.to_assoc(row)) {
       | [
           ("Province/State", provinceOrState),
           ("Country/Region", country),
           _lat,
           _lon,
           ...rest,
         ] =>
         let id = createId(country, provinceOrState);
         (
           id,
           `Assoc(
             rest |> List.map(((key, value)) => (key, `String(value))),
           ),
         );
       | _ => invalid_arg("")
       }
     );
};

Yojson.Basic.to_file(Sys.argv[4], `Assoc(data));
