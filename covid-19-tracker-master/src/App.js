import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./infoBox";
import Map from "./map";
import Table from "./Table";
import "./util";
import { sortData, prettyCardStats } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
// import './index.css'

//API => https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("world");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountry, setMapCountry] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //useEffect is a very powerful hook that runs a code for a condition
  useEffect(() => {
    // the code inside will runs once when the components will be load at the begining !
    //async -> request for data , wait until it lodes =======
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => {
            return {
              name: country.country,
              value: country.countryInfo.iso2,
            };
          });
          setCountries(countries);
          setMapCountry(data);
          const sortedCountriesTable = sortData(data);
          setTableData(sortedCountriesTable);
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    //world stats -->
    //https://disease.sh/v3/covid-19/countries/all
    //country stats by country code -->
    //https://disease.sh/v3/covid-19/countries/[country code]

    const url =
      countryCode === "world"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //data's from country responce
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* header */}
        <div className="app__header">
          <h1 className="app__title">Covid19 Tracker</h1>
          {/* Title + input dropdown */}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
              fullWidth
              size="small"
            >
              <MenuItem value="world">World</MenuItem>
              {countries.map((country, index) => {
                return (
                  <MenuItem value={country.value} key={index}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* infobox coronavirus cases*/}
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            active={casesType === 'cases'}
            isRed
            title="Cases"
            cases={prettyCardStats(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0,0")}
          />
          {/* infobox corona virus active cases*/}
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            active={casesType === 'recovered'}
            title="Recovered"
            cases={prettyCardStats(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0,0")}
          />
          {/* infobox corona virus total deaths*/}
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            active={casesType === 'deaths'}
            isRed
            title="Deaths"
            cases={prettyCardStats(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0,0")}
          />
        </div>
        {/* map */}
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountry}
          casesType={casesType}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* table */}
          <h3>Live Cases by country</h3>
          <Table countries={tableData} />
          {/* graph */}
          <h3>Worldwide new {casesType.charAt(0).toUpperCase() + casesType.slice(1)}</h3>
          <LineGraph casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
