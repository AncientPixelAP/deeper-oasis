export default class RTI{
    constructor(){
        this.epsilon = 0.000001;
        this.edge1 = [0, 0, 0];
        this.edge2 = [0, 0, 0];
        this.tvec = [0, 0, 0];
        this.pvec = [0, 0, 0];
        this.qvec = [0, 0, 0];
    }

    cross(_out, _a, _b) {
    let ax = _a[0], ay = _a[1], az = _a[2],
        bx = _b[0], by = _b[1], bz = _b[2]

    _out[0] = ay * bz - az * by
    _out[1] = az * bx - ax * bz
    _out[2] = ax * by - ay * bx
    return _out
    }

    dot(_a, _b) {
        return _a[0] * _b[0] + _a[1] * _b[1] + _a[2] * _b[2]
    }

    sub(_out, _a, _b) {
        _out[0] = _a[0] - _b[0]
        _out[1] = _a[1] - _b[1]
        _out[2] = _a[2] - _b[2]
        return _out
    }

    intersect(_out, _pt, _dir, _tri) {
        this.sub(this.edge1, _tri[1], _tri[0]);
        this.sub(this.edge2, _tri[2], _tri[0]);

        this.cross(this.pvec, _dir, this.edge2);
        let det = this.dot(this.edge1, this.pvec);

        if (det < this.epsilon) return null;
        this.sub(this.tvec, _pt, _tri[0]);
        let u = this.dot(this.tvec, this.pvec);
        if (u < 0 || u > det) return null;
        this.cross(this.qvec, this.tvec, this.edge1);
        let v = this.dot(_dir, this.qvec);
        if (v < 0 || u + v > det) return null;

        let t = this.dot(this.edge2, this.qvec) / det;
        _out[0] = _pt[0] + t * _dir[0];
        _out[1] = _pt[1] + t * _dir[1];
        _out[2] = _pt[2] + t * _dir[2];
        return _out;
    }

    //additional vector math
    rotateX(out, a, b, c) {
        /**
        * Rotate a 3D vector around the x-axis
        * @param {vec3} out The receiving vec3
        * @param {vec3} a The vec3 point to rotate
        * @param {vec3} b The origin of the rotation
        * @param {Number} c The angle of rotation
        * @returns {vec3} out
        */
        var by = b[1];
        var bz = b[2];

        // Translate point to the origin
        var py = a[1] - by;
        var pz = a[2] - bz;

        var sc = Math.sin(c);
        var cc = Math.cos(c);

        // perform rotation and translate to correct position
        out[0] = a[0];
        out[1] = by + py * cc - pz * sc;
        out[2] = bz + py * sc + pz * cc;

        return out;
    }

    rotateY(out, a, b, c) {
        var bx = b[0];
        var bz = b[2];

        // translate point to the origin
        var px = a[0] - bx;
        var pz = a[2] - bz;

        var sc = Math.sin(c);
        var cc = Math.cos(c);

        // perform rotation and translate to correct position
        out[0] = bx + pz * sc + px * cc;
        out[1] = a[1];
        out[2] = bz + pz * cc - px * sc;

        return out;
    }

    rotateZ(out, a, b, c) {
        var bx = b[0];
        var by = b[1];

        //Translate point to the origin
        var px = a[0] - bx;
        var py = a[1] - by;

        var sc = Math.sin(c);
        var cc = Math.cos(c);

        // perform rotation and translate to correct position
        out[0] = bx + px * cc - py * sc;
        out[1] = by + px * sc + py * cc;
        out[2] = a[2];

        return out;
    }
}