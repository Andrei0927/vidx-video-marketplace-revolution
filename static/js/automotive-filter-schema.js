/**
 * Comprehensive Automotive Filter Schema
 * Professional automotive marketplace filter system
 * 
 * This schema defines all available filters for automotive listings
 * with their respective options, types, and metadata.
 */

const automotiveFilterSchema = {
    // Main category structure
    categories: {
        type: 'dropdown',
        label: 'Category',
        width: 'full',
        options: [
            { id: 'all', value: '', label: '🚗 Choose Category - All Vehicles' },
            { id: 'cars', value: 'Cars', label: '🚗 Cars' },
            { id: 'commercial', value: 'Commercial', label: '🚐 Commercial Vehicles' },
            { id: 'trucks', value: 'Trucks - Trailers - Caravans', label: '🚛 Trucks - Trailers - Caravans' },
            { id: 'motorcycles', value: 'Motorcycles', label: '🏍️ Motorcycles' },
            { id: 'scooters', value: 'Scooters - ATV - UTV', label: '🛵 Scooters - ATV - UTV' },
            { id: 'boats', value: 'Boats', label: '⛵ Boats' },
            { id: 'industrial', value: 'Industrial & farm vehicles', label: '🚜 Industrial & Farm Vehicles' }
        ],
        alwaysVisible: true
    },

    // Make/Brand (Marca)
    make: {
        type: 'dropdown',
        label: 'Make',
        required: false,
        alwaysVisible: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'Abarth', label: 'Abarth' },
            { value: 'Acura', label: 'Acura' },
            { value: 'Aiways', label: 'Aiways' },
            { value: 'Aixam', label: 'Aixam' },
            { value: 'Alfa Romeo', label: 'Alfa Romeo' },
            { value: 'Aro', label: 'Aro' },
            { value: 'Aston Martin', label: 'Aston Martin' },
            { value: 'Audi', label: 'Audi' },
            { value: 'Austin', label: 'Austin' },
            { value: 'Baic', label: 'Baic' },
            { value: 'Bentley', label: 'Bentley' },
            { value: 'BMW', label: 'BMW' },
            { value: 'Bugatti', label: 'Bugatti' },
            { value: 'Buick', label: 'Buick' },
            { value: 'Cadillac', label: 'Cadillac' },
            { value: 'Chery', label: 'Chery' },
            { value: 'Chevrolet', label: 'Chevrolet' },
            { value: 'Chrysler', label: 'Chrysler' },
            { value: 'Citroen', label: 'Citroën' },
            { value: 'Comarth', label: 'Comarth' },
            { value: 'Cupra', label: 'Cupra' },
            { value: 'Dacia', label: 'Dacia' },
            { value: 'Daewoo', label: 'Daewoo' },
            { value: 'Daihatsu', label: 'Daihatsu' },
            { value: 'DFSK', label: 'DFSK' },
            { value: 'Dodge', label: 'Dodge' },
            { value: 'Dongwei', label: 'Dongwei' },
            { value: 'DS Automobiles', label: 'DS Automobiles' },
            { value: 'Ferrari', label: 'Ferrari' },
            { value: 'Fiat', label: 'Fiat' },
            { value: 'Fisker', label: 'Fisker' },
            { value: 'Ford', label: 'Ford' },
            { value: 'Forthing', label: 'Forthing' },
            { value: 'Geely', label: 'Geely' },
            { value: 'GMC', label: 'GMC' },
            { value: 'Honda', label: 'Honda' },
            { value: 'Hummer', label: 'Hummer' },
            { value: 'Hyundai', label: 'Hyundai' },
            { value: 'Ineos', label: 'Ineos' },
            { value: 'Infiniti', label: 'Infiniti' },
            { value: 'Isuzu', label: 'Isuzu' },
            { value: 'JAC', label: 'JAC' },
            { value: 'Jaguar', label: 'Jaguar' },
            { value: 'Jeep', label: 'Jeep' },
            { value: 'KG Mobility', label: 'KG Mobility' },
            { value: 'Kia', label: 'Kia' },
            { value: 'Lada', label: 'Lada' },
            { value: 'Lamborghini', label: 'Lamborghini' },
            { value: 'Lancia', label: 'Lancia' },
            { value: 'Land Rover', label: 'Land Rover' },
            { value: 'Lexus', label: 'Lexus' },
            { value: 'Ligier', label: 'Ligier' },
            { value: 'Lincoln', label: 'Lincoln' },
            { value: 'Lotus', label: 'Lotus' },
            { value: 'Lucid', label: 'Lucid' },
            { value: 'Lynk&Co', label: 'Lynk&Co' },
            { value: 'Mahindra', label: 'Mahindra' },
            { value: 'Maserati', label: 'Maserati' },
            { value: 'Maybach', label: 'Maybach' },
            { value: 'Mazda', label: 'Mazda' },
            { value: 'McLaren', label: 'McLaren' },
            { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
            { value: 'MG', label: 'MG' },
            { value: 'Microcar', label: 'Microcar' },
            { value: 'Microlino', label: 'Microlino' },
            { value: 'Mini', label: 'Mini' },
            { value: 'Mitsubishi', label: 'Mitsubishi' },
            { value: 'Morgan', label: 'Morgan' },
            { value: 'Nio', label: 'Nio' },
            { value: 'Nissan', label: 'Nissan' },
            { value: 'Opel', label: 'Opel' },
            { value: 'Peugeot', label: 'Peugeot' },
            { value: 'Plymouth', label: 'Plymouth' },
            { value: 'Polestar', label: 'Polestar' },
            { value: 'Pontiac', label: 'Pontiac' },
            { value: 'Porsche', label: 'Porsche' },
            { value: 'Relive', label: 'Relive' },
            { value: 'Renault', label: 'Renault' },
            { value: 'Rolls-Royce', label: 'Rolls-Royce' },
            { value: 'Rover', label: 'Rover' },
            { value: 'Saab', label: 'Saab' },
            { value: 'Seat', label: 'Seat' },
            { value: 'Seres', label: 'Seres' },
            { value: 'Skoda', label: 'Škoda' },
            { value: 'Skywell', label: 'Skywell' },
            { value: 'Smart', label: 'Smart' },
            { value: 'SsangYong', label: 'SsangYong' },
            { value: 'Subaru', label: 'Subaru' },
            { value: 'Suzuki', label: 'Suzuki' },
            { value: 'SWM', label: 'SWM' },
            { value: 'Tazzari', label: 'Tazzari' },
            { value: 'Tesla', label: 'Tesla' },
            { value: 'Toyota', label: 'Toyota' },
            { value: 'Trabant', label: 'Trabant' },
            { value: 'Triumph', label: 'Triumph' },
            { value: 'Vauxhall', label: 'Vauxhall' },
            { value: 'Volkswagen', label: 'Volkswagen' },
            { value: 'Volvo', label: 'Volvo' },
            { value: 'Weismann', label: 'Weismann' },
            { value: 'XEV', label: 'XEV' },
            { value: 'Xpeng', label: 'Xpeng' },
            { value: 'Zeekr', label: 'Zeekr' },
            { value: 'Other', label: 'Other' }
        ]
    },
    
    // Model depends on make selection
    model: {
        type: 'dropdown',
        label: 'Model',
        required: false,
        dependsOn: 'make',
        alwaysVisible: true,
        options: [
            { value: '', label: 'Any' }
            // Populated dynamically based on make from carModels object
        ]
    },

    // Price Range (Pret)
    price: {
        type: 'range',
        label: 'Price',
        width: 'half',
        alwaysVisible: true,
        currency: {
            default: 'EUR',
            options: ['EUR', 'USD', 'RON', 'GBP']
        },
        range: {
            min: 0,
            max: 500000,
            step: 500,
            unit: '€'
        },
        inputs: {
            from: { placeholder: 'Min price', id: 'price-from' },
            to: { placeholder: 'Max price', id: 'price-to' }
        }
    },

    // Year of Manufacture (An de fabricatie)
    year: {
        type: 'range',
        label: 'Year',
        width: 'half',
        alwaysVisible: true,
        range: {
            min: 1950,
            max: new Date().getFullYear() + 1,
            step: 1,
            unit: ''
        },
        inputs: {
            from: { placeholder: 'From year', id: 'year-from' },
            to: { placeholder: 'To year', id: 'year-to' }
        }
    },

    // Mileage (Rulaj/Kilometraj)
    mileage: {
        type: 'range',
        label: 'Mileage (km)',
        width: 'half',
        alwaysVisible: true,
        range: {
            min: 0,
            max: 500000,
            step: 1000,
            unit: 'km'
        },
        inputs: {
            from: { placeholder: 'Min km', id: 'mileage-from' },
            to: { placeholder: 'Max km', id: 'mileage-to' }
        }
    },

    // Transmission (Cutie de viteze)
    transmission: {
        type: 'dropdown',
        label: 'Transmission',
        width: 'half',
        alwaysVisible: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'Manual', label: 'Manual' },
            { value: 'Automatic', label: 'Automatic' },
            { value: 'Semi-automatic', label: 'Semi-automatic' }
        ]
    },

    // Location
    location: {
        type: 'text',
        label: 'Location',
        placeholder: 'City or region...',
        alwaysVisible: true,
        helpText: 'Enter city, region, or postal code'
    },

    // Body Type (Caroserie in Romanian)
    bodyType: {
        type: 'multi-select',
        label: 'Body Type',
        collapsible: true,
        options: [
            { value: 'Sedan', label: 'Sedan' },
            { value: 'Coupe', label: 'Coupe' },
            { value: 'Convertible', label: 'Convertible' },
            { value: 'Hatchback', label: 'Hatchback' },
            { value: 'Estate', label: 'Estate / Wagon' },
            { value: 'Off-road', label: 'Off-road / 4x4' },
            { value: 'SUV', label: 'SUV / Crossover' },
            { value: 'Minibus', label: 'Minibus' },
            { value: 'People carrier', label: 'People Carrier / MPV' },
            { value: 'Pickup', label: 'Pickup Truck' }
        ]
    },

    // Variant/Trim (optional, collapsible)
    variant: {
        type: 'text',
        label: 'Variant / Trim',
        collapsible: true,
        optional: true,
        placeholder: 'e.g., GTI, Sport, Elegance, AMG...',
        helpText: 'Enter the specific trim level or variant you\'re looking for'
    },

    // Fuel Type (Combustibil)
    fuel: {
        type: 'multi-select',
        label: 'Fuel Type',
        collapsible: true,
        options: [
            { value: 'Petrol', label: 'Petrol / Gasoline' },
            { value: 'Diesel', label: 'Diesel' },
            { value: 'Electric', label: 'Electric (EV)' },
            { value: 'Hybrid', label: 'Hybrid (HEV)' },
            { value: 'Plug-in Hybrid', label: 'Plug-in Hybrid (PHEV)' },
            { value: 'LPG', label: 'LPG / Autogas' },
            { value: 'CNG', label: 'CNG / Natural Gas' },
            { value: 'Hydrogen', label: 'Hydrogen / Fuel Cell' },
            { value: 'E85', label: 'E85 / Bioethanol' }
        ]
    },

    // Drive Type (NEW - from AutoScout24 analysis)
    driveType: {
        type: 'radio',
        label: 'Drive Type',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'FWD', label: 'Front-Wheel Drive (FWD)' },
            { value: 'RWD', label: 'Rear-Wheel Drive (RWD)' },
            { value: 'AWD', label: 'All-Wheel Drive (AWD)' },
            { value: '4WD', label: '4x4 / Four-Wheel Drive' }
        ]
    },

    // Number of Doors (NEW - from AutoScout24 analysis)
    doors: {
        type: 'multi-select',
        label: 'Doors',
        collapsible: true,
        optional: true,
        options: [
            { value: '2', label: '2 Doors' },
            { value: '3', label: '3 Doors' },
            { value: '4', label: '4 Doors' },
            { value: '5', label: '5 Doors' }
        ]
    },

    // Number of Seats (NEW - from AutoScout24 analysis)
    seats: {
        type: 'range',
        label: 'Seats',
        collapsible: true,
        optional: true,
        range: {
            min: 2,
            max: 9,
            step: 1
        },
        inputs: {
            from: { placeholder: 'Min seats', id: 'seats-from' },
            to: { placeholder: 'Max seats', id: 'seats-to' }
        }
    },

    // Engine Displacement (Capacitate motor)
    displacement: {
        type: 'range',
        label: 'Engine Displacement (L)',
        collapsible: true,
        range: {
            min: 0,
            max: 10.0,
            step: 0.1,
            unit: 'L'
        },
        inputs: {
            from: { placeholder: 'Min', id: 'displacement-from' },
            to: { placeholder: 'Max', id: 'displacement-to' }
        }
    },

    // Power (Putere)
    power: {
        type: 'range',
        label: 'Power (HP)',
        collapsible: true,
        range: {
            min: 0,
            max: 1500,
            step: 10,
            unit: 'HP'
        },
        inputs: {
            from: { placeholder: 'Min HP', id: 'power-from' },
            to: { placeholder: 'Max HP', id: 'power-to' }
        }
    },

    // Color (Culoare)
    color: {
        type: 'multi-select',
        label: 'Color',
        collapsible: true,
        options: [
            { value: 'Black', label: 'Black' },
            { value: 'White', label: 'White' },
            { value: 'Silver', label: 'Silver' },
            { value: 'Grey', label: 'Grey' },
            { value: 'Red', label: 'Red' },
            { value: 'Blue', label: 'Blue' },
            { value: 'Green', label: 'Green' },
            { value: 'Yellow', label: 'Yellow' },
            { value: 'Orange', label: 'Orange' },
            { value: 'Brown', label: 'Brown' },
            { value: 'Beige', label: 'Beige' },
            { value: 'Gold', label: 'Gold' },
            { value: 'Purple', label: 'Purple' },
            { value: 'Pink', label: 'Pink' },
            { value: 'Other', label: 'Other' }
        ]
    },

    // Steering Wheel Position (Volan)
    steering: {
        type: 'radio',
        label: 'Steering Wheel',
        collapsible: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'Left', label: 'Left-hand Drive' },
            { value: 'Right', label: 'Right-hand Drive' }
        ]
    },

    // Condition (Stare)
    condition: {
        type: 'multi-select',
        label: 'Condition',
        collapsible: true,
        options: [
            { value: 'New', label: 'New' },
            { value: 'Used', label: 'Used' },
            { value: 'Damaged', label: 'Damaged / Salvage' }
        ]
    },

    // Additional marketplace filters
    sellerType: {
        type: 'radio',
        label: 'Seller Type',
        collapsible: true,
        options: [
            { value: '', label: 'All' },
            { value: 'private', label: 'Private Seller' },
            { value: 'dealer', label: 'Dealer / Company' }
        ]
    },

    // Features/Equipment (optional additional filters)
    features: {
        type: 'multi-select',
        label: 'Features',
        collapsible: true,
        optional: true,
        options: [
            { value: '4x4', label: '4x4 / AWD' },
            { value: 'leather', label: 'Leather Interior' },
            { value: 'sunroof', label: 'Sunroof / Panoramic Roof' },
            { value: 'navigation', label: 'Navigation System' },
            { value: 'camera', label: 'Backup Camera' },
            { value: 'parking-sensors', label: 'Parking Sensors' },
            { value: 'cruise-control', label: 'Cruise Control' },
            { value: 'heated-seats', label: 'Heated Seats' },
            { value: 'keyless', label: 'Keyless Entry/Start' },
            { value: 'bluetooth', label: 'Bluetooth' },
            { value: 'aux', label: 'AUX/USB Input' },
            { value: 'warranty', label: 'Warranty Included' }
        ]
    },

    // Location filter
    location: {
        type: 'text',
        label: 'Location',
        placeholder: 'e.g., București, Cluj-Napoca',
        optional: true
    }
};

// Car models data for make-model dependency (expanded from AutoScout24/Mobile.de analysis)
const carModels = {
    'Acura': ['ILX', 'TLX', 'RLX', 'Integra', 'MDX', 'RDX', 'NSX', 'ZDX'],
    'Audi': ['A1', 'A3', 'A4', 'A4 Allroad', 'A5', 'A6', 'A6 Allroad', 'A7', 'A8', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'e-tron', 'e-tron GT'],
    'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'i7', 'iX', 'iX1', 'iX3', 'M2', 'M3', 'M4', 'M5', 'M8'],
    'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'V-Class', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'EQV', 'AMG GT', 'SL', 'SLC'],
    'Volkswagen': ['Polo', 'Golf', 'Golf GTI', 'Golf R', 'Jetta', 'Passat', 'Arteon', 'Tiguan', 'Touareg', 'T-Roc', 'T-Cross', 'ID.3', 'ID.4', 'ID.5', 'ID.7', 'ID.Buzz', 'Transporter', 'Caddy', 'Amarok', 'up!'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'Mustang Mach-E', 'Kuga', 'Puma', 'EcoSport', 'Explorer', 'Edge', 'Ranger', 'F-150', 'Bronco', 'Transit', 'Transit Custom'],
    'Toyota': ['Aygo', 'Yaris', 'Corolla', 'Camry', 'Avalon', 'C-HR', 'RAV4', 'Highlander', 'Land Cruiser', '4Runner', 'Tacoma', 'Tundra', 'Prius', 'Mirai', 'bZ4X', 'Hilux', 'Proace'],
    'Honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Passport', 'Ridgeline', 'Odyssey', 'Insight', 'e', 'Civic Type R'],
    'Nissan': ['Micra', 'Sentra', 'Altima', 'Maxima', 'Juke', 'Qashqai', 'X-Trail', 'Murano', 'Pathfinder', 'Armada', 'Frontier', 'Titan', 'GT-R', 'Z', '370Z', 'Leaf', 'Ariya', 'Navara'],
    'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-60', 'CX-90', 'MX-5', 'MX-30'],
    'Hyundai': ['i10', 'i20', 'i30', 'i40', 'Elantra', 'Sonata', 'Kona', 'Tucson', 'Santa Fe', 'Palisade', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'Bayon', 'Nexo'],
    'Kia': ['Picanto', 'Rio', 'Ceed', 'Forte', 'Optima', 'Stinger', 'Seltos', 'Sportage', 'Sorento', 'Telluride', 'Niro', 'EV6', 'EV9', 'Soul'],
    'Renault': ['Twingo', 'Clio', 'Megane', 'Megane E-Tech', 'Kadjar', 'Captur', 'Arkana', 'Koleos', 'Talisman', 'Zoe', 'Kangoo', 'Scenic', 'Espace'],
    'Peugeot': ['108', '208', 'e-208', '308', '408', '508', '2008', 'e-2008', '3008', '5008', 'Rifter', 'Partner', 'Traveller'],
    'Citroen': ['C1', 'C3', 'C3 Aircross', 'C4', 'e-C4', 'C5 Aircross', 'C5 X', 'Berlingo', 'SpaceTourer'],
    'Skoda': ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq', 'Enyaq Coupe'],
    'Seat': ['Ibiza', 'Leon', 'Tarraco', 'Arona', 'Ateca'],
    'CUPRA': ['Formentor', 'Leon', 'Ateca', 'Born'],
    'Opel': ['Corsa', 'Corsa-e', 'Astra', 'Insignia', 'Crossland', 'Grandland', 'Mokka', 'Mokka-e', 'Combo', 'Zafira'],
    'Fiat': ['500', '500e', 'Panda', 'Tipo', '500X', '500L', 'Ducato', 'Doblo'],
    'Alfa Romeo': ['Giulia', 'Giulietta', 'Stelvio', 'Tonale'],
    'Jeep': ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator', 'Avenger'],
    'Volvo': ['XC40', 'XC60', 'XC90', 'V60', 'V90', 'S60', 'S90', 'C40', 'EX30', 'EX90', 'V40'],
    'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
    'Porsche': ['911', '718 Boxster', '718 Cayman', 'Panamera', 'Macan', 'Cayenne', 'Taycan'],
    'Lexus': ['CT', 'IS', 'ES', 'GS', 'LS', 'UX', 'NX', 'RX', 'LX', 'LC', 'RC'],
    'Mini': ['Cooper', 'Countryman', 'Clubman', 'Convertible', 'Electric', 'Paceman'],
    'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Range Rover Sport', 'Range Rover'],
    'Jaguar': ['XE', 'XF', 'XJ', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace'],
    'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'Crosstrek', 'Ascent', 'BRZ', 'WRX', 'XV'],
    'Mitsubishi': ['Mirage', 'Lancer', 'Eclipse Cross', 'Outlander', 'Outlander PHEV', 'Pajero', 'L200', 'ASX'],
    'Suzuki': ['Swift', 'Baleno', 'Vitara', 'S-Cross', 'Jimny', 'Ignis', 'SX4'],
    'Dacia': ['Sandero', 'Logan', 'Duster', 'Jogger', 'Spring'],
    'Chevrolet': ['Spark', 'Malibu', 'Camaro', 'Corvette', 'Trax', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Silverado', 'Blazer'],
    'Dodge': ['Charger', 'Challenger', 'Durango', 'Ram 1500'],
    'Chrysler': ['300', 'Pacifica', 'Voyager'],
    'Buick': ['Encore', 'Envision', 'Enclave'],
    'Cadillac': ['CT4', 'CT5', 'XT4', 'XT5', 'XT6', 'Escalade', 'Lyriq'],
    'GMC': ['Terrain', 'Acadia', 'Yukon', 'Sierra', 'Canyon'],
    'MG': ['MG3', 'MG4', 'MG5', 'MG ZS', 'MG HS', 'MG EHS'],
    'DS': ['DS 3', 'DS 4', 'DS 7', 'DS 9'],
    'Smart': ['Fortwo', 'Forfour', '#1'],
    'Maserati': ['Ghibli', 'Levante', 'Quattroporte', 'GranTurismo', 'MC20', 'Grecale'],
    'Ferrari': ['296 GTB', 'F8', 'Roma', 'Portofino', 'SF90', '812'],
    'Lamborghini': ['Huracan', 'Aventador', 'Urus'],
    'Bentley': ['Continental', 'Flying Spur', 'Bentayga'],
    'Rolls-Royce': ['Ghost', 'Phantom', 'Cullinan', 'Wraith', 'Dawn'],
    'Aston Martin': ['DB11', 'Vantage', 'DBX'],
    'McLaren': ['GT', '720S', 'Artura'],
    'Lotus': ['Elise', 'Exige', 'Evora', 'Emira'],
    'Other': []
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { automotiveFilterSchema, carModels };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.automotiveFilterSchema = automotiveFilterSchema;
    window.carModels = carModels;
}
