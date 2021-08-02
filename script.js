
import axios from "./node_modules/@bundled-es-modules/axios/axios.js";
import { DataTable} from "./node_modules/simple-datatables/dist/module/index.js"
const table = document.querySelector("#myTable");
let selectorMapElement = document.querySelector("#gmap_canvas");

const res = axios
  .get(
    "https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&limit=100"
  )
  .then((res) => {
    const header = drawTitles(res.data.result.fields);
    tableBody.innerHTML = `<tr scope="row">${header}</tr>`;
    drawTable(res.data.result.records);
    drawOnMap(res.data.result.records);
    const dataTable = new DataTable(table);
  })
  .catch((err) => console.log(`error: ${err}`));

let titles = document.querySelector("tr#table-titles");
let tableBody = document.querySelector("tbody#table-body");

const drawTable = (Content) => {
  let dataRows = "";
  for (let i = 0; i < Content.length; i++) {
    let curRow = drawSingleRow(Content[i]);
    dataRows += `<tr scope="row">${curRow}</tr>`;
  }
  tableBody.innerHTML = dataRows;
};

const drawSingleRow = (rowProps) => {
  let row = "";
  for (let col in rowProps) {
    row += `<td>${rowProps[col]}</td>`;
  }
  return row;
};

const drawTitles = (allTitles) => {
  let row = "";
  allTitles.forEach((curTitle) => {
    row += `<th scope="col">${curTitle.id}</th>`;
  });
  titles.innerHTML = row;
};

//--------------------------google map--------------------------------

const drawOnMap = (Content) => {
  for (let i = 0; i < Content.length; i++) {
    if (
      isFinite(Content[i].X_Coordinate) &&
      isFinite(Content[i].Y_Coordinate) &&
      Content[i].X_Coordinate !== 0 &&
      Content[i].Y_Coordinate !== 0
    ) {
      if (Content[i].X_Coordinate > 32 && Content[i].Y_Coordinate < 34) {
        init_map(
          Content[i].Bank_Name,
          Content[i].Atm_Num,
          Content[i].ATM_Address,
          Content[i].Y_Coordinate,
          Content[i].X_Coordinate
        );
      } else {
        init_map(
          Content[i].Bank_Name,
          Content[i].Atm_Num,
          Content[i].ATM_Address,
          Content[i].X_Coordinate,
          Content[i].Y_Coordinate
        );
      }
    }
  }
};
const myOptions = {
  zoom: 8,
  center: new google.maps.LatLng(31.4037193, 33.9606947),
  mapTypeId: google.maps.MapTypeId.ROADMAP,
};
const map = new google.maps.Map(selectorMapElement, myOptions);

function init_map(name,num, address, x, y) {
  let infowindow = new google.maps.InfoWindow({
    content: `
        <strong>שם: ${name} </strong>
        <br> ATM ${num}
        <br> כתובת: ${address} 
      `,
  });
  let marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(x, y),
  });
  google.maps.event.addListener(marker, "click", function () {
    infowindow.open(map, marker);
  });
}

google.maps.event.addDomListener(window, "load", init_map);
