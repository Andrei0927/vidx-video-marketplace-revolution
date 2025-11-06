// Romanian counties and cities data
export const locations = [
    { id: 28, name: "Alba", type: "county" },
    { id: 1, name: "Arad", type: "county" },
    { id: 11, name: "Arges", type: "county" },
    { id: 3, name: "Bacau", type: "county" },
    { id: 19, name: "Bihor", type: "county" },
    { id: 21, name: "Bistrita-Nasaud", type: "county" },
    { id: 18, name: "Botosani", type: "county" },
    { id: 37, name: "Braila", type: "county" },
    { id: 4, name: "Brasov", type: "county" },
    { id: 46, name: "Bucuresti", type: "county" },
    { id: 36, name: "Buzau", type: "county" },
    { id: 40, name: "Calarasi", type: "county" },
    { id: 26, name: "Caras-Severin", type: "county" },
    { id: 2, name: "Cluj", type: "county" },
    { id: 7, name: "Constanta", type: "county" },
    { id: 29, name: "Covasna", type: "county" },
    { id: 35, name: "Dambovita", type: "county" },
    { id: 8, name: "Dolj", type: "county" },
    { id: 9, name: "Galati", type: "county" },
    { id: 41, name: "Giurgiu", type: "county" },
    { id: 33, name: "Gorj", type: "county" },
    { id: 23, name: "Harghita", type: "county" },
    { id: 27, name: "Hunedoara", type: "county" },
    { id: 39, name: "Ialomita", type: "county" },
    { id: 10, name: "Iasi", type: "county" },
    { id: 168, name: "Ilfov", type: "county" },
    { id: 16, name: "Maramures", type: "county" },
    { id: 32, name: "Mehedinti", type: "county" },
    { id: 22, name: "Mures", type: "county" },
    { id: 24, name: "Neamt", type: "county" },
    { id: 43, name: "Olt", type: "county" },
    { id: 6, name: "Prahova", type: "county" },
    { id: 20, name: "Salaj", type: "county" },
    { id: 15, name: "Satu Mare", type: "county" },
    { id: 12, name: "Sibiu", type: "county" },
    { id: 17, name: "Suceava", type: "county" },
    { id: 42, name: "Teleorman", type: "county" },
    { id: 13, name: "Timis", type: "county" },
    { id: 38, name: "Tulcea", type: "county" },
    { id: 34, name: "Valcea", type: "county" },
    { id: 30, name: "Vaslui", type: "county" },
    { id: 31, name: "Vrancea", type: "county" },
    // Cities (sample - add more as needed)
    { id: 24485, name: "1 Decembrie", county: "Ilfov", type: "city" },
    { id: 46625, name: "1 Decembrie", county: "Vaslui", type: "city" },
    { id: 76593, name: "2 Mai", county: "Constanta", type: "city" },
    { id: 74219, name: "23 August", county: "Constanta", type: "city" },
    { id: 79685, name: "Adjud", county: "Vrancea", type: "city" }
];

export const getLocationById = (id) => {
    return locations.find(loc => loc.id === parseInt(id));
};

export const searchLocations = (query) => {
    const searchTerm = query.toLowerCase();
    return locations.filter(loc => 
        loc.name.toLowerCase().includes(searchTerm) ||
        (loc.county && loc.county.toLowerCase().includes(searchTerm))
    );
};