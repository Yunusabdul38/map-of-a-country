const inputs = document.querySelector(".inputs");
const countryName = document.querySelector("h3");
const countryLogo = document.querySelector("img");
const inputValue = document.querySelector("input");
const mapContainer = document.querySelector(".map");
const btn = document.querySelector(".btn");
let map;
const container = document.querySelector(".container");
const html = ` <section class="map" id="map"></section>`;
container.insertAdjacentHTML("beforeend", html);
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
let styleNumber
//console.log(v[2][1]);

async function country(name, style=0) {
  try {
    
    const request = await fetch(`https:restcountries.com/v3.1/name/${name}`);
    if (!request.ok) {
      throw new Error(
        `(${request.status}) Unable to display map with the country name ${name} check the name and try again`
      );
    }
    container.lastChild.remove();
    container.insertAdjacentHTML("beforeend", html);
    const [response] = await request.json();
    const { latlng } = await response.capitalInfo;
    const [lat, lng] = await latlng;
    //map.remove()
    // countryLogo.src = response.flags.svg;
    // countryName.textContent = response.name.common;
    // response.flags.alt
    //   ? (countryLogo.alt = response.flags.alt)
    //   : (countryLogo.alt = `flag of ${name}`);
    map = await L.map("map").setView([lat, lng], 13);
    let styleValue = map_style[style];
    const tile=await L.tileLayer(styleValue[0], styleValue[1]).addTo(map);
    countryLogo.src = response.flags.svg;
    countryName.textContent = response.name.common;
    response.flags.alt
      ? (countryLogo.alt = response.flags.alt)
      : (countryLogo.alt = `flag of ${name}`);

    //console.log(map,mapContainer);
    L.marker([lat, lng]).addTo(map).bindPopup(`Capital of ${name}`).openPopup();
  } catch (err) {
    console.log(err);
    
    mapContainer.insertAdjacentText("beforeend", err);
  }
}
inputValue.value = "";
let countryValue='nigeria'
btn.addEventListener("click", () => {
  countryValue = inputValue.value;
  if (!countryValue) return;
  country(countryValue);
});
inputValue.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    countryValue = inputValue.value;
    if (!countryValue) return;
    country(countryValue);
  }
});
document.querySelector(".map_style").addEventListener("click", (e) => {
  if(e.target.classList.contains("box")){
    const id = +e.target.dataset.id
    country(countryValue,id)
    
  }
});
country(countryValue);
// mint();
