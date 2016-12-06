Coding={}

Coding.parser=peg.generate(String.raw`
start=a:(_(str/mod)_)*{
  return a.map(x=>x[1])
}

_=[ \n]*

str='"'a:([^"\\]/'\\'.)*'"'?{
  return{
    type:'str',
    body:a.map(x=>x.pop?x[1]=='"'?'"':x.join(''):x).join('').replace(/\\\\/g,'\\')
  }
}

mod=tag/class/id/attr/op
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
op=h:$(.+){
  return{
    type:'op',
    body:h
  }
}
`)

Coding.eval=(x,y)=>{
  let code=Coding.parser.parse(x.replace(/^[ \n]*/g,''))
  let strst=[]
  let elest=[]
  let base={
    '$s':_=>strst.push(strst[strst.length-1])
  }

  for(ip=0;a=code[ip];ip++){
    if(a.type=='str'){
      strst.push(a.body)
    }
    if(a.type=='tag'){
      let el=document.createElement(a.body)
      el.innerHTML=strst.pop()
      elest.push(el)
    }
    if(a.type=='class'){
      elest[elest.length-1].class+=' '+a.body
    }
    if(a.type=='id'){
      elest[elest.length-1].id=a.body
    }
    if(a.type=='attr'){
      elest[elest.length-1].setAttribute(a.body,strst.pop())
    }
    if(a.type=='op'){
      base[a.body]()
    }
  }

  y(strst,elest)
}