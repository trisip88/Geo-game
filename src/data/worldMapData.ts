export interface LandPath {
  id: string;
  name: string;
  fill: string;
  path: string;
}

// Equirectangular projection path data calibrated for 1000 x 500 SVG
// Coordinate mapper: x = (lon + 180)/360 * 1000, y = (90 - lat)/180 * 500
export const WORLD_LAND_PATHS: LandPath[] = [
  {
    id: 'north-america',
    name: 'North America',
    fill: '#312e81',
    path: `M 180,60 
      L 155,75 L 140,95 L 165,115 L 185,120 L 205,140 L 230,145 L 245,170 
      L 255,190 L 280,205 L 295,225 L 305,250 L 315,260 L 320,250 L 310,240 
      L 315,220 L 335,215 L 340,195 L 330,175 L 325,160 L 335,145 L 315,135 
      L 305,110 L 290,95 L 265,80 L 230,70 L 200,65 Z
      M 160,80 L 130,85 L 115,100 L 125,120 L 145,115 L 160,95 Z`
  },
  {
    id: 'greenland',
    name: 'Greenland',
    fill: '#312e81',
    path: `M 380,45 L 430,55 L 450,75 L 435,105 L 400,120 L 375,100 L 365,70 Z`
  },
  {
    id: 'south-america',
    name: 'South America',
    fill: '#1e1b4b',
    path: `M 305,265 L 330,260 L 360,275 L 390,295 L 400,320 L 385,360 L 365,395 
      L 350,430 L 335,465 L 325,455 L 335,410 L 330,365 L 300,320 L 290,285 Z`
  },
  {
    id: 'eurasia',
    name: 'Eurasia',
    fill: '#3730a3',
    path: `M 490,90 L 515,80 L 540,75 L 580,75 L 630,70 L 690,65 L 750,65 L 810,70 
      L 860,85 L 900,80 L 930,95 L 960,110 L 975,135 L 950,150 L 920,165 L 890,175 
      L 870,210 L 850,235 L 830,260 L 810,250 L 795,230 L 775,225 L 755,240 
      L 730,260 L 705,240 L 680,210 L 640,210 L 600,225 L 560,250 L 535,240 
      L 515,220 L 485,210 L 470,185 L 480,160 L 465,135 L 475,110 Z`
  },
  {
    id: 'africa',
    name: 'Africa',
    fill: '#1e1b4b',
    path: `M 470,185 L 500,180 L 530,195 L 565,190 L 600,215 L 620,245 L 645,260 
      L 620,290 L 610,330 L 590,370 L 570,400 L 545,400 L 535,365 L 515,320 
      L 485,280 L 460,250 L 450,210 Z`
  },
  {
    id: 'australia',
    name: 'Australia',
    fill: '#312e81',
    path: `M 810,310 L 845,305 L 880,320 L 900,350 L 885,385 L 850,400 L 815,380 
      L 790,340 Z`
  },
  {
    id: 'britain-ireland',
    name: 'British Isles',
    fill: '#3730a3',
    path: `M 470,115 L 485,120 L 480,145 L 465,140 Z M 455,130 L 465,130 L 460,145 L 450,140 Z`
  },
  {
    id: 'japan',
    name: 'Japan',
    fill: '#3730a3',
    path: `M 885,160 L 900,175 L 890,200 L 875,190 Z`
  },
  {
    id: 'indonesia-seasia',
    name: 'Southeast Asian Archipelagos',
    fill: '#3730a3',
    path: `M 765,270 L 795,275 L 780,290 Z M 800,285 L 825,285 L 815,300 Z M 850,280 L 875,285 L 860,300 Z M 815,245 L 830,255 L 820,270 Z`
  },
  {
    id: 'madagascar',
    name: 'Madagascar',
    fill: '#1e1b4b',
    path: `M 625,325 L 635,335 L 625,370 L 615,355 Z`
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    fill: '#312e81',
    path: `M 960,390 L 975,410 L 965,430 L 950,415 Z`
  },
  {
    id: 'iceland',
    name: 'Iceland',
    fill: '#3730a3',
    path: `M 435,80 L 455,80 L 450,95 L 430,90 Z`
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    fill: '#1e1b4b',
    path: `M 200,470 L 350,455 L 500,465 L 650,455 L 800,465 L 950,470 L 1000,480 L 1000,500 L 0,500 L 0,480 Z`
  }
];

export const GRATICULE_PARALLELS = [
  { lat: 60, y: 83.3, label: '60°N' },
  { lat: 30, y: 166.7, label: '30°N' },
  { lat: 0, y: 250, label: 'Equator', isEquator: true },
  { lat: -30, y: 333.3, label: '30°S' },
  { lat: -60, y: 416.7, label: '60°S' },
];

export const GRATICULE_MERIDIANS = [
  { lon: -150, x: 83.3, label: '150°W' },
  { lon: -120, x: 166.7, label: '120°W' },
  { lon: -90, x: 250, label: '90°W' },
  { lon: -60, x: 333.3, label: '60°W' },
  { lon: -30, x: 416.7, label: '30°W' },
  { lon: 0, x: 500, label: '0°', isPrimeMeridian: true },
  { lon: 30, x: 583.3, label: '30°E' },
  { lon: 60, x: 666.7, label: '60°E' },
  { lon: 90, x: 750, label: '90°E' },
  { lon: 120, x: 833.3, label: '120°E' },
  { lon: 150, x: 916.7, label: '150°E' },
];
