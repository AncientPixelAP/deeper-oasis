export default class EuclidianDistance{
    constructor(){

    }

    squared(a, b){
        var sum = 0
        var n
        for (n = 0; n < a.length; n++) {
            sum += Math.pow(a[n] - b[n], 2)
        }
        return sum;
    }

    distance(a, b){
        return Math.sqrt(this.squared(a, b));
    }
}