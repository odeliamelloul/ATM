import axios from "./node_modules/@bundled-es-modules/axios/axios.js";
import {DataTable} from "./node_modules/simple-datatables/dist/module/index.js"
const table = document.querySelector("#myTable");
let selectorMapElement = document.querySelector("#gmap_canvas");
let dataTable
 let allData
const res = axios.get(  "https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&limit=4000")
.then((res) => {
    const header = drawTitles(res.data.result.fields);
    tableBody.innerHTML = `<tr scope="row">${header}</tr>`;
    allData=res.data.result.records
    drawTable(allData);
    dataTable = new DataTable(table); 
  })
  .catch((err) => console.log(`error: ${err}`));

let titles = document.querySelector("tr#table-titles");
let tableBody = document.querySelector("tbody#table-body");

const drawTitles = (allTitles) => {
  let row = "";
  allTitles.forEach((curTitle) => {
    if(curTitle.id!=="ATM_Address_Extra")
    row += `<th scope="col">${curTitle.id}</th>`;
  });
  titles.innerHTML = row;
};

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
    if(col!=="ATM_Address_Extra")
    row += `<td class="${col}">${rowProps[col]}</td>`;
  }
  return row;
};

//--------------------------google map--------------------------------

let myOptions = {
  zoom: 7,
  center: new google.maps.LatLng(32.4528759,37.9159274),
  mapTypeId: google.maps.MapTypeId.ROADMAP,
};
let map = new google.maps.Map(selectorMapElement, myOptions);
// google.maps.event.addDomListener(window, "load", init_map);

function init_map(name,num, address, x, y) {
  
  let infowindow = new google.maps.InfoWindow({
        content: `
        <strong>שם: ${name} </strong>
        <br> מספר : ${num}
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
// ------------------with dataTable.searchData------------


setTimeout(function(){
  let search = document.querySelectorAll(".dataTable-input")[0];

  search.onkeyup = function(){
    
    document.querySelector("#gmap_canvas").innerHTML = "";
    map = new google.maps.Map(selectorMapElement, myOptions);

      for(var i=0;i<dataTable.searchData.length;i++)
        drawOnMap(allData[dataTable.searchData[i]])

       
}}, 5000);


const drawOnMap = (Content) => {
  let x=Content["X_Coordinate"]
  let y=Content["Y_Coordinate"]
  let num = Content["Atm_Num"]
  let name=Content["Bank_Name"]
  let adress=Content["ATM_Address"]

    if ( isFinite(x) &&isFinite(y) && x !== 0 && y !== 0 ) {
      if (x > 32 && y < 34) {
        init_map(name,num,adress,y,x)
      } 
      else {
        init_map(name,num,adress,x,y)
      }
    }
  
};
//------------------with dataTable.pages------------
// let filter=[]

// setTimeout(function(){
//   let search = document.querySelectorAll(".dataTable-input")[0];
//   search.onkeyup = function(){ 
//     document.querySelector("#gmap_canvas").innerHTML = "";
//     map = new google.maps.Map(selectorMapElement, myOptions);

//     filter=[]

//     for (let pageNum=0;pageNum<dataTable.pages.length;pageNum++)
//     {
//       for (var i=0;i<dataTable.pages[pageNum].length;i++)
//         filter.push(dataTable.pages[0][i].cells)  
//     }
//     if(filter.length===100 && search.value!=="13")
//      filter=[]

//     for (var i=0;i<filter.length;i++){
//        drawOnMap(filter[i]);
//     }
    
// }}, 3000);

// const drawOnMap = (Content) => {

//   let x,y,name,num,adress

//   for (let i = 0; i < Content.length; i++) {
//     switch(Content[i].className)
//     {
//       case "X_Coordinate" :
//          x=Content[i].innerText
//          break;
//       case "Y_Coordinate" :
//           y=Content[i].innerText
//           break;
//       case "Bank_Name" :
//           name=Content[i].innerText
//           break;
//       case "Atm_Num" :
//            num=Content[i].innerText
//             break;
//       case "ATM_Address" :
//             adress=Content[i].innerText
//             break;
//       default:
//         break;
//     }
//   }
//   if (x > 32 && y < 34) {
//     init_map(name,num,adress,y,x);
//   } else {
//     init_map(name,num,adress,x,y);
//   }

// };
