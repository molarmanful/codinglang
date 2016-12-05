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

mod=tag/class/id/attr
tag='>'h:[A-Za-z]t:[-_A-Za-z0-9]*{
  return{
    type:'tag',
    body:[h].concat(t).join('')
  }
}
class='.'h:"-"?t:[_a-zA-Z]+T:[_a-zA-Z0-9-]*{
  return{
    type:'class',
    body:[h||''].concat(t,T).join('')
  }
}
id='#'h:[A-Za-z]t:[-_A-Za-z0-9]*{
  return{
    type:'id',
    body:[h].concat(t).join('')
  }
}
attr='@'h:[A-Za-z]t:[-_A-Za-z0-9]*{
  return{
    type:'attr',
    body:[h].concat(t).join('')
  }
}
`,{})
Coding.eval=(x,y)=>{
  let code=Coding.parser.parse(x)
  let strst=[]
  let elest=[]
  code.map(a=>{
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
  })
  y(elest,strst)
}