
// if (!Array.prototype.fill) {
//     Object.defineProperty(Array.prototype, "fill", {
//         enumerable: false,
//         value: function(value) {

//             // Steps 1-2.
//             if (this == null) {
//               throw new TypeError('this is null or not defined');
//             }

//             var O = Object(this);

//             // Steps 3-5.
//             var len = O.length >>> 0;

//             // Steps 6-7.
//             var start = arguments[1];
//             var relativeStart = start >> 0;

//             // Step 8.
//             var k = relativeStart < 0 ?
//               Math.max(len + relativeStart, 0) :
//               Math.min(relativeStart, len);

//             // Steps 9-10.
//             var end = arguments[2];
//             var relativeEnd = end === undefined ?
//               len : end >> 0;

//             // Step 11.
//             var final = relativeEnd < 0 ?
//               Math.max(len + relativeEnd, 0) :
//               Math.min(relativeEnd, len);

//             // Step 12.
//             while (k < final) {
//               O[k] = value;
//               k++;
//             }

//             // Step 13.
//             return O;
//         }
//     });
// }
// if (!Array.prototype.copy) {
//     Object.defineProperty(Array.prototype, "copy", {
//         enumerable: false,
//         value:function(){
//             if (this == null) {
//               throw new TypeError('this is null or not defined');
//             }
//             var O =new Object(this);
//             return O.slice();
//             // print([1,2,3].copy())
//         }
//     });
// }
// if (!Array.prototype.flatten) {
//     Object.defineProperty(Array.prototype, "flatten", {
//         enumerable: false,
//         value:function(){
//             if (this == null) {
//               throw new TypeError('this is null or not defined');
//             }
//             var O =new Object(this);
//             return O.reduce(function(a, b) {
//               return a.concat(b);
//             }, []);
//         }
//     });
// }

// if (!Object.prototype.k) {
//     Object.defineProperty(Object.prototype, "k", {
//         enumerable: false,
//         value:function(){
//             if (this == null) {
//               throw new TypeError('this is null or not defined');
//             }
//             var O =new Object(this);
//             return Object.keys(O);
//         }
//     });
// }

var inf = Infinity;
var min = Math.min;


function k(o){
    if (o == null) {
        throw new TypeError('this is null or not defined');
    }
    return Object.keys(o);
}

function copy(arr){
    if (arr == null) {
        throw new TypeError('this is null or not defined');
    }
    var O =new Object(arr);
    return O.slice();
    // print([1,2,3].copy())
}
function flatten(arr){
    if (arr == null) {
        throw new TypeError('this is null or not defined');
    }
    var O =new Object(arr);
    return O.reduce(function(a, b) {
        return a.concat(b);
    }, []);
}

function fill(r,value) {
    var length=r;
    if(typeof r == typeof 0){
        r=Array(r);
    }else{
        length=r.length
    }
    for (var i = 0; i < length; i++) {
        r[i]=value;
    }
    return r;
}



function range(shape){
    return Array.prototype.concat([0],Object.keys(new Int8Array(shape)).map(Number).slice(1));
    // print(typeof range(5)[0])
}
function len(a){
    return (a.constructor && a.constructor.name=="Array") ? a.length : -1;
}

function zeros(shape){
    if(shape.length==0) return [];
    if(shape.length==1) shape=shape[0];
    var a=new Array(),i=0;
    if(typeof(shape)=='number' ){
        a=new Array(shape).fill(0);
        return a;
    }else {
        for(var j=0;j<shape[0];j++){
            a[j]=zeros(shape.slice(1));
        }
        return a;
    }
    return -1;
}

function array(shape){
    if(typeof shape=='number'){
        return new Array(shape||0)
    }else{
        var matrix = [];
        for(var i=0; i<shape[0]; i++) {
            matrix[i] = new Array(shape[1]);
        }
        return matrix;
    }
}

function print(){
    for (i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}

function format(formatString, replacementArray) {
    return formatString.replace(
        /\{(\d+)\}/g, // Matches placeholders, e.g. '{1}'
        function formatStringReplacer(match, placeholderIndex) {
            // Convert String to Number
            placeholderIndex = Number(placeholderIndex);
            // Make sure that index is within array bounds
            if (
                placeholderIndex < 0 ||
                    placeholderIndex > replacementArray.length - 1
            ) {
                return placeholderIndex;
            }
            // Replace placeholder with value from replacement array
            return replacementArray[placeholderIndex];
        }
    );
    // print(zeros([10,2]))
}

/**
* FUNCTION: argmin( arr )
*   Computes the minimum value of a numeric array and returns the corresponding array indices.
*
* @param {Array} arr - array of values
* @returns {Array} array indices
*/
function argmin( arr ) {
    if ( !Array.isArray( arr ) ) {
        throw new TypeError( 'argmin()::invalid input argument. Must provide an array.' );
    }
    var len = arr.length,
        min = arr[ 0 ],
        idx = [ 0 ],
        val;

    for ( var i = 1; i < len; i++ ) {
        val = arr[ i ];
        if ( val < min ) {
            min = val;
            idx.length = 0;
            idx.push( i );
        }
        else if ( val === min ) {
            idx.push( i );
        }
    }
    return idx;  
} 
function argmax( arr ) {
    if ( !Array.isArray( arr ) ) {
        throw new TypeError( 'argmin()::invalid input argument. Must provide an array.' );
    }
    var len = arr.length,
        min = arr[ 0 ],
        idx = [ 0 ],
        val;

    for ( var i = 1; i < len; i++ ) {
        val = arr[ i ];
        if ( val > min ) {
            min = val;
            idx.length = 0;
            idx.push( i );
        }
        else if ( val === min ) {
            idx.push( i );
        }
    }
    return idx;  
} 

var sum = function(a){
    return flatten(a).reduce(function(a, b) {
        return a + b;
    }) || 0;
}