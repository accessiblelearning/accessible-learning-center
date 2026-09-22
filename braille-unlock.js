/* The private course is decrypted only in this browser after the access code is entered. */
(function(root) {
  'use strict';
  async function openBundle(bundle, passphrase) {
    if(bundle.version!==1||bundle.iterations!==600000)throw Error('Unsupported preview format');
    const bytes=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
    const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(passphrase.trim()),'PBKDF2',false,['deriveKey']);
    const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(bundle.salt),iterations:bundle.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(bundle.iv)},key,bytes(bundle.ciphertext));
    const payload=JSON.parse(new TextDecoder().decode(plain));
    if(payload.version!==1||typeof payload.markup!=='string'||!Array.isArray(payload.scripts)||!payload.scripts.every(s=>typeof s==='string'))throw Error('Invalid preview');
    return payload;
  }
  root.ALCPrivatePreview={openBundle};
  if(typeof module!=='undefined')module.exports={openBundle};
  if(typeof document==='undefined')return;
  const form=document.getElementById('privatePreviewForm'),input=document.getElementById('privatePreviewCode'),status=document.getElementById('privatePreviewStatus'),button=document.getElementById('openPrivatePreview');
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(button.disabled)return;
    const code=input.value;input.value='';button.disabled=true;status.textContent='Opening the private preview…';
    let bundle;
    try {
      const response=await fetch('braille-preview.bundle.json?v=4',{cache:'no-store'});
      if(!response.ok)throw Error('Unavailable');bundle=await response.json();
    } catch(_){status.textContent='The preview could not be loaded. Check your connection and try again.';button.disabled=false;input.focus();return;}
    let payload;
    try{payload=await openBundle(bundle,code);}catch(_){status.textContent='The access code did not open this preview. Check the code and try again.';button.disabled=false;input.focus();return;}
    // Only authenticated, locally authored HTML and scripts reach this point.
    document.body.innerHTML=payload.markup;
    document.body.dataset.minimalPage='true';
    const main=document.querySelector('main');main.setAttribute('tabindex','-1');
    const skip=document.createElement('a');skip.className='skip-link';skip.href='#'+main.id;skip.textContent='Skip to main content';skip.addEventListener('click',()=>main.focus({preventScroll:true}));document.body.prepend(skip);
    for(const source of payload.scripts){const script=document.createElement('script');script.textContent=source;document.body.append(script);}
    // The embedded development gate remains inside the encrypted application.
    document.getElementById('previewCode').value=payload.bootstrapCode;
    document.getElementById('unlockForm').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    payload=null;
  });
})(globalThis);

