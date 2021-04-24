export default class PIP {
    constructor() {
        
    }

    pointInPolygon(_point, _poly){
        //point and poly must be arrays eg [0, 0] and [[0, 0], [0, 1], [1, 1]]
        let x = _point[0], y = _point[1];

        let inside = false;
        for (let i = 0, j = _poly.length - 1; i < _poly.length; j = i++) {
            let xi = _poly[i][0], yi = _poly[i][1];
            let xj = _poly[j][0], yj = _poly[j][1];

            let intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }
}