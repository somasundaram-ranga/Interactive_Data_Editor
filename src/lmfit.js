function hypotenuse(a, b) {
  var r = 0;
  if (Math.abs(a) > Math.abs(b)) {
    r = b / a;
    return Math.abs(a) * Math.sqrt(1 + r * r);
  }
  if (b !== 0) {
    r = a / b;
    return Math.abs(b) * Math.sqrt(1 + r * r);
  }
  return 0;
}



// inverse of a 
function inverse(A){// solves a system of linear equations using QR decomposition
  var qr = JSON.parse(JSON.stringify(A))
  var m = qr.length
  var n = qr[0].length
  var rdiag = new Array(n);
  var i, j, k, s;
  var X = new Array(m).fill(0).map(_ => new Array(m).fill(0))
  for(let i =0; i<m;i++) X[i][i] = 1.0

  for (k = 0; k < n; k++) {
    var nrm = 0;
    for (i = k; i < m; i++) {
      nrm =hypotenuse(nrm, qr[i][k]);
    }
    if (nrm !== 0) {
      if (qr[k][k] < 0) {
        nrm = -nrm;
      }
      for (i = k; i < m; i++) {
        qr[i][k] /= nrm
      }
      qr[k][k] +=1  
      for (j = k + 1; j < n; j++) {
        s = 0;
        for (i = k; i < m; i++) {
          s += qr[i][k] * qr[i][j]
        }
        s = -s / qr[k][k];
        for (i = k; i < m; i++) {
          qr[i][j] += s * qr[i][k] 
        }
      }
    }
    rdiag[k] = -nrm;
  }

  let count = X[0].length;

  for (k = 0; k < n; k++) {
    for (j = 0; j < count; j++) {
      s = 0;
      for (i = k; i < m; i++) {
        s += qr[i][k] * X[i][j];
      }
      s = -s / qr[k][k];
      for (i = k; i < m; i++) {
          X[i][j] += s*qr[i][k]
      }
    }
  }
  for (k = n - 1; k >= 0; k--) {
    for (j = 0; j < count; j++) {
        X[k][j] /= rdiag[k] 
    }
    for (i = 0; i < k; i++) {
      for (j = 0; j < count; j++) {
          X[i][j] -=X[k][j]*qr[i][k]
      }
    }
  }
  return X
}


function eyemat(m,v){
  var X = new Array(m).fill(0).map(_ => new Array(m).fill(0))
  for(let i =0; i<m;i++) X[i][i] = 1.0
  return X
}

function matmul(a,b){
  // column and row length
  if (a[0].length != b.length) return
  // a is of length nxm,,, b is of mxp so  res is of the length nxp
  var n = a.length, p = b[0].length, m = b.length
  res = new Array(n).fill(0).map(_ => new Array(p).fill(0))
  for(let k=0; k<m; k++){
      for (let i=0; i<n; i++){
          for(let j =0; j<p ; j++){
              res[i][j] += a[i][k]* b[k][j]
          }
      }
  }
  return res
}



function transpose(m) {
  return m[0].map((_, i) => m.map(x => x[i]));
};


function matadd(a,b){
  var m = a.length, n = a[0].length;
  var res = new Array(m).fill(0).map(_ => new Array(n).fill(0))
  for(let i=0;i<m;i++){
    for(let j=0;j<n;j++){
      res[i][j] = a[i][j] + b[i][j]
    }
  }
  return res
}


function matsub(a,b){
  var m = a.length, n = a[0].length;
  var res = new Array(m).fill(0).map(_ => new Array(n).fill(0))
  for(let i=0;i<m;i++){
    for(let j=0;j<n;j++){
      res[i][j] = a[i][j] - b[i][j]
    }
  }
  return res
}



function matmulscalar(a,b){
  var m = a.length, n = a[0].length;
  var res = new Array(m).fill(0).map(_ => new Array(n).fill(0))
  for(let i=0;i<m;i++){
    for(let j=0;j<n;j++){
      res[i][j] = a[i][j]*b
    }
  }
  return res
}



function errorCalculation( data, parameters, myfunc) {
    var error = 0;
    const func = myfunc(parameters);
    for (var i = 0; i < data.x.length; i++) {
      error += Math.abs(data.y[i] - func(data.x[i]));
    }
    return error;
  }


  function gradientFunction(data, evaluatedData,params, gradientDifference, paramFunction ) {
    const n = params.length;
    const m = data.x.length;

    var ans = new Array(n);
  
    for (var param = 0; param < n; param++) {
      ans[param] = new Array(m);
      var auxParams = params.concat();
      auxParams[param] += gradientDifference;
      var funcParam = paramFunction(auxParams);
      for (var point = 0; point < m; point++) {
        ans[param][point] = evaluatedData[point] - funcParam(data.x[point]);
      }
    }
    return ans;
  }




function matrixFunction(data, evaluatedData) {
    const m = data.x.length;
    var ans = new Array(m);
    for (var point = 0; point < m; point++) ans[point] = [data.y[point] - evaluatedData[point]]
    return ans;
  }


  function step( dat, parameters, damping, gradientDifference, myfunc ) {
    var value = damping * gradientDifference * gradientDifference;
    var identity =eyemat(parameters.length, value)

    var evaluatedData = dat.x.map((e) => myfunc(parameters)(e));

    var gradientFunc = gradientFunction(
      dat,
      evaluatedData,
      parameters,
      gradientDifference,
      myfunc
    );

    var matrixFunc = matrixFunction(dat, evaluatedData);

    var inverseMatrix = inverse(
       matadd(identity, 
        matmul(gradientFunc, 
          transpose(gradientFunc)))
    );

    var minp = transpose(matmulscalar(matmul(matmul(inverseMatrix, gradientFunc), matrixFunc), gradientDifference))
    var mnp = parameters.length
    var parms2 =  new Array(mnp)
    for(let i=0; i<mnp; i++){
      parms2[i] = parameters[i]-minp[0][i]
    }
    return parms2
  }

  function myfunc([q, a, b,c]) {
    return (x) => q*x**3 + a*x**2+ b*x + c// Math.sin(b * t);
  }




var dat = {x, y}
maxIterations = 10000
gradientDifference = 10e-2
errorTolerance = 10e-3
damping = 1.5
var parameters =[0,0,0,0]//initialValues || new Array(myfunc.length).fill(1);
var parLen = parameters.length;
maxValues = new Array(parLen).fill(Number.MAX_SAFE_INTEGER);
minValues = new Array(parLen).fill(Number.MIN_SAFE_INTEGER);
var error = errorCalculation(dat, parameters, myfunc);
var converged = error <= errorTolerance;



for (let iteration = 0; iteration < maxIterations && !converged; iteration++ ) {
    parameters = step( dat, parameters, damping, gradientDifference, myfunc);

    for (let k = 0; k < parLen; k++) {
      parameters[k] = Math.min( Math.max(minValues[k], parameters[k]),  maxValues[k]);
    }

    error = errorCalculation(dat, parameters, myfunc);
    // if (isNaN(error)) break;
    converged = error <= errorTolerance;
    
  }
  console.log(error, parameters)
//   return {parameterValues: parameters, parameterError: error,iterations: iteration};
