Coding={}

Coding.parser=peg.generate(String.raw`
start=a:(_(str/num/mod)_)*{
  return a.map(x=>x[1])
}

_=[ \n]*

str='"'a:([^"\\]/'\\'.)*'"'?{
  return a.map(x=>x.pop?x[1]=='"'?'"':x.join(''):x).join('').replace(/\\\\/g,'\\')
}
num=a:$[0-9]+{
    return +a
}

mod=fn/tag/class/id/attr/op
tag='>'h:$([A-Za-z][-_A-Za-z0-9]*){
  return{
    type:'tag',
    body:h
  }
}
class='.'h:$("-"?[_a-zA-Z]+[_a-zA-Z0-9-]*){
  return{
    type:'class',
    body:h
  }
}
id='#'h:$([A-Za-z][-_A-Za-z0-9]*){
  return{
    type:'id',
    body:h
  }
}
attr='@'h:$([A-Za-z][-_A-Za-z0-9]*){
  return{
    type:'attr',
    body:h
  }
}
op=h:$([^ \n()""@#.]+){
  return{
    type:'op',
    body:h
  }
}
fn='('a:start')'b:op{
  return{
    type:'fn',
    body:a,
    f:b.body
  }
}
`)

Coding.eval=(x,y)=>{
  let sst=[]
  let est=[]
  let base={
    '$s':_=>sst.push(sst[sst.length-sst.pop()-1]),
    '$e':_=>est.push(est[est.length-sst.pop()-1]),
    '%s':_=>sst.splice(sst.length-sst.pop()-1,1),
    '%e':_=>est.splice(est.length-est.pop()-1,1),
    '\\s':_=>sst.splice(sst.length-sst.pop()-1,0,sst.pop()),
    '\\e':_=>est.splice(est.length-est.pop()-1,0,est.pop()),
    '>':_=>est.push(sst.pop()||''),
    '<h':_=>sst.push(est.pop().innerHTML),
    '<t':_=>sst.push(est.pop().innerText),
    '+s':_=>sst[sst.length-2]+=sst.pop(),
    '+e':_=>
      est[est.length-2].innerHTML!=[]._?
        (est[est.length-2].innerHTML+=est.pop())
      :est[est.length-1].innerHTML!=[]._?
        (est[est.length-1].innerHTML=est.splice(-2,1)+est[est.length-1].innerHTML)
      :(est[est.length-2]+=est.pop())
  }
  let E=x=>{
    for(let ip=0,a;a=x[ip],a||a==''||a==0;ip++){
      if(!a.type){
        sst.push(a)
      }
      else if(a.type=='tag'){
        let el=document.createElement(a.body)
        el.innerHTML=sst.pop()||''
        est.push(el)
      }
      else if(a.type=='class'){
        est[est.length-1].class+=' '+a.body
      }
      else if(a.type=='id'){
        est[est.length-1].id=a.body
      }
      else if(a.type=='attr'){
        est[est.length-1].setAttribute(a.body,sst.pop())
      }
      else if(a.type=='op'){
        base[a.body]()
      }
      else if(a.type=='fn'){
        base[a.f]=_=>E(a.body)
      }
    }
  }
  E(Coding.parser.parse(x.replace(/^[ \n]*/g,'')))

  return[sst,est]
}