let pathToDataCsv = Sys.argv[1];

let csv = Csv.load(pathToDataCsv);

let createId = (country, provinceOrState) =>
  if (String.length(provinceOrState) === 0) {
    country;
  } else {
    country ++ " (" ++ provinceOrState ++ ")";
  };

module StringSet = Set.Make(String);

let locationRows =
  Csv.sub(~r=1, ~c=0, ~cols=2, ~rows=Csv.lines(csv) - 1, csv) |> Csv.to_array;
let duplicateCountries =
  Array.fold_left(
    ((countries, duplicateCountries)) =>
      fun
      | [|provinceOrState, country|] =>
        if (StringSet.mem(country, countries)) {
          (countries, StringSet.add(country, duplicateCountries));
        } else {
          (StringSet.add(country, countries), duplicateCountries);
        }
      | _ => invalid_arg("Unknown format"),
    (StringSet.empty, StringSet.empty),
    locationRows,
  )
  |> snd;

let locations = {
  (
    duplicateCountries
    |> StringSet.elements
    |> List.map(country => {
         let id = country ++ " (All regions)";
         (
           id,
           `Assoc([("country", `String(country)), ("name", `String(id))]),
         );
       })
  )
  @ (
    locationRows
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
       )
    |> Array.to_list
  );
};

Yojson.Basic.to_file(Sys.argv[2], `Assoc(locations));

let days = {
  (
    Csv.sub(~r=0, ~c=4, ~cols=Csv.columns(csv) - 4, ~rows=1, csv)
    |> Csv.to_array
  )[0]
  |> Array.map(x => `String(x));
};

Yojson.Basic.to_file(Sys.argv[3], `List(days |> Array.to_list));

let data = {
  let rows = Csv.Rows.load(~has_header=true, pathToDataCsv);
  let allRegionsPerCountry = {
    let csv = Csv.transpose(csv);
    let header = (
                   csv
                   |> Csv.sub(~r=1, ~c=0, ~cols=Csv.columns(csv), ~rows=1)
                   |> Csv.to_array
                 )[0];
    let placesByDay =
      csv
      |> Csv.sub(
           ~r=4,
           ~c=0,
           ~cols=Csv.columns(csv),
           ~rows=Csv.lines(csv) - 4,
         )
      |> Csv.associate(header |> Array.to_list);

    List.map(
      country => {
        let id = country ++ " (All regions)";
        let days =
          List.map(
            fun
            | [(_, day), ...values] => {
                let value =
                  List.fold_left(
                    (acc, (currentCountry, value)) =>
                      if (currentCountry == country) {
                        acc + (value |> int_of_string);
                      } else {
                        acc;
                      },
                    0,
                    values,
                  );
                (day, `Int(value));
              }
            | _ => invalid_arg("Unknown format"),
            placesByDay,
          );
        (id, `Assoc(days));
      },
      duplicateCountries |> StringSet.elements,
    );
  };

  (
    rows
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
               rest
               |> List.map(((key, value)) =>
                    (key, `Int(value |> int_of_string))
                  ),
             ),
           );
         | _ => invalid_arg("")
         }
       )
  )
  @ allRegionsPerCountry;
};

Yojson.Basic.to_file(Sys.argv[4], `Assoc(data));
