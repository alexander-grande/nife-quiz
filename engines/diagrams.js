// ============================================================
// SYSTEM DIAGRAM DATA
// Each blank: x/y = position of the blank on the image (% of
// image width/height), label = display answer, accept = extra
// accepted spellings/abbreviations (normalized matching).
// Source: "Fill In Systems" templates + labeled figures from
// NAVAVSCOLSCOM-SG-200 (Figs 3.5-11, 3.6-8, 3.7-4, lubrication).
// ============================================================
const DIAGRAMS = {

  hydraulic: {
    name: "Hydraulic System",
    figure: "Figure 3.5-11",
    img: "img/hydraulic.png",
    blanks: [
      {x:15.5, y:34.5, label:"Pressurized Reservoir", accept:["reservoir"]},
      {x:5.5,  y:47.5, label:"Pump", accept:["hydraulic pump"]},
      {x:4.0,  y:63.0, label:"Check Valve", accept:[]},
      {x:27.0, y:82.5, label:"Pressure Regulator / Unloader Valve — Constant Displacement", accept:["pressure regulator","unloader valve","pressure regulator unloader valve","pressure regulator or unloader valve","constant displacement"]},
      {x:38.0, y:16.0, label:"Bypass", accept:[]},
      {x:38.5, y:34.5, label:"Filter", accept:[]},
      {x:39.5, y:44.0, label:"Pressure Relief Valve", accept:["relief valve"]},
      {x:58.5, y:51.5, label:"Accumulator", accept:[]},
      {x:69.0, y:57.5, label:"Pressure Gauge", accept:[]},
      {x:42.5, y:82.0, label:"Low Pressure Switch", accept:[]},
      {x:94.0, y:45.0, label:"Selector Valve", accept:[]},
      {x:83.5, y:79.0, label:"Hydraulic Fuse", accept:["fuse"]},
      {x:79.0, y:93.5, label:"Actuating (Cylinder)", accept:["actuating","actuating cylinder"]}
    ]
  },

  electrical: {
    name: "Electrical System",
    figure: "Figure 3.6-8",
    img: "img/electrical.png",
    blanks: [
      {x:28.5, y:35.0, label:"DC Starter/Generator", accept:["starter generator","dc starter generator","starter"]},
      {x:43.5, y:38.0, label:"Engine Accessory Gearbox", accept:["accessory gearbox","accessory gear box","agb","engine accessory gear box"]},
      {x:58.5, y:36.5, label:"Constant Speed Drive", accept:["csd"]},
      {x:74.5, y:36.0, label:"AC Generator / Alternator", accept:["generator","alternator","generator alternator","ac generator"]},
      {x:10.5, y:55.5, label:"Secondary (DC 28V Bus)", accept:["secondary","secondary bus","secondary dc bus"]},
      {x:23.0, y:55.5, label:"Primary (DC 28V Bus)", accept:["primary","primary bus","primary dc bus"]},
      {x:35.5, y:55.5, label:"Essential (DC 28V Bus)", accept:["essential","essential bus","essential dc bus"]},
      {x:67.0, y:55.5, label:"Essential (AC 115V Bus)", accept:["essential","essential bus","essential ac bus"]},
      {x:79.5, y:55.5, label:"Primary (AC 115V Bus)", accept:["primary","primary bus","primary ac bus"]},
      {x:93.5, y:55.5, label:"Secondary (AC 115V Bus)", accept:["secondary","secondary bus","secondary ac bus"]},
      {x:52.5, y:60.5, label:"Transformer Rectifier", accept:["tr","transformer rectifier tr"]},
      {x:55.5, y:75.5, label:"Inverter", accept:[]},
      {x:13.5, y:73.0, label:"Starter (Bus)", accept:["starter","starter bus"]},
      {x:33.0, y:84.0, label:"Battery", accept:[]},
      {x:20.5, y:84.0, label:"DC (External Power Supply)", accept:["dc"]}
    ]
  },

  fuel: {
    name: "Fuel System",
    figure: "Figure 3.7-4",
    img: "img/fuel.png",
    blanks: [
      {x:11.0, y:28.3, label:"Secondary Manifold", accept:["secondary"]},
      {x:28.5, y:27.5, label:"Primary Manifold", accept:["primary"]},
      {x:44.5, y:22.0, label:"Spray Bars", accept:["spray bar"]},
      {x:21.0, y:37.0, label:"Pressurizing and Dump Valve", accept:["p and d valve","pd valve","pressurizing dump valve","p d valve"]},
      {x:17.5, y:52.0, label:"Fuel-Oil Heat Exchanger", accept:["fuel oil cooler","fuel oil heat exchanger"]},
      {x:36.0, y:46.0, label:"Afterburner Fuel Control", accept:["ab fuel control"]},
      {x:41.5, y:54.0, label:"Transfer Valve", accept:[]},
      {x:29.5, y:63.0, label:"Engine Driven Fuel Pump", accept:["engine driven pump","main fuel pump"]},
      {x:56.5, y:52.0, label:"Bypass", accept:[]},
      {x:55.5, y:70.0, label:"Low Pressure Filter", accept:["low pressure fuel filter"]},
      {x:68.5, y:46.0, label:"Pressure Gauge", accept:[]},
      {x:76.0, y:39.0, label:"Emergency Fuel Shut Off Handle & Valve", accept:["emergency fuel shutoff handle and valve","emergency shutoff handle","emergency fuel shutoff","emergency fuel shut off handle and valve"]},
      {x:86.5, y:57.0, label:"Boost Pump", accept:[]},
      {x:34.0, y:79.0, label:"Fuel Control Unit", accept:["fcu"]},
      {x:18.5, y:74.0, label:"Flowmeter", accept:["flow meter"]},
      {x:9.0,  y:86.0, label:"Fuel Flow Gauge", accept:["fuel flow"]},
      {x:63.0, y:84.0, label:"Power Control Lever (PCL)", accept:["pcl","power control lever"]},
      {x:42.5, y:97.0, label:"Normal/Emergency Control Switch", accept:["normal emergency switch","normal emergency control switch"]}
    ]
  },

  lubrication: {
    name: "Lubrication System",
    figure: "Lubrication System",
    img: "img/lubrication.png",
    blanks: [
      {x:38.0, y:13.5, label:"Reservoir", accept:["oil reservoir","oil tank"]},
      {x:59.5, y:16.3, label:"Breather Pressurizing Valve", accept:["breather valve"]},
      {x:33.0, y:41.8, label:"Pressure Pump", accept:[]},
      {x:45.5, y:40.4, label:"Pressure & Temp Gauge", accept:["pressure and temp gauge","pressure and temperature gauge","pressure temp gauge"]},
      {x:44.0, y:58.2, label:"Filter", accept:["oil filter"]},
      {x:33.7, y:68.5, label:"Bypass", accept:[]},
      {x:44.0, y:77.0, label:"Oil Pressure Relief Valve", accept:["pressure relief valve","relief valve"]},
      {x:22.0, y:72.6, label:"Temp Reg Valve", accept:["temperature regulating valve","oil temperature regulating valve","temp regulating valve"]},
      {x:15.5, y:42.3, label:"Fuel Temp Switch", accept:["fuel temperature switch","fuel temperature sensing switch","fuel temp sensing switch"]},
      {x:66.0, y:75.5, label:"Accessory Gear Box (AGB)", accept:["agb","accessory gearbox","accessory gear box"]},
      {x:76.0, y:68.5, label:"Chip Detector", accept:["chip detectors"]},
      {x:63.0, y:96.5, label:"Scavenge Pump", accept:[]},
      {x:36.0, y:88.0, label:"Air-Oil Cooler", accept:["air oil cooler"]}
    ]
  }
};
