const inputs = document.querySelector(".inputs");
const countryName = document.querySelector("h3");
const countryLogo = document.querySelector("img");
const inputValue = document.querySelector("input");
const preloader = document.querySelector(".preloader");
const btn = document.querySelector(".btn");
const container = document.querySelector(".container");
const html = ` <section class="map" id="map"></section>`;
container.insertAdjacentHTML("beforeend", html);

// map style variable from openStreet map
const map_style = [
  [
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  ],
  [
    "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ],
  [
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    },
  ],
  [
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
  ],
];

// async Ajax call
async function country(name, style=0) {
  try {
    // fetch request for name of a country using rest country api
    const request = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    //remove map countainer when ever we try(call this function) to re initialized map element
    container.lastChild.remove();

    //adding map html element back
    container.insertAdjacentHTML("beforeend", html);
    // if request failed 
    if (!request.ok) {
      throw new Error(
        `(${request.status}) Unable to display map with the country name ${name} check the name and try again`
      );
    }
    Preloader()
    const [response] = await request.json();
    const { latlng } = await response.capitalInfo;
    map = await L.map("map").setView(latlng, 13);
    //map tilelayer style from map_style variable
    let styleValue = map_style[style];
    //adding map tilelayer
    const tile=await L.tileLayer(styleValue[0], styleValue[1]).addTo(map);
    // remove preloader after tilelayer finish loading
    tile.addEventListener("load",function(){
      preloader.style.display="none"
      container.style.filter="blur(0px)"     
    })
    // adding the country name, logo and atl
    countryLogo.src = response.flags.svg;
    countryName.textContent = response.name.common;
    response.flags.alt
      ? (countryLogo.alt = response.flags.alt)
      : (countryLogo.alt = `flag of ${name}`);
    //adding marker to the coordinate of the country capital
    L.marker(latlng).addTo(map).bindPopup(`Capital of ${name}`).openPopup();

    // catching error
  } catch (err) {
    console.log(err);
    alert(err);
  }
}
inputValue.focus()
inputValue.value = "";
//default country name Onload
let countryValue='nigeria'

//button event
btn.addEventListener("click", () => {
  countryValue = inputValue.value;
  if (!countryValue) return;
  country(countryValue);
});
function Preloader(){
  container.style.filter="blur(8px)"
  preloader.style.display="block"
}
// input event 
inputValue.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    countryValue = inputValue.value;
    if (!countryValue) return;
    country(countryValue);
  }
});
//map tilelayer styles events onClick
document.querySelector(".map_style").addEventListener("click", (e) => {
  if(e.target.classList.contains("box")){
    const id = +e.target.dataset.id
    country(countryValue,id)
    
  }
});
country(countryValue);