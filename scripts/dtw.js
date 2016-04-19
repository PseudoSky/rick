

function levenshtein(a, b){
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};





function d2(a, b) {
  var sum = 0
  var n
  for (n = 0; n < a.length; n++) {
    sum += Math.pow(a[n] - b[n], 2)
  }
  return sum
}

function frack(a,b){
    return a-b;
}
function euclidean_pdist(a,b){
    return Math.sqrt(Math.pow(a - b, 2));
}

function euclidean_norm(a,b){
    
    return Math.sqrt(Math.pow(a - b, 2))*(1/((1+a + b)/2));
}


function euclidean_distance(a, b) {
    return Math.sqrt(d2(a,b))
    // print("euclidean_distance "+euclidean_pdist(19, 1))
}



 function dtw(x, y, dist,value_func){

    // Computes Dynamic Time Warping (DTW) of two sequences.
    // :param array x: N1*M array
    // :param array y: N2*M array
    // :param func dist: distance used as cost measure
    // Returns the minimum distance, the cost matrix, the accumulated cost matrix, and the wrap path.

    var c = len(x);
    var r = len(y);

    if(c==0 || r==0) return -1;

    
    var D0   = zeros([c + 1, r + 1]);

    D0[0]    = fill(D0[0],inf);
    D0[0][0] = 0

    for(var i=1; i < D0.length;) D0[i++][0]=inf;

    var D1 = [];


    for(var row=1; row < c;row++){
        D1[row]=[]
        for(var col=1; col<r;col++){
            D1[row].push(D0[row][col]);
        }
    }

    x.forEach(function(x_d,i){
        y.forEach(function(y_d,j){
            if(!D1[i])D1[i]=[];
            // print(format("i,j  {2},{3} of {4},{5}  x,y {0},{1} ",[x_d,y_d,i+1,j+1,len(D0),len(D0[0])]))
            d=dist(x_d,y_d)
            D1[i][j] = d
            a=(i+1)
            b=(j+1)
            D0[a][b] = d
        });
    });



    var C = copy(D1)

    range(c).forEach(function(x_d,i){
        range(r).forEach(function(y_d,j){

            D1[i][j]         += min(D0[i][j], D0[i][(j+1)], D0[(i+1)][j])
            D0[(i+1)][(j+1)] += min(D0[i][j], D0[i][(j+1)], D0[(i+1)][j])

        });
    });

    var path = _traceback(D0)
    // if(len(x)==1){
    //     path = zeros(len(y)), range(len(y))
    // }else if(len(y) == 1){
    //     path = range(len(x)), zeros(len(x))
    // }
    // else{
    //     path = _traceback(D0)
    // }
    var dl=D1.length-1
    if(value_func) {
        return value_func(D1[dl][D1[dl].length-1],(dl+1+D1[dl].length));
    }
    else{
        return [1-(D1[dl][D1[dl].length-1] / (dl+1+D1[dl].length))]//, C, D1, path]
    }

}


function _traceback(D){
    var i =D.length-2;
    var j=D[0].length-2//, j = array([D.length,D[0].length]) - 2
    var p= [i], q = [j]

    while ((i > 0) || (j > 0)){
        tb = argmin([D[i][j], D[i][j+1], D[i+1][j]])[0]

        if((tb == 0)){
            i -= 1
            j -= 1
        } else if((tb == 1)){
            i -= 1
        }
        else{ // (tb == 2):
            j -= 1
        }

        p.push(i)
        q.push(j)
    }
    return [ p.reverse(),q.reverse()]
}
function test2(){
    if(0){ 
        // 1-D numeric
        // from sklearn.metrics.pairwise import manhattan_distances
        x = [0, 0, 1, 1, 2, 4, 2, 1, 2, 0]
        y = [1, 1, 1, 2, 2, 2, 2, 3, 2, 0]
        dist_fun = manhattan_distances
    }else if(0){
        // 2-D numeric
        // from sklearn.metrics.pairwise import euclidean_distances
        x = [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [4, 3], [2, 3], [1, 1], [2, 2], [0, 1]]
        y = [[1, 0], [1, 1], [1, 1], [2, 1], [4, 3], [4, 3], [2, 3], [3, 1], [1, 2], [1, 0]]
        dist_fun = euclidean_distances
    }else{
        // 1-D list of strings
        // from nltk.metrics.distance import edit_distance
        //x = ['we', 'shelled', 'clams', 'for', 'the', 'chowder']
        //y = ['class', 'too']
        x = ['i', 'soon', 'found', 'myself', 'muttering', 'to', 'the', 'walls']
        y = ['see', 'drown', 'himself']
        //x = 'we talked about the situation'.split()
        //y = 'we talked about the situation'.split()
        dist_fun = edit_distance
    }

}



function test(type){
    var dist,x,y;
    if(type=="series"){
        dist  = euclidean_pdist
        x     = [0, 0, 1, 1, 2, 4, 2, 1, 2, 0];
        y     = [1, 1, 1, 2, 2, 2, 2, 3, 2, 0];
    }else if(type=="string"){
        dist  = levenshtein;
        x     = ['i', 'soon', 'found', 'myself', 'muttering', 'to', 'the', 'walls'];
        y     = ['see', 'drown', 'himself'];
    }else{
        dist  = euclidean_pdist
        x     = [0, 0, 1, 1, 2, 4, 2, 1, 2, 0];
        y     = [1, 1, 1, 2, 2, 2, 2, 3, 2, 0];
    }
    print(dtw(x, y, dist));
}


function mapV(obj){
    return Object.keys(obj).map(function ( key ) { return [key,obj[key]] });
}

function pairs(arr){
    return arr.map(function ( obj ) { return mapV(obj) });
}




function Classifier(alg,templates,dist,gap){
    var self=this;
    
    // Need to add option to differentiate between continuous stream data
    // and discrete data. Like FFT shouldn't be sequentially modifying the
    // input stream (it needs to fully clear the template)
    self.is_discrete=false;
    self.algo=alg;
    self.dist=dist;
    self.value_func=null;
    if(dist.dist && dist.val){
        self.dist=dist.dist
        self.value_func=dist.val;
    }
    console.log('VALUE',self.value_func);
    self.tmp=templates||[];
    self.stream=[];
    self.labels={}
    self.odds={};
    self.frame_size=256;
    self.gap=gap || 1;
    self.gap_counter=0;


    self.sample = function(el){

        if((self.stream.length)&&(self.stream.length!=0)&&(self.frame_size==self.stream.length)){
            self.stream.shift();

        };
        self.stream.push(el);
        self.gap_counter=self.gap_counter+1;

        if(self.gap_counter==self.gap && (self.frame_size>=self.stream.length)){
            self.odds=new Object({});
            for(var ex=0; ex<self.tmp.length; ex++){
                self.odds[ex]=self.algo(self.tmp[ex], self.stream, self.dist,self.value_func)[0];
            }
            max = argmax(Object.keys(self.odds).map(function ( key ) { return self.odds[key] }));
            console.log("Most Likely: "+max+", "+self.odds[max]);
            self.gap_counter=0;
        }

    }

    self.classify = function(){
        // self.labels.k().map(self.run);
        console.log('KEYS',k(self.labels));
        self.odds=k(self.labels).map(function(k,i){return {label:k,p:self.run(k)}; })
        console.log('BEST',self.odds,_.maxBy(self.odds,'p'));
        RenderNodes(self.odds,_.maxBy(self.odds,'p'));
        // self.algo(self.tmp[0], self.labels[label], self.dist)[0]
    }

    self.store_ambient=function(d){
        self.background=Array.prototype.slice.call(self.tmp);
    }
    self.store = function(label){
        if(label){
            self.labels[label]=[Array.prototype.slice.call(self.tmp)];
            console.log('STORED SAMPLE',self.tmp,self.labels[label]);
        }
    }
    self.run=function(label){
        console.log('Testing Live',label,self.labels);
        return self.algo(self.tmp, self.labels[label][0], self.dist,self.value_func)[0];
    }
    self.record = function(label,buffer){
        // if(!data)return -1;
        // label=label+'';
        // if(!self.labels[label])self.labels[label]=[];
        if(!buffer)return -1;
        if(!self.labels[label])self.labels[label]=[];
        self.tmp=Array.prototype.slice.call(buffer);
        // console.log('self.record -> self.tmp',self.tmp);
        // self.labels[label].append(buffer);

    }
    self.stream_record = function(data){
        if(!data)return -1;
        if(!self.tmp)self.tmp=[];
        if((self.tmp.length)&&(self.tmp.length!=0)&&(self.frame_size<=self.tmp.length)){
            while(self.frame_size<=self.tmp.length){

                self.tmp.shift();
            }
        };
        self.tmp.push(data);

    }

    return this;
}




function test_classifier(count){
    var cur_time = Date.now();
    var templates=[
        [ 0, 0.9090909090909092, 2.2032085561497325, 3.2032085561497325, 3.6032085561497325, 3.6032085561497325 ],
        [ 2.9, 0.9090909090909092, 2.2032085561497325, 3.2032085561497325, 3.6032085561497325, 3.6032085561497325 ],
        [ 0, 0.9090909090909092, 2.2032085561497325, 3.2032085561497325, 3.6032085561497325, 3.6032085597325 ],
        [0.9090909090909092,2.2032085561497325,3.2032085561497325,1.6032085561497325,3.6032085561497325],
        [.7397169237358767,2.1315094660917784,2.0771225947577925,2.1173824118549893,1.8916483026964062]];
    var c=new Classifier(dtw,templates,euclidean_norm);
    // console.log('C',C);
    for ( var sky = 1; sky < count; sky++ ) {
        next=Math.random()*2.2032085561497325+1
        c.sample(next);
    }
    var end_time = Date.now();

    var timeDifference = end_time - cur_time;
    var differenceDate = new Date(timeDifference * 100);
    var diffHours = differenceDate.getUTCHours()+ ':' +differenceDate.getUTCMinutes()+ ':' +differenceDate.getUTCSeconds();
    console.log('Elapsed',diffHours);


}
// test_classifier(50000)
window.DTWClass=new Classifier(dtw,[],{dist:euclidean_pdist,val:function(a,b,c,d){return [b/(1+a+b)];}});
window.cur_lab="1";
function chkey(e,d){
    // console.log('KEY PRESSED, Changing label to ',e);

    if(e.key && /\d/.test(e.key) || /Digit\d/.test(e.code)){
        console.log('KEY PRESSED, Changing label to ',e.key||e.code);
        window.cur_lab=e.key||e.code;
    }
    if( (e.key && e.key=="r") || e.code=="KeyR"){
        console.log('RUNNING',window.cur_lab);
        DTWClass.run(window.cur_lab)
    }else if( (e.key && e.key=="s") || e.code=="KeyS"){
        console.log('STORING',window.cur_lab);
        DTWClass.store(window.cur_lab)
    }else if( (e.key && e.key=="b") || e.code=="KeyS"){
        console.log('STORING',window.cur_lab);
        DTWClass.store_ambient('background')
    }else if( (e.key && e.key=="c") || e.code=="KeyC"){
        console.log('CLASSIFY');
        DTWClass.classify();
    }
    console.log("ALGO",DTWClass.dist);
    // console.log('E',e,d);
}

document.body.addEventListener("keyup",chkey)