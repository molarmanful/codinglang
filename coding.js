Coding={}

Coding.parser=peg.generate(String.raw`
start=a:(_ mod _)*{
  return a.map(x=>x[1])
}

_=[ \n]*

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
fn='('a:$([^)\\]/'\\'.)*')'?{
  return{
    type:'fn',
    body:a.replace(/\\\)/g,')')
  }
}
`)

Coding.eval=(x,sst=[],est=[])=>{
  let base={
    '~':_=>sst.splice(-1,0,sst.pop()),
    '~e':_=>est.splice(-1,0,est.pop()),
    ':':_=>sst.push(sst[sst.length-1]),
    ':e':_=>est.push(est[est.length-1]),
    '!':_=>sst.pop(),
    '!e':_=>est.pop(),
    'S':_=>est.push($('<div></div>').text(sst.pop()).html()),
    'Se':_=>(sst.push(est[est.length-1].outerHTML||est[est.length-1]),est.pop()),
    '*':_=>sst[sst.length-2]+=s.pop(),
    '*e':_=>
      est[est.length-2].innerHTML!=[]._?
        $(est[est.length-2]).append(est.pop())
      :est[est.length-1].innerHTML!=[]._?
        $(est[est.length-2]).prepend(est.splice(-2,1))
      :est[est.length-2]+=est.pop(),
    'a':_=>sst.push(`(${sst.pop().replace(/\)/g,'\\)')})`),
    '^':_=>[sst,est]=Coding.eval(sst.pop().replace(/\\\)/g,')'),sst,est)
  }

  let E=x=>{
    for(let ip=0,a;a=x[ip],a||a==''||a==0;ip++){
      if(a.type=='tag'){
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
        sst.push(a.body)
      }
    }
  }

  E(Coding.parser.parse(x.replace(/^[ \n]*/g,'')))

  return[sst,est]
}