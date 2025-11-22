export interface pcs {
    pcs: PC[];
}

export interface PC {
    _id:            string;
    marca:          string;
    modelo:         string;
    procesador:     string;
    ram:            number;
    almacenamiento: number;
    categoria:      string;
    imagenUrl:      string;
}
