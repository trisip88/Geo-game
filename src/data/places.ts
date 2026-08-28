import { Place } from '../types';

export const PLACES_BANK: Place[] = [
  {
    id: 'samarkand',
    name: 'Samarkand',
    country: 'Uzbekistan',
    lat: 39.654,
    lon: 66.96,
    wikipediaTitle: 'Samarkand',
    clues: [
      'Landlocked Eurasian oasis basin bordered by arid steppes and the Zeravshan mountain valley.',
      'Key crossroads on the ancient Silk Road, renowned for majolica-tiled madrasas and Gur-e-Amir mausoleum.',
      '14th-century imperial capital of Timur (Tamerlane) featuring the iconic Registan plaza.'
    ],
    cachedExtract:
      'Samarkand is a city in southeastern Uzbekistan and among the oldest continuously inhabited cities in Central Asia. Prospering from its location on the Silk Road between China and the Mediterranean, it was destroyed by Genghis Khan and rebuilt as the capital of the Timurid Empire.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80',
      creator: 'Dan Lundberg / Openverse',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
      sourceUrl: 'https://openverse.org/image/samarkand-registan',
      title: 'Registan Square Madrasahs in Samarkand'
    },
    literatureKeywords: 'samarkand silk road'
  },
  {
    id: 'valletta',
    name: 'Valletta',
    country: 'Malta',
    lat: 35.898,
    lon: 14.514,
    wikipediaTitle: 'Valletta',
    clues: [
      'Compact fortified peninsula jutting into a central Mediterranean natural deepwater harbor.',
      'Founded in 1566 by the Order of St. John following a legendary Ottoman siege.',
      'Europe’s southernmost sovereign capital, renowned for limestone bastions and St. John’s Co-Cathedral.'
    ],
    cachedExtract:
      'Valletta is the tiny capital of the Mediterranean island nation of Malta. The walled city was established in the 1500s on a peninsula by the Knights of St. John, a Roman Catholic order.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
      creator: 'Continentale / Openverse',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Grand Harbour of Valletta from Upper Barrakka'
    },
    literatureKeywords: 'valletta knights malta'
  },
  {
    id: 'ushuaia',
    name: 'Ushuaia',
    country: 'Argentina',
    lat: -54.801,
    lon: -68.303,
    wikipediaTitle: 'Ushuaia',
    clues: [
      'Subpolar oceanic climate on the Beagle Channel, wedged against the southern Martial glacier range.',
      'Former penal colony and indigenous Yaghan territory, now the premier departure port for Antarctic expeditions.',
      'Commonly branded as "El Fin del Mundo" (The End of the World) in Tierra del Fuego.'
    ],
    cachedExtract:
      'Ushuaia is a resort town in Argentina located on the Tierra del Fuego archipelago at the southernmost tip of South America, nicknamed the "End of the World."',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      creator: 'Liam Quinn / Openverse',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Les Eclaireurs Lighthouse, Beagle Channel'
    },
    literatureKeywords: 'tierra del fuego ushuaia'
  },
  {
    id: 'svalbard-longyearbyen',
    name: 'Longyearbyen',
    country: 'Norway',
    lat: 78.223,
    lon: 15.646,
    wikipediaTitle: 'Longyearbyen',
    clues: [
      'High Arctic archipelago settlement located halfway between mainland Scandinavia and the North Pole.',
      'Home to the Global Seed Vault deep within the permafrost mountain bedrock.',
      'The northernmost permanent civilian settlement of over 1,000 residents in the world.'
    ],
    cachedExtract:
      'Longyearbyen is the world’s northernmost settlement with a population greater than 1,000, located on the island of Spitsbergen in the Svalbard archipelago.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      creator: 'Christopher Michel / Openverse',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Longyearbyen colorful houses under Arctic mountains'
    },
    literatureKeywords: 'svalbard arctic seed vault'
  },
  {
    id: 'luang-prabang',
    name: 'Luang Prabang',
    country: 'Laos',
    lat: 19.89,
    lon: 102.135,
    wikipediaTitle: 'Luang_Prabang',
    clues: [
      'Lush tropical river confluence surrounded by limestone karst peaks in Indochina.',
      'Historic royal capital of the Lane Xang kingdom ("Land of a Million Elephants").',
      'UNESCO heritage town renowned for saffron-robed morning alms-giving along the Mekong and Nam Khan rivers.'
    ],
    cachedExtract:
      'Luang Prabang is an ancient city in northern Laos situated along the upper Mekong. It was the royal capital of the kingdom until 1975 and is known for its Buddhist temples.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
      creator: 'Basile Morin / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Wat Xieng Thong Temple, Luang Prabang'
    },
    literatureKeywords: 'luang prabang mekong laos'
  },
  {
    id: 'petra',
    name: 'Petra',
    country: 'Jordan',
    lat: 30.328,
    lon: 35.444,
    wikipediaTitle: 'Petra',
    clues: [
      'Arid desert canyon valley between the Dead Sea and the Gulf of Aqaba.',
      'Capital of the ancient Nabataean Kingdom, masters of desert water harvesting and frankincense caravans.',
      'Rose-red city carved directly into sandstone cliffs, entered through the narrow Siq gorge.'
    ],
    cachedExtract:
      'Petra is a famous archaeological site in southwestern Jordan. Dating to around 300 B.C., it was the capital of the Nabataean Kingdom and is known as the "Rose City."',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1579606032834-d130a08e17db?auto=format&fit=crop&w=1200&q=80',
      creator: 'Bernard Gagnon / Openverse',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Al-Khazneh Treasury carved into sandstone cliff'
    },
    literatureKeywords: 'petra nabataean jordan'
  },
  {
    id: 'zanzibar-stone-town',
    name: 'Stone Town',
    country: 'Tanzania',
    lat: -6.165,
    lon: 39.198,
    wikipediaTitle: 'Stone_Town',
    clues: [
      'Spice island archipelago port off the Swahili Coast in the Indian Ocean.',
      'Historic maritime center for cloves, carved brass-studded wooden doors, and the Sultanate of Oman.',
      'Birthplace of Freddie Mercury and historic urban quarter of Zanzibar City.'
    ],
    cachedExtract:
      'Stone Town is the old part of Zanzibar City, the main city of Zanzibar in Tanzania. It is an outstanding example of a Swahili coastal trading town blending African, Arab, Indian and European elements.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
      creator: 'Muhammad Mahdi Karim / Openverse',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Stone Town waterfront, Zanzibar'
    },
    literatureKeywords: 'zanzibar stone town swahili'
  },
  {
    id: 'banff',
    name: 'Banff',
    country: 'Canada',
    lat: 51.178,
    lon: -115.57,
    wikipediaTitle: 'Banff,_Alberta',
    clues: [
      'High-altitude alpine valley town surrounded by Mount Rundle and Sulphur Mountain in the Rockies.',
      'Established in the 1880s around natural sulfur thermal hot springs along the Canadian Pacific Railway.',
      'Canada’s first national park resort, famed for turquoise glacial lakes like Louise and Moraine.'
    ],
    cachedExtract:
      'Banff is a resort town in the province of Alberta, located within Banff National Park in the Canadian Rockies along the Trans-Canada Highway.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
      creator: 'Gorgo / Wikimedia',
      license: 'Public Domain',
      sourceUrl: 'https://openverse.org',
      title: 'Lake Louise in Banff National Park'
    },
    literatureKeywords: 'banff canadian rockies'
  },
  {
    id: 'timbuktu',
    name: 'Timbuktu',
    country: 'Mali',
    lat: 16.766,
    lon: -3.002,
    wikipediaTitle: 'Timbuktu',
    clues: [
      'Southern fringe of the Sahara Desert where dunes meet the northern loop of the Niger River.',
      'Legendary medieval center of Islamic scholarship, preserving hundreds of thousands of ancient manuscripts.',
      'Home to the historic mud-brick Sankore and Djinguereber mosques in the Sahel.'
    ],
    cachedExtract:
      'Timbuktu is an ancient city in Mali situated 20 km north of the Niger River. It was a trading post on the trans-Saharan caravan route and a center of Islamic culture in the 15th and 16th centuries.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      creator: 'Emilio Labrador / Openverse',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Sankore Mosque mud minaret in Timbuktu'
    },
    literatureKeywords: 'timbuktu manuscripts sahara'
  },
  {
    id: 'galapagos-puerto-ayora',
    name: 'Puerto Ayora',
    country: 'Ecuador',
    lat: -0.745,
    lon: -90.313,
    wikipediaTitle: 'Puerto_Ayora',
    clues: [
      'Volcanic Pacific island port situated nearly directly on the Earth’s Equator, 1,000 km west of the mainland.',
      'Base of the Charles Darwin Research Station focusing on giant tortoise breeding and marine iguanas.',
      'The most populated town of the Galápagos archipelago on Santa Cruz Island.'
    ],
    cachedExtract:
      'Puerto Ayora is a town in central Galápagos, Ecuador. Located on the southern shore of Santa Cruz Island, it is the most populous town in the archipelago.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      creator: 'Haplochromis / Openverse',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Galapagos Marine Iguanas and Coastal Bay'
    },
    literatureKeywords: 'galapagos darwin santa cruz'
  },
  {
    id: 'reykjavik',
    name: 'Reykjavik',
    country: 'Iceland',
    lat: 64.146,
    lon: -21.942,
    wikipediaTitle: 'Reykjavik',
    clues: [
      'Subarctic volcanic coastline powered predominantly by geothermal steam and hot springs.',
      'Settle site of the first Norse permanent pioneer Ingólfur Arnarson in 874 AD.',
      'World’s northernmost capital of a sovereign state, famed for Hallgrímskirkja church and Harpa hall.'
    ],
    cachedExtract:
      'Reykjavik on the coast of Iceland is the country’s capital and largest city. It’s home to the National and Saga museums, tracing Iceland’s Viking history, and the striking concrete Hallgrímskirkja church.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
      creator: 'Helgi Halldórsson / Openverse',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Hallgrimskirkja Church overlooking Reykjavik'
    },
    literatureKeywords: 'iceland reykjavik geothermal'
  },
  {
    id: 'sintra',
    name: 'Sintra',
    country: 'Portugal',
    lat: 38.802,
    lon: -9.381,
    wikipediaTitle: 'Sintra',
    clues: [
      'Microclimate-rich forested hills near Cabo da Roca, the westernmost point of continental Europe.',
      '19th-century epicentre of European Romantic architecture, mixing Moorish, Manueline, and Gothic styles.',
      'Famed for the vividly colorful hilltop Pena Palace and the mystical initiation wells of Quinta da Regaleira.'
    ],
    cachedExtract:
      'Sintra is a resort town in the foothills of Portugal’s Sintra Mountains, near the capital, Lisbon. A longtime royal sanctuary, its forested terrain is studded with pastel-colored villas and palaces.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1200&q=80',
      creator: 'Jose A. / Openverse',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Palacio Nacional da Pena in Sintra'
    },
    literatureKeywords: 'sintra portugal romanticism'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.29,
    lon: 103.851,
    wikipediaTitle: 'Singapore',
    clues: [
      'Diamond-shaped tropical island city-state located one degree north of the Equator on the Malacca Strait.',
      'Global financial and maritime shipping titan that transformed from a British colonial outpost to a high-income nation.',
      'Known as the "Garden City", celebrated for Marina Bay Sands and futuristic Supertree Grove.'
    ],
    cachedExtract:
      'Singapore, officially the Republic of Singapore, is an island country and city-state in maritime Southeast Asia. It is located about one degree of latitude north of the equator, off the southern tip of the Malay Peninsula.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
      creator: 'Chensiyuan / Wikimedia',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Gardens by the Bay and Marina Bay skyline'
    },
    literatureKeywords: 'singapore economy straits'
  },
  {
    id: 'cusco',
    name: 'Cusco',
    country: 'Peru',
    lat: -13.531,
    lon: -71.967,
    wikipediaTitle: 'Cusco',
    clues: [
      'High Andean plateau valley situated at an altitude of 3,400 meters above sea level.',
      'Historic imperial capital of the Tawantinsuyu (Inca Empire), laid out in the shape of a puma.',
      'Gateway city to the Sacred Valley and Machu Picchu, featuring masterfully fitted mortarless stone walls like Sacsayhuamán.'
    ],
    cachedExtract:
      'Cusco is a city in the Peruvian Andes which was once capital of the Inca Empire, and is now known for its archaeological remains and Spanish colonial architecture.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
      creator: 'Martin St-Amant / Openverse',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Plaza de Armas and Cathedral in Cusco'
    },
    literatureKeywords: 'cusco inca sacred valley'
  },
  {
    id: 'rotorua',
    name: 'Rotorua',
    country: 'New Zealand',
    lat: -38.136,
    lon: 176.249,
    wikipediaTitle: 'Rotorua',
    clues: [
      'Volcanic caldera lake basin in the central North Island known for bubbling mud pools and sulfur vents.',
      'Deep heartland of indigenous Māori culture, featuring the historic Te Puia cultural centre and Whakarewarewa valley.',
      'Nicknamed "Sulphur City", celebrated for Pohutu Geyser shooting boiling water 30 meters high.'
    ],
    cachedExtract:
      'Rotorua is a town on the southern shores of the lake of the same name in the Bay of Plenty Region of New Zealand’s North Island, renowned for geothermal activity and Māori culture.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      creator: 'Pseudopanax / Wikimedia',
      license: 'Public Domain',
      sourceUrl: 'https://openverse.org',
      title: 'Geothermal vents and Pohutu Geyser'
    },
    literatureKeywords: 'rotorua maori geothermal'
  },
  {
    id: 'alula',
    name: 'AlUla',
    country: 'Saudi Arabia',
    lat: 26.616,
    lon: 37.922,
    wikipediaTitle: 'Al-Ula',
    clues: [
      'Ancient oasis valley nestled between colossal sandstone canyons in the Hejaz desert.',
      'Major stop on the historic incense route, preserving monumental tombs of Hegra (Mada’in Salih).',
      'The southern sister city of Petra, recognized as Saudi Arabia’s first UNESCO World Heritage site.'
    ],
    cachedExtract:
      'AlUla is an ancient oasis city located in the Medina Region of north-western Saudi Arabia. It was the capital of the ancient Lihyanites and contains Hegra, the southernmost major settlement of the Nabataeans.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=1200&q=80',
      creator: 'Sammy / Openverse',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Hegra monumental tombs carved into rock'
    },
    literatureKeywords: 'alula hegra nabataean'
  },
  {
    id: 'suva',
    name: 'Suva',
    country: 'Fiji',
    lat: -18.141,
    lon: 178.441,
    wikipediaTitle: 'Suva',
    clues: [
      'Pacific island peninsula surrounded by Laucala Bay in the humid tropical South Seas.',
      'Largest and most cosmopolitan urban centre in the South Pacific island region.',
      'Capital of Fiji on Viti Levu island, home to the Pacific Islands Forum secretariat and Grand Pacific Hotel.'
    ],
    cachedExtract:
      'Suva is the capital and largest city of Fiji. It is located on the southeast coast of the island of Viti Levu, in the Central Division, Rewa Province.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      creator: 'Matthias Süßen / Openverse',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Suva coastal port and Grand Pacific Hotel'
    },
    literatureKeywords: 'suva fiji south pacific'
  },
  {
    id: 'hobart',
    name: 'Hobart',
    country: 'Australia',
    lat: -42.882,
    lon: 147.327,
    wikipediaTitle: 'Hobart',
    clues: [
      'Temperate southern maritime estuary at the mouth of the River Derwent, beneath Mount Wellington (kunanyi).',
      'Australia’s second oldest capital city, established in 1804 as a British penal settlement.',
      'Island state capital famous for Salamanca Market, the Sydney-to-Hobart yacht race, and MONA museum.'
    ],
    cachedExtract:
      'Hobart is the capital and most populous city of the Australian island state of Tasmania. Founded in 1804 as a penal colony, it is Australia’s second oldest capital after Sydney.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
      creator: 'JJ Harrison / Openverse',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Hobart waterfront and Mount Wellington'
    },
    literatureKeywords: 'hobart tasmania derwent'
  },
  {
    id: 'nuuk',
    name: 'Nuuk',
    country: 'Greenland',
    lat: 64.183,
    lon: -51.721,
    wikipediaTitle: 'Nuuk',
    clues: [
      'Subarctic fjord coast on the Labrador Sea, warmed slightly by the West Greenland Current.',
      'Founded in 1728 by Norwegian-Danish missionary Hans Egede near ancient Norse settlements.',
      'World’s northernmost capital of a constituent country, surrounded by Sermitsiaq mountain.'
    ],
    cachedExtract:
      'Nuuk is the capital and largest city of Greenland. It is the seat of government and the country’s largest cultural and economic centre.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      creator: 'Oliver Schauf / Openverse',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Nuuk colorful colonial harbor'
    },
    literatureKeywords: 'nuuk greenland inuit'
  },
  {
    id: 'tromso',
    name: 'Tromsø',
    country: 'Norway',
    lat: 69.649,
    lon: 18.955,
    wikipediaTitle: 'Tromsø',
    clues: [
      'Island city within a northern fjord basin located 350 kilometres north of the Arctic Circle.',
      'Historical embarkation point for famed Arctic explorers Roald Amundsen and Fridtjof Nansen.',
      'Renowned "Capital of the Arctic" featuring the triangular glass Arctic Cathedral and spectacular Northern Lights.'
    ],
    cachedExtract:
      'Tromsø is a city in Troms og Finnmark county, Norway. Most of the city, including the city centre, is on the island of Tromsøya in the Arctic Circle.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
      creator: 'Frode Ramone / Openverse',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Arctic Cathedral and Tromso Bridge'
    },
    literatureKeywords: 'tromso arctic aurora'
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    lat: 35.011,
    lon: 135.768,
    wikipediaTitle: 'Kyoto',
    clues: [
      'Surrounded on three sides by mountains in the Kansai basin of Honshu island.',
      'Imperial capital of Japan for more than a millennium (794 to 1868) during the Heian through Edo periods.',
      'Celebrated for over 1,600 Buddhist temples, Fushimi Inari torii gates, and Kinkaku-ji (Golden Pavilion).'
    ],
    cachedExtract:
      'Kyoto is the capital city of Kyoto Prefecture in Japan. Located in the Kansai region on the island of Honshu, it served as the capital of Japan and the emperor’s residence from 794 until 1868.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      creator: 'Raymond Barlow / Openverse',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Kinkaku-ji Golden Pavilion in Kyoto'
    },
    literatureKeywords: 'kyoto imperial heian'
  },
  {
    id: 'ouarzazate',
    name: 'Ouarzazate',
    country: 'Morocco',
    lat: 30.918,
    lon: -6.893,
    wikipediaTitle: 'Ouarzazate',
    clues: [
      'Bare desert plateau south of the High Atlas mountains at the doorstep of the Sahara.',
      'Famous as the "Hollywood of Africa", home to Atlas Film Studios where Lawrence of Arabia and Gladiator were filmed.',
      'Near the fortified earthen clay ksar of Aït Benhaddou along old trans-Saharan camel trade routes.'
    ],
    cachedExtract:
      'Ouarzazate is a city south of Morocco’s High Atlas mountains, known as a gateway to the Sahara Desert. Its huge Taourirt Kasbah is home to a 19th-century palace.',
    cachedImage: {
      url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
      creator: 'Bernard Gagnon / Openverse',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://openverse.org',
      title: 'Ait Benhaddou clay ksar near Ouarzazate'
    },
    literatureKeywords: 'ouarzazate morocco sahara'
  }
];
